import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function UserProfile(props) {

  const [user_id, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  let token = null;


  const getToken = async () => {
    token = await AsyncStorage.getItem('Token');
    if (token) {
      const user_id_from_storage = await AsyncStorage.getItem('user_id');
      setUserId(user_id_from_storage);

      getUserData();

    } else {
      props.navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    getToken();
    console.log(userData)
  }, []);


  const getUserData = () => {
    console.log(token);
    fetch(`http://192.168.8.137:8000/backend/users/1/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
        .then(res => res.json())
        .then(jsonRes => {
          console.log(jsonRes);
          setUserData((jsonRes))
          console.log(userData)
        })
        .catch(error => console.log(error))
  }


  const bookClicked = (book) => {
    props.navigation.navigate("BookDetail", {book, token});
  };

  return (
      <View>
        <Text>Twoje dane to:</Text>
        {userData ? (
            <Text>{userData.username}</Text>
        ) : (
            <Text>Loading...</Text>
        )}

        {userData ? (
            <Text>{userData.email}</Text>
        ) : (
            <Text>Loading...</Text>
        )}
        <Text> W przypadku chęci zmiany skontaktuj się z administracją pod adresem mailowym administracja@test.pl</Text>
      </View>
  );
}

UserProfile.navigationOptions = ({ navigation }) => ({
  title: 'Lista półek',
  headerStyle: {
    backgroundColor: 'red',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  //headerLeft: () => null
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