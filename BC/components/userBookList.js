import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function UserBookList(props) {

  const [books, setBooks] = useState([]);

  let token = null;


  const getToken = async () => {
    token = await AsyncStorage.getItem('Token');
    if (token) {
      getBooks();

    } else {
      props.navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    getToken();
  }, []);


  const getBooks = () => {
    console.log(token);
    fetch(`http://192.168.0.248:8000/backend/books/taken_by_user`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
        .then(res => res.json())
        .then(jsonRes => {
          console.log(jsonRes);
          setBooks((jsonRes))})
        .catch(error => console.log(error))
  }


    const bookClicked = (book) => {
        props.navigation.navigate("BookDetail", { book, token });
    };

  return (
   <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => bookClicked(item)}>
                        <View style={styles.item}>
                            <Text style={styles.itemName}>Autor: {item.author}</Text>
                            <Text style={styles.itemName}>Tytuł: {item.title}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
    </View>
  );
}

UserBookList.navigationOptions = ({ navigation }) => ({
  title: 'Twoje książki',
  headerStyle: {
    backgroundColor: '#9b4e0a',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  //headerLeft: () => null
});

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
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
});