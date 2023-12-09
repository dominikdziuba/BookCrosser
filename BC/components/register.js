import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    fetch(`http://192.168.0.213:8000/backend/users/`, {
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
        // Pamiętaj, żeby obsłużyć odpowiedź z serwera, np. jeśli rejestracja się powiedzie
        // Możesz przekierować użytkownika na stronę logowania albo w inny sposób go poinformować
        console.log("Rejestracja udana");
        props.navigation.navigate('Auth');
      })
      .catch(error => console.log(error))
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder='Login'
        onChangeText={text => setUsername(text)}
        value={username}
        autoCapitalize='none'
      />
      <Text>Hasło</Text>
      <TextInput
        style={styles.input}
        placeholder='Hasło'
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
        autoCapitalize='none'
      />
      <Button title="Zarejestruj się" onPress={() => register()} />
    </View>
  );
}

Register.navigationOptions = ({ navigation }) => ({
  title: 'Zarejestruj się',
  headerStyle: {
    backgroundColor: 'red',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  input: {
    fontSize: 24,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },
});
