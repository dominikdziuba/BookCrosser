import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function ShelvesList(props) {
   const cityId = props.navigation.getParam('cityId', null);
  const [shelves, setShelves] = useState([]);
   const [closestShelf, setClosestShelf] = useState(null);
  let token = null;

const getLocationAsync = async () => {
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
      console.log(token);
      //getLocationAsync()

    } else {
      props.navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    getToken();
    getLocationAsync();
  }, []);


const getShelves = () => {
  fetch(`http://192.168.0.143:8000/backend/shelves/shelves_in_city?city_id=${cityId}`, {
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
    fetch(`http://192.168.0.143:8000/backend/shelves/get_closest_shelf/?user_latitude=${userLatitude}&user_longitude=${userLongitude}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        setClosestShelf(jsonRes)
        console.log(closestShelf)
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



  return (
    <View>
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
      <Button title="Wyloguj" onPress={logout} />
      <Button title="Wyszukaj" onPress={search} />
    </View>
  );
}

ShelvesList.navigationOptions = ({ navigation }) => ({
  title: 'Lista półek',
  headerStyle: {
    backgroundColor: 'red',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
 // headerLeft: () => null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    flex: 1,
    padding: 10,
    height: 50,
    backgroundColor: '#282C35'
  },
  itemName: {
    color: 'white'
  },
});