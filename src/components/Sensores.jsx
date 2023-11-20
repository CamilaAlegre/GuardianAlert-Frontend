import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import {
    calcularCurtosis,
    calcularAsimetria,
    calcularMagnitud,
    calcularLinMax,
    calcularPostLinMax,
    calcularPostGyroMax,
    calcularPostMagMax,
  } from './Calculador';

export default function SensorData() {
  const [sensorData, setSensorData] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const accelerometerDataRef = useRef(null);
  const gyroscopeDataRef = useRef(null);
  const magnetometerDataRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const startCapturingData = async () => {
      while (isMounted) {
        const dataHistory = [];
        await new Promise(resolve => {
          let timeout = setTimeout(() => {
            clearTimeout(timeout);
            resolve();
          }, 6000);

          const accSubscription = Accelerometer.addListener(data => {
            accelerometerDataRef.current = data;
            dataHistory.push({ type: 'accelerometer', data, timestamp: new Date() });
          });

          const gyroSubscription = Gyroscope.addListener(data => {
            gyroscopeDataRef.current = data;
            dataHistory.push({ type: 'gyroscope', data, timestamp: new Date() });
          });

          const magSubscription = Magnetometer.addListener(data => {
            magnetometerDataRef.current = data;
            dataHistory.push({ type: 'magnetometer', data, timestamp: new Date() });
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
          // Almacena todos los datos capturados y ordenados por tiempo
          setSensorData(prevData => [...prevData, ...dataHistory.sort((a, b) => a.timestamp - b.timestamp)]);

          // Pausa durante 10 segundos
          setIsPaused(true);
          console.log('Estoy pausado');
          await new Promise(resolve => setTimeout(resolve, 10000));
          setIsPaused(false);
        }
      }
    };

    startCapturingData();

    return () => {
      isMounted = false;
    };
  }, []);

// Este useEffect se ejecutará cuando sensorData cambie
useEffect(() => {
    console.log('Todos los datos ordenados por tiempo:', sensorData);
  
    // Obtener datos para el cálculo de curtosis y asimetría
    const accelerometerData = sensorData.filter(entry => entry.type === 'accelerometer').map(entry => entry.data.x);
    const gyroscopeData = sensorData.filter(entry => entry.type === 'gyroscope').map(entry => entry.data.x);
    const magnetometerData = sensorData.filter(entry => entry.type === 'magnetometer').map(entry => entry.data.x);
  
    // Calcular curtosis y asimetría
    const accCurtosis = calcularCurtosis(accelerometerData);
    const accAsimetria = calcularAsimetria(accelerometerData);
  
    const gyroCurtosis = calcularCurtosis(gyroscopeData);
    const gyroAsimetria = calcularAsimetria(gyroscopeData);
  
    const magCurtosis = calcularCurtosis(magnetometerData);
    const magAsimetria = calcularAsimetria(magnetometerData);
  
    // Mostrar resultados en la consola
    console.log('Curtosis del acelerómetro:', accCurtosis);
    console.log('Asimetría del acelerómetro:', accAsimetria);
  
    console.log('Curtosis del giroscopio:', gyroCurtosis);
    console.log('Asimetría del giroscopio:', gyroAsimetria);
  
    console.log('Curtosis del magnetómetro:', magCurtosis);
    console.log('Asimetría del magnetómetro:', magAsimetria);
  }, [sensorData]);
  

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
