import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CityList(props) {
  const [cities, setCities] = useState([]);
  let token = null;

  const getToken = async () => {
    token = await AsyncStorage.getItem('Token');
    if (token) {
      getCities();
      console.log(token);
    } else {
      props.navigation.navigate('Start');
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  const getCities = () => {
    fetch('http://192.168.0.143:8000/backend/cities/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => setCities((jsonRes)))
      .catch(error => console.log(error))
  }

  const cityClicked = (city, token) => {

    props.navigation.navigate("ShelvesList", { cityId: city.id, token: token });
  }

  return (
    <View>
      <FlatList
        data={cities}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => cityClicked(item)}>
              <View style={styles.item}>
                <Text style={styles.itemName}> {item.id}</Text>
              </View>
            </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
  );
}

CityList.navigationOptions = ({ navigation }) => ({
  title: 'Lista półek',
  headerStyle: {
    backgroundColor: 'red',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerLeft: () => null
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
