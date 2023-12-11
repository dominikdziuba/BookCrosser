import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const register = () => {
    if (username.trim() === "" || password.trim() === "" || email.trim() === "") {
      showAlert("Wypełnij wszystkie pola.");
      return;
    }
    if (!validateEmail(email)) {
      showAlert("Niepoprawny format email.");
      return;
    }
    if (!validatePassword(password)) {
      showAlert("Twoje hasło powinno mieć 8 znaków.");
      return;
    }
    fetch(`http://192.168.0.248:8000/backend/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log("Rejestracja udana");
        props.navigation.navigate('Auth');
      })
      .catch(error => console.log(error))
  };

  const navigateToLogin = () => {
    props.navigation.navigate("Auth");
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        onChangeText={text => setEmail(text)}
        value={email}
        autoCapitalize='none'
      />
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
      <Text style={styles.loginLink} onPress={navigateToLogin}>
        Masz już konto? Zaloguj się.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => register()}>
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>


      <AwesomeAlert
        show={isAlertVisible}
        showProgress={false}
        title="Błąd"
        message={alertMessage}
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

Register.navigationOptions = ({ navigation }) => ({
  title: 'Zarejestruj się',
  headerStyle: {
    backgroundColor: '#9b4e0a',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerLeft: () => null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f4f3',
  },
  input: {
    width: '100%', // Zajmij całą szerokość ekranu
    fontSize: 24,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2c2829',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    color: '#9b4e0a',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
