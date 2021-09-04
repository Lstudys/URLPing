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
  Image
} from 'react-native';
import Data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import {NavigationBar, Label, Checkbox} from 'teaset';

import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {SetSpText, ScaleSizeH, ScaleSizeW, ScaleSize} from '../controller/Adaptation';
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
         
        }}>       
        {/* <View style={styles.headerViewStyle}>
          <NavigationBar
            style={{backgroundColor: '#fffef4'}}
            type="ios"
            tintColor="#333"
            title={
              <View
                style={{
                  flex: 1,
                  paddingLeft: ScaleSize(4),
                  paddingRight: ScaleSize(4),
                  borderRadius: 60,
                  alignItems: 'center',
                }}>
                <Label
                  style={{color: '#333333', fontSize: SetSpText(20)}}
                  text=""
                  style={styles.headerTextStyle}
                />
              </View>
            }
            leftView={
              <View
                style={{
                  flexDirection: 'row',
                  marginTop:ScaleSize(10),
                  marginLeft:ScaleSize(10),
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
        </View> */}


        <View style={{width:Width, height:ScaleSize(50),justifyContent:'center',backgroundColor:'white'}}>
          <TouchableOpacity
          style={{position:'absolute',left:ScaleSize(10),}}
            onPress={() => {
              this.props.navigation.navigate('Ordinary');
            }}>
            <Image
              source={require('../imgs/back.png')}
              style={{
                height: ScaleSize(25),
                width: ScaleSize(25),
              }}
              tintColor="#333"
            />
          </TouchableOpacity>
        </View>
        
        <View
          style={{
            width: ScaleSize(360),
            height: ScaleSize(60),
            borderBottomWidth: 1,
            borderBottomColor: '#666',
            marginTop: ScaleSize(30),
            flexDirection: 'row',
            alignItems:'center',
            backgroundColor:'white',
          }}>
          {/* <Text
            style={{
              fontSize: SetSpText(35),              
              color: '#85b2ae',
            }}>
            GENERAL
          </Text> */}
          <TouchableOpacity
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
              const mainThis = this.props.route.params.mainThis;
              mainThis.setState({langvis: false});
            }}
            style={{
              position:'absolute',
              left:ScaleSize(15),
              width:Width,
            }}>
            <Text
              style={{
                fontSize: SetSpText(40),
                color: '#666',
              }}>
              {I18n.t('language')}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              position:'absolute',
              right: ScaleSize(15),
              fontSize: SetSpText(40),
              color: '#666',
            }}>
            {I18n.locale === 'zh' ? '中文' : 'English'}
          </Text>
        </View>

        <View
          style={{
            width: Width,
            height: ScaleSize(60), 
            // borderBottomWidth: 1,
            // borderBottomColor: '#666',
            flexDirection: 'row',
            alignItems:'center',
            backgroundColor:'white',
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
                              {parseInt(item.key) < 10 ? '0'+item.key + ' ms':item.key + ' ms'}                  
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
          {/* <Text
            style={{
              fontSize: SetSpText(35),
              color: '#85b2ae',
            }}>
            ADVANCED
          </Text> */}
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true);
            }}
            style={{
              position: 'absolute',
              left: ScaleSize(15),
              width: Width,
            }}>
            <Text
              style={{
                fontSize: SetSpText(40),
                color: '#666',
              }}>
              {I18n.t('requestinterval')}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              position:'absolute',
              right: ScaleSize(15),
              fontSize: SetSpText(40),
              color: '#666',
              }}>
            {this.state.reqTime}  ms
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
    height: ScaleSize(200),
    width: ScaleSize(300),
    backgroundColor: 'white',
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
    top: ScaleSize(-100),
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: SetSpText(45),
    top: ScaleSize(-20),
    paddingLeft: ScaleSize(20),
  },
  flatlistContainer: {
    height: ScaleSize(65),
    width: ScaleSize(260),
    marginLeft: ScaleSize(20),
  },
  textcontainer: {
    flex: 1,
  },
  textStyle: {
    fontSize: SetSpText(50),
    position: 'relative',    
  },
  modalCancel: {
    fontSize: SetSpText(30),
    left: ScaleSize(230),
    top: ScaleSize(20),
    color: '#88b3ad',
  },
  //

  headerTextStyle: {
    paddingTop: ScaleSize(10),
    fontWeight: 'bold',
    fontSize:SetSpText(30),
    color: '#FFFFFF',
  },
  headerViewStyle: {
    height: ScaleSize(60),
    width: ScaleSize(360),
    position: 'absolute',
    top: 0, 
    backgroundColor: '#fffef4',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 40,
  },
});
