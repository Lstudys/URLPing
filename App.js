import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/view/Home';
import Select from "./src/view/Select";
import Setting from './src/view/Setting';



function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function Nav() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Select" component={Select} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Nav;










// import React from 'react';
// import {Text} from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Home from './src/view/Home';
// import Select from "./src/view/Select";
// import Analyse from "./src/view/Analyse"
// import Setting from './src/view/Setting';
// import {SetSpText} from './src/controller/Adaptation';
// const Drawer = createDrawerNavigator();
// const Stack = createNativeStackNavigator();

// function About({ navigation }){
//     return (alert('hello'));
// }
// function MyDrawer() {
//     return (
//         <Drawer.Navigator
//             screenOptions={({ route }) => ({
//                 headerShown: false,
//                 drawerStyle: {
//                     backgroundColor: 'white',
//                     width: 240,
//                 },
//                 // 侧滑栏页面的图标
//                 drawerIcon: ({ focused, color, size }) => {
//                     if (route.name === 'Home') {
//                         return (
//                             <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(52)}}>{'\ue50e'}</Text>
//                         );
//                     } else if (route.name === 'Setting ') {
//                         return (
//                             <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(62)}}>{'\ue6c1'}</Text>
//                         );
//                     } else if (route.name === 'About') {
//                         return (
//                             <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(62)}}>{'\ue62a'}</Text>
//                         );
//                     }
//                 },
//             })}
//         >
//             <Drawer.Screen name="Home" component={Home}
//                 options={{
//                     drawerItemStyle: {
//                         top: 10,
//                         height: 50,
//                     },
//                 }}
//             />
//             <Drawer.Screen name="About" component={About}
//                 options={{
//                     drawerItemStyle: {
//                         top: 540,
//                         height:590,
//                     },
//                 }}
//             />
//             <Drawer.Screen name="Setting " component={StackDrawer}
//                 options={{
//                     drawerItemStyle: {
//                         position:'absolute',
//                         height:50,
//                         width:220,
//                         top: 550,
//                     },
//                 }}
//             />
//         </Drawer.Navigator>
//     );
// }


// function StackDrawer() {
//     return (
//         <Stack.Navigator
//             screenOptions={{
//                 headerShown: true,
//                 headerTintColor: 'white',
//                 headerStyle: { backgroundColor: '#232323' },
//             }}>
//             <Stack.Screen name="Settings" component={Setting} />
//         </Stack.Navigator>
//     );
// }

// export default function App() {
//     return (
//         <NavigationContainer>
//             <MyDrawer />
//         </NavigationContainer>
//     );
// }
