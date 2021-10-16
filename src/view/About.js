import React from 'react';
import {Component} from 'react';
import {Dimensions, View, Text, Button, processColor} from 'react-native';
import Data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {SetSpText, ScaleSize} from '../controller/Adaptation';
import {TouchableOpacity} from 'react-native';

const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

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
  }

  render() {
    return (
      <View>
        <View
          style={{
            height: Height,
            backgroundColor: '#1f2342',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(75),
              fontSize: SetSpText(50),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('developmentunit')}:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(110),
              fontSize: SetSpText(50),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('hDDevteam')}
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(190),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('developer')}:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(220),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('members')}
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(270),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('versionupdatetime')}:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(300),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            2021/10/15
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(360),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('version')}
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(400),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('iftherearebugsduringuse')}
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(440),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            {I18n.t('pleasecontact')}:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(480),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            E-mail:×××××××××××××
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: ScaleSize(500),
              fontSize: SetSpText(40),
              color: '#666',
              fontWeight: 'bold',
            }}>
            E-mail:×××××××××××××
          </Text>
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: ScaleSize(10),
            height: ScaleSize(70),
            width: Width,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fffef4',
          }}
          onPress={() => {
            this.props.navigation.navigate('Ordinary');
          }}>
          <Text style={{fontSize: SetSpText(40)}}>Home</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default Index;
