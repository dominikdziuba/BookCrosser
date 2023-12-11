import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

export default function Start(props) {
  const navigateToAuth = () => {
    props.navigation.navigate('Auth');
  };

  const navigateToRegister = () => {
    props.navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <TouchableOpacity style={styles.button} onPress={navigateToAuth}>
        <Text style={styles.buttonText}>Zaloguj</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToRegister}>
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

Start.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f4f3',
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 20,
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
});
