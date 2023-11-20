import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import Calculador from './Calculador2'; 


const SensorComponent = () => {
  const [sensorData, setSensorData] = useState({
    accelerometerData: [],
    gyroscopeData: [],
    magnetometerData: [],
  });

  const sensorDataRef = useRef(sensorData);




  
  useEffect(() => {
    const captureData = async () => {
      try {
        // Suscribirse a los sensores
        await Promise.all([
          Accelerometer.setUpdateInterval(100),
          Gyroscope.setUpdateInterval(100),
          Magnetometer.setUpdateInterval(100),
        ]);

        // Funciones para manejar los datos de los sensores
        const handleAccelerometerData = (data) => {
          sensorDataRef.current = {
            ...sensorDataRef.current,
            accelerometerData: [...sensorDataRef.current.accelerometerData, data],
          };
        };

        const handleGyroscopeData = (data) => {
          sensorDataRef.current = {
            ...sensorDataRef.current,
            gyroscopeData: [...sensorDataRef.current.gyroscopeData, data],
          };
        };

        const handleMagnetometerData = (data) => {
          sensorDataRef.current = {
            ...sensorDataRef.current,
            magnetometerData: [...sensorDataRef.current.magnetometerData, data],
          };
        };

        // Suscribirse a los eventos de los sensores
        Accelerometer.addListener(handleAccelerometerData);
        Gyroscope.addListener(handleGyroscopeData);
        Magnetometer.addListener(handleMagnetometerData);

        // Capturar datos durante 6 segundos
        setTimeout(() => {
          // Detener la suscripción a los sensores
          Accelerometer.removeAllListeners();
          Gyroscope.removeAllListeners();
          Magnetometer.removeAllListeners();

          // Actualizar el estado con los datos capturados
          setSensorData(sensorDataRef.current);
          // Después de actualizar el estado con los datos capturados
          console.log('Datos capturados:', sensorDataRef.current);

          // Crear una instancia de la clase Calculador
          const calculador = new Calculador();

          // Calcular las características
          const caracteristicas = calculador.calcularCaracteristicas(sensorDataRef.current.accelerometerData);

          // Imprimir las características por consola
          console.log('Características calculadas:', caracteristicas);

        }, 6000);
      } catch (error) {
        console.error('Error al suscribirse a los sensores:', error);
      }
    };

    captureData();

    // Limpieza al desmontar el componente
    return () => {
      Accelerometer.removeAllListeners();
      Gyroscope.removeAllListeners();
      Magnetometer.removeAllListeners();
    };
  }, []);





  return (
    <View style={styles.container}>
      {/* Renderizar datos de los sensores en la vista si es necesario */}
    </View>
  );
};

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

export default SensorComponent;