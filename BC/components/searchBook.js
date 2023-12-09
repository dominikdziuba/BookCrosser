import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchBook(props) {
   const cityId = props.navigation.getParam('cityId', null);
  const [books, setBooks] = useState([]);
  let token = null;

  const getToken = async () => {
    token = await AsyncStorage.getItem('Token');
    if (token) {
      getBooks();
      console.log(token);
    } else {
      props.navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    getToken();
  }, []);


const getBooks = () => {
  fetch(`http://192.168.0.213:8000/backend/shelves/books_in_city?city_id=${cityId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
    .then(res => res.json())
    .then(jsonRes => {
      setBooks((jsonRes))
    })
      // .then(res => {
      //           saveToken(res.token);
      //           props.navigation.navigate('CityList')
      //
      //       })
    .catch(error => console.log(error))
}


  const bookClicked = (book, token) => {
    props.navigation.navigate("BookDetail", { book: book, token: token })
  }
//
//   const logout = async () => {
//
//     await AsyncStorage.removeItem('Token');
//
//     props.navigation.navigate('Start');
//   };
//
// const search = (shelves, token) =>{
//   props.navigation.navigate("SearchBook",{ cityId: cityId, token: token })
// }



  return (
        <View style={styles.navBar}>


            <View>
                <FlatList
                    data={books}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => bookClicked(item)}>
                            <View style={styles.item}>
                                <Text style={styles.itemName}> {item.author}</Text>
                                <Text style={styles.itemName}> {item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
  );
}

SearchBook.navigationOptions = ({ navigation }) => ({
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
