import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ordinary from './view/Mainpage';
import Ping from './view/Functionpage';
import UrlInput from './view/UrlInput';
import About from './view/About';

const Stack = createStackNavigator();

function Nav() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Ordinary">
        <Stack.Screen name="Ordinary" component={Ordinary} />
        <Stack.Screen name="Ping" component={Ping} />
        <Stack.Screen name="UrlInput" component={UrlInput} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Nav;