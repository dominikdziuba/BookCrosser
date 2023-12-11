import React, { useState, useEffect } from "react";
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { IconButton } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookDetail(props) {
    const book = props.navigation.getParam('book', null);
    const shelve = props.navigation.getParam('shelve', null);
    const token = props.navigation.getParam('token', '');

    const takeBook = () => {
        fetch(`http://192.168.0.248:8000/backend/shelves/${shelve.id}/take_book_from_shelf/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                book_id: book.id,
            }),
        })
        .then(res => res.json())
        .then(book => {
            console.log(token);
            props.navigation.navigate("ShelveDetail", { shelve: shelve });
        })
        .catch(error => console.log(error));
    }

    const renderActionButton = () => {
        if (book.added_by !== null) {
            return (
                <IconButton
                    icon="book-remove"
                    color="#2c2829"
                    size={30}
                    onPress={takeBook}
                />
            );
        } else {
            // Dodaj odpowiednie działania w przypadku przycisku "Dodaj"
            return (
                <IconButton
                    icon="plus"
                    color="#2c2829"
                    size={30}
                    onPress={() => {/* Dodaj swoją logikę */}}
                />
            );
        }
    }

    return (
        <View style={styles.container}>
             <Image
        source={require('../assets/book.png')}
        style={styles.logo}
      />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>{book.author}</Text>
                <Text style={styles.description}>{book.description}</Text>
                {book.added_by !== null && (
                    <Text style={styles.addedDate}>{book.added_date}</Text>
                )}
                {book.added_by !== null && (
                    <Text style={styles.addedBy}>{book.added_by}</Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                {renderActionButton()}
                <IconButton
                    icon="pencil"
                    color="#2c2829"
                    size={30}
                    onPress={() => props.navigation.navigate('EditBook', { book: book, shelve: shelve, token: token })}
                />
            </View>
        </View>
    );
}

BookDetail.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('book').title || 'Przepraszamy coś poszło nie tak',
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
    detailsContainer: {
        marginBottom: 20,
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        marginBottom: 10,
    },
    author: {
        fontSize: 18,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    addedDate: {
        fontSize: 14,
        marginBottom: 5,
    },
    addedBy: {
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});
