import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
export default function EditBook(props) {
    const shelve = props.navigation.getParam('shelve', null);
    const book = props.navigation.getParam('book', null);
    const token = props.navigation.getParam('token', '');
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [description, setDescription] = useState(book.description);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const saveBook = () => {
        if (title.trim() === "" || author.trim() === "") {
             showAlert("Błąd", "Wypełnij wszystkie pola.");
      return;
        }
        fetch(`http://192.168.8.137:8000/backend/shelves/${shelve.id}/edit_book_in_shelf/${book.id}/`, {
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
                console.log(token)
                props.navigation.navigate("BookDetail", {book: book, shelve: shelve})            })
            .catch(error => console.log(error))
    };

    const showAlert = (title, message) => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tytuł</Text>
            <TextInput
                style={styles.input}
                placeholder='Tytuł'
                onChangeText={text => setTitle(text)}
                value={title}
            />
            <Text style={styles.label}>Autor</Text>
            <TextInput
                style={styles.input}
                placeholder='Autor'
                onChangeText={text => setAuthor(text)}
                value={author}
            />
            <Text style={styles.label}>Opis</Text>
            <TextInput
                style={styles.input}
                placeholder='Krótki opis'
                onChangeText={text => setDescription(text)}
                value={description}
                multiline={true}
            />
                  <TouchableOpacity
        style={styles.button}
        onPress={() => saveBook()}
      >
        <Text style={styles.buttonText}>Zapisz</Text>
      </TouchableOpacity>

             <AwesomeAlert
        show={isAlertVisible}
        showProgress={false}
        title="Błąd"
        message="Wypełnij wszystkie pola."
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#2c2829"
        onConfirmPressed={() => hideAlert()}
      />
        </View>
    );
}

EditBook.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('book').title || 'Edytuj książkę',

    headerStyle: {
        backgroundColor: '#9b4e0a',
        elevation: 0,
        shadowOpacity: 0,
    },
    headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
    },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f4f3",
  },
  input: {
    width: "80%",
    fontSize: 24,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#2c2829",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
