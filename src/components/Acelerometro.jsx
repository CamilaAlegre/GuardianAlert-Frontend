import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {  Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import simpleStatistics from 'simple-statistics';
import axios from 'axios';

export default function SensorData() {
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState(null);
  const [magnetometerData, setMagnetometerData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [capturing, setCapturing] = useState(true);
  const captureInterval = 6000; // 6 segundos
  const pauseInterval = 3000; // 3 segundos
  const [timer, setTimer] = useState(null);

  // Crear una función para enviar los datos al servidor
  const sendDataToServer = async (jsonData) => {
    try {
      const response = await axios.post('http://172.16.128.101:3000/data/sensors', jsonData);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  useEffect(() => {
    let isCapturing = true;
    let capturedData = [];
  
    const startCapturingData = () => {
      const addDataToCapture = (type, data) => {
        capturedData.push({ type, data, timestamp: new Date() });
      };
  
      const accSubscription = Accelerometer.addListener((data) => {
        setAccelerometerData(data);
        addDataToCapture('accelerometer', data);
      });
  
      const gyroSubscription = Gyroscope.addListener((data) => {
        setGyroscopeData(data);
        addDataToCapture('gyroscope', data);
      });
  
      const magSubscription = Magnetometer.addListener((data) => {
        setMagnetometerData(data);
        addDataToCapture('magnetometer', data);
      });
  
      setTimeout(() => {
        stopCapturingData();
        accSubscription.remove();
        gyroSubscription.remove();
        magSubscription.remove();
      }, 6000);
    };
  
    const stopCapturingData = () => {
      isCapturing = false;
      sendData(capturedData);
      capturedData = [];
    };
  
    startCapturingData();
  
    return () => {
      stopCapturingData();
    };
  }, []);
  
  
  // Función para procesar y enviar datos
  const processAndSendData = () => {
    console.log(dataHistory);
    const datosCalculados = calcularCaracteristicas(dataHistory);
  
    const jsonData = {
      'acc_max': datosCalculados[0],
      'acc_kurtosis': datosCalculados[1],
      'acc_skewness': datosCalculados[2],
      'gyro_max': datosCalculados[3],
      'gyro_kurtosis': datosCalculados[4],
      'gyro_skewness': datosCalculados[5],
      'linMaxValue': datosCalculados[6],
      'postLinMaxValue': datosCalculados[7],
      'postGyroMaxValue': datosCalculados[8],
      'postMagMaxValue': datosCalculados[9],
      'mag_max': datosCalculados[10],
      'mag_curtosis': datosCalculados[11],
      'mag_skewness': datosCalculados[12],
    };
  
    console.log('JSON Data:', JSON.stringify(jsonData, null, 2));

    sendDataToServer(jsonData);
  };
  
  // Lógica para el efecto que observa cambios en dataHistory
  useEffect(() => {
    if (!capturing) {
      processAndSendData();
    }
  }, [capturing, dataHistory]);

  // Función para obtener datos específicos en un intervalo de tiempo
  const getMetricData = (data, type, interval, currentTime) => {
    const intervalStart = new Date(currentTime - interval);
    return data
      .filter((entry) => entry.type === type && entry.timestamp >= intervalStart && entry.timestamp <= currentTime);
  };

  function calcularCaracteristicas(datosentrada) {
    // Filtrar datos de interés, procesarlos y calcular estadísticas
    const datos = datosentrada.filter((dato) => dato.timestamp >= 0 && dato.timestamp < 7);
    const ventanaDatosCuartoSegundo = datos.filter((dato) => dato.timestamp >= 4 && dato.timestamp < 5);
  
    const magnitudesAceleracion = ventanaDatosCuartoSegundo.map((dato) => calcularMagnitud(dato.acc));
    const acc_max = Math.max(...magnitudesAceleracion);
  
    // Calcular otras magnitudes y estadísticas...
  
    // Luego, agregar las estadísticas calculadas en un array
    const resultados = [
      acc_max,
      // Otras estadísticas calculadas
    ];
  
    return resultados;
  }
  
  // Calcula la magnitud
  function calcularMagnitud(data) {
    return Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
  }
  
/*
const calcularCaracteristicas=(datosentrada)=> {
  const datos=datosentrada.filter(dato => dato.timestamp >= 0 && dato.timestamp <7);
  const ventanaDatosCuartoSegundo =datos.filter(dato => dato.timestamp >= 4 && dato.timestamp <5);
  
  const magnitudesAceleracion = [];
  for (const dato of ventanaDatosCuartoSegundo) {
    const magnitud = calcularMagnitud({ x: dato.acc_x, y: dato.acc_y, z: dato.acc_z });
    magnitudesAceleracion.push(magnitud);
  }
  
  // Cálculo de máxima magnitud de giroscopio
  const acc_max = Math.max(...magnitudesAceleracion);
  
  const magnitudesGiroscopio = [];
  for (const dato of ventanaDatosCuartoSegundo) {
    const magnitud =calcularMagnitud({ x: dato.gyro_x, y: dato.gyro_y, z: dato.gyro_z });
    magnitudesGiroscopio.push(magnitud);
  }
  
  // Cálculo de magnitudes de aceleración
  const magnitudesAceleracionDeTodaLaventana = [];
  for (const dato of datos) {
    const magnitud =calcularMagnitud({ x: dato.acc_x, y: dato.acc_y, z: dato.acc_z });
    magnitudesAceleracionDeTodaLaventana.push(magnitud);
  }
  
  // Cálculo de magnitudes de giroscopio
  const magnitudesGyroscopioDeTodaLaventana = [];
  for (const dato of datos) {
    const magnitud = calcularMagnitud({ x: dato.gyro_x, y: dato.gyro_y, z: dato.gyro_z });
    magnitudesGyroscopioDeTodaLaventana.push(magnitud);
  }
  
  // Cálculo de curtosis y asimetría de aceleración
  const acc_kurtosis =calcularCurtosis(magnitudesAceleracionDeTodaLaventana);
  const acc_skewness =calcularAsimetria(magnitudesAceleracionDeTodaLaventana);
  
  // Cálculo de máxima magnitud de giroscopio
  const gyro_max = Math.max(...magnitudesGiroscopio);
  
  const gyro_kurtosis = calcularCurtosis(magnitudesGyroscopioDeTodaLaventana);
  const gyro_skewness = calcularAsimetria(magnitudesGyroscopioDeTodaLaventana);
  const linMaxValue = calcularLinMax(datos);
  const postLinMaxValue = calcularPostLinMax(datos);
  const postGyroMaxValue = calcularPostGyroMax(datos);
  
  
      // Cálculo de magnitudes del magnetómetro
      const
       magnitudesMagnetometroDeTodaLaventana = [];
      for (const dato of datos) {
        const magnitud = calcularMagnitud({ x: dato.mag_x, y: dato.mag_y, z: dato.mag_z });
        magnitudesMagnetometroDeTodaLaventana.push(magnitud);
      }
  
  const magnitudesMagnetometro = [];
  for (const dato of ventanaDatosCuartoSegundo) {
    const magnitud =calcularMagnitud({ x: dato.mag_x, y: dato.mag_y, z: dato.mag_z });
    magnitudesMagnetometro.push(magnitud);
  }
  
  const postMagMaxValue = calcularPostMagMax(datos);
  const mag_max = Math.max(...magnitudesMagnetometro);
  
      // Cálculo de curtosis del magnetómetro
      const mag_curtosis = calcularCurtosis(magnitudesMagnetometroDeTodaLaventana);
  
      // Cálculo de asimetría (skewness) del magnetómetro
      const mag_skewness =calcularAsimetria(magnitudesMagnetometroDeTodaLaventana);
  
    const campos=[
  
            acc_max,
            acc_kurtosis,
            acc_skewness,
            gyro_max,
            gyro_kurtosis,
            gyro_skewness,
            linMaxValue,
            postLinMaxValue,
            postGyroMaxValue,
            postMagMaxValue,
            mag_max,
            mag_curtosis, 
            mag_skewness,
      ];
      return campos;
  }
 
  const calcularMagnitud=(vector)=> {
  return Math.sqrt(vector.x ** 2 + vector.y **2 + vector.z ** 2);
  }
  
  // Función para calcular la curtosis de un conjunto de datos
  const calcularCurtosis=(datos)=> {
  const n = datos.length;
  const media = datos.reduce((sum, val) => sum + val, 0) / n;
  const sumatoria4 = datos.reduce((sum, val) => sum + Math.pow(val - media, 4), 0);
  const desviacionEstandar = Math.sqrt(sumatoria4 / n);
  const curtosis = sumatoria4 / (n * Math.pow(desviacionEstandar, 4))-3;
  
  return curtosis;
  }
  
  // Función para calcular la asimetría de un conjunto de datos
  const calcularAsimetria=(datos)=> {
  
  const n = datos.length;
  const media = datos.reduce((sum, val) => sum + val, 0) / n;
  const sumatoria3 = datos.reduce((sum, val) => sum + Math.pow(val - media, 3), 0);
  const desviacionEstandar = Math.sqrt(datos.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / n);
  const asimetria = sumatoria3 / (n * Math.pow(desviacionEstandar, 3));
  return asimetria;
  }
  
  const calcularLinMax=(datos)=> {
    const gravedad = 9.81; // Valor aproximado de la gravedad en m/s²
  
    let lin_max = 0; // Inicializar en 0
  
    for (const fila of datos) {
      const acc_magnitud = calcularMagnitud({
        x: fila.acc_x,
        y: fila.acc_y,
        z: fila.acc_z
      });
  
      // Excluir la gravedad restando el valor estimado de gravedad
      const acc_excluyendo_gravedad = Math.max(0, acc_magnitud - gravedad);
  
      // Para calcular lin_max (Máxima aceleración lineal en el 4to segundo) excluyendo la gravedad
      if (fila.timestamp >= 4 && fila.timestamp < 5) {
        if (acc_excluyendo_gravedad > lin_max) {
          lin_max = acc_excluyendo_gravedad;
        }
      }
    }
  
    return lin_max;
  }
  
  // Función para calcular post_lin_max
  const calcularPostLinMax=(datos)=> {
    
  let post_lin_max = 0; // Inicializar en 0
  
  for (const fila of datos) {
  const acc_magnitud =calcularMagnitud({
    x: fila.acc_x,
    y: fila.acc_y,
    z: fila.acc_z
  });
  
  // Para calcular post_lin_max (Máxima aceleración lineal en el 6to segundo)
  if (fila.timestamp >= 6 && fila.timestamp < 7) {
    if (acc_magnitud > post_lin_max) {
      post_lin_max = acc_magnitud;
    }
  }
  }
  
  return post_lin_max;
  }
  
  // Función para calcular post_gyro_max
  const calcularPostGyroMax=(datos) =>{
  
  let post_gyro_max = 0; // Inicializar en 0
  
  for (const fila of datos) {
  const gyro_magnitud =calcularMagnitud({
    x: fila.gyro_x,
    y: fila.gyro_y,
    z: fila.gyro_z
  });
  
  // Para calcular post_gyro_max (Máxima magnitud del giroscopio en el 6to segundo)
  if (fila.timestamp >= 6 && fila.timestamp < 7) {
    if (gyro_magnitud > post_gyro_max) {
      post_gyro_max = gyro_magnitud;
    }
  }
  }
  
  return post_gyro_max;
  }
  
  // Función para calcular post_mag_max
  const calcularPostMagMax=(datos)=> {
  
      let post_mag_max = 0; // Inicializar en 0
      
      for (const fila of datos) {
      const mag_magnitud =calcularMagnitud({
        x: fila.mag_x,
        y: fila.mag_y,
        z: fila.mag_z
      });
      
      // Para calcular post_gyro_max (Máxima magnitud del giroscopio en el 6to segundo)
      if (fila.timestamp >= 6 && fila.timestamp < 7) {
        if (mag_magnitud > post_mag_max) {
          post_mag_max = mag_magnitud;
        }
      }
      }
      
      return post_mag_max;
      }
*/



  return (
    <View style={styles.container}>
      <Text>Acelerómetro Data:</Text>
      {accelerometerData && (
        <View>
          <Text>X: {accelerometerData.x.toFixed(15)}</Text>
          <Text>Y: {accelerometerData.y.toFixed(15)}</Text>
          <Text>Z: {accelerometerData.z.toFixed(15)}</Text>
        </View>
      )}
      <Text>Giroscopio Data:</Text>
      {gyroscopeData && (
        <View>
          <Text>X: {gyroscopeData.x.toFixed(15)}</Text>
          <Text>Y: {gyroscopeData.y.toFixed(15)}</Text>
          <Text>Z: {gyroscopeData.z.toFixed(15)}</Text>
        </View>
      )}
      <Text>Magnetómetro Data:</Text>
      {magnetometerData && (
        <View>
          <Text>X: {magnetometerData.x.toFixed(15)}</Text>
          <Text>Y: {magnetometerData.y.toFixed(15)}</Text>
          <Text>Z: {magnetometerData.z.toFixed(15)}</Text>
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
