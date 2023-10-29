//Vistas

import React from 'react';
import { NativeBaseProvider } from 'native-base';
import RegistroScreen from './src/components/RegistroScreen';
import LoginScreen from './src/components/LoginScreen';
import UpdateScreen from './src/components/UpdateScreen';
import ContactoScreen from './src/components/ContactoScreen';
import AppNavigator from './src/routes/AppNavigator';

const App = () => {
  return (
    <NativeBaseProvider>
      <AppNavigator />
    </NativeBaseProvider>
  );
};

export default App;
