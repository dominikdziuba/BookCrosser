import React, {useState, useEffect} from "react";
import {Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";

export default function EditBook(props){
    const shelve = props.navigation.getParam('shelve', null);
    const book = props.navigation.getParam('book', null)
    const token = props.navigation.getParam('token', '')
    const [title, setTitle] = useState(book.title)
    const [author, setAuthor] = useState(book.author)
    const [description, setDecription] = useState(book.description)



    const saveBook = () => {
        if (book.id){
            fetch(`http://192.168.8.134:8000/backend/shelves/${shelve.id}/edit_book_in_shelf/${book.id}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                author: author,
                description: description
            }),
        })
            .then(res => res.json())
            .then(book => {

                props.navigation.navigate("BookDetail", {book: book, shelve: shelve})            })
            .catch(error => console.log(error))

        }else{
            fetch(`http://192.168.8.134:8000/backend/shelves/${shelve.id}/add_book_to_shelf/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                author: author,
                description: description
            }),
            })
                .then(res => res.json())
                .then(book => {
                props.navigation.navigate("ShelveDetail", {shelve: shelve})})
                .catch(error => console.log(error))

        }

    }


    return(
        <View>
            <Text>Tytuł</Text>
            <TextInput
            style={styles.input}
            placeholder='Tytuł'
            onChangeText={text => setTitle(text)}
            value={title}
            />
            <Text>Autor</Text>
            <TextInput
            style={styles.input}
            placeholder='Autor'
            onChangeText={text => setAuthor(text)}
            value={author}
            />
            <Text>Opis</Text>
            <TextInput
            style={styles.input}
            placeholder='Krótki opis'
            onChangeText={text => setDecription(text)}
            value={description}
            />
            <Button title="Zapisz"
            onPress={() => saveBook()}/>

    </View>

    );
}


EditBook.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('book').title || 'Dodaj nową książkę do tej półki',

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
