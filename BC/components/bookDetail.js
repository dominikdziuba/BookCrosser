import React, {useState, useEffect} from "react";
import {Button, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function BookDetail(props){

    const book = props.navigation.getParam('book', null)

    return(
        <View>
            <Text>{book.title}</Text>
            <Text>{book.author}</Text>
            <Text>{book.description}</Text>
            <Text>{book.added_date}</Text>
            <Text>{book.added_by}</Text>
    </View>

    );
}

BookDetail.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('book').title || 'Przepraszamy coś poszło nie tak',
 headerRight: () =>
      <Button
        onPress={() => navigation.navigate('EditBook', {book: navigation.getParam('book')})}
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
