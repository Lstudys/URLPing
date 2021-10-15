import React from 'react';
import {Component} from 'react';
import {Text,View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/view/Home';
import Setting from './src/view/Setting';
import {SetSpText} from './src/controller/Adaptation';

import data from './src/modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from './src/modal/Langguage/zh_CN';
import en from './src/modal/Langguage/en_US';
import ChartDataHistory from './src/view/ChartDataHistory';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言
class About extends Component {
    render (){
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>About</Text>
        </View>
        );
    }
}
class StackDrawer extends Component {
    render(){
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: true,
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#232323' },
                }}>
                <Stack.Screen name={I18n.t('setting')+" "}  component={Setting} />
            </Stack.Navigator>
        );
    }
}
class StackDrawer2 extends Component {
    render(){
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: true,
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#232323' },
                }}>
                <Stack.Screen name={I18n.t('history')+" "}  component={ChartDataHistory} />
            </Stack.Navigator>
        );
    }
}
class App extends Component{
    constructor(props){
        super(props);
        store.get('Language')
            .then((res) => {
                if(res===null){
                    data.userChoose = SystemLanguage;
                }else{
                    data.userChoose = res;
                }     
            })
            .finally(() => {
                if (data.userChoose.length !== 0) {
                    // 首选用户设置记录
                    I18n.locale = data.userChoose;
                } else if (SystemLanguage) {
                    // 获取系统语言
                    I18n.locale = SystemLanguage;
                } else {
                    I18n.locale = 'en'; // 用户既没有设置，也没有获取到系统语言，默认加载英语语言资源
                }
                this.setState({
                    langvis: false,
                });
            });

        /* 获取历史记录数据 */
        store.get('local').then((res) => {
            if(res === null){
                data.local = [];
            }else{
                data.local = res.slice();
            }
        });
        I18n.fallbacks = true;
        // 加载语言包
        I18n.translations = {zh, en};
    }

    render(){
        return (
            <NavigationContainer>
                <Drawer.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: 'white',
                        width: 170,
                    },
                    // 侧滑栏页面的图标
                    drawerIcon: ({ focused, color, size }) => {
                        switch(route.name){
                            case '主页':
                            case 'Home':
                                return (
                                    <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(52)}}>{'\ue766'}</Text>
                                );
                            case '设置':
                            case 'Setting':
                                return (
                                    <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(62)}}>{'\ue760'}</Text>
                                );
                            case '关于':
                            case 'About':
                                return(
                                    <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(62)}}>{'\ue722'}</Text>
                                );
                            case '历史':
                            case 'History':
                                return(
                                    <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(62)}}>{'\ue720'}</Text>
                                );
                        }
                    },
                })}
            >
                <Drawer.Screen name={I18n.t('home')} component={Home}
                    options={{
                        drawerItemStyle: {
                            top: 10,
                            height: 50,
                        },
                    }}
                />
                <Drawer.Screen name={I18n.t('about')} component={About}
                    options={{
                        drawerItemStyle: {
                            top: 540,
                            height:590,
                        },
                    }}
                />
                <Drawer.Screen name={I18n.t('setting')} component={StackDrawer}
                    options={{
                        drawerItemStyle: {
                            position:'absolute',
                            height:50,
                            width:220,
                            top: 550,
                        },
                    }}
                />
                <Drawer.Screen name={I18n.t('history')} component={StackDrawer2}
                    options={{
                        drawerItemStyle: {
                            position:'absolute',
                            height:50,
                            width:220,
                            top: 100,
                        },
                    }}
                />
            </Drawer.Navigator>
            </NavigationContainer>
        );
    }
} 
export default App;
