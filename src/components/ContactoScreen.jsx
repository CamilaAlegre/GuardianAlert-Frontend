import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert  } from 'react-native';
import { Text, Input } from 'react-native-elements';

const ContactoScreen = () => {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [parentesco, setParentesco] = useState('');

  //Expresiones regulares
  const validateName = (name) => {
    return /^[a-zA-Z\s']{3,50}$/.test(name);
  };

  const validatePhoneNumber = (phone) => {
    return /^[0-9]{10}$/.test(phone);//revisar por el tema del codigo de area
  };

  const validateRelationship= (Relationship) => {
    return /^[a-zA-Z\s']{3,10}$/.test(Relationship);
  };

  //validaciones
  const handleRegistro = () => {
    //es del boton
    if (!nombre || !apellido || !telefono || !parentesco) {
      Alert.alert("Error", "Faltan completar campos obligatorios (*)");
        return;
    }
    if (
      validateName(nombre) &&
      validateName(apellido) &&
      validatePhoneNumber(telefono) &&
      validateRelationship(parentesco)) {
      Alert.alert("¡El contacto ha sido exitoso!");
    } else {
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


  const handleTelefonoBlur = () => {
    if (telefono && !validatePhoneNumber(telefono)) {
      Alert.alert("Error", "Formato de número de teléfono incorrecto. Debe tener 10 dígitos.");
    }
  };
  
  const handleRelationshipBlur = () => {
    if (parentesco && !validateRelationship(parentesco)) {
      Alert.alert("Error", "Formato de correo incorrecto.");
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
        <Text h3>Contacto</Text>
        <Text >Complete el formulario de contacto de emergencia</Text>
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
          placeholder="Telefono (*)"
          onChangeText={setTelefono}
          value={telefono}
          onBlur={handleTelefonoBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Parentesco (*)"
          onChangeText={setParentesco}
          value={parentesco}
          onBlur={handleRelationshipBlur}
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
    marginTop:80
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
    marginTop:20,
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

export default ContactoScreen;