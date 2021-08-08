import React from 'react';
import {View, Button, Text, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/view/Home';
import Setting from './src/view/Setting';
import {setSpText} from './src/controller/Adaptation';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                drawerStyle: {
                    backgroundColor: 'pink',
                    width: 240,
                },
                // 侧滑栏页面的图标
                drawerIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        return (
                            <Text style={{fontFamily: 'iconfont', fontSize: setSpText(52)}}>{'\ue50e'}</Text>
                        );
                    } else if (route.name === 'Setting ') {
                        return (
                            <Text style={{fontFamily: 'iconfont', fontSize: setSpText(62)}}>{'\ue6c1'}</Text>
                        );
                    }
                },
            })}
        >
            <Drawer.Screen name="Home" component={Home}
                options={{
                    drawerItemStyle: {
                        top: 10,
                        height: 50,
                    },
                }}
            />
            <Drawer.Screen name="Setting " component={StackDrawer}
                options={{
                    drawerItemStyle: {
                        height:580,
                        top: 535,
                    },
                }}
            />
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
