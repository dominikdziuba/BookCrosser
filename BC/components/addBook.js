import React, {useState, useEffect} from "react";
import {Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
export default function AddBook(props){
    const shelve = props.navigation.getParam('shelve', null);
    const book = props.navigation.getParam('book', null)
    let token = null
    const [title, setTitle] = useState(book.title)
    const [author, setAuthor] = useState(book.author)
    const [description, setDecription] = useState(book.description)
    const [isAlertVisible, setAlertVisible] = useState(false);

 const getToken = async () => {
    token = await AsyncStorage.getItem('Token');
    if (token) {

    } else {
      props.navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    getToken();
  });

    const saveBook = () => {
         if (title.trim() === "" || author.trim() === "") {
             showAlert("Błąd", "Wypełnij wszystkie pola.");
      return;
        }
            fetch(`http://192.168.8.137:8000/backend/shelves/${shelve.id}/add_book_to_shelf/`, {
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
                .then(res => {
                    console.log(token)
                props.navigation.navigate("ShelveDetail", {shelve: shelve})})
                .catch(error => console.log(error))
    }
  const showAlert = (title, message) => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

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
          <TouchableOpacity
            style={styles.button}
            onPress={() => saveBook()}>
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


AddBook.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('book').title || 'Dodaj nową książkę do tej półki',

    headerStyle: {
    backgroundColor: '#9b4e0a',
  },
  headerTitleStyle:{
    fontWeight: 'bold',
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
