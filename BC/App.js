import React from "react";
import ShelvesList from "./components/shelvesList";
import ShelveDetail from "./components/shelveDetail";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

import BookDetail from "./components/bookDetail";
import EditBook from "./components/editBook";
import Auth from "./components/auth";
import Start from "./components/start"
import Register from "./components/register";
import CityList from "./components/cityList";
import SearchBook from "./components/searchBook";
import AddBook from "./components/addBook";
import UserBookList from "./components/userBookList"
import UserProfile from "./components/userProfile";
const AppNavigator = createStackNavigator({
    Start: {screen: Start},
    Register: {screen: Register},
    Auth: {screen: Auth},
    CityList: {screen: CityList},
    ShelvesList: {screen: ShelvesList},
    UserProfile: {screen: UserProfile},
    UserBookList: {screen: UserBookList},
    SearchBook: {screen: SearchBook},
    ShelveDetail: {screen: ShelveDetail},
    AddBook: {screen: AddBook},
    BookDetail: {screen: BookDetail},
    EditBook: {screen: EditBook},
})

const App = createAppContainer(AppNavigator);

export default App;


