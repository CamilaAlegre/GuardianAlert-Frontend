import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { Text, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'; // Asegúrate de importar useNavigation
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const LoginScreen = () => {
  const navigation = useNavigation(); // Configura la navegación
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

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://172.16.128.102:3000/users/login', {
        email: mail,
        password: password,
      });
  
      if (response.data.message) {
        // Si el servidor responde con un mensaje de error, muestra el mensaje en el Alert
        Alert.alert('Error', response.data.message);
      } else {
        // Si la respuesta es exitosa y no contiene un mensaje de error, asumimos que contiene el token
        const token = response.data;
        if (token) {
          // Muestra un mensaje de éxito en el log
          Alert.alert('Inicio de sesión exitoso');
          // Almacena el token en AsyncStorage si lo necesitas
          await AsyncStorage.setItem('token', token);
          // Redirige a la vista 'Update'
          navigation.navigate('Update');
        }
      }
    } catch (error) {
      console.error('Error:', error);
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
          containerStyle={styles.inputContainer}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Ingresar</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Olvidaste la contraseña?</Text>
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
});

export default LoginScreen;