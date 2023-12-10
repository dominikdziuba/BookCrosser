import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ShelveDetail(props) {
    const shelve = props.navigation.getParam('shelve', null);
    const [token, setToken] = useState(null);
    const [books, setBooks] = useState([]);

    const getFirstPartOfAddress = () => {
        if (shelve.address) {
            const parts = shelve.address.split(",");
            return parts[0];
        }
        return "";
    };

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await AsyncStorage.getItem('Token');

            if (storedToken) {
                setToken(storedToken);
                getShelveDetail(storedToken);
            } else {
                props.navigation.navigate('Auth');
            }
        };

        fetchData();
    }, []);

    const getShelveDetail = (token) => {
        fetch(`http://192.168.0.143:8000/backend/shelves/${shelve.id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(jsonRes => setBooks(jsonRes.books))
        .catch(error => console.log(error));
    };

    const bookClicked = (book) => {
        props.navigation.navigate("BookDetail", { book, shelve, token });
    };

    return (
        <View style={styles.navBar}>
            <Text style={styles.address}>{getFirstPartOfAddress()}</Text>
            {<Text> W tej półce jest tyle książek {shelve.no_of_books}</Text>}
            <View>
                <FlatList
                    data={books}
                    renderItem={({ item }) => (
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
    headerRight: () => (
        <Button
            onPress={() => navigation.navigate('AddBook', {book: {title: '', author: '', description: ''}, shelve: navigation.getParam('shelve'), token: navigation.getParam('token')})}
            title="Dodaj"
        />
    ),
    headerStyle: {
        backgroundColor: 'red',
    },
    headerTitleStyle: {
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
