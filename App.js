import React from 'react';
import { NativeBaseProvider } from 'native-base';
//import { View, StyleSheet } from 'react-native';
import RegistroScreen from './src/components/RegistroScreen';
import LoginScreen from './src/components/LoginScreen';
import UpdateScreen from './src/components/UpdateScreen.jsx';
import ContactoScreen from './src/components/ContactoScreen.jsx';

const App = () => {
  return (
        <NativeBaseProvider>
          <LoginScreen />
        </NativeBaseProvider>
  );
};

export default App;
