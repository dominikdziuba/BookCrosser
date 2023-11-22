import React, {useState, useEffect} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function ShelvesList(props){

    const [shelves, setShelves] = useState([])


    useEffect(() => {
        fetch('http://192.168.0.67:8000/backend/shelves/', {
            method: 'GET',
            headers: {
                'Authorization': `Token b1f1aa222fd5201f1cb4d434eff750822942ee38`
            }
        })
            .then(res => res.json())
            .then(jsonRes => setShelves((jsonRes)))
            .catch(error => console.log(error))
    }, []);

        const shelveClicked = (shelve) => {
        props.navigation.navigate("ShelveDetail", {shelve: shelve})
    }

    return(
        <View>
              <FlatList
              data={shelves}
              renderItem={({item}) => (
                  <TouchableOpacity onPress={() => shelveClicked(item)}>
                  <View style={styles.item}>
                      <Text style={styles.itemName}> {item.name}</Text>
                  </View>
                  </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item:{
     flex: 1,
        padding: 10,
        height: 50,
        backgroundColor: '#282C35'
    },
    itemName: {
        color: 'white'
    },
})