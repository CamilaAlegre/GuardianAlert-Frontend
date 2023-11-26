import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet , ImageBackground, Image,} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SensorData from './Sensores';

//  FALTA HABILITAR SENSORES LUEGO FUNCIONA BIEN

const HistorialScreen = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const responseToken = await axios.post(
          'http://172.16.128.102:3000/users/token',
          {token}
        );
        const userId = responseToken.data.userId.replace(/"/g, '');//es para sacarle las comillas a la respuesta json
        const responseEvents = await axios.get(`http://172.16.128.102:3000/events/${userId}`);
        setEvents(responseEvents.data.events);
      } catch (error) {
        console.error('Error en la solicitud GET:', error);
      }
    };

    loadEvents();
  }, []);


  const handleMain = () => {
    navigation.navigate('Main');
  };

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 80,
    },
    backContainer: {
      backgroundColor: '#7B68EE',
      padding: 10,
      margin: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    textBack: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    eventItem: {
      padding: 10,
      margin: 5,
      borderWidth: 1,
      borderColor: '#7B68EE',
      borderRadius: 5,
    },
    logo: {
      width: 200,
      height: 100,
      marginBottom: 10,
    },
  });

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
        <Text h3>Historial de Eventos</Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text>Fecha: {item.date}</Text>
            <Text>Lugar: {item.place}</Text>
            <Text>Tipo de Evento: {item.type}</Text>
            <Text>Estado: {item.status}</Text>
          </View>
        )}
      />
    </ImageBackground>
  );
};

export default HistorialScreen;