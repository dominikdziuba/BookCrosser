import React, {useState, useEffect} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShelvesList(props){

    const [shelves, setShelves] = useState([])
    let token  = null;

    const getToken = async () => {
        token = await AsyncStorage.getItem('Token')
        if (token){
            getShelves();
            console.log(token)
        }else{
            props.navigation.navigate('Auth')
        }

    }
    useEffect(() => {
        getToken();

    }, []);

    const getShelves = () => {
        fetch('http://192.168.8.134:8000/backend/shelves/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(res => res.json())
            .then(jsonRes => setShelves((jsonRes)))
            .catch(error => console.log(error))
    }

    const shelveClicked = (shelve, token) => {
        props.navigation.navigate("ShelveDetail", {shelve: shelve, token: token})
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