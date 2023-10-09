import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { Text, Input } from 'react-native-elements';
import axios from 'axios'; 

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const LoginScreen = () => {
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
      const response = await axios.post('http://localhost:3000/login', {
        email: mail,
        password: password,
      });
      if (response.data.success) {
      } else {
        Alert.alert('Error', 'Usuario y/o contraseña incorrectos');
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