import React from "react";
import ShelvesList from "./components/shelvesList";
import ShelveDetail from "./components/shelveDetail";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

import BookDetail from "./components/bookDetail";
import EditBook from "./components/editBook";

const AppNavigator = createStackNavigator({
    ShelvesList: {screen: ShelvesList},
    ShelveDetail: {screen: ShelveDetail},
    BookDetail: {screen: BookDetail},
    EditBook: {screen: EditBook},
})

const App = createAppContainer(AppNavigator);

export default App;


