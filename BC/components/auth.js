import React, {useState, useEffect} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Auth(props){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        getToken()
    }, [])

    const auth = () => {

        fetch(`http://192.168.0.213:8000/auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(res => res.json())
            .then(res => {
                saveToken(res.token);
                props.navigation.navigate('CityList')

            })
            .catch(error => console.log(error))
    }
    const saveToken = async (token) => {
         await AsyncStorage.setItem('Token', token);
    }
    const getToken = async () => {
         const token = await AsyncStorage.getItem('Token');
         if (token) props.navigation.navigate('CityList')
    }

    return(
        <View>
            <Text>login</Text>
            <TextInput
            style={styles.input}
            placeholder='Login'
            onChangeText={text => setUsername(text)}
            value={username}
            autoCapitalize={'none'}
            />
            <Text>Hasło</Text>
            <TextInput
            style={styles.input}
            placeholder='Hasło'
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={true}
            autoCapitalize={'none'}
            />
            <Button title="Zaloguj"
            onPress={() => auth()}/>

    </View>

    );
}


Auth.navigationOptions = ({ navigation }) => ({
  title: 'Zaloguj się',

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