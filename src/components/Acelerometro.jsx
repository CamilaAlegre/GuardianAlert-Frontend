import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import simpleStatistics from 'simple-statistics';


export default function Acelerometro() {
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [capturing, setCapturing] = useState(true);
  const [accMax, setAccMax] = useState(null);
  const [accKurtosis, setAccKurtosis] = useState(null);
  const [accSkewness, setAccSkewness] = useState(null);

  useEffect(() => {
    let isCapturing = true;
    let subscription;

    const startCapturingData = () => {
      if (isCapturing) {
        subscription = Accelerometer.addListener((data) => {
          setAccelerometerData(data);
          setDataHistory((prevData) => [...prevData, data]);
        });

        setTimeout(() => {
          stopCapturingData();
        }, 6000);
      }
    };

    const stopCapturingData = () => {
      isCapturing = false;
      subscription.remove();
      setCapturing(false);
    };

    startCapturingData();

    return () => {
      stopCapturingData();
    };
  }, []);

  useEffect(() => {
    if (!capturing) {
      // Calcular la curtosis, max y skewness de los datos
      const dataX = dataHistory.map((data) => data.x);
      const n = dataX.length;

      const mean = dataX.reduce((acc, value) => acc + value, 0) / n;
      const fourthMoment = dataX.reduce((acc, value) => acc + Math.pow(value - mean, 4), 0) / n;
      const variance = dataX.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / n;
      const kurtosis = fourthMoment / (variance * variance);
      setAccKurtosis(kurtosis);

      const max = Math.max(...dataX);
      setAccMax(max);

      const skewness = simpleStatistics.sampleSkewness(dataX);
      setAccSkewness(skewness);

      console.log('Historial de datos del acelerómetro:', dataHistory);
      console.log('Máximo de los datos:', max);
      console.log('Curtosis de los datos:', kurtosis);
      console.log('Skewness de los datos:', skewness);
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
