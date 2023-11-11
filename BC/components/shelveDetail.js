import React, {useState, useEffect} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function ShelveDetail(props){

    const shelve = props.navigation.getParam('shelve', null)

  const getFirstPartOfAddress = () => {
    if (shelve.address) {
      const parts = shelve.address.split(",");
      return parts[0];
    }
    return "";
  };
    return(
        <View style={styles.navBar}>
            <Text style={styles.name}>{shelve.name}</Text>
            <Text style={styles.address}>{getFirstPartOfAddress()}</Text>
            <FontAwesomeIcon icon={faPlus} style={styles.icon} />
    </View>
    );
}

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
