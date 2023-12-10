import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search books..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <Button title="Wyszukaj" onPress={() => onSearch(searchQuery)} />
    </View>
  );
}

export default function SearchBook(props) {
  const cityId = props.navigation.getParam('cityId', null);
  const [books, setBooks] = useState([]);
  let token = null;

  const getToken = async () => {
    token = await AsyncStorage.getItem('Token');
    if (token) {
      // getToken zostaje bez zmian
    } else {
      props.navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  const getBooks = (searchQuery) => {
    fetch(`http://192.168.0.143:8000/backend/shelves/books_in_city/?city_id=${cityId}&search_query=${searchQuery}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        setBooks(jsonRes);
      })
      .catch(error => console.log(error))
  }

  const bookClicked = (book, token) => {
    props.navigation.navigate("BookDetail", { book: book, token: token });
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={getBooks} />
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
  );
}

SearchBook.navigationOptions = ({ navigation }) => ({
  title: 'Search Books',
  headerStyle: {
    backgroundColor: 'red',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  item: {
    flex: 1,
    padding: 10,
    height: 50,
    backgroundColor: '#282C35',
  },
  itemName: {
    color: 'white',
  },
});
