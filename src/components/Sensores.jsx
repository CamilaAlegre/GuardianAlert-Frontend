import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import Calculador from './Calculador2';
import axios from 'axios'; // Asegúrate de importar axios

export default function SensorData({ token, location }) {
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
        longitude: location.coords.longitude,
      });
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error.response.data);
    }
  };

  useEffect(() => {
    let isMounted = true;
  
    const startCapturingData = async () => {
      let timestamp = 1;
      const capturedData = [];
  
      while (isMounted && timestamp <= 6) {
        // Pausa por 1 segundo antes de la captura de datos
        setIsPaused(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsPaused(false);
  
        const dataHistory = [];
  
        await new Promise((resolve) => {
          const accelerometerListener = Accelerometer.addListener((accelData) => {
            dataHistory.push({ type: 'accelerometer', data: accelData, timestamp });
            accelerometerListener.remove(); // Remover el listener después de la primera captura
          });
  
          const gyroscopeListener = Gyroscope.addListener((gyroData) => {
            dataHistory.push({ type: 'gyroscope', data: gyroData, timestamp });
            gyroscopeListener.remove();
          });
  
          const magnetometerListener = Magnetometer.addListener((magData) => {
            dataHistory.push({ type: 'magnetometer', data: magData, timestamp });
            magnetometerListener.remove();
          });
  
          // Captura por 1 segundo
          setTimeout(() => {
            resolve();
          }, 1000);
        });
  
        if (isMounted) {
          // Agrega los datos capturados al array
          capturedData.push({
            timestamp,
            acc_x: parseFloat(dataHistory.find((item) => item.type === 'accelerometer')?.data.x || 0).toFixed(1),
            acc_y: parseFloat(dataHistory.find((item) => item.type === 'accelerometer')?.data.y || 0).toFixed(1),
            acc_z: parseFloat(dataHistory.find((item) => item.type === 'accelerometer')?.data.z || 0).toFixed(1),
            gyro_x: parseFloat(dataHistory.find((item) => item.type === 'gyroscope')?.data.x || 0).toFixed(1),
            gyro_y: parseFloat(dataHistory.find((item) => item.type === 'gyroscope')?.data.y || 0).toFixed(1),
            gyro_z: parseFloat(dataHistory.find((item) => item.type === 'gyroscope')?.data.z || 0).toFixed(1),
            mag_x: parseFloat(dataHistory.find((item) => item.type === 'magnetometer')?.data.x || 0).toFixed(1),
            mag_y: parseFloat(dataHistory.find((item) => item.type === 'magnetometer')?.data.y || 0).toFixed(1),
            mag_z: parseFloat(dataHistory.find((item) => item.type === 'magnetometer')?.data.z || 0).toFixed(1),
          });
  
          // Incrementa el contador de timestamp
          timestamp += 1;
        }
      }
  
      // Luego de capturar todos los datos
      if (isMounted) {
        // Formatea los datos capturados para el Calculador
        const formattedData = capturedData.map((item) => ({
          timestamp: item.timestamp,
          acc_x: item.acc_x,
          acc_y: item.acc_y,
          acc_z: item.acc_z,
          gyro_x: item.gyro_x,
          gyro_y: item.gyro_y,
          gyro_z: item.gyro_z,
          mag_x: item.mag_x,
          mag_y: item.mag_y,
          mag_z: item.mag_z,
        }));
  
        console.log(formattedData);
        
        // Calcular características con el Calculador
        const calculador = new Calculador();
        const calculatedFeatures = calculador.calcularCaracteristicas(formattedData);
        setCaracteristicas(calculatedFeatures); // Guardar en el estado
  
        // Construir el objeto JSON con las características calculadas
        const jsonResult = {
          acc_kurtosis: replaceInfinity(calculatedFeatures[1]),
          acc_max: replaceInfinity(calculatedFeatures[0]),
          acc_skewness: calculatedFeatures[2],
          gyro_kurtosis: replaceInfinity(calculatedFeatures[4]),
          gyro_max: replaceInfinity(calculatedFeatures[3]),
          gyro_skewness: calculatedFeatures[5],
          linMaxValue: calculatedFeatures[6],
          mag_curtosis: replaceInfinity(calculatedFeatures[11]),
          mag_max: replaceInfinity(calculatedFeatures[10]),
          mag_skewness: calculatedFeatures[12],
          postGyroMaxValue: replaceInfinity(calculatedFeatures[8]),
          postLinMaxValue: calculatedFeatures[7],
          postMagMaxValue: replaceInfinity(calculatedFeatures[9]),
        };
  
        // Hacer lo que necesites con el objeto JSON
        console.log('Datos en formato JSON:', jsonResult);
        console.log(token);
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);
  
        // Enviar el objeto JSON al servidor
        sendDataToServer(jsonResult);
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
