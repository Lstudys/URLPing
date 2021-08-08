import React from 'react';
import {View, Button, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from 'react-native-vector-icons';
import Home from './src/view/Home';
import {SetSpText, ScaleSizeH, ScaleSizeW} from './src/controller/Adaptation';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


function Setting() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Food Screen</Text>
        </View>
    );
}

function MyDrawer() {
    return (
        <Drawer.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                drawerStyle: {
                    backgroundColor: 'pink',
                    width: 240,
                },
                drawerIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        return (
                            <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(52)}}>{'\ue50e'}</Text>
                        );
                    } else if (route.name === 'Setting ') {
                        return (
                            <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(62)}}>{'\ue6c1'}</Text>
                        );
                    }
                },
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'red',
            })}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Setting " component={StackDrawer} />
        </Drawer.Navigator>
    );
}


function StackDrawer() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}>
            <Stack.Screen name="Setting" component={Setting} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    );
}
