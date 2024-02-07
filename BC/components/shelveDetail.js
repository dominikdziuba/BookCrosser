import React, { useState, useEffect } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton } from 'react-native-paper';

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
        fetch(`http://192.168.8.137:8000/backend/shelves/${shelve.id}/`, {
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
        <View style={styles.container}>
            <Text style={styles.name}>{shelve.name}</Text>
            <Text style={styles.name}>{getFirstPartOfAddress()}</Text>
            <Text> Prawdopodobna liczba książek: {shelve.no_of_books}</Text>
            <FlatList
                data={books}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => bookClicked(item)}>
                        <View style={styles.item}>
                            <Text style={styles.itemName}>Autor: {item.author}</Text>
                            <Text style={styles.itemName}>Tytuł: {item.title}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <IconButton
                icon="plus"
                color="#2c2829"
                size={30}
                onPress={() => props.navigation.navigate('AddBook', { book: { title: '', author: '', description: '' }, shelve: shelve, token: token })}
            />
        </View>
    );
}

ShelveDetail.navigationOptions = ({ navigation }) => ({
    title: 'BookCrosser',
    headerStyle: {
        backgroundColor: '#9b4e0a',
        elevation: 0,
        shadowOpacity: 0,
    },
    headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
    },
    item: {
        backgroundColor: "#2c2829",
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginVertical: 10,
        borderRadius: 10,
    },
    itemName: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },

});
