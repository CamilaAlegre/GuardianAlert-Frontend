import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { Text, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const LoginScreen = () => {
  const navigation = useNavigation(); 
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailBlur = () => {
    if (!validateEmail(mail)) {
      Alert.alert('Error', 'Correo electrónico no válido');
    }
  };

  const handlePasswordBlur = () => {
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Contraseña no válida');
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate('Registro'); 
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://172.16.128.102:3000/users/login', {
        email: mail,
        password: password,
      });
  
      console.log('Response data:', response.data); // Agregado para ver la respuesta del servidor
  
      if (response.data.message) {
        Alert.alert('Error', response.data.message);
      } else {
        const token = response.data.token;
        console.log('Token:', token); // Agregado para ver el token
  
        if (token) {
          Alert.alert('Inicio de sesión exitoso');
          await AsyncStorage.setItem('token', JSON.stringify(token));
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      console.error('Error:', error.response);
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };
  
  
  
  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/GuardianAlertBlack.png')}
          style={styles.logo}
        />
        <Text h3 style={styles.title}>Iniciar Sesion</Text>
        <Input
          placeholder="Correo electrónico"
          onChangeText={setMail}
          value={mail}
          keyboardType="email-address"
          onBlur={handleEmailBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Contraseña"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          onBlur={handlePasswordBlur}
          containerStyle={{ ...styles.inputContainer, marginBottom:0 }}
        />
        <Text style={styles.textForgotPassword}>Olvidaste la contraseña?</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Ingresar</Text>
        </TouchableOpacity>
        <Text style={styles.textSignUp} onPress={handleSignUpPress}>Registrate aquí</Text>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 30,
  },
  text: {
    marginTop: 20,
    color: '#0000FF',
  },
  
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  button: {
    width: '60%',
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: "#7B68EE",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  textForgotPassword: {
    marginLeft: 160,
    paddingTop:0,
    marginTop:0,
    marginBottom:30,
    color: '#0000FF',
  },
  textSignUp: {
    marginTop: 20, 
    color: '#0000FF',
  },
});

export default LoginScreen;