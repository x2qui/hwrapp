import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesListScreen from './notesListScreen'
import CanvasScreen from './CanvasScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Notes">
        <Stack.Screen name="Notes" component={NotesListScreen} />
        <Stack.Screen name="Canvas" component={CanvasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}