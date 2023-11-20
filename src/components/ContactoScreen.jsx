import React, { useState , useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert  } from 'react-native';
import { Text, Input } from 'react-native-elements';
import axios from 'axios'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactoScreen = () => {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [parentesco, setParentesco] = useState('');
  const navigation = useNavigation(); 

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
 /* const handleRegistro = async () => {
    // Verificar si todos los campos obligatorios están completos
    if (!nombre || !apellido || !telefono || !parentesco) {
      Alert.alert("Error", "Faltan completar campos obligatorios (*)");
      return;
    }
    // Verificar si los campos cumplen con las validaciones
    if (
      validateName(nombre) &&
      validateName(apellido) &&
      validatePhoneNumber(telefono) &&
      validateRelationship(parentesco)
    ) {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post('http://172.16.128.101:3000/contacts/create', {
          name: nombre,
          lastname: apellido,
          phoneNumber: telefono,
          relationship: parentesco,
          token:token
        });
  
        if (response.data.contact) {
          Alert.alert("¡El contacto ha sido creado exitosamente!");
        } else {
          Alert.alert("Error", "No se pudo crear el contacto");
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Ocurrió un error al crear el contacto');
      }
    } else {
      Alert.alert("Campo incorrecto o faltante");
    }
  };*/
  
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

  const handleMain = () => {
    navigation.navigate('Map'); 
  };

/*  useEffect(() => {
    const loadContact = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const responseToken = await axios.post('http://172.16.128.101:3000/users/token', { token });
        const userId = responseToken.data.userId;

        const responseContact = await axios.get(`http://172.16.128.101:3000/contacts/${userId}`);
        if (responseContact.data) {
          const contactData = responseContact.data;
          console.log(contactData);
          console.log(contactData.contact.name);

          setNombre(contactData.contact.name);
          setApellido(contactData.contact.lastname);
          setTelefono(contactData.contact.phoneNumber);
          setParentesco(contactData.contact.relationship);

        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadContact();
  }, []);*/

  const loadContact = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const responseToken = await axios.post('http://172.16.128.101:3000/users/token', { token });
      const userId = responseToken.data.userId;

      const responseContact = await axios.get(`http://172.16.128.101:3000/contacts/${userId}`);
      if (responseContact.data && responseContact.data.contact) {
        const contactData = responseContact.data.contact;
        setNombre(contactData.name);
        setApellido(contactData.lastname);
        setTelefono(contactData.phoneNumber);
        setParentesco(contactData.relationship);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    loadContact();
  }, []);

  const handleRegistro = async () => {
    if (!nombre || !apellido || !telefono || !parentesco) {
      Alert.alert("Error", "Faltan completar campos obligatorios (*)");
      return;
    }

    if (validateName(nombre) && validateName(apellido) && validatePhoneNumber(telefono) && validateRelationship(parentesco)) {
      const token = await AsyncStorage.getItem('token');
      const userId = (await axios.post('http://172.16.128.101:3000/users/token', { token })).data.userId;

      try {
        const responseContact = await axios.get(`http://172.16.128.101:3000/contacts/${userId}`);
        const endpoint = responseContact.data.contact ? `http://172.16.128.101:3000/contacts/${userId}` : 'http://172.16.128.101:3000/contacts/create';
        const method = responseContact.data.contact ? 'put' : 'post';

        const response = await axios[method](`http://172.16.128.101:3000/contacts/${userId}`, {
          name: nombre,
          lastname: apellido,
          phoneNumber: telefono,
          relationship: parentesco,
          token: token,
        });

        if (response.data.contact) {
          Alert.alert("¡El contacto ha sido creado/modificado exitosamente!");
        } else {
          Alert.alert("Error", "No se pudo crear/modificar el contacto");
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Ocurrió un error al crear/modificar el contacto');
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
        <Text h3>Contacto</Text>
        <Text >Complete el formulario de contacto de emergencia</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Input
          placeholder="Nombre (*)"
          value={nombre}
          onBlur={handleNombreBlur}
          onChangeText={setNombre}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Apellido (*)"
          value={apellido}
          onChangeText={setApellido}
          onBlur={handleApellidoBlur}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Telefono (*)"
          value={telefono}
          onChangeText={setTelefono}
          onBlur={handleTelefonoBlur}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Parentesco (*)"
          value={parentesco}
          onChangeText={setParentesco}
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