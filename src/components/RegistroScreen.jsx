import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert  } from 'react-native';
import { Text, Input } from 'react-native-elements';

const RegistroScreen = () => {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [mail, setMail] = useState('');
  const [telefono, setTelefono]= useState('');
  const [pais, setPais] = useState('');
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaDeNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [repitepassword, setRepitePassword] = useState('');

  //Expresiones regulares
  const validateName = (name) => {
    return /^[a-zA-Z\s']{3,50}$/.test(name);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return /^[0-9]{10}$/.test(phone);//revisar por el tema del codigo de area
  };

  const validateLocation = (location, fieldName) => {
    if (!/^[a-zA-Z\s']{3,50}$/.test(location)) {
      Alert.alert("Error", `El campo "${fieldName}" debe tener entre 3 y 50 letras y no puede contener números ni caracteres especiales.`);
      return false;
    }
    return true;
  };

  const validateDireccion = (direccion) => {
    // Verificar si la dirección sigue el formato deseado
    const direccionRegex = /^[a-zA-Z\s']+\s\d+$/;
    return direccionRegex.test(direccion);
  };

  const validateDateOfBirth = (date) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) {
      return false;
    }
    const [day, month, year] = date.split('/').map(Number);
    if ([4, 6, 9, 11].includes(month) && (day < 1 || day > 30)) {
      return false;
    }
    if (month === 2) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        if (day < 1 || day > 29) {
          return false;
        }
      } else {
        if (day < 1 || day > 28) {
          return false;
        }
      }
    }
    if ([1, 3, 5, 7, 8, 10, 12].includes(month) && (day < 1 || day > 31)) {
      return false;
    }
    return true;
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  //validaciones
  const handleRegistro = () => {
    //es del boton
    if (!nombre || !apellido || !mail || !telefono || !pais || !provincia || !ciudad || !direccion || !fechaNacimiento || !password || !repitepassword) {
      Alert.alert("Error", "Faltan completar campos obligatorios (*)");
        return;
    }
    if (
      validateName(nombre) &&
      validateName(apellido) &&
      validateEmail(mail) &&
      validatePhoneNumber(telefono) &&
      validateLocation(pais, "País") &&
      validateLocation(provincia, "Provincia") &&
      validateLocation(ciudad, "Ciudad") &&
      validateDateOfBirth(fechaNacimiento) &&
      validatePassword(password) &&
      repitepassword === password) {

      Alert.alert("¡Tu registro ha sido exitoso!");
    } else {
      // Si hay algún error en los campos, no hagas nada o muestra un mensaje de error
      Alert.alert("Campo incorrecto o faltante");
    }
  };

  const handleNombreBlur = () => {
    if (nombre && !validateName(nombre)) {
      Alert.alert("Error", "El nombre debe tener entre 3 y 50 letras y no puede contener números ni caracteres especiales.");
    }
  };
  
  const handleApellidoBlur = () => {
    if (apellido && !validateName(apellido)) {
      Alert.alert("Error", "El apellido debe tener entre 3 y 50 letras y no puede contener números ni caracteres especiales.");
    }
  };

  const handleEmailBlur = () => {
    if (mail && !validateEmail(mail)) {
      Alert.alert("Error", "Formato de correo incorrecto.");
    }
  };

  const handleTelefonoBlur = () => {
    if (telefono && !validatePhoneNumber(telefono)) {
      Alert.alert("Error", "Formato de número de teléfono incorrecto. Debe tener 10 dígitos.");
    }
  };

  const handlePaisBlur = () => {
    validateLocation(pais, "Pais");
  };

  const handleProvinciaBlur = () => {
    validateLocation(provincia, "Provincia");
  };

  const handleCiudadBlur = () => {
    validateLocation(ciudad, "Ciudad");
  };

  const handleDireccionBlur = () => {
    if (!validateDireccion(direccion)) {
      Alert.alert("Error", "Formato de dirección incorrecto. Debe ser 'Nombre de la calle Número'.");
    }
  };

  const handleFechaNacimientoBlur = () => {
    if (fechaNacimiento && !validateDateOfBirth(fechaNacimiento)) {
      Alert.alert("Error", "Formato de fecha de nacimiento incorrecto. Utilice dd/mm/aaaa.");
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      Alert.alert("Error", "El campo 'Contraseña' es obligatorio.");
      return;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert("Error", "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial, y su longitud debe ser mayor a 8 caracteres.");
    }
  };

  const handleRepitePasswordBlur = () => {
    if (repitepassword !== password) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
    }
  };
  
  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.header}>
        <Image
          source={require('../assets/GuardianAlertBlack.png')}
          style={styles.logo}
        />
        <Text h3>Bienvenido a GuardianAlert</Text>
        <Text >Complete el formulario de registro</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Input
          placeholder="Nombre (*)"
          onChangeText={setNombre}
          value={nombre}
          onBlur={handleNombreBlur}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Apellido (*)"
          onChangeText={setApellido}
          value={apellido}
          onBlur={handleApellidoBlur} 
          containerStyle={styles.input}
        />
        <Input
          placeholder="Correo electrónico (*)"
          onChangeText={setMail}
          value={mail}
          onBlur={handleEmailBlur}
          keyboardType="email-address"
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Telefono (*)"
          onChangeText={setTelefono}
          value={telefono}
          onBlur={handleTelefonoBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Pais (*)"
          onChangeText={setPais}
          value={pais}
          onBlur={handlePaisBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Provincia (*)"
          onChangeText={setProvincia}
          value={provincia}
          onBlur={handleProvinciaBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Ciudad (*)" 
          onChangeText={setCiudad}
          value={ciudad}
          onBlur={handleCiudadBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Direccion (*)"
          onChangeText={setDireccion}
          value={direccion}
          onBlur={handleDireccionBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Fecha de Nacimiento (*)"
          onChangeText={setFechaDeNacimiento}
          value={fechaNacimiento}
          onBlur={handleFechaNacimientoBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Contraseña (*)"
          onChangeText={setPassword}
          value={password}
          onBlur={handlePasswordBlur}
          secureTextEntry
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Repetir Contraseña (*)"
          onChangeText={setRepitePassword}
          value={repitepassword}
          onBlur={handleRepitePasswordBlur}
          secureTextEntry
          containerStyle={styles.inputContainer}
        />
      </ScrollView>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleRegistro}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop:40
  },
  text: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  button: {
    width: '60%',
    padding: 15,
    alignItems: 'center',
    marginTop: 2,
    borderRadius: 15,
    backgroundColor: "#7B68EE",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default RegistroScreen;