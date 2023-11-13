import React, { useState , useEffect } from 'react';
import { View,StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert  } from 'react-native';
import { Text, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Asegúrate de importar Axios
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateScreen = () => {

  const navigation = useNavigation(); 
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

  useEffect(() => {
    // Lógica para obtener los datos del usuario al cargar la vista
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        console.log(token);
      
        const responseToken = await axios.post('http://172.16.128.101:3000/users/token', { token });
        const userId = responseToken.data.userId;
  
        const responseUser = await axios.get(`http://172.16.128.101:3000/users/${userId}`);
        const userData = responseUser.data.user;
  
        // Aquí puedes usar userData, que contiene los detalles completos del usuario
        console.log(userData);
        // Guardar los detalles del usuario en el estado local para su uso
        setNombre(userData.name);
        setApellido(userData.lastname);
        setMail(userData.email);
        setTelefono(userData.phoneNumber);
        setPais(userData.country);
        setProvincia(userData.province);
        setCiudad(userData.city);
        setDireccion(userData.address);
        setFechaDeNacimiento(userData.birthdate);
        setPassword(userData.password);
        setRepitePassword(userData.password);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        // Manejar errores, como token no encontrado en AsyncStorage o respuestas inesperadas del backend
      }
    };

    fetchData(); // Llamar a la función para obtener los datos del usuario
  }, []);

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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
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

  const handleMain = () => {
    navigation.navigate('Map'); 
  };

  const handleRegistro = async () => {
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
      repitepassword === password
    ) {
      // Aquí realizar la petición para actualizar los datos del usuario
      try {
        const token = await AsyncStorage.getItem('token');
  
        const responseToken = await axios.post('http://172.16.128.101:3000/users/token', { token });
        const userId = responseToken.data.userId;
  
        const updatedUser = {
          name: nombre,
          lastname: apellido,
          email: mail,
          phoneNumber: telefono,
          country: pais,
          province: provincia,
          city: ciudad,
          address: direccion,
          birthdate: fechaNacimiento,
          password: password,
        };
  
        const response = await axios.put(`http://172.16.128.101:3000/users/${userId}`, updatedUser);
  
        Alert.alert("¡Tus datos han sido actualizados!");
        console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        console.error('Error al actualizar los datos del usuario:', error);
        Alert.alert("Error", "Hubo un problema al intentar actualizar los datos.");
      }
    } else {
      Alert.alert("Campo incorrecto o faltante");
    }
  };
  

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.backgroundImage}
    > 
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <Text style={styles.textBack} onPress={handleMain}>Volver</Text>
        </View>
        <Image
          source={require('../assets/GuardianAlertBlack.png')}
          style={styles.logo}
        />
        <Text h3>Mi perfil</Text>
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
          onBlur={handleDireccionBlur}
          value={direccion}
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
          <Text style={{ color: "white", fontWeight: "bold" }}>Modificar</Text>
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

export default UpdateScreen;