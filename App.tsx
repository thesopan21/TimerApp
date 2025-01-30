import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TimerListScreen from './src/screens/TimerListScreen/TimerListScreen';
import AddTimerScreen from './src/screens/AddTimerScreen/AddTimerScreen';

export type RootStackParamList = {
  Home: undefined; 
  AddTimer: undefined;
  TimerHistory: undefined;
};

export type NavigationTypes = NativeStackNavigationProp<RootStackParamList>;


const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={TimerListScreen} />
        <Stack.Screen name="AddTimer" component={AddTimerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})