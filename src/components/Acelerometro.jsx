import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function Acelerometro() {
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [capturing, setCapturing] = useState(true);

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
      // Calcular la curtosis de los datos
      const dataX = dataHistory.map((data) => data.x);
      const n = dataX.length;
      const mean = dataX.reduce((acc, value) => acc + value, 0) / n;
      const fourthMoment = dataX.reduce((acc, value) => acc + Math.pow(value - mean, 4), 0) / n;
      const variance = dataX.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / n;
      const kurtosis = fourthMoment / (variance * variance);

      console.log('Historial de datos del acelerómetro:', dataHistory);
      console.log('Curtosis de los datos:', kurtosis);
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
});
