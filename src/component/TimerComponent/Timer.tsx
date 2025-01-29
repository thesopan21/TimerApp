import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Bar } from 'react-native-progress';
import { formatTime } from '../../utils/formatTime';
import CustomButton from '../ButtonComponent/CustomButton';

type CalbackFun = (itemId: number) => void;

interface TimerProps {
    item: any;
    startTimer: CalbackFun;
    pauseTimer: CalbackFun;
    resetTimer: CalbackFun;
}

const Timer: React.FC<TimerProps> = ({ item, startTimer, resetTimer, pauseTimer }) => {

    return (
        <View style={styles.timerItem}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.timerName}>{item.name}</Text>
                    <Text style={styles.timerStatus}>{item.completed ? "Completed" : item.running ? "Running" : "Paused"}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.timerTime}>{formatTime(item.remainingTime)}</Text>
                    <Bar
                        progress={item.duration === 0 ? 0 : item.remainingTime / item.duration}
                        width={100}
                        color="#2ecc71" // A nice, calming green
                    // OR other options:
                    // color="#3498db" // A classic blue
                    // color="#f39c12" // A vibrant orange
                    // color="#e74c3c" // A warning red (use sparingly)
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton
                    style={styles.startButton}
                    // textStyle={styles.saveButtonText}
                    title="Start"
                    onPress={() => startTimer(item.id)}
                    disabled={item.running || item.completed}
                />
                <CustomButton
                    style={styles.pauseButton}
                    // textStyle={styles.saveButtonText}
                    title="Pause"
                    onPress={() => pauseTimer(item.id)}
                    disabled={!item.running}
                />
                <CustomButton
                    title="Reset"
                    onPress={() => resetTimer(item.id)}
                    style={styles.resetButton}
                />
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    timerItem: {
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    headerContainer: {
        alignItems: 'flex-start', // Align to the start (left)
    },
    timerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    timerStatus: {
        fontSize: 14,
        color: 'gray',
    },
    startButton: {
        backgroundColor: '#27ae60',
    },
    pauseButton: {
        backgroundColor: '#f39c12', // Orange for pause
    },
    resetButton: {
        backgroundColor: '#e74c3c', // Red for reset
    },
    contentContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    timerTime: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
});

export default Timer;