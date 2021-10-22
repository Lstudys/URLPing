//页面路由
//2021/9/20
//created by GM
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ordinary from './view/Mainpage';
import Ping from './view/Functionpage';
import UrlInput from './view/UrlInput';

const Stack = createStackNavigator();

function Nav() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Ordinary">
        <Stack.Screen name="Ordinary" component={Ordinary} />
        <Stack.Screen name="Ping" component={Ping} />
        <Stack.Screen name="UrlInput" component={UrlInput} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Nav;