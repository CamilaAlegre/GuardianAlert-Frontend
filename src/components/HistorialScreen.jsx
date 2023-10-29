import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';

const HistorialScreen= () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Realiza una solicitud GET al endpoint de Node.js
    axios.get('http://172.16.128.102:3000/events')
      .then(response => {
        setEvents(response.data.events); // Asumiendo que los datos de eventos se encuentran en el campo "events" en la respuesta
      })
      .catch(error => {
        console.error('Error al obtener eventos:', error);
      });
  }, []);

  return (
    <View>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id.toString()} // Asume que cada evento tiene un campo "_id"
        renderItem={({ item }) => (
          <View>
            <Text>Fecha: {item.date}</Text>
            <Text>Lugar: {item.place}</Text>
            <Text>Tipo de Evento: {item.type}</Text>
            <Text>Estado: {item.status}</Text>
          </View>
        )}
      />
      <Button title="Volver" onPress={() => {/* Agrega la acción para volver a la pantalla anterior */}} />
    </View>
  );
};

export default HistorialScreen;
