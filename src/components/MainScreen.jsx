import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet,TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import SensorData from './Sensores';


const MainScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [golpes, setGolpes] = useState(0);
    const [caidas, setCaidas] = useState(0);
    const [impactos, setImpactos] = useState(0);
    const [hora, setHora] = useState(new Date().toLocaleTimeString('es-AR'));
    const [storedToken, setStoredToken] = useState(null); // Agregado
  
    const navigation = useNavigation(); 
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          setStoredToken(token); // Almacenar el token en el estado
        } catch (error) {
          console.error('Error al obtener el token:', error);
        }
      };
  
      fetchData();
    }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString('es-AR'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const latitude = location.coords.latitude;
  const longitude = location.coords.longitude;

  const handleHistorial= () => {
    navigation.navigate('Historial'); 
  };

  const handleUpdate = () => {
    navigation.navigate('Update'); 
  };

  const handleContact = () => {
    navigation.navigate('Contact'); 
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.infoContainer}>
        <Image source={require('../assets/GuardianAlertBlack.png')} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: latitude, longitude: longitude }}
              title={'Ubicación Actual'}
              description={'Aquí estás'}
            />
          </MapView>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>{hora}</Text>
          </View>
        </View>
      </View>

      <View style={styles.alertContainer}>
        <Image source={require('../assets/alerta.gif')} style={styles.alertIcon} />
        <Text style={styles.alertText}>GOLPES <Text style={styles.boldText}>{golpes}</Text></Text>
        <Text style={styles.alertText}>CAIDAS: <Text style={styles.boldText}>{caidas}</Text></Text>
        <Text style={styles.alertText}>IMPACTOS: <Text style={styles.boldText}>{impactos}</Text></Text>
        <SensorData token={storedToken} location={location} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Actualizar datos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleContact}>
          <Text style={styles.buttonText}>Contacto de Emergencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleHistorial}>
          <Text style={styles.buttonText}>Historial</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  timeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBox: {
    width:160,
    height: 135,
    backgroundColor: '#7B68EE',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 30,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: 160,
    height: 135,
    borderRadius: 20,
    overflow: 'hidden',
  },

  alertIcon: {
    width: 100,
    height: 50,
  },

  alertContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  alertIcon: {
    width: 100,
    height: 90,
    marginBottom: 10,
  },
  alertText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10, 
    alignItems: 'center',
  },
  button: {
    width: 350,
    height: 50,
    backgroundColor: '#7B68EE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});

export default MainScreen;