import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../component/ButtonComponent/CustomButton';
import CategoryPicker from '../../component/CategoryPicker/CategoryPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TimerType } from '../TimerListScreen/TimerListScreen';
import { NavigationTypes } from '../../../App';

const AddTimerScreen = () => {

    const navigation = useNavigation<NavigationTypes>()

    const [timers, setTimers] = useState<TimerType[]>([]);
    const [newTimer, setNewTimer] = useState({ name: '', duration: 0, category: '' });

    const availableCategories = ["Workout", "Study", "Break", "Personal", "Office"];

    const handleCategorySelection = (selectedCategory: string) => {
        setNewTimer({ ...newTimer, category: selectedCategory });
        console.log("Selected Category:", selectedCategory); 
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
        if (newTimer.name && newTimer.duration > 0) {
            const newTimerObj = {
                id: Date.now(),
                ...newTimer,
                duration: newTimer.duration,
                remainingTime: newTimer.duration,
                running: false,
                completed: false,
            };
            setTimers([...timers, newTimerObj]);
            setNewTimer({ name: '', duration: 0, category: '' });
            navigation.push('Home')
        }
    };

    const handleCancel = () => {
        // clear all form fields
    }


    return (
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

        </View>
    );
}

export default AddTimerScreen

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
        marginTop: 20,
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
        alignItems: "center"
    },
    toggleDropdown: {
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
        justifyContent: "flex-start",
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