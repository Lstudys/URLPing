import React from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity, Alert, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import Data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {SetSpText, ScaleSizeH, ScaleSizeW} from '../controller/Adaptation';
const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
            modalVisible: false,
            reqTime: 5, // 控制请求发送持续时间的state
        };
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
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };
    render(){
        const { modalVisible } = this.state;
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#333333'}}>
                <View style={{width:320, height:90, position:'absolute', backgroundColor:'#333333', flex:0, top:0, borderBottomWidth:1, borderBottomColor:'white'}} >
                    <Text style={{fontSize: SetSpText(35), top: ScaleSizeH(30), left:ScaleSizeW(40), color:'#85b2ae'}}>GENERAL</Text>
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
                        <Text style={{fontSize: SetSpText(40), top: ScaleSizeH(50), left:ScaleSizeW(40), color:'white'}}>Switch language</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width:320, height:90, position:'absolute', backgroundColor:'#333333', flex:0, top:100, borderBottomWidth:1, borderBottomColor:'white'}} >
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Request interval</Text>
                                <TouchableHighlight
                                    style={{ ...styles.openButton}}
                                    onPress={() => {
                                        this.setModalVisible(!modalVisible);
                                        this.setState({reqTime: 2});
                                    }}
                                >
                                    <Text style={styles.textStyle}>2 ms</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={{ ...styles.openButton}}
                                    onPress={() => {
                                        this.setModalVisible(!modalVisible);
                                        this.setState({reqTime: 5});
                                    }}
                                >
                                    <Text style={styles.textStyle}>5 ms</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={{ ...styles.openButton}}
                                    onPress={() => {
                                        this.setModalVisible(!modalVisible);
                                        this.setState({reqTime: 10});
                                    }}
                                >
                                    <Text style={styles.textStyle}>10 ms</Text>
                                </TouchableHighlight>
                                <Text style={{fontSize:15, left:120, top:20, color: '#88b3ad' }} onPress={() => {
                                    this.setModalVisible(!modalVisible);
                                }}>CANCEL</Text>
                            </View>
                        </View>
                    </Modal>
                    <Text style={{fontSize: SetSpText(35), top: ScaleSizeH(10), left:ScaleSizeW(40), color:'#85b2ae'}}>ADVANCED</Text>
                    <TouchableHighlight
                        style={{padding: 10,
                            width:320,
                            height:40,
                            top:20 }}
                        onPress={() => {
                            this.setModalVisible(true);
                        }}
                    >
                        <Text style={{fontSize:20, top: ScaleSizeH(-35), left:ScaleSizeW(20), color:'white'}}>Request interval</Text>
                    </TouchableHighlight>
                    <Text style={{color:'white', top: ScaleSizeH(10), left:ScaleSizeW(40)}}>current time :  {this.state.reqTime} ms</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        top:-100,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#333333',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        padding: 10,
        width:320,
        height:40,
        top:-20,
    },
    textStyle: {
        fontSize: SetSpText(50),
        color: 'white',
        left:50,
    },
    modalText: {
        marginBottom: 15,
        fontSize: SetSpText(45),
        position:'relative',
        top:-20,
        left:-70,
        color: 'white',
    },
});
