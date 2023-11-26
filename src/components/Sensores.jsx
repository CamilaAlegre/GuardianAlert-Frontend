import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import Calculador from './Calculador2';
import axios from 'axios'; // Asegúrate de importar axios

export default function SensorData({ token , location}) {
  const [sensorData, setSensorData] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [caracteristicas, setCaracteristicas] = useState(null);
  const timestampCounter = useRef(0);
  const accelerometerDataRef = useRef(null);
  const gyroscopeDataRef = useRef(null);
  const magnetometerDataRef = useRef(null);

  const sendDataToServer = async (jsonData) => {
    try {
      const response = await axios.post('http://172.16.128.102:3000/events', {
          token: token,
          sensorData: jsonData,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
      );
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error.response.data);
    }
  };
  

  useEffect(() => {
    let isMounted = true;

    const startCapturingData = async () => {
      while (isMounted) {
        // Pausa por 10 segundos antes de la captura de datos
        setIsPaused(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
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
          if (!isPaused) {
            timestampCounter.current += 1;
          }

          // Almacena todos los datos capturados
          setSensorData(prevData => [...prevData, ...dataHistory]);

          // Mapear los datos al formato esperado por Calculador
          const formattedData = dataHistory.map((item, index) => ({
            timestamp: timestampCounter.current - dataHistory.length + index + 1,
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
          'acc_kurtosis': replaceInfinity(calculatedFeatures[1]),
          'acc_max': replaceInfinity(calculatedFeatures[0]),
          'acc_skewness': calculatedFeatures[2],
          'gyro_kurtosis': replaceInfinity(calculatedFeatures[4]),
          'gyro_max': replaceInfinity(calculatedFeatures[3]),
          'gyro_skewness': calculatedFeatures[5],
          'linMaxValue': calculatedFeatures[6],
          'mag_curtosis': replaceInfinity(calculatedFeatures[11]),
          'mag_max': replaceInfinity(calculatedFeatures[10]),
          'mag_skewness': calculatedFeatures[12],
          'postGyroMaxValue': replaceInfinity(calculatedFeatures[8]),
          'postLinMaxValue': calculatedFeatures[7],
          'postMagMaxValue': replaceInfinity(calculatedFeatures[9]),
        };

        // Hacer lo que necesites con el objeto JSON
        console.log('Datos en formato JSON:', jsonResult);
        console.log(token);
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);

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

  function replaceInfinity(value) {
    // Verifica si el valor es "-Infinity" o "Infinity" y lo reemplaza por 0
    return value === '-Infinity' || value === 'Infinity' ? 0 : value;
  }

  useEffect(() => {
    // Maneja los resultados calculados, por ejemplo, puedes enviarlos a un servidor o actualizar el estado del componente.
    console.log('Características calculadas:', caracteristicas);
  }, [caracteristicas]);

  function roundToTwoDecimals(value) {
    // Verifica si el valor es "-Infinity" o "Infinity" y lo reemplaza por 0
    value = value === '-Infinity' || value === 'Infinity' ? 0 : value;
    return Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100;
  }

  return (
    <View style={styles.container}>
      <Text>Acelerómetro Data:</Text>
      {accelerometerDataRef.current && (
        <View>
          <Text>X: {roundToTwoDecimals(parseFloat(accelerometerDataRef.current.x?.toFixed(2)))}</Text>
          <Text>Y: {roundToTwoDecimals(parseFloat(accelerometerDataRef.current.y?.toFixed(2)))}</Text>
          <Text>Z: {roundToTwoDecimals(parseFloat(accelerometerDataRef.current.z?.toFixed(2)))}</Text>
        </View>
      )}
      <Text>Giroscopio Data:</Text>
      {gyroscopeDataRef.current && (
        <View>
          <Text>X: {roundToTwoDecimals(parseFloat(gyroscopeDataRef.current.x?.toFixed(2)))}</Text>
          <Text>Y: {roundToTwoDecimals(parseFloat(gyroscopeDataRef.current.y?.toFixed(2)))}</Text>
          <Text>Z: {roundToTwoDecimals(parseFloat(gyroscopeDataRef.current.z?.toFixed(2)))}</Text>
        </View>
      )}
      <Text>Magnetómetro Data:</Text>
      {magnetometerDataRef.current && (
        <View>
          <Text>X: {roundToTwoDecimals(parseFloat(magnetometerDataRef.current.x?.toFixed(2)))}</Text>
          <Text>Y: {roundToTwoDecimals(parseFloat(magnetometerDataRef.current.y?.toFixed(2)))}</Text>
          <Text>Z: {roundToTwoDecimals(parseFloat(magnetometerDataRef.current.z?.toFixed(2)))}</Text>
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
