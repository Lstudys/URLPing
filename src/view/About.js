import React from 'react';
import {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  Button,
  processColor,
} from 'react-native';
import {BackHandler} from 'react-native';
import {SendRequest} from '../controller/request';
import {LineChart} from 'react-native-charts-wrapper';
import {
  ReqTimeChange,
  ConfirmRqTime,
  TextInputChange1,
  TextInputChange2,
  BackAction,
  SaveValue,
} from '../controller/AppPageFunction';
import Data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import {NavigationBar, Label, Checkbox} from 'teaset';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {
  SetSpText,
  ScaleSizeH,
  ScaleSizeW,
  ScaleSizeR,
} from '../controller/Adaptation';
import {color} from 'react-native-reanimated';

const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const Colors = [
  processColor('red'),
  processColor('blue'),
  processColor('green'),
  processColor('yellow'),
  processColor('purple'),
  processColor('pink'),
];
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
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

  render() {
    return (
      <View>
        <View
          style={{
            height: ScaleSizeH(1200),
            backgroundColor: '#f1f3f0',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(125),
              fontSize: 25,
              color: '#666',
              fontWeight: 'bold',
            }}>
            开发单位:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(200),
              fontSize: 25,
              color: '#666',
              fontWeight: 'bold',
            }}>
<<<<<<< HEAD
            {I18n.t('developmentunit')}：{I18n.t('hDDevteam')}
=======
            河南大学网络中心实验室
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(350),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
            开发人员:
>>>>>>> f11015428c408dc199c6f8131642d840dd8acfbc
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(400),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
<<<<<<< HEAD
            {I18n.t('developer')}
=======
            19级RN组、20级RN组部分人员
>>>>>>> f11015428c408dc199c6f8131642d840dd8acfbc
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(500),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
<<<<<<< HEAD
            {I18n.t('versionupdatetime')}：2021/8/18
=======
            版本更新时间:
>>>>>>> f11015428c408dc199c6f8131642d840dd8acfbc
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(550),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
            2021/8/18
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(700),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('iftherearebugsduringuse')}
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(800),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
            请联系:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(1000),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
<<<<<<< HEAD
            {I18n.t('pleasecontact')}
=======
            QQ:×××××××××××
>>>>>>> f11015428c408dc199c6f8131642d840dd8acfbc
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSizeH(1050),
              fontSize: 20,
              color: '#666',
              fontWeight: 'bold',
            }}>
            QQ:×××××××××××
          </Text>
          {/* <View style={{position:"absolute",top:700}}> */}
        </View>
        <Button
          color="#666"
          title="Home"
          onPress={() => {
            this.props.navigation.navigate('Home');
          }}
        />
      </View>
    );
  }
}
export default Index;
