import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistroScreen from '../components/RegistroScreen.jsx';
import LoginScreen from '../components/LoginScreen.jsx';
import UpdateScreen from '../components/UpdateScreen.jsx'
import ContactoScreen from '../components/ContactoScreen.jsx';
import HistorialScreen from '../components/HistorialScreen.jsx';
import MainScreen from '../components/MainScreen.jsx';
import SensorComponent from '../components/Sensores.jsx'

const Stack = createStackNavigator();

const AppNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Registro" component={RegistroScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="Update" component={UpdateScreen} options={{headerShown: false}} />
        <Stack.Screen name="Contact" component={ContactoScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Historial" component={HistorialScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Sensor" component={SensorComponent} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
