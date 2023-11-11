import React from "react";
import ShelvesList from "./components/shelvesList";
import ShelveDetail from "./components/shelveDetail";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

const AppNavigator = createStackNavigator({
    ShelvesList: {screen: ShelvesList},
    ShelveDetail: {screen: ShelveDetail},
})

const App = createAppContainer(AppNavigator);

export default App;


