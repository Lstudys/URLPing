/**
 * 页面代码
 *created by LYH on 2021/7/23
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  FlatList,
  processColor,
  StatusBar,
} from 'react-native';
import {NavigationBar, Label, Checkbox} from 'teaset';
import {Overlay} from 'react-native-elements';
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
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {SetSpText, ScaleSizeH, ScaleSizeW} from '../controller/Adaptation';

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
export default class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reqTime: 5, // 控制请求发送持续时间的state
      newReqTime: 0,
      url: '', // 用户输入的url
      url2: '',
      OverlayAble: false, // 控制Overlay组件的显示
      linechart: true, // 用来控制图表的显示,true表示显示输入框，不显示图表
      ifOverlayAble: true, // 用来控制是否可以设置请求时间，当正在Ping时不能设置
      isPing: false, // 控制是否正在ping
      defaultvalueOne: '',
      defaultvalueTwo: '',
      backChart: false, // ping过之后，点击返回图表
      chartToData: false,
      overlayOne: false,
      overlayTwo: false, // 控制两个overlay显示的state
      urlArr: ['https://', 'http://', 'www.', '.cn', '.com'],
      visible: false, // 删除后刷新历史记录
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      selectedDomain: '',
      zoomDomain: '',
      values: [],
      colorIndex: 0,
      chartLabels: [],
      values2: [],
      colorIndex2: 2,
      chartLabels2: [],
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white'),
      },
      chartDate: [{y: 0, x: 0}], // 只作为刷新页面用的state
      setting: false,
      secondDataHeight: 120, // 第二个图表数据style属性的bottom值
      chart1: false,
      chart2: false,
      ifTwoChartShow: true,
      FlatListIsRefreshing: false,
      checked: true,
      chartDisplay: false,
      urlsWitch: false,
    };

    /* 选择合适语言 */
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

    /* 获取历史记录数据 */
    store.get('local').then((res) => (Data.local = res.slice()));
    I18n.fallbacks = true;
    // 加载语言包
    I18n.translations = {zh, en};

    //初始化Data.indexArr作为索引存储在数据库里面的全部数据，初始全部为空
    // for (let i = 0; i < Data.indexArr.length; i++) {
    //   store.get(Data.indexArr[i]).then((res) => {
    //     if (res == null) {
    //       store.push(Data.indexArr[i], '');
    //     }
    //   });
    // }

    //初始化Data.indexIndex作为索引存储在数据库的里面的数据，初始为1

    console.log('232');
    console.log(this.state.url);
    console.log(this.state.url2);
  }

  componentDidMount() {
    store.get(Data.indexIndex).then((res) => {
      if (res == null) store.save(Data.indexIndex, 0);
    });

    store.get(Data.indexIndex).then((res) => {
      Data.index = res;
    });

    store.get(Data.urlsIndex).then((res) => {
      if (res == null) store.save(Data.urlsIndex, []);
    });

    store.get(Data.urlsIndex).then((res) => {
      console.log(res);
      const {urlsWitch} = this.state;
      Data.urls = res;
      this.setState({
        urlsWitch: !urlsWitch,
      });
    });

    // for(let i=0;i<Data.urls.length;i++){
    //   if(Data.urls[i].mark&&this.state.url==''){
    //     this.state.url=Data.urls[i].url
    //   }
    // }

    // for(let i=0;i<Data.urls.length;i++){
    //   if(Data.urls[i].mark&&this.state.url2==''){
    //     this.state.ur2=Data.urls[i].url
    //   }
    // }

    let amount = 0,
      urlsArr2 = ['', ''];
    for (let i = 0; i < Data.urls.length; i++) {
      if (Data.urls[i].mark == true) {
        amount++;
        if (amount == 1) urlsArr2[0] = Data.urls[i].url;
        if (amount == 2) urlsArr2[1] = Data.urls[i].url;
      }
    }

    if (amount == 1) {
      this.state.url = urlsArr2[0];
      this.state.url2 = '';
    }
    if (amount == 2) {
      this.state.url = urlsArr2[0];
      this.state.url2 = urlsArr2[1];
    }
    if (amount == 0) {
      this.state.url = '';
      this.state.url2 = '';
    }
  }

  render() {
    return (
      <View>
        <NavigationBar
                style={{backgroundColor: '#ffffff',height:0.085 * Height}}
                type="ios"
                tintColor="#ffffff"
              />
        <View>
          <FlatList/>
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomChartDataTwo: {
    width: Width,
    height: ScaleSizeH(50),
    position: 'absolute',
    top: ScaleSizeH(100),
  },
  bottomChartDataOne: {
    width: Width,
    height: ScaleSizeH(50),
    position: 'absolute',
    top: ScaleSizeH(50),
  },
  bottomChartDataItem: {
    flexDirection: 'row',
    position: 'relative',
    height: ScaleSizeH(200),
    width: Width,
  },
  bottomChartData: {
    flexDirection: 'column',
    position: 'relative',
    height: Height * 0.1,
  },
  bottomStyle: {
    height: Height,
    backgroundColor: '#ffffff',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  serch: {
    flexDirection: 'column',
    top: 20,
  },
  HomeInputs: {
    color: '#ffffff',
    fontSize: SetSpText(65),
    paddingTop: 5,
    marginTop: 40,
    backgroundColor: 'pink',
    alignSelf: 'center',
    textAlign: 'center',
    height: ScaleSizeH(100),
    width: ScaleSizeW(400),
    top: ScaleSizeH(90),
    borderRadius: 15,
  },
  textinput: {
    flexDirection: 'column',
  },
  TextStyle: {
    margin: 10,
    height: 50,
    width: 250,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 4,
    color: '#1F2342',
    fontSize: 20,
    borderColor: 'pink',
    marginLeft: 30,
    marginTop: 45,
    flexDirection: 'row',
  },
  ButtonStyle: {
    width: 60,
    height: 50,
    marginLeft: -30,
    backgroundColor: 'white',
    borderColor: 'pink',
    borderRadius: 15,
    borderWidth: 4,
    marginTop: -3,
  },
  settingbtnstyle: {
    fontFamily: 'iconfont',
    color: '#FFB6C1',
    fontSize: 30,
    top: 40,
    left: 5,
  },
  History: {
    position: 'relative',
    height: Height / 2,
    width: Width,
  },
  HistoryList: {
    width: ScaleSizeW(730),
    height: ScaleSizeH(80),
    backgroundColor: 'white',
  },
  HistoryTextBox: {
    height: ScaleSizeH(70),
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    left: 5,
    paddingLeft: 10,
    marginTop: 10,
  },
  HistoryText: {
    fontSize: SetSpText(40),
    color: '#666',
  },
  Delete: {
    width: ScaleSizeW(90),
    height: ScaleSizeH(70),
    position: 'relative',
    top: ScaleSizeH(-85),
    left: ScaleSizeW(640),
  },
  DeleteText: {
    fontFamily: 'iconfont',
    position: 'relative',
    top: ScaleSizeH(10),
    right: ScaleSizeW(-13),
    fontSize: SetSpText(60),
  },
  overlay: {
    position: 'absolute',
  },
  language: {
    width: Width,
    height: Height,
    position: 'absolute',
  },
  iconStyle: {
    fontFamily: 'iconfont',
    fontSize: SetSpText(85),
    top: ScaleSizeH(1250),
    left: ScaleSizeW(20),
    width: ScaleSizeW(80),
  },
  Settingarea: {
    position: 'absolute',
    top: Height / 1.1,
    left: 60,
    flexDirection: 'row',
  },
});

{
  /* <View style={styles.textinput}>
                         <TextInput
                             ref={'input1'}
                             placeholder={I18n.t('inputone')} // 占位符
                             defaultValue={this.state.defaultvalueOne}
                             placeholderTextColor="#ccc" // 设置占位符颜色
                             keyboardType="url" // 设置键盘类型，url只在iOS端可用
                             color="#666" // 设置输入文字的颜色
                             onChangeText={TextInputChange1.bind(this)}
                             onFocus={() => {
                                 this.setState({overlayOne: true});
                             }}
                             style={{borderBottomColor: '#ffffff', borderRadius: 15, width: Width * 0.95, left:Width * 0.025,
                                 height: ScaleSizeH(110), bottom: ScaleSizeH(10), backgroundColor:'white', fontSize:ScaleSizeW(45)}}
                         />
                         <TextInput
                             ref={'input2'}
                             placeholder={I18n.t('inputtwo')} // 占位符
                             defaultValue={this.state.defaultvalueTwo}
                             placeholderTextColor="#ccc" // 设置占位符颜色
                             keyboardType="url" // 设置键盘类型，url只在iOS端可用
                             color="#666" // 设置输入文字的颜色
                             onChangeText={TextInputChange2.bind(this)}
                             onFocus={() => {
                                 this.setState({overlayTwo: true});
                             }}
                             style={{borderBottomColor: '#ffffff', borderRadius: 15, width: Width * 0.95, left:Width * 0.025, height: ScaleSizeH(110), backgroundColor:'white', fontSize:ScaleSizeW(45)}}
                         />
                     </View> */
}
