import React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  BackHandler
} from 'react-native';
import Data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import {NavigationBar, Label, Checkbox} from 'teaset';

import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {SetSpText, ScaleSizeH, ScaleSizeW} from '../controller/Adaptation';
const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      modalVisible: false,
      reqTime: 5, // 控制请求发送持续时间的state
    };
    store
      .get('Language')
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
    this.setState({modalVisible: visible});
  };
  render() {
    const {modalVisible} = this.state;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f1f4ee',
        }}>
        <View>
          <View style={styles.headerViewStyle}>
            <NavigationBar
              style={{backgroundColor: '#fffef4'}}
              type="ios"
              tintColor="#333"
              title={
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 60,
                    alignItems: 'center',
                  }}>
                  <Label
                    style={{color: '#333333', fontSize: 20}}
                    text=""
                    style={styles.headerTextStyle}
                  />
                </View>
              }
              leftView={
                <View
                  style={{
                    height:Height,
                    width:Width,
                    flexDirection: 'row',
                    marginTop:50,
                    marginLeft:0,
                  }}>
                  <NavigationBar.IconButton
                    icon={require('../imgs/back.png')}
                    onPress={() => {
                      this.props.navigation.navigate('Home');
                    }}
                  />
                </View>
              }
              // rightView={
              //   <View
              //     style={{flexDirection: 'row', marginTop: 10, marginRight: 10}}>
              //     <NavigationBar.IconButton
              //       icon={require('../imgs/caozuo-quanbuxuan.png')}
              //       onPress={this.deletitems}
              //     />
              //     <NavigationBar.IconButton
              //       icon={require('../imgs/total_selection.png')}
              //       onPress={this.addhandle}
              //     />
              //   </View>
              // }
            />
          </View>
        </View>
        <View
          style={{
            width: 320,
            height: 100,
            position: 'absolute',
            backgroundColor: '#f1f4ee',
            flex: 0,
            top: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#666',
            marginTop: 100,
          }}>
          <Text
            style={{
              fontSize: SetSpText(35),
              top: ScaleSizeH(30),
              left: ScaleSizeW(40),
              color: '#85b2ae',
            }}>
            GENERAL
          </Text>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              if (I18n.locale === 'zh') {
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
            <Text
              style={{
                fontSize: SetSpText(40),
                top: ScaleSizeH(50),
                left: ScaleSizeW(40),
                color: '#666',
              }}>
              Switch language
            </Text>
          </TouchableOpacity>
          <Text
            style={{color: '#666', top: ScaleSizeH(0), left: ScaleSizeW(40)}}>
            current language : {Data.userChoose}
          </Text>
        </View>
        <View
          style={{
            width: 320,
            height: 100,
            position: 'absolute',
            flex: 0,
            top: 200,
            borderBottomWidth: 1,
            borderBottomColor: '#666',
          }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Request interval</Text>
                <TouchableHighlight
                  style={{...styles.openButton}}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                    this.setState({reqTime: 2});
                  }}>
                  <Text style={styles.textStyle}>2 ms</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{...styles.openButton}}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                    this.setState({reqTime: 5});
                  }}>
                  <Text style={styles.textStyle}>5 ms</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{...styles.openButton}}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                    this.setState({reqTime: 10});
                  }}>
                  <Text style={styles.textStyle}>10 ms</Text>
                </TouchableHighlight>
                <Text
                  style={{fontSize: 15, left: 120, top: 20, color: '#88b3ad'}}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}>
                  CANCEL
                </Text>
              </View>
            </View>
          </Modal>
          <Text
            style={{
              fontSize: SetSpText(35),
              top: ScaleSizeH(10),
              left: ScaleSizeW(40),
              color: '#85b2ae',
            }}>
            ADVANCED
          </Text>
          <TouchableHighlight
            style={{padding: 10, width: 320, height: 40, top: 20}}
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Text
              style={{
                fontSize: 20,
                top: ScaleSizeH(-35),
                left: ScaleSizeW(20),
                color: '#666',
              }}>
              Request interval
            </Text>
          </TouchableHighlight>
          <Text
            style={{color: '#666', top: ScaleSizeH(10), left: ScaleSizeW(40)}}>
            current time : {this.state.reqTime} ms
          </Text>
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
    top: -100,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#666',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#666',
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
    width: 320,
    height: 40,
    top: -20,
  },
  textStyle: {
    fontSize: SetSpText(50),
    color: 'white',
    left: 50,
  },
  modalText: {
    marginBottom: 15,
    fontSize: SetSpText(45),
    position: 'relative',
    top: -20,
    left: -70,
    color: 'white',
  },
  headerTextStyle: {
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerViewStyle: {
    height: 80,
    position: 'absolute',
    top: -430,
    right: -216,
    width: Width,
    backgroundColor: '#fffef4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
});
