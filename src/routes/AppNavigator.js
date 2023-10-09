import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistroScreen from '../components/RegistroScreen.jsx';
import LoginScreen from '../components/LoginScreen.jsx';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Registro">
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
