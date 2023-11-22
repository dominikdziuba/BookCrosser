import React, {useState, useEffect} from "react";
import {Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

export default function EditBook(props){

    const book = props.navigation.getParam('book', null)
    const [title, setTitle] = useState(book.title)
    return(
        <View>
            <Text>EditBook</Text>
            <TextInput
            style={styles.input}
            placeholder='Tytuł'
            onChangeText={text => setTitle(text)}
            value={title}
            />
    </View>

    );
}

EditBook.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('book').title || 'Przepraszamy coś poszło nie tak',

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
    input:{
        fontSize: 24,
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        borderWidth: 1,

    }
});
