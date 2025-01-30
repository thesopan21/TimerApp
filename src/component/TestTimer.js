import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bar } from 'react-native-progress';
import CustomButton from './ButtonComponent/CustomButton';
import CategoryPicker from './CategoryPicker/CategoryPicker';
import Timer from './TimerComponent/Timer';

const TestTimer = () => {
  const [timers, setTimers] = useState([]);
  const [newTimer, setNewTimer] = useState({ name: '', duration: 0, category: '' });
  const [expandedCategories, setExpandedCategories] = useState({}); // Track expanded categories
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState('');
  const [editingTimer, setEditingTimer] = useState(null);

  const availableCategories = ["Workout", "Study", "Break", "Personal", "Office"];

  const handleCategorySelection = (selectedCategory) => {
    setNewTimer({ ...newTimer, category: selectedCategory });
    console.log("Selected Category:", selectedCategory); // Log the selected category
  };


  const loadTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) {
        setTimers(JSON.parse(storedTimers));
      }
    } catch (error) {
      console.error("Error loading timers:", error);
    }
  };

  const saveTimers = async () => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(timers));
    } catch (error) {
      console.error("Error saving timers:", error);
    }
  };

  useEffect(() => {
    loadTimers();
  }, []);

  useEffect(() => {
    saveTimers();
  }, [timers]);

  const createTimer = () => {
    // ... (same as before, but convert duration to seconds if needed)
    if (newTimer.name && newTimer.duration > 0) {
      const newTimerObj = {
        id: Date.now(),
        ...newTimer,
        duration: parseInt(newTimer.duration), // Store duration in seconds
        remainingTime: parseInt(newTimer.duration),
        running: false,
        completed: false,
      };
      setTimers([...timers, newTimerObj]);
      setNewTimer({ name: '', duration: 0, category: '' });
    }
  };

  const handleCancel = () => {
    // clear all form fields
  }

  const handleTimerUpdate = (updatedTimer) => {
    setTimers(timers.map(timer => (timer.id === updatedTimer.id ? updatedTimer : timer)));
  };

  const deleteTimer = (id) => {
    setTimers(timers.filter(timer => timer.id !== id));
  };

  const startTimer = (id) => {
    setTimers(timers.map(timer =>
      timer.id === id && !timer.completed ? { ...timer, running: true } : timer
    ));
  };

  const pauseTimer = (id) => {
    setTimers(timers.map(timer =>
      timer.id === id ? { ...timer, running: false } : timer
    ));
  };

  const resetTimer = (id) => {
    setTimers(timers.map(timer =>
      timer.id === id ? { ...timer, running: false, remainingTime: timer.duration, completed: false } : timer
    ));
  };

  const markCompleted = (id) => {
    setTimers(timers.map(timer =>
      timer.id === id ? { ...timer, running: false, remainingTime: 0, completed: true } : timer
    ));
  };

  const tick = () => {
    setTimers(timers.map(timer => {
      if (timer.running && timer.remainingTime > 0) {
        const newRemainingTime = timer.remainingTime - 1;
        if (newRemainingTime === 0) {
          markCompleted(timer.id);
          setCompletedTimerName(timer.name);
          setModalVisible(true);
        }
        return { ...timer, remainingTime: newRemainingTime };
      }
      return timer;
    }));
  };

  useEffect(() => {
    let intervalId;

    if (timers.some(timer => timer.running)) {
      intervalId = setInterval(tick, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timers]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories({ ...expandedCategories, [category]: !expandedCategories[category] });
  };

  const handleBulkAction = (category, action) => {
    setTimers(timers.map(timer => {
      if (timer.category === category) {
        switch (action) {
          case 'start': return { ...timer, running: true };
          case 'pause': return { ...timer, running: false };
          case 'reset': return { ...timer, running: false, remainingTime: timer.duration, completed: false };
          default: return timer;
        }
      }
      return timer;
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer App</Text>
      {/* Timer Input */}
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Timer Name"
          value={newTimer.name}
          onChangeText={text => setNewTimer({ ...newTimer, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration (minutes)"
          keyboardType="numeric"
          value={newTimer.duration.toString()}
          onChangeText={text => setNewTimer({ ...newTimer, duration: parseInt(text) || 0 })}
        />

        <CategoryPicker
          categories={availableCategories}
          onCategorySelect={handleCategorySelection}
        />

        {
          editingTimer ?
            (
              <Button title="Update Timer" onPress={updateTimer} />
            )
            :
            (
              <View style={styles.buttonContainer}>
                <CustomButton
                  style={styles.saveButton}
                  textStyle={styles.saveButtonText}
                  title="Save Timer"
                  onPress={createTimer}
                />
                <CustomButton
                  title="Cancel"
                  style={styles.cancelButton}
                  onPress={handleCancel}
                />
              </View>
            )
        }
      </View>

      <FlatList
        data={Array.from(new Set(timers.map(timer => timer.category)))} // Get unique categories
        keyExtractor={item => item}
        renderItem={({ item: category }) => (
          <View>
            <Pressable onPress={() => toggleCategoryExpansion(category)}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryHeadingContainer}>
                  <Text style={styles.categoryTitle}>{category} ({timers.filter(t => t.category === category).length})</Text>
                  <Text style={styles.toggleDropdown}>{expandedCategories[category] ? '-' : '+'}</Text> {/* Expansion indicator */}
                </View>
                <View style={styles.bulkActions}>
                  <CustomButton title="Start All" onPress={() => handleBulkAction(category, 'start')} />
                  <CustomButton title="Pause All" onPress={() => handleBulkAction(category, 'pause')} />
                  <CustomButton title="Reset All" onPress={() => handleBulkAction(category, 'reset')} />
                </View>
              </View>
            </Pressable>

            {expandedCategories[category] && (
              <FlatList
                data={timers.filter(timer => timer.category === category)}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <Timer
                    item={item}
                    pauseTimer={pauseTimer}
                    resetTimer={resetTimer}
                    startTimer={startTimer}
                  />
                )}
              />
            )}
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Timer {completedTimerName} Completed!</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333'
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 12
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveButton: {
    backgroundColor: 'green',
    flex: 1
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'red'
  },
  saveButtonText: {

  },
  categoryHeader: {

    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryHeadingContainer: {
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignItems:"center"
  },
  toggleDropdown:{
    fontSize: 25,
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerActions: {
    flexDirection: 'row',
  },
  bulkActions: {
    justifyContent:"flex-start",
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default TestTimer;