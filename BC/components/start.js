import React, {useState, useEffect} from "react";
import {Button, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function Start(props){
  const navigateToAuth = () => {
    props.navigation.navigate('Auth');
  };

  const navigateToRegister = () => {
    props.navigation.navigate('Register');
  };

    return(
        <View style={styles.container}>
        <Button title='Zaloguj' onPress={navigateToAuth}/>
        <Button title='Zarejestruj sie' onPress={navigateToRegister}/>
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
  },
});
