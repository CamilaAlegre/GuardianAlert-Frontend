import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HistorialScreen= () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation(); 
  useEffect(() => {
    axios.get('http://172.16.128.101:3000/events')
      .then(response => {
        setEvents(response.data.events); 
      })
      .catch(error => {
        console.error('Error al obtener eventos:', error);
      });
  }, []);

  const handleMain = () => {
    navigation.navigate('Map'); 
  };

  return (
    <View>
        <View style={styles.backContainer}>
          <Text style={styles.textBack} onPress={handleMain}>Volver</Text>
        </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id.toString()} 
        renderItem={({ item }) => (
          <View>
            <Text>Fecha: {item.date}</Text>
            <Text>Lugar: {item.place}</Text>
            <Text>Tipo de Evento: {item.type}</Text>
            <Text>Estado: {item.status}</Text>
          </View>
        )}
      />
      <Button title="Volver" onPress={() => {}} />
    </View>
  );
};

export default HistorialScreen;
