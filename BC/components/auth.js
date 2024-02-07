import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";

export default function Auth(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    getToken();
  }, []);

  const auth = () => {
    if (username.trim() === "" || password.trim() === "") {
      showAlert("Błąd", "Wypełnij wszystkie pola.");
      return;
    }
    fetch(`http://192.168.8.137:8000/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        saveToken(res.token);
        props.navigation.navigate("CityList");
      })
      .catch((error) => console.log(error));
  };

  const saveToken = async (token) => {
    await AsyncStorage.setItem("Token", token);
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) props.navigation.navigate("CityList");
  };

  const showAlert = (title, message) => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const navigateToRegister = () => {
    props.navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Login"
        onChangeText={(text) => setUsername(text)}
        value={username}
        autoCapitalize={"none"}
      />
      <Text style={styles.label}>Hasło</Text>
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        autoCapitalize={"none"}
      />
            <Text style={styles.registerLink} onPress={navigateToRegister}>
        Nie masz jeszcze konta? Zarejestruj się.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => auth()}
      >
        <Text style={styles.buttonText}>Zaloguj się</Text>
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

Auth.navigationOptions = ({ navigation }) => ({
  title: "Zaloguj się",
  headerStyle: {
    backgroundColor: "#9b4e0a",
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "white",
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
  registerLink: {
    marginTop: 20,
    color: "#9b4e0a",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
