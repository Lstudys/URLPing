import React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  LogBox,
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
          // 用户既没有设置，也没有获取到系统语言，默认加载英语语言资源
          I18n.locale = 'en'; 
        }
        this.setState({
          langvis: false,
        });
      });

    I18n.fallbacks = true;
    // 加载语言包
    I18n.translations = {zh, en};

    //设置可以忽略setting造成的WARN，
    // LogBox.ignoreLogs([
    //   'Non-serializable values were found in the navigation state',
    //  ]);
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
                      this.props.navigation.navigate('Main');
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
              // 获得home页面的this并进行刷新，在这里写变换快，在componentWillUnmount中写会有一点延迟。
              const homeThis = this.props.route.params.homeThis;
              homeThis.setState({langvis: false});
            }}>
            <Text
              style={{
                fontSize: SetSpText(40),
                top: ScaleSizeH(30),
                left: ScaleSizeW(40),
                color: '#666',
              }}>
              {I18n.t('switchlanguage')}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: '#666',
              top: ScaleSizeH(1),
              left: ScaleSizeW(40),
              marginBottom: 5,
            }}>
            {I18n.t('currentlanguage')} :{' '}
            {I18n.locale === 'zh' ? '中文' : 'English'}
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
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!modalVisible);
            }}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => {
                this.setModalVisible(!modalVisible);
              }}>
              <View style={{...styles.centeredView}}>
                <TouchableWithoutFeedback
                  style={{flex: 1}}
                  onPress={() => {
                    this.setModalVisible(modalVisible);
                  }}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>
                      {I18n.t('requestinterval')}
                    </Text>
                    <View style={styles.flatlistContainer}>
                      <FlatList
                        data={[{key: '2'}, {key: '5'}, {key: '10'}]}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            style={styles.textcontainer}
                            onPress={() => {
                              this.setModalVisible(!modalVisible);
                              this.setState({reqTime: item.key});
                            }}>
                            <Text style={styles.textStyle}>
                              {item.key + ' ms'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                    <Text
                      style={styles.modalCancel}
                      onPress={() => {
                        this.setModalVisible(!modalVisible);
                      }}>
                      {I18n.t('cancel')}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
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
          <TouchableOpacity
            style={{padding: 10, width: 320, height: 40, top: 20}}
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Text
              style={{
                fontSize: SetSpText(40),
                top: ScaleSizeH(-34),
                left: ScaleSizeW(20),
                color: '#666',
              }}>
              {I18n.t('requestinterval')}
            </Text>
          </TouchableOpacity>
          <Text
            style={{color: '#666', top: ScaleSizeH(10), left: ScaleSizeW(40)}}>
            {I18n.t('currenttime')} : {this.state.reqTime} ms
          </Text>
        </View>
      </View>
    );
  }
  

}

const styles = StyleSheet.create({
  //模态框样式代码
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    height: 200,
    width: 300,
    backgroundColor: '#666',
    shadowColor: '#666',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    top: -100,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: SetSpText(45),
    top: -20,
    paddingLeft: 20,
    color: 'white',
  },
  flatlistContainer: {
    height: 65,
    width: 260,
    marginLeft: 20,
  },
  textcontainer: {
    flex: 1,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: SetSpText(50),
    position: 'relative',
    color: 'white',
    left: -100,
  },
  modalCancel: {
    fontSize: 15,
    left: 230,
    top: 20,
    color: '#88b3ad',
  },
  //

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
