import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import simpleStatistics from 'simple-statistics';

export default function SensorData() {
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState(null);

  const [dataHistory, setDataHistory] = useState([]);
  const [capturing, setCapturing] = useState(true);

  const [accMax, setAccMax] = useState(null);
  const [accKurtosis, setAccKurtosis] = useState(null);
  const [accSkewness, setAccSkewness] = useState(null);

  const [gyroMax, setGyroMax] = useState(null);
  const [gyroKurtosis, setGyroKurtosis] = useState(null);
  const [gyroSkewness, setGyroSkewness] = useState(null);

  useEffect(() => {
    let isCapturing = true;
    let accSubscription, gyroSubscription;

    const startCapturingData = () => {
      if (isCapturing) {
        accSubscription = Accelerometer.addListener((data) => {
          setAccelerometerData(data);
          setDataHistory((prevData) => [...prevData, { type: 'accelerometer', data }]);
        });

        gyroSubscription = Gyroscope.addListener((data) => {
          setGyroscopeData(data);
          setDataHistory((prevData) => [...prevData, { type: 'gyroscope', data }]);
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
      setCapturing(false);
    };

    startCapturingData();

    return () => {
      stopCapturingData();
    };
  }, []);

  useEffect(() => {
    if (!capturing) {
      // Filtrar datos de acelerómetro
      const accData = dataHistory
        .filter((entry) => entry.type === 'accelerometer')
        .map((entry) => entry.data.x);

      // Calcular la curtosis, máx y skewness de los datos del acelerómetro
      const n = accData.length;

      const mean = accData.reduce((acc, value) => acc + value, 0) / n;
      const fourthMoment = accData.reduce((acc, value) => acc + Math.pow(value - mean, 4), 0) / n;
      const variance = accData.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / n;
      const kurtosis = fourthMoment / (variance * variance);
      setAccKurtosis(kurtosis);

      const max = Math.max(...accData);
      setAccMax(max);

      const skewness = simpleStatistics.sampleSkewness(accData);
      setAccSkewness(skewness);

      // Filtrar datos del giroscopio
      const gyroData = dataHistory
        .filter((entry) => entry.type === 'gyroscope')
        .map((entry) => entry.data.x);

      // Calcular la curtosis, máx y skewness de los datos del giroscopio
      const nGyro = gyroData.length;

      const meanGyro = gyroData.reduce((acc, value) => acc + value, 0) / nGyro;
      const fourthMomentGyro = gyroData.reduce((acc, value) => acc + Math.pow(value - meanGyro, 4), 0) / nGyro;
      const varianceGyro = gyroData.reduce((acc, value) => acc + Math.pow(value - meanGyro, 2), 0) / nGyro;
      const kurtosisGyro = fourthMomentGyro / (varianceGyro * varianceGyro);
      setGyroKurtosis(kurtosisGyro);

      const maxGyro = Math.max(...gyroData);
      setGyroMax(maxGyro);

      const skewnessGyro = simpleStatistics.sampleSkewness(gyroData);
      setGyroSkewness(skewnessGyro);

      console.log('Historial de datos:', dataHistory);
      console.log('Máximo de los datos del acelerómetro:', max);
      console.log('Curtosis de los datos del acelerómetro:', kurtosis);
      console.log('Skewness de los datos del acelerómetro:', skewness);
      console.log('Máximo de los datos del giroscopio:', maxGyro);
      console.log('Curtosis de los datos del giroscopio:', kurtosisGyro);
      console.log('Skewness de los datos del giroscopio:', skewnessGyro);
    }
  }, [capturing, dataHistory]);
  return (
    <View style={styles.container}>
      <Text>Acelerómetro Data:</Text>
      {accelerometerData && (
        <View>
          <Text>X: {accelerometerData.x.toFixed(2)}</Text>
          <Text>Y: {accelerometerData.y.toFixed(2)}</Text>
          <Text>Z: {accelerometerData.z.toFixed(2)}</Text>
        </View>
      )}
      <Text>Giroscopio Data:</Text>
      {gyroscopeData && (
        <View>
          <Text>X: {gyroscopeData.x.toFixed(2)}</Text>
          <Text>Y: {gyroscopeData.y.toFixed(2)}</Text>
          <Text>Z: {gyroscopeData.z.toFixed(2)}</Text>
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
