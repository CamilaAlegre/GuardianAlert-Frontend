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
  const [accMax, setAccMax] = useState(null);
  const [accKurtosis, setAccKurtosis] = useState(null);
  const [accSkewness, setAccSkewness] = useState(null);
  const [gyroMax, setGyroMax] = useState(null);
  const [gyroKurtosis, setGyroKurtosis] = useState(null);
  const [gyroSkewness, setGyroSkewness] = useState(null);
  const [magMax, setMagMax] = useState(null);
  const [magKurtosis, setMagKurtosis] = useState(null);
  const [magSkewness, setMagSkewness] = useState(null);
  const linMaxInterval = 4000;  // Intervalo de 4 segundos para linMaxValue
  const postLinMaxInterval = 6000;  // Intervalo de 6 segundos para postLinMaxValue, postGyroMaxValue y postMagMaxValue
  const captureInterval = 6000; // 6 segundos
  const pauseInterval = 3000; // 3 segundos
  const [timer, setTimer] = useState(null);

  // Crear una función para enviar los datos al servidor
  const sendDataToServer = async (jsonData) => {
    try {
      const response = await axios.post('http://172.16.128.102:3000/data/sensors', jsonData);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  const captureData = () => {
    const interval = capturing ? captureInterval : pauseInterval;
    const timerId = setInterval(() => {
      if (capturing) {
        processAndSendData(); // Procesa y envía datos después del intervalo de captura
        startCapturingData(); // Reinicia la captura
      } else {
        stopCapturingData();
      }
    }, interval);
    setTimer(timerId);
  };
  const startCapturingData = () => {
    setCapturing(true);
    captureData();
  };
  
  const stopCapturingData = () => {
    setCapturing(false);
    clearTimeout(timer);
    // Comienza la captura nuevamente después de un intervalo de pausa
    setTimeout(() => {
      startCapturingData();
    }, pauseInterval);
  };
  //Limpia el temporizador cuando el componente se desmonta
  useEffect(() => {
    startCapturingData();
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  useEffect(() => {
    let isCapturing = true;
    let accSubscription, gyroSubscription, magSubscription;

    const startCapturingData = () => {
      if (isCapturing) {
        accSubscription = Accelerometer.addListener((data) => {
          setAccelerometerData(data);
          setDataHistory((prevData) => [...prevData, { type: 'accelerometer', data, timestamp: new Date() }]);
        });

        gyroSubscription = Gyroscope.addListener((data) => {
          setGyroscopeData(data);
          setDataHistory((prevData) => [...prevData, { type: 'gyroscope', data, timestamp: new Date() }]);
        });

        magSubscription = Magnetometer.addListener((data) => {
          setMagnetometerData(data);
          setDataHistory((prevData) => [...prevData, { type: 'magnetometer', data, timestamp: new Date() }]);
        });

        setTimeout(() => {
          stopCapturingData();
        }, 6000);
      }
    };

    const stopCapturingData = () => {
      isCapturing = false;
      accSubscription.remove();
      gyroSubscription.remove();
      magSubscription.remove();
      setCapturing(false);
    };

    startCapturingData();

    return () => {
      stopCapturingData();
    };
  }, []);

  // Función para procesar y enviar datos
const processAndSendData = () => {
  const accData = dataHistory
  .filter((entry) => entry.type === 'accelerometer')
  .map((entry) => entry.data.x);

const gyroData = dataHistory
  .filter((entry) => entry.type === 'gyroscope')
  .map((entry) => entry.data.x);

const magData = dataHistory
  .filter((entry) => entry.type === 'magnetometer')
  .map((entry) => entry.data.x);

// Calcular la curtosis, máx y skewness de los datos del acelerómetro
const n = accData.length;

// Calcular las métricas para el acelerómetro
const meanAcc = accData.reduce((acc, value) => acc + value, 0) / n;
const fourthMomentAcc = accData.reduce((acc, value) => acc + Math.pow(value - meanAcc, 4), 0) / n;
const varianceAcc = accData.reduce((acc, value) => acc + Math.pow(value - meanAcc, 2), 0) / n;
const kurtosisAcc = fourthMomentAcc / (varianceAcc * varianceAcc);
setAccKurtosis(kurtosisAcc);

const maxAcc = Math.max(...accData);
setAccMax(maxAcc);

//const skewnessAcc = simpleStatistics.sampleSkewness(accData);
//setAccSkewness(skewnessAcc);

const skewnessAcc = accData.length >= 3 ? simpleStatistics.sampleSkewness(accData) : null;
setAccSkewness(skewnessAcc);

// Filtrar datos del giroscopio
const nGyro = gyroData.length;

// Calcular las métricas para el giroscopio
const meanGyro = gyroData.reduce((acc, value) => acc + value, 0) / nGyro;
const fourthMomentGyro = gyroData.reduce((acc, value) => acc + Math.pow(value - meanGyro, 4), 0) / nGyro;
const varianceGyro = gyroData.reduce((acc, value) => acc + Math.pow(value - meanGyro, 2), 0) / nGyro;
const kurtosisGyro = fourthMomentGyro / (varianceGyro * varianceGyro);
setGyroKurtosis(kurtosisGyro);

const maxGyro = Math.max(...gyroData);
setGyroMax(maxGyro);

const skewnessGyro = simpleStatistics.sampleSkewness(gyroData);
setGyroSkewness(skewnessGyro);

// Filtrar datos del magnetómetro
const nMag = magData.length;

// Calcular las métricas para el magnetómetro
const meanMag = magData.reduce((acc, value) => acc + value, 0) / nMag;
const fourthMomentMag = magData.reduce((acc, value) => acc + Math.pow(value - meanMag, 4), 0) / nMag;
const varianceMag = magData.reduce((acc, value) => acc + Math.pow(value - meanMag, 2), 0) / nMag;
const kurtosisMag = fourthMomentMag / (varianceMag * varianceMag);
setMagKurtosis(kurtosisMag);

const maxMag = Math.max(...magData);
setMagMax(maxMag);

const skewnessMag = simpleStatistics.sampleSkewness(magData);
setMagSkewness(skewnessMag);

// Obtener datos específicos para los intervalos de tiempo
const currentTime = new Date();
const linMaxData = getMetricData(dataHistory, 'accelerometer', linMaxInterval, currentTime);
const postLinMaxData = getMetricData(dataHistory, 'accelerometer', postLinMaxInterval, currentTime);
const postGyroMaxData = getMetricData(dataHistory, 'gyroscope', postLinMaxInterval, currentTime);
const postMagMaxData = getMetricData(dataHistory, 'magnetometer', postLinMaxInterval, currentTime);

// Calcular linMaxValue, postLinMaxValue, postGyroMaxValue y postMagMaxValue
const linMaxValue = linMaxData ? Math.max(...linMaxData.map((entry) => entry.data.x)) : null;
const postLinMaxValue = postLinMaxData ? Math.max(...postLinMaxData.map((entry) => entry.data.x)) : null;
const postGyroMaxValue = postGyroMaxData ? Math.max(...postGyroMaxData.map((entry) => entry.data.x)) : null;
const postMagMaxValue = postMagMaxData ? Math.max(...postMagMaxData.map((entry) => entry.data.x)) : null;

//se guardan los datos en un json
const jsonData = {
  'acc_max': maxAcc,
  'acc_kurtosis': kurtosisAcc,
  'acc_skewness': skewnessAcc,
  'gyro_max': maxGyro,
  'gyro_kurtosis': kurtosisGyro,
  'gyro_skewness': skewnessGyro,
  'linMaxValue': linMaxValue,
  'postLinMaxValue': postLinMaxValue,
  'postGyroMaxValue': postGyroMaxValue,
  'postMagMaxValue': postMagMaxValue,
  'mag_max': maxMag,
  'mag_curtosis': kurtosisMag,
  'mag_skewness': skewnessMag,
};

//Imprimir el objeto JSON en la consola
console.log('JSON Data:', JSON.stringify(jsonData, null, 2));

// Enviar el objeto JSON al servidor 
sendDataToServer(jsonData);
};

  //hace los calculos y envia
  useEffect(() => {
    if (!capturing) {
      // Filtrar datos de acelerómetro, giroscopio y magnetómetro
      processAndSendData();
    }
  }, [capturing, dataHistory]);

  // Función para obtener datos específicos en un intervalo de tiempo
  const getMetricData = (data, type, interval, currentTime) => {
    const intervalStart = new Date(currentTime - interval);
    return data
      .filter((entry) => entry.type === type && entry.timestamp >= intervalStart && entry.timestamp <= currentTime);
  };

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
