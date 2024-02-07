import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Button, IconButton } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
export default function ShelvesList(props) {
   const cityId = props.navigation.getParam('cityId', null);
  const [shelves, setShelves] = useState([]);
   const [closestShelf, setClosestShelf] = useState(null);
   const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  let token = null;

const getLocationAsync = async () => {
  getToken();
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  //console.log('Current location:', location);
   getClosestShelf(location.coords.latitude, location.coords.longitude);
};

  const getToken = async () => {
    token = await AsyncStorage.getItem('Token');
    if (token) {
      getShelves();

    } else {
      props.navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    getToken();
    getLocationAsync();
  }, []);


const getShelves = () => {
  fetch(`http://192.168.8.137:8000/backend/shelves/shelves_in_city?city_id=${cityId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(res => res.json())
    .then(jsonRes => setShelves((jsonRes)))
    .catch(error => console.log(error))
}

  const getClosestShelf = (userLatitude, userLongitude) => {
    fetch(`http://192.168.8.137:8000/backend/shelves/get_closest_shelf/?user_latitude=${userLatitude}&user_longitude=${userLongitude}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        //(jsonRes)
        setClosestShelf(jsonRes)
        //console.log(closestShelf)
      })
      .catch(error => console.log(error));
  };
  const shelveClicked = (shelve, token) => {
    props.navigation.navigate("ShelveDetail", { shelve: shelve, token: token })
  }

  const logout = async () => {

    await AsyncStorage.removeItem('Token');

    props.navigation.navigate('Start');
  };

const search = (shelves, token) =>{
  props.navigation.navigate("SearchBook",{ cityId: cityId, token: token })
}

const getYourBooks =(cityId) => {
props.navigation.navigate("UserBookList", {cityId: cityId} );
}
const changeCity =() => {
props.navigation.navigate("CityList");
}
const getUserProfile =() => {
props.navigation.navigate("UserProfile");
}

 const showAlert = () => {
  if (closestShelf) {
    // Pobierz dane z obiektu closestShelf
    console.log(closestShelf)
    const { closest_shelf_name, address, closest_shelf_distance_km } = closestShelf;
    //const shelfName = name !== undefined ? `"${name}"` : 'Brak informacji o nazwie';
    // Ustaw dane do wyświetlenia w AwesomeAlert
    setAlertTitle('Najbliższa półka');
    setAlertMessage(
      `Nazwa półki: "${closest_shelf_name}"\nAdres: "${address}"\nDystans: "${closest_shelf_distance_km}"`
    );

    // Pokaż AwesomeAlert
    setAlertVisible(true);
  } else {
    // Jeśli closestShelf jest null, pokaż alert o braku danych
    setAlertTitle('Błąd');
    setAlertMessage('Nie udało się pobrać danych o najbliższej półce.');
    setAlertVisible(true);
  }
};

const hideAlert = () => {
    setAlertVisible(false);
    setAlertTitle('');
    setAlertMessage('');
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={shelves}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => shelveClicked(item)}>
            <View style={styles.item}>
              <Text style={styles.itemName}> {item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.iconContainer}>
        <IconButton icon="magnify" color="#2c2829" onPress={search} />
        <IconButton icon="map-marker" color="#2c2829" onPress={showAlert} />
        <IconButton icon="book" color="#2c2829" onPress={getYourBooks} />
        <IconButton icon="swap-horizontal" color="#2c2829" onPress={changeCity} />
        <IconButton icon="logout" color="#2c2829" onPress={logout} />

        {/*<IconButton icon="account" color="#2c2829" onPress={getUserProfile} />*/}
      </View>

      <AwesomeAlert
        show={isAlertVisible}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#2c2829"
        onConfirmPressed={hideAlert}
      />
    </View>
  );
}

ShelvesList.navigationOptions = ({ navigation }) => ({
  title: 'Półki',
  headerStyle: {
    backgroundColor: '#9b4e0a',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerLeft: () => null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f4f3',
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    backgroundColor: "#2c2829",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
  },
  itemName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff', // Kolor tła ikonowego kontenera (możesz dostosować według własnych preferencji)
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
