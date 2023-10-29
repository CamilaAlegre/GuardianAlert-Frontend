import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistroScreen from '../components/RegistroScreen.jsx';
import LoginScreen from '../components/LoginScreen.jsx';
import UpdateScreen from '../components/UpdateScreen.jsx'
import ContactoScreen from '../components/ContactoScreen.jsx';
import HistorialScreen from '../components/HistorialScreen.jsx';
import Acelerometro from '../components/Acelerometro.jsx';
import Giroscopio from '../components/Giroscopio.jsx';
import Magnetometro from '../components/Magnetometro.jsx';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Acelerometro">
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Update" component={UpdateScreen} />
        <Stack.Screen name="Contact" component={ContactoScreen} />
        <Stack.Screen name="Historial" component={HistorialScreen} />
        <Stack.Screen name="Acelerometro" component={Acelerometro} />
        <Stack.Screen name="Giroscopio" component={Giroscopio} />
        <Stack.Screen name="Magnetometro" component={Magnetometro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
