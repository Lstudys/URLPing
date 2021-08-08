import React from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';

const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
        };

        /* 选择合适语言 */
        store.get('Language')
            .then((res) => {
                Data.userChoose = res;
            })
            .finally(() => {
                if (Data.userChoose.length !== 0) {
                    // 首选用户设置记录
                    I18n.locale = Data.userChoose;
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

        I18n.fallbacks = true;
        // 加载语言包
        I18n.translations = {zh, en};
    }
    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{width:320, height:100, position:'absolute', backgroundColor:'pink', flex:0, top:0}} >
                    <Text style={{fontSize:20}}>Langue</Text>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{
                        if (I18n.locale === 'zh'){
                            I18n.locale = 'en';
                            Data.userChoose = I18n.locale;
                            store.save('Language', Data.userChoose);
                            this.setState({langvis: false});

                        } else {
                            I18n.locale = 'zh';
                            Data.userChoose = I18n.locale;
                            store.save('Language', Data.userChoose);
                            this.setState({langvis: false});
                        }
                    }}>
                        <Text style={{fontSize:30}}>Switch language</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
