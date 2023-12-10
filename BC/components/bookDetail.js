import React, {useState, useEffect} from "react";
import {Button, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function BookDetail(props){

    const book = props.navigation.getParam('book', null)
    const shelve = props.navigation.getParam('shelve', null)
    const token = props.navigation.getParam('token', '')

const takeBook = () => {
  fetch(`http://192.168.0.143:8000/backend/shelves/${shelve.id}/take_book_from_shelf/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      book_id: book.id,

    }),
  })
  .then(res => res.json())
  .then(book => {
    console.log(token);
    props.navigation.navigate("ShelveDetail", { shelve: shelve });
  })
  .catch(error => console.log(error));
}


    return(
        <View>
            <View>
                <Text>{book.title}</Text>
                <Text>{book.author}</Text>
                <Text>{book.description}</Text>
                <Text>{book.added_date}</Text>
                <Text>{book.added_by}</Text>
            </View>
            <View>
                <Button title="Weź" onPress={takeBook}/>
            </View>
    </View>


    );
}

BookDetail.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('book').title || 'Przepraszamy coś poszło nie tak',
 headerRight: () =>
      <Button
        onPress={() => navigation.navigate('EditBook', {book: navigation.getParam('book'), shelve: navigation.getParam('shelve'), token: navigation.getParam('token')})}
        title="Edytuj"

      />
    ,
  headerStyle: {
    backgroundColor: 'red',
  },
  headerTitleStyle:{
    fontWeight: 'bold',
  },

});


const styles = StyleSheet.create({
  navBar: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8", // Dostosuj kolor tła według własnych preferencji
  },

  address: {
    fontSize: 16,
    marginTop: 50,

  },
  icon: {
    fontSize: 24,
    color: "green",
  },
});
