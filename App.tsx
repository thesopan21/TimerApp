import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TestTimer from './src/component/TestTimer'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TimerListScreen from './src/screens/TimerListScreen/TimerListScreen';

export type RootStackParamList = {
  Home: undefined; // Home screen does not take any parameters
  AddTimer: undefined;
  TimerHistory: undefined;
  // Add more screens here as needed
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={TimerListScreen} />
        {/* <Stack.Screen name="History" component={HistoryScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})