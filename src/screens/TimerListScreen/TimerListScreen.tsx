import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../component/ButtonComponent/CustomButton';
import Timer from '../../component/TimerComponent/Timer';
import { useNavigation } from '@react-navigation/native';
import { NavigationTypes } from '../../../App';

export interface TimerType {
    id: number;
    name: string;
    duration: number;
    category: string;
    remainingTime: number;
    running: boolean;
    completed: boolean;
}

const TimerListScreen = () => {

    const navigation = useNavigation<NavigationTypes>()

    const [timers, setTimers] = useState<TimerType[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<{ [category: string]: boolean }>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [completedTimerName, setCompletedTimerName] = useState('');
    const [refreshing, setRefreshing] = useState(false); // State for refresh control



    const loadTimers = async () => {
        setRefreshing(true); // Set refreshing to true before loading
        try {
            const storedTimers = await AsyncStorage.getItem('timers');
            if (storedTimers) {
                setTimers(JSON.parse(storedTimers));
            }
        } catch (error) {
            console.error("Error loading timers:", error);
        } finally {
            setRefreshing(false); // Set refreshing to false after loading (success or error)
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


    const startTimer = (id: number) => {
        setTimers(timers.map(timer =>
            timer.id === id && !timer.completed ? { ...timer, running: true } : timer
        ));
    };

    const pauseTimer = (id: number) => {
        setTimers(timers.map(timer =>
            timer.id === id ? { ...timer, running: false } : timer
        ));
    };

    const resetTimer = (id: number) => {
        setTimers(timers.map(timer =>
            timer.id === id ? { ...timer, running: false, remainingTime: timer.duration, completed: false } : timer
        ));
    };

    const markCompleted = (id: number) => {
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
        let intervalId: NodeJS.Timeout | null = null;

        if (timers.some(timer => timer.running)) {
            intervalId = setInterval(tick, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [timers]);

    const toggleCategoryExpansion = (category: string) => {
        setExpandedCategories({ ...expandedCategories, [category]: !expandedCategories[category] });
    };

    const handleBulkAction = (category: string, action: string) => {
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

    const handleRefresh = () => {
        loadTimers()
    }

    return (
        <View style={styles.container}>
            <CustomButton title="Add New Timer" onPress={() => navigation.navigate('AddTimer')} />

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
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
                        <CustomButton title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default TimerListScreen

const styles = StyleSheet.create({
    container: {},
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