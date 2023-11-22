import React, {useState, useEffect} from "react";
import {Button, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function ShelveDetail(props){

    const shelve = props.navigation.getParam('shelve', null)
      const [books, setBooks] = useState([])
      useEffect(() => {
        fetch(`http://192.168.0.67:8000/backend/shelves/${shelve.id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token b1f1aa222fd5201f1cb4d434eff750822942ee38`
            }
        })
            .then(res => res.json())
            .then(jsonRes => setBooks((jsonRes.books)))
            .catch(error => console.log(error))
    }, []);
        console.log(books)
      const bookClicked = (book) => {
        props.navigation.navigate("BookDetail", {book: book})
          }
  const getFirstPartOfAddress = () => {
    if (shelve.address) {
      const parts = shelve.address.split(",");
      return parts[0];
    }
    return "";
  };
    return(
        <View style={styles.navBar}>
          {/*  <Text style={styles.name}>{shelve.name}</Text> */}
            <Text style={styles.address}>{getFirstPartOfAddress()}</Text>
            <Text> W tej półce jest tyle książek {shelve.no_of_books}</Text>
            <FontAwesomeIcon icon={faPlus} style={styles.icon} />
            <View>
              <FlatList
              data={books}
              renderItem={({item}) => (
                  <TouchableOpacity onPress={() => bookClicked(item)}>
                  <View style={styles.item}>
                      <Text style={styles.itemName}> {item.author}</Text>
                      <Text style={styles.itemName}> {item.added_by}</Text>
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

ShelveDetail.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('shelve').name || 'Przepraszamy coś poszło nie tak',
 headerRight: () =>
      <Button
        onPress={() => navigation.navigate('AddBook', {shelve: navigation.getParam('shelve')})}
        title="Dodaj"

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
  name: {
    fontWeight: "bold",
    fontSize: 18,
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
