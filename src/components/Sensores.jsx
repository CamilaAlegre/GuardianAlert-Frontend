import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import Calculador from './Calculador2';
import axios from 'axios'; // Asegúrate de importar axios

export default function SensorData() {
  const [sensorData, setSensorData] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [caracteristicas, setCaracteristicas] = useState(null);
  const timestampCounter = useRef(0);

  const accelerometerDataRef = useRef(null);
  const gyroscopeDataRef = useRef(null);
  const magnetometerDataRef = useRef(null);


    // Crear una función para enviar los datos al servidor
    const sendDataToServer = async (jsonData) => {
        try {
          const response = await axios.post('http://172.16.128.102:3000/data/sensors', jsonData);
          console.log('Respuesta del servidor:', response.data);
        } catch (error) {
          console.error('Error al enviar datos al servidor:', error);
        }
      };

  useEffect(() => {
    let isMounted = true;

    const startCapturingData = async () => {
      while (isMounted) {
        // Pausa por 10 segundos antes de la captura de datos
        setIsPaused(true);
        await new Promise(resolve => setTimeout(resolve, 10000));
        setIsPaused(false);

        const dataHistory = [];
        await new Promise(resolve => {
          let timeout = setTimeout(() => {
            clearTimeout(timeout);
            resolve();
          }, 6000);

          const accSubscription = Accelerometer.addListener(data => {
            accelerometerDataRef.current = data;
            dataHistory.push({ type: 'accelerometer', data, timestamp: timestampCounter.current });
          });

          const gyroSubscription = Gyroscope.addListener(data => {
            gyroscopeDataRef.current = data;
            dataHistory.push({ type: 'gyroscope', data, timestamp: timestampCounter.current });
          });

          const magSubscription = Magnetometer.addListener(data => {
            magnetometerDataRef.current = data;
            dataHistory.push({ type: 'magnetometer', data, timestamp: timestampCounter.current });
          });

          // Captura por 6 segundos
          setTimeout(() => {
            accSubscription.remove();
            gyroSubscription.remove();
            magSubscription.remove();
            resolve();
          }, 6000);
        });

        if (isMounted) {
          // Incrementa el contador de timestamp
          timestampCounter.current += 1;

          // Almacena todos los datos capturados
          setSensorData(prevData => [...prevData, ...dataHistory]);

          // Mapear los datos al formato esperado por Calculador
          const formattedData = dataHistory.map(item => ({
            timestamp: item.timestamp,
            acc_x: item.data.x,
            acc_y: item.data.y,
            acc_z: item.data.z,
            gyro_x: item.type === 'gyroscope' ? item.data.x : 0,
            gyro_y: item.type === 'gyroscope' ? item.data.y : 0,
            gyro_z: item.type === 'gyroscope' ? item.data.z : 0,
            mag_x: item.type === 'magnetometer' ? item.data.x : 0,
            mag_y: item.type === 'magnetometer' ? item.data.y : 0,
            mag_z: item.type === 'magnetometer' ? item.data.z : 0,
          }));

          // Calcular características con el Calculador
          const calculador = new Calculador();
          const calculatedFeatures = calculador.calcularCaracteristicas(formattedData);
          setCaracteristicas(calculatedFeatures); // Guardar en el estado
          console.log('Datos capturados durante los primeros 6 segundos:', formattedData);

            // Construir el objeto JSON con las características calculadas
          const jsonResult = {
                'acc_max':  calculatedFeatures[0],
                'acc_kurtosis': calculatedFeatures[1],
                'acc_skewness':  calculatedFeatures[2],
                'gyro_max': calculatedFeatures[3],
                'gyro_kurtosis':  calculatedFeatures[4],
                'gyro_skewness': calculatedFeatures[5],
                'linMaxValue': calculatedFeatures[6],
                'postLinMaxValue': calculatedFeatures[7],
                'postGyroMaxValue': calculatedFeatures[8],
                'postMagMaxValue': calculatedFeatures[9],
                'mag_max': calculatedFeatures[10],
                'mag_curtosis': calculatedFeatures[11],
                'mag_skewness':  calculatedFeatures[12]
              };
         
           // Hacer lo que necesites con el objeto JSON
           console.log('Datos en formato JSON:', jsonResult);

            // Enviar el objeto JSON al servidor
            sendDataToServer(jsonResult);

        }
      }
    };

    startCapturingData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Maneja los resultados calculados, por ejemplo, puedes enviarlos a un servidor o actualizar el estado del componente.
    console.log('Características calculadas:', caracteristicas);
  }, [caracteristicas]);

  return (
    <View style={styles.container}>
      <Text>Acelerómetro Data:</Text>
      {accelerometerDataRef.current && (
        <View>
          <Text>X: {accelerometerDataRef.current.x?.toFixed(15)}</Text>
          <Text>Y: {accelerometerDataRef.current.y?.toFixed(15)}</Text>
          <Text>Z: {accelerometerDataRef.current.z?.toFixed(15)}</Text>
        </View>
      )}
      <Text>Giroscopio Data:</Text>
      {gyroscopeDataRef.current && (
        <View>
          <Text>X: {gyroscopeDataRef.current.x?.toFixed(15)}</Text>
          <Text>Y: {gyroscopeDataRef.current.y?.toFixed(15)}</Text>
          <Text>Z: {gyroscopeDataRef.current.z?.toFixed(15)}</Text>
        </View>
      )}
      <Text>Magnetómetro Data:</Text>
      {magnetometerDataRef.current && (
        <View>
          <Text>X: {magnetometerDataRef.current.x?.toFixed(15)}</Text>
          <Text>Y: {magnetometerDataRef.current.y?.toFixed(15)}</Text>
          <Text>Z: {magnetometerDataRef.current.z?.toFixed(15)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
  },
});
