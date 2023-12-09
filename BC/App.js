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
const AppNavigator = createStackNavigator({
    Start: {screen: Start},
    Register: {screen: Register},
    Auth: {screen: Auth},
    CityList: {screen: CityList},
    SearchBook: {screen: SearchBook},
    ShelvesList: {screen: ShelvesList},
    ShelveDetail: {screen: ShelveDetail},
    BookDetail: {screen: BookDetail},
    EditBook: {screen: EditBook},
})

const App = createAppContainer(AppNavigator);

export default App;


