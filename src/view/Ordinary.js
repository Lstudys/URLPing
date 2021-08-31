// import React from 'react';
// import {Component} from 'react';
// import {Toast} from 'teaset';
// import {
//   Dimensions,
//   StyleSheet,
//   TextInput,
//   View,
//   Text,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   processColor,
//   RefreshControl,
//   TouchableHighlight,
//   FlatList,
//   Image,
//   Overlay,
// } from 'react-native';
// import {BackHandler} from 'react-native';
// import {SendRequest} from '../controller/request';
// import {LineChart} from 'react-native-charts-wrapper';
// import {
//   BackAction,
// } from '../controller/AppPageFunction';
// import Data from '../modal/data';
// import store from 'react-native-simple-store';
// import I18n from 'i18n-js';
// import {NavigationBar, Label, Checkbox} from 'teaset';
// import * as RNLocalize from 'react-native-localize';
// import zh from '../modal/Langguage/zh_CN';
// import en from '../modal/Langguage/en_US';
// import {
//   SetSpText,
//   ScaleSizeH,
//   ScaleSizeW,
//   ScaleSizeR,
// } from '../controller/Adaptation';
// const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
// const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言
// const Height = Dimensions.get('window').height;
// const Width = Dimensions.get('window').width;
// const Colors = [
//   processColor('red'),
//   processColor('blue'),
//   processColor('green'),
//   processColor('yellow'),
//   processColor('purple'),
//   processColor('pink'),
// ];
// class Index extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       inputtext:"",
//       judge:false,
//       key:0,
//       reqTime: 5, // 控制请求发送持续时间的state
//       newReqTime: 0,
//       url: '', // 用户输入的url
//       url2: '',
//       OverlayAble: false, // 控制Overlay组件的显示
//       linechart: true, // 用来控制图表的显示,true表示显示输入框，不显示图表
//       ifOverlayAble: true, // 用来控制是否可以设置请求时间，当正在Ping时不能设置
//       isPing: false, // 控制是否正在ping
//       defaultvalueOne: '',
//       defaultvalueTwo: '',
//       backChart: false, // ping过之后，点击返回图表
//       chartToData: false,
//       overlayOne: false,
//       overlayTwo: false, // 控制两个overlay显示的state
//       urlArr: ['https://', 'http://', 'www.', '.cn', '.com'],
//       visible: false, // 删除后刷新历史记录
//       langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
//       selectedDomain: '',
//       zoomDomain: '',
//       values: [],
//       colorIndex: 0,
//       chartLabels: [],
//       values2: [],
//       colorIndex2: 2,
//       chartLabels2: [],
//       marker: {
//         enabled: true,
//         digits: 2,
//         backgroundTint: processColor('teal'),
//         markerColor: processColor('#F0C0FF8C'),
//         textColor: processColor('white'),
//       },
//       chartDate: [{y: 0, x: 0}], // 只作为刷新页面用的state
//       setting: false,
//       secondDataHeight: 120, // 第二个图表数据style属性的bottom值
//       chart1: false,
//       chart2: false,
//       ifTwoChartShow: true,
//       FlatListIsRefreshing: false,
//       checked: true,
//       chartDisplay: false,
//       urlsWitch: true, //刷新页面
//     };
//     this.cancle_checked()
//     store
//       .get('Language')
//       .then((res) => {
//         Data.userChoose = res;
//       })
//       .finally(() => {
//         if (Data.userChoose.length !== 0) {
//           // 首选用户设置记录
//           I18n.locale = Data.userChoose;
//         } else if (SystemLanguage) {
//           // 获取系统语言
//           I18n.locale = SystemLanguage;
//         } else {
//           I18n.locale = 'en'; // 用户既没有设置，也没有获取到系统语言，默认加载英语语言资源
//         }
//         this.setState({
//           langvis: false,
//         });
//       });

//     /* 获取历史记录数据 */
//     store.get('local').then((res) => (Data.local = res.slice()));
//     I18n.fallbacks = true;
//     // 加载语言包
//     I18n.translations = {zh, en};
//     {
//     }

//     store.get(Data.indexIndex).then((res) => {
//       if (res == null) store.save(Data.indexIndex, 0);
//     });

//     store.get(Data.indexIndex).then((res) => {
//       Data.index = res;
//     });

//     store.get(Data.urlsIndex).then((res) => {
//       if (res == null) store.save(Data.urlsIndex, []);
//     });

//     store.get(Data.urlsIndex).then((res) => {
//       //console.log(res);
//       const {urlsWitch} = this.state;
//       Data.urls = res;
//       this.setState({
//         urlsWitch: !urlsWitch,
//       });
//     });

//     let amount = 0,
//       urlsArr2 = ['', ''];
//     for (let i = 0; i < Data.urls.length; i++) {
//       if (Data.urls[i].mark == true) {
//         amount++;
//         if (amount == 1) urlsArr2[0] = Data.urls[i].url;
//         if (amount == 2) urlsArr2[1] = Data.urls[i].url;
//       }
//     }

//     if (amount == 1) {
//       this.state.url = urlsArr2[0];
//       this.state.url2 = '';
//     }
//     if (amount == 2) {
//       this.state.url = urlsArr2[0];
//       this.state.url2 = urlsArr2[1];
//     }
//     if (amount == 0) {
//       this.state.url = '';
//       this.state.url2 = '';
//     }
//   }

//   pressnum = 0; // 表示安卓手机返回键按压次数，以控制返回上一界面
//   firstpress = 0; // 第一次按返回键的时间戟
//   maxTime = 0; // 最大时间
//   minTime = ''; // 最小时间
//   avgTime = 0; // 平均时间
//   n95 = ''; // 95%的数据
//   status1 = '';
//   sumReqTime = []; // 所有请求时间的数组，用来计算标准差
//   /**
//    * 下面是第二个图表的数据
//    */
//   maxTime2 = 0; // 最大时间
//   minTime2 = ''; // 最小时间
//   avgTime2 = 0; // 平均时间
//   n952 = ''; // 95%的数据
//   status2 = '';
//   sumReqTime2 = []; // 所有请求时间的数组，用来计算标准差

//   config = {};

//   componentDidMount() {
//     BackHandler.addEventListener('hardwareBackPress', BackAction.bind(this));
//     /* 选择合适语言 */
//   }
//   componentWillUnmount() {
//     BackHandler.removeEventListener('hardwareBackPress', BackAction.bind(this));
//   }
//   // 设置url和输入框默认值为item
//   setDefaultValue = (item) => {
//     if (this.state.overlayOne) {
//       this.setState({defaultvalueOne: item});
//       this.state.url = item;
//     }
//     if (this.state.overlayTwo) {
//       this.setState({defaultvalueTwo: item});
//       this.state.url2 = item;
//     }
//   };

//   next(
//     values,
//     colorIndex,
//     chartLabels,
//     url,
//     url2,
//     values2,
//     colorIndex2,
//     chartLabels2,
//   ) {
//     if (this.state.url != '' && this.state.url2 != '') {
//       return {
//         data: {
//           dataSets: [
//             {
//               values: values,
//               label: url,

//               config: {
//                 drawValues: false,
//                 color: Colors[colorIndex],
//                 mode: 'CUBIC_BEZIER',
//                 drawCircles: false,
//                 lineWidth: 2,
//               },
//             },
//             {
//               values: values2,
//               label: url2,

//               config: {
//                 drawValues: false,
//                 color: Colors[colorIndex2],
//                 mode: 'CUBIC_BEZIER',
//                 drawCircles: false,
//                 lineWidth: 2,
//               },
//             },
//           ],
//         },
//         xAxis: {
//           valueFormatter: chartLabels,
//           axisLineWidth: 0,
//           drawLabels: true,
//           position: 'BOTTOM',
//           drawGridLines: false,
//         },
//       };
//     }
//     if (this.state.url != '') {
//       return {
//         data: {
//           dataSets: [
//             {
//               values: values,
//               label: url,

//               config: {
//                 drawValues: false,
//                 color: Colors[colorIndex],
//                 mode: 'CUBIC_BEZIER',
//                 drawCircles: false,
//                 lineWidth: 2,
//               },
//             },
//           ],
//         },
//         xAxis: {
//           valueFormatter: chartLabels,
//           axisLineWidth: 0,
//           drawLabels: true,
//           position: 'BOTTOM',
//           drawGridLines: false,
//         },
//       };
//     }
//     if (this.state.url2 != '') {
//       return {
//         data: {
//           dataSets: [
//             {
//               values: values2,
//               label: url2,

//               config: {
//                 drawValues: false,
//                 color: Colors[colorIndex2],
//                 mode: 'CUBIC_BEZIER',
//                 drawCircles: false,
//                 lineWidth: 2,
//               },
//             },
//           ],
//         },
//         xAxis: {
//           valueFormatter: chartLabels2,
//           axisLineWidth: 0,
//           drawLabels: true,
//           position: 'BOTTOM',
//           drawGridLines: false,
//         },
//       };
//     }
//   }

//   ifSecondPing = () => {
//     if (this.state.url == '') {
//       this.state.secondDataHeight = 140;
//     } else {
//       this.state.secondDataHeight = 220;
//     }
//   };

//   // flatlist的渲染函数,item是数据，index是序列号
//   // 渲染列表项

//   onChangeitemurl = (item) => {};

//   _renderItem = ({item}) => {//console.log(item.key)
//     <View><Text>12345</Text></View>
//   };

//   render() {
//     //this.cancle_checked()
//     if (this.state.url != '' || this.state.url2 != '') {
//       const {
//         values,
//         colorIndex,
//         chartLabels,
//         url,
//         values2,
//         url2,
//         colorIndex2,
//         chartLabels2,
//       } = this.state;
//       this.config = this.next(
//         values,
//         colorIndex,
//         chartLabels,
//         url,
//         url2,
//         values2,
//         colorIndex2,
//         chartLabels2,
//       );
//     }

//     return this.state.linechart ? (
//       <View style={{flex: 1}}>
//         <NavigationBar
//                 style={{backgroundColor: '#ffffff',height:0.085 * Height}}
//                 type="ios"
//                 tintColor="#333"
//               />
//         <View style={{marginTop:0.085 * Height+10,height : .35 * Height,backgroundColor:"#e5e5e5"}}>
//         </View>

//         <View style={{height: .25 * Height,backgroundColor:"#fefefe"}}>

//         </View>

//         <View>

//         </View>
//       </View>

//     ) : (
//       <View style={styles.bottomStyle}>
//         <View style={styles.headerViewStyle}>
//           <NavigationBar
//             style={{backgroundColor: '#fffef4'}}
//             type="ios"
//             tintColor="#333"
//             title={
//               <View
//                 style={{
//                   flex: 1,
//                   paddingLeft: 4,
//                   paddingRight: 4,
//                   borderRadius: 60,
//                   alignItems: 'center',
//                 }}>
//                 <Label
//                   style={{color: '#333333', fontSize: 20}}
//                   text=""
//                   style={styles.headerTextStyle}
//                 />
//               </View>
//             }
//             leftView={
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   marginTop: 10,
//                   marginLeft: 10,
//                 }}>
//                 <NavigationBar.IconButton
//                   icon={require('../imgs/back.png')}
//                   onPress={() => {
//                     this.cancle_checked()
//                     let amount = 0,
//                       urlsArr2 = ['', ''];
//                     for (let i = 0; i < Data.urls.length; i++) {
//                       if (Data.urls[i].mark == true) {
//                         amount++;
//                         if (amount == 1) urlsArr2[0] = Data.urls[i].url;
//                         if (amount == 2) urlsArr2[1] = Data.urls[i].url;
//                       }
//                     }

//                     if (amount == 1) {
//                       this.state.url = urlsArr2[0];
//                       this.state.url2 = '';
//                     }
//                     if (amount == 2) {
//                       this.state.url = urlsArr2[0];
//                       this.state.url2 = urlsArr2[1];
//                     }
//                     if (amount == 0) {
//                       this.state.url = '';
//                       this.state.url2 = '';
//                     }

//                     //console.log('232');
//                     //console.log(this.state.url);
//                     //console.log(this.state.url2);

//                     this.setState({
//                       linechart: true,
//                       isPing: false,
//                     });
//                     const {urlsWitch} = this.state;
//                     this.setState({
//                       urlsWitch: !urlsWitch,
//                     });
//                   }}
//                 />
//               </View>
//             }
//             // rightView={
//             //   <View
//             //     style={{flexDirection: 'row', marginTop: 10, marginRight: 10}}>
//             //     <NavigationBar.IconButton
//             //       icon={require('../imgs/caozuo-quanbuxuan.png')}
//             //       onPress={this.deletitems}
//             //     />
//             //     <NavigationBar.IconButton
//             //       icon={require('../imgs/total_selection.png')}
//             //       onPress={this.addhandle}
//             //     />
//             //   </View>
//             // }
//           />
//         </View>
//         <ScrollView style={{height: Height}}>
//           <LineChart
//             width={Width}
//             height={Height * 0.7}
//             bottom={0}
//             data={this.config.data}
//             xAxis={this.config.xAxis}
//             style={styles.container}
//             marker={this.state.marker}
//             chartDescription={{text: ''}}
//             ref="chart"
//           />

//           <ScrollView>
//             <View
//               style={[
//                 styles.bottomChartData,
//                 {
//                   marginBottom: 30,
//                   marginTop: 15,
//                   borderTopWidth: 0.5,
//                   borderColor: '#666',
//                 },
//               ]}>
//               <View style={styles.bottomChartDataItem}>
//                 <Text
//                   style={{
//                     color: 'pink',
//                     fontSize: SetSpText(40),
//                     left: ScaleSizeW(40),
//                     position: 'absolute',
//                   }}>
//                   MAX
//                 </Text>
//                 <Text
//                   style={{
//                     color: 'pink',
//                     fontSize: SetSpText(40),
//                     left: ScaleSizeW(220),
//                     position: 'absolute',
//                   }}>
//                   MIN
//                 </Text>
//                 <Text
//                   style={{
//                     color: 'pink',
//                     fontSize: SetSpText(40),
//                     left: ScaleSizeW(400),
//                     position: 'absolute',
//                   }}>
//                   AVG
//                 </Text>
//                 <Text
//                   style={{
//                     color: 'pink',
//                     fontSize: SetSpText(40),
//                     left: ScaleSizeW(580),
//                     position: 'absolute',
//                   }}>
//                   N95
//                 </Text>
//               </View>
//               {this.state.chart1 ? (
//                 <View style={styles.bottomChartDataOne}>
//                   <Text
//                     style={{
//                       color: 'red',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(40),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'red',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(220),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'red',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'red',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(580),
//                       position: 'absolute',
//                     }}>
//                     {this.n95 ? `${this.n95.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart2 ? (
//                 <View style={styles.bottomChartDataTwo}>
//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(40),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime2}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(220),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime2}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime2.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(580),
//                       position: 'absolute',
//                     }}>
//                     {this.n952 ? `${this.n952.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//             </View>
//           </ScrollView>
//           <ScrollView
//             style={{
//               backgroundColor: '#f1f3f0',
//               height: Height * 0.4,
//             }}></ScrollView>
//         </ScrollView>
//       </View>
//     );
//   }
//  cancle_checked (){
//    let i=0
//   for(i;i<Data.urls.length;i++){
//     if(Data.urls[i].mark==true){
//       Data.urls[i].mark=false
//       store.save(Data.urlsIndex, Data.urls);

//      /*const {urlsWitch} = this.state;
//       this.setState({
//       urlsWitch: !urlsWitch,
//       })*/
//     }
//   }
// }

// }

// export default Index;

// const styles = StyleSheet.create({
//   bottomChartDataTwo: {
//     width: Width,
//     height: ScaleSizeH(70),
//     position: 'absolute',
//     top: ScaleSizeH(100),
//   },
//   bottomChartDataOne: {
//     width: Width,
//     height: ScaleSizeH(50),
//     position: 'absolute',
//     top: ScaleSizeH(50),
//   },
//   bottomChartDataItem: {
//     flexDirection: 'row',
//     position: 'relative',
//     height: ScaleSizeH(200),
//     width: Width,
//   },
//   bottomChartData: {
//     flexDirection: 'column',
//     position: 'relative',
//     height: Height * 0.1,
//   },
//   bottomStyle: {
//     height: Height * 1.2,
//     backgroundColor: '#ffffff',
//   },
//   container: {
//     justifyContent: 'center',
//     alignItems: 'stretch',
//     backgroundColor: 'transparent',
//   },
//   serch: {
//     flexDirection: 'column',
//     top: 20,
//   },
//   textinput: {
//     flexDirection: 'column',
//   },
//   TextStyle: {
//     margin: 10,
//     height: 50,
//     width: 250,
//     backgroundColor: 'white',
//     borderRadius: 15,
//     borderWidth: 4,
//     color: '#1F2342',
//     fontSize: 20,
//     borderColor: 'pink',
//     marginLeft: 30,
//     marginTop: 45,
//     flexDirection: 'row',
//   },
//   ButtonStyle: {
//     width: 60,
//     height: 50,
//     marginLeft: -30,
//     backgroundColor: 'white',
//     borderColor: 'pink',
//     borderRadius: 15,
//     borderWidth: 4,
//     marginTop: -3,
//   },
//   settingbtnstyle: {
//     fontFamily: 'iconfont',
//     color: '#FFB6C1',
//     fontSize: 30,
//     top: 40,
//     left: 5,
//   },
//   History: {
//     position: 'relative',
//     height: Height / 2,
//     width: Width,
//   },
//   HistoryList: {
//     width: ScaleSizeW(730),
//     height: ScaleSizeH(80),
//     backgroundColor: 'white',
//   },
//   HistoryTextBox: {
//     height: ScaleSizeH(70),
//     justifyContent: 'center',
//     borderRadius: 20,
//     backgroundColor: '#F0F8FF',
//     left: 5,
//     paddingLeft: 10,
//     marginTop: 10,
//   },
//   HistoryText: {
//     fontSize: SetSpText(40),
//     color: '#666',
//   },
//   Delete: {
//     width: ScaleSizeW(46),
//     height: ScaleSizeH(40),
//     top: ScaleSizeH(42),
//     left: ScaleSizeW(-10),
//     borderRadius: ScaleSizeR(ScaleSizeW(46), ScaleSizeH(40)),
//     // borderRadius: Math.sqrt(
//     //   Math.pow(ScaleSizeW(46), 2) + Math.pow(ScaleSizeH(40), 2),
//     // ),
//   },
//   DeleteText: {
//     fontFamily: 'iconfont',
//     position: 'relative',
//     top: ScaleSizeH(10),
//     right: ScaleSizeW(-13),
//     fontSize: SetSpText(60),
//   },
//   overlay: {
//     position: 'absolute',
//   },
//   language: {
//     width: Width,
//     height: Height,
//     position: 'absolute',
//   },
//   iconStyle: {
//     fontFamily: 'iconfont',
//     fontSize: SetSpText(85),
//     top: ScaleSizeH(1250),
//     left: ScaleSizeW(20),
//     width: ScaleSizeW(80),
//   },
//   Settingarea: {
//     position: 'absolute',
//     top: Height / 1.1,
//     left: 60,
//     flexDirection: 'row',
//   },
//   headerViewStyle: {
//     height: ScaleSizeH(125),
//     width: Width * 0.99,
//     backgroundColor: '#fffef4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 40,
//     backgroundColor:"black"
//   },
//   headerTextStyle: {
//     paddingTop: 10,
//     fontWeight: 'bold',
//     fontSize: 20,
//     color: '#FFFFFF',
//   },
//   scrollViewStyle: {
//     flex: 1,
//     height: Height * 0.7,
//     marginLeft: 10,
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   itemViewStyle: {
//     height: 80,
//     borderWidth: 5,
//     borderColor: '#d66e94',
//     borderRadius: 20,
//     backgroundColor: '#3c3c3c',
//     borderTopLeftRadius: 50,
//     borderBottomRightRadius: 50,
//     borderTopRightRadius: 50,
//     borderRightWidth: 0,
//     marginTop: 2,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   itemTextStyle: {
//     color: '#cccccc',
//     fontSize: 20,
//     marginLeft: 20,
//   },
//   container: {
//     flex: 1, // 填充满整个屏幕
//     alignItems: 'center',
//     // backgroundColor: "red"
//   },
//   mainLine: {
//     marginTop: 10,
//     height: Height * 0.1,
//     width: Width - 35,
//     flexDirection: 'row',
//   },
//   lineId: {
//     borderRadius: 10,
//     fontSize: 30,
//     backgroundColor: '#ffffff',
//     lineHeight: Height * 0.1,
//     alignSelf: 'center',
//     //paddingLeft: 20,
//     flexDirection: 'row',
//   },
//   HomeInputs: {
//     color: '#ffffff',
//     fontSize: SetSpText(65),
//     paddingTop: 5,
//     marginTop: 10,
//     backgroundColor: '#a4d1bb',
//     alignSelf: 'center',
//     textAlign: 'center',
//     height: ScaleSizeH(100),
//     width: Width * 0.9,
//     top: ScaleSizeH(90),
//     borderRadius: 15,
//   },
// });
import {blue} from 'chalk';
import React, {Component} from 'react';
import {Image} from 'react-native';
import {Toast} from 'teaset';
import {
  Button,
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Overlay,
} from 'react-native';
import {
  ScaleSizeH,
  ScaleSizeR,
  ScaleSizeW,
  SetSpText,
  ScaleSize,
} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import TheData from '../modal/TheData';
import { ScrollView } from 'react-native';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
//样式数据
const history = [
  {key: '0', url: 'http://www.baidu.com'},
  {key: '1', url: 'http://www.souhu.com'},
  {key: '2', url: 'http://www.souhu.com'},
];

class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QuickSelectIndex: 0,
      visible: false,
      FlatListIsRefreshing: false,
      isPing: false,
      refresh: false,
    };
    if (TheData.Ping == []) {
      TheData.Ping = [{key: 0, url: ''}];
      this.setState({refresh: !this.state.refresh});
    }
  }
  identify = true;

  _renderItem1 = ({item}) => {
    return (
      
      <View
        style={{
          marginBottom:ScaleSize(20),
          borderBottomWidth: ScaleSize(2),
          borderBottomColor: 'rgba(0,0,0,.1)',
          height: Height * 0.055,
          width: Width * 0.92,
          marginLeft: Width * 0.04,
        }}>
        <View
          style={{
            // paddingRight: ScaleSize(-20),
            marginRight: ScaleSize(0),
          }}>
          <TextInput
            defaultValue={TheData.Ping[parseInt(item.key)].url}
            onChangeText={(value) => {
              TheData.Ping[parseInt(item.key)].url = value;
              this.setState({refresh: !this.state.refresh});
              store.update(TheData.Ping[parseInt(item.key)].url, value);
              console.log(TheData.Ping);
            }}
            placeholder="请输入Ping的地址"
            style={{
              borderStyle: 'solid',
              marginTop: ScaleSize(1),
              marginLeft: ScaleSize(4),
              paddingRight: ScaleSize(35),
              width: ScaleSize(310),
              height:ScaleSize(50),
              // backgroundColor:"pink",
              borderRadius: 10,
              paddingBottom: ScaleSize(25),
              fontSize: SetSpText(30),
            }}></TextInput>
        </View>
        {/*第一个不包含删除按钮*/}
        {item.key != 0 ? (
          <View
            style={{
              position: 'absolute',
              right: ScaleSize(5),
              top: ScaleSize(20),
              marginRight: ScaleSize(0),
              marginTop: ScaleSize(-10),
            }}>
            <TouchableOpacity
              onPress={() => {
                TheData.Ping.splice(parseInt(item.key), 1);
                //可能会有问题 标记一下
                for (let i = 0; i < TheData.Ping.length; i++) {
                  TheData.Ping[i].key = i;
                }
                this.setState({refresh: !this.state.refresh});
                console.log(TheData.Ping);
              }}>
              <Text
                style={{
                  color: '#2a82e4',
                  fontSize: SetSpText(30),
                  position:"relative",
                  top:ScaleSize(-3),
                  right:ScaleSize(15),
                  z: 99,
                }}>
                删除
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
      </View>
      //<Text>{this.Data}</Text>
    );
  };

  _renderitem2 = ({item}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View>
          <Image
            source={require('../imgs/task.png')}
            style={{
              width: ScaleSize(30),
              height: ScaleSize(30),
              marginVertical: ScaleSize(5),
              marginHorizontal: ScaleSize(10),
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            let length = TheData.Ping.length;
            TheData.Ping = [
              ...TheData.Ping,
              {key: length, url: TheData.historyPing[item.key].url},
            ];
            this.setState({refresh: !this.state.refresh});
          }}>
          <View
            style={{
              width: ScaleSize(255),
              height: ScaleSize(34),
              justifyContent: 'center',
              borderBottomColor: '#919191',
              borderBottomWidth: 1,
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: '#919191',
                fontSize: SetSpText(35),
              }}>
              {item.url}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: ScaleSize(15),
            marginTop: ScaleSize(15),
          }}>
          <TouchableOpacity
            onPress={() => {
              TheData.historyPing.splice(parseInt(item.key), 1);

              for (let i = 0,j=TheData.historyPing.length; i < TheData.historyPing.length; i++,j--) {
                TheData.historyPing[i].key = j;
              }
              this.setState({refresh: !this.state.refresh});
              console.log(TheData.historyPing);
            }}>
            <Text
              style={{
                color: '#2a82e4',
                fontSize: SetSpText(25),
              }}>
              删除
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderRow(item) {
    return (
        <TouchableOpacity
            onPress={() => {
                // if (this.state.overlayOne) {
                //     if (this.state.url == '') {
                //         this.setState({url: item});
                //         this.setState({defaultvalueOne: item});
                //     } else {
                //         this.setState({url: this.state.url + item});
                //         this.setState({defaultvalueOne: this.state.defaultvalueOne + item});
                //     }
                // }
                // if (this.state.overlayTwo) {
                //     if (this.state.url2 == '') {
                //         this.setState({url2: item});
                //         this.setState({defaultvalueTwo: item});
                //     } else {
                //         this.setState({url2: this.state.url2 + item});
                //         this.setState({defaultvalueTwo: this.state.defaultvalueTwo + item});
                //     }
                // }
            }}
            style={{
              marginLeft:ScaleSize(7),
                flexDirection: 'row',
                marginTop:ScaleSize(4),
                height:Height * .045,
                backgroundColor:"#ffffff",
                borderRadius:ScaleSize(20)
            }}>
            <Text style={{borderRadius:ScaleSizeH(12), fontSize: SetSpText(40),  margin:ScaleSizeH(5),color:"#2a82e4",fontWeight:"550"}}>{item}</Text>
        </TouchableOpacity>
    );
}

  render() {
    if (this.state.isPing) {
      return;
    } else {
      return (
        <ScrollView style={{backgroundColor: '#ffffff', height:Height+10}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                width: ScaleSize(360),
                height: Height * 0.058,
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,.05)',
                marginTop:ScaleSize(20),
                
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: ScaleSize(15),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Ordinary');
                  }}>
                  <Text style={{position:"absolute",left:Width *0.13,top:ScaleSize(-10),fontSize:20,color:"#2a82e4"}}>
                  简洁模式
                  </Text>
                </TouchableOpacity> 

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Ordinary');
                  }}>
                  <Image source={require('../imgs/转换.png')} style={{height: ScaleSize(20),
                      width: ScaleSize(20),position:"absolute",left:Width *0.43,top:ScaleSize(-8)}}>
                  </Image>
                </TouchableOpacity> 

                  {/* // onPress={() => {
                  //   this.props.navigation.navigate('About', {
                  //     mainThis: this,
                  //   });
                  // }} */}
                  
                  {/* <Image
                    source={require('../imgs/转换.png')}
                    style={{
                      height: ScaleSize(20),
                      width: ScaleSize(20),
                    }}
                  /> */}


                <TouchableOpacity
                style={{position:"relative"}}
                  onPress={() => {
                    this.props.navigation.navigate('About');
                  }}>
                  <Text style={{position:"relative",left:Width *0.60,top:ScaleSize(-10),fontSize:SetSpText(33),color:"#666"}}>
                  专业模式
                  </Text>
                </TouchableOpacity> 
                {/* <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('About', {
                      mainThis: this,
                    });
                  }}>
                  <Image
                    source={require('../imgs/about.png')}
                    style={{
                      height: ScaleSize(20),
                      width: ScaleSize(20),
                    }}
                  />
                </TouchableOpacity> */}
              </View>
              {/* <View style={{marginLeft: Width * 0.38}}>
                <Text style={{fontSize: SetSpText(28), fontWeight: '500'}}>
                  GraphURLPing
                </Text>
              </View> */}
              {/* <View
                style={{
                  position: 'absolute',
                  right: ScaleSize(15),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('History');
                  }}>
                  <Image
                    source={require('../imgs/history.png')}
                    style={{
                      height: ScaleSize(25),
                      width: ScaleSize(25),
                    }}
                  />
                </TouchableOpacity>
              </View> */}
            </View>
            <View style={{borderBottomWidth:1,width:Width * .5,borderBottomColor:"#2a82e4"}}></View>
              <View style={{marginTop:ScaleSize(40)}}>
            <FlatList
              data={TheData.Ping}
              renderItem={this._renderItem1}
              refreshing={this.state.FlatListIsRefreshing}
              onRefresh={() => {
                this.setState((prevState) => ({FlatListIsRefreshing: true}));
                setTimeout(() => {
                  this.setState((prevState) => ({
                    FlatListIsRefreshing: false,
                  }));
                }, 1000);
              }}
            />
            </View>
            {/*console.log(TheData.Ping)*/}
            <View flexDirection="row">
              <TouchableOpacity
                onPress={() => {
                  if (TheData.Ping.length != 0) {
                    let key = TheData.Ping.length
                    TheData.Ping = [{ key: key, url: '' },...TheData.Ping];
                    for(let i=0;i<TheData.Ping.length;i++){
                      TheData.Ping[i].key=i
                    }
                    this.setState({ refresh: !this.state.refresh });
                    console.log("1")
                  } else {
                    TheData.Ping = [{key: 0, url: ''}];
                    this.setState({refresh: !this.state.refresh});
                    console.log('2');
                  }
                }}
                style={{
                  marginLeft: ScaleSize(15),
                  marginVertical: ScaleSize(10),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: ScaleSize(20),
                    marginBottom:ScaleSize(20)
                  }}>
                  <Image
                    source={require('../imgs/add4.png')}
                    style={{
                      height: ScaleSize(20),
                      width: ScaleSize(20),
                    }}
                  />
                  <Text
                    style={{
                      color: '#2a82e4',
                      fontSize: SetSpText(30),
                      paddingTop: ScaleSize(0),
                    }}>
                    添加
                  </Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => {
                  TheData.Ping.splice(0, TheData.Ping.length);
                  this.setState({ refresh: !this.state.refresh });
                }}>
                <Text
                  style={{
                    color: 'blue',
                    marginLeft: ScaleSize(265),
                    marginVertical: ScaleSize(10),
                    fontSize: SetSpText(25)
                  }}>
                  清空
                </Text>
              </TouchableOpacity> */}
            </View>

              <View style={{height:Height * .1}}>
              <FlatList
                style={{marginLeft:ScaleSizeH(4),marginRight:ScaleSizeH(4),marginBottom:ScaleSizeH(60),borderRadius:ScaleSize(13),backgroundColor:"#2a82e4"}}
                horizontal={true}
                data={TheData.urlsArr}
                renderItem={({item, index}) => this._renderRow(item, index)}
                keyExtractor={(item, index) => item + index}
                />
              </View>


            <View
              style={{
                marginHorizontal: ScaleSize(5),
                marginBottom: ScaleSize(10),
              }}>
              <TouchableOpacity
                onPress={() => {
                  for (let i = 0; i < TheData.Ping.length; i++) {
                    if (
                      TheData.Ping[i].url == 'https://' ||
                      TheData.Ping[i].url == ''
                    ) {
                      this.identify = false;
                      break;
                    } else {
                      this.identify = true;
                    }
                  }
                  if (this.identify) {
                    if (TheData.Ping.length != 0) {
                      //if (TheData.historyPing.length != 0) {
                      //TheData.historyPing = [];
                      //}
                      let Ping_length = TheData.Ping.length;
                      let History_length = TheData.historyPing.length;
                      for (
                        let i = 0, j = History_length;
                        i < Ping_length;
                        i++, j++
                      ) {
                        TheData.historyPing = [
                          ...TheData.historyPing,
                          {key: j, url: TheData.Ping[i].url},
                        ];
                      }
                      this.setState({ refresh: !this.state.refresh });
                      // console.log(TheData.historyPing);
                      this.props.navigation.navigate('Ping',{urlData:[...TheData.Ping]});
                    } else {
                      Toast.message('尚未添加需要Ping的网址!');
                    }
                    //TheData.Ping.splice(0, TheData.Ping.length);
                  } else {
                    Toast.message('输入网址不能有空!');
                  }
                }}
                style={{
                  marginHorizontal: ScaleSize(2),
                  alignItems: 'center',
                  marginTop: ScaleSize(5),
                  borderRadius: ScaleSize(10),
                  backgroundColor: '#2a82e4',
                  height: ScaleSize(42),
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: SetSpText(40), color: 'white',fontWeight:"600"}}>
                  Ping
                </Text>
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Setting', {
                  mainThis: this,
                });
              }}
              style={{
                marginTop: ScaleSize(5),
                marginHorizontal: ScaleSize(5),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'gray', fontSize: SetSpText(25)}}>
                参数设置
              </Text>
            </TouchableOpacity> */}
            {/* <View
              style={{
                height: Height * 0.0127,
                backgroundColor: '#e5e5e5',
                marginTop: ScaleSize(15),
              }}></View> */}
            {/* <View> */}
              {/* <View
                style={{
                  marginVertical: ScaleSize(10),
                  marginLeft: ScaleSize(15),
                }}>
                <Text style={{color: 'gray', fontSize: SetSpText(30)}}>
                  快捷输入
                </Text>
              </View>
              <View
                flexDirection="row"
                style={{
                  marginHorizontal: ScaleSize(15),
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onLongPress={() => {
                    this.setState({QuickSelectIndex: 0}, () => {
                      this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                      console.log(this.state.QuickSelectIndex);
                    });
                    this.overlay.show();
                  }}
                  onPress={() => {
                    if (
                      TheData.QuickSelect[0].name &&
                      TheData.QuickSelect[0].url != 'https://'
                    ) {
                      if (TheData.Ping.length != 0) {
                        let key = TheData.Ping[TheData.Ping.length - 1].key + 1;
                        TheData.Ping = [
                          { key: key, url: TheData.QuickSelect[0].url },
                          ...TheData.Ping,
                        ];
                        for(let i=0;i<TheData.Ping.length;i++){
                          TheData.Ping[i].key=i
                        }
                        this.setState({ refresh: !this.state.refresh });
                      } else {
                        TheData.Ping = [
                          { key: 0, url: TheData.QuickSelect[0].url },
                        ];
                        this.setState({refresh: !this.state.refresh});
                      }
                    } else {
                      this.setState({QuickSelectIndex: 0}, () => {
                        this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                        console.log(this.state.QuickSelectIndex);
                      });
                      TheData.QuickSelect[0].url = 'https://';
                      this.overlay.show();
                    }
                  }}
                  style={{
                    borderRadius: 20,
                    backgroundColor: '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ScaleSize(80),
                    height: ScaleSize(40),
                  }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}>
                    {TheData.QuickSelect[0].name
                      ? TheData.QuickSelect[0].name
                      : '✚'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onLongPress={() => {
                    this.setState({QuickSelectIndex: 1}, () => {
                      this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                      console.log(this.state.QuickSelectIndex);
                    });
                    this.overlay.show();
                  }}
                  onPress={() => {
                    if (
                      TheData.QuickSelect[1].name &&
                      TheData.QuickSelect[1].url
                    ) {
                      if (TheData.Ping.length != 0) {
                        let key = TheData.Ping[TheData.Ping.length - 1].key + 1;
                        TheData.Ping = [
                          { key: key, url: TheData.QuickSelect[1].url },
                          ...TheData.Ping,
                        ];
                        for(let i=0;i<TheData.Ping.length;i++){
                          TheData.Ping[i].key=i
                        }
                        this.setState({ refresh: !this.state.refresh });
                      } else {
                        TheData.Ping = [
                          { key: 0, url: TheData.QuickSelect[1].url },
                        ];
                        this.setState({refresh: !this.state.refresh});
                      }
                    } else {
                      this.setState({QuickSelectIndex: 1}, () => {
                        this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                        console.log(this.state.QuickSelectIndex);
                      });
                      TheData.QuickSelect[1].url = 'https://';
                      this.overlay.show();
                    }
                  }}
                  style={{
                    borderRadius: 20,
                    backgroundColor: '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ScaleSize(80),
                  }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}>
                    {TheData.QuickSelect[1].name
                      ? TheData.QuickSelect[1].name
                      : '✚'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onLongPress={() => {
                    this.setState({QuickSelectIndex: 2}, () => {
                      this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                      console.log(this.state.QuickSelectIndex);
                    });
                    this.overlay.show();
                  }}
                  onPress={() => {
                    if (
                      TheData.QuickSelect[2].name &&
                      TheData.QuickSelect[2].url
                    ) {
                      if (TheData.Ping.length != 0) {
                        let key = TheData.Ping[TheData.Ping.length - 1].key + 1;
                        TheData.Ping = [
                          { key: key, url: TheData.QuickSelect[2].url },
                          ...TheData.Ping,
                        ];
                        for(let i=0;i<TheData.Ping.length;i++){
                          TheData.Ping[i].key=i
                        }
                        this.setState({ refresh: !this.state.refresh });
                      } else {
                        TheData.Ping = [
                          { key: 0, url: TheData.QuickSelect[2].url },
                        ];
                        this.setState({refresh: !this.state.refresh});
                      }
                    } else {
                      this.setState({QuickSelectIndex: 2}, () => {
                        this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                        console.log(this.state.QuickSelectIndex);
                      });
                      TheData.QuickSelect[2].url = 'https://';
                      this.overlay.show();
                    }
                  }}
                  style={{
                    borderRadius: 20,
                    backgroundColor: '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ScaleSize(80),
                  }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}>
                    {TheData.QuickSelect[2].name
                      ? TheData.QuickSelect[2].name
                      : '✚'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: ScaleSize(15),
                  marginVertical: ScaleSize(20),
                }}>
                <TouchableOpacity
                  onLongPress={() => {
                    this.setState({QuickSelectIndex: 3}, () => {
                      this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                      console.log(this.state.QuickSelectIndex);
                    });
                    this.overlay.show();
                  }}
                  onPress={() => {
                    if (
                      TheData.QuickSelect[3].name &&
                      TheData.QuickSelect[3].url
                    ) {
                      if (TheData.Ping.length != 0) {
                        let key = TheData.Ping[TheData.Ping.length - 1].key + 1;
                        TheData.Ping = [
                          { key: key, url: TheData.QuickSelect[3].url },
                          ...TheData.Ping,
                        ];
                        for(let i=0;i<TheData.Ping.length;i++){
                          TheData.Ping[i].key=i
                        }
                        this.setState({ refresh: !this.state.refresh });
                      } else {
                        TheData.Ping = [
                          { key: 0, url: TheData.QuickSelect[3].url },
                        ];
                        this.setState({refresh: !this.state.refresh});
                      }
                    } else {
                      this.setState({QuickSelectIndex: 3}, () => {
                        this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                        console.log(this.state.QuickSelectIndex);
                      });
                      TheData.QuickSelect[3].url = 'https://';
                      this.overlay.show();
                    }
                  }}
                  style={{
                    borderRadius: 20,
                    backgroundColor: '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ScaleSize(80),
                    height: ScaleSize(40),
                  }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}>
                    {TheData.QuickSelect[3].name
                      ? TheData.QuickSelect[3].name
                      : '✚'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onLongPress={() => {
                    this.setState({QuickSelectIndex: 4}, () => {
                      this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                      console.log(this.state.QuickSelectIndex);
                    });
                    this.overlay.show();
                  }}
                  onPress={() => {
                    if (
                      TheData.QuickSelect[4].name &&
                      TheData.QuickSelect[4].url
                    ) {
                      if (TheData.Ping.length != 0) {
                        let key = TheData.Ping[TheData.Ping.length - 1].key + 1;
                        TheData.Ping = [
                          { key: key, url: TheData.QuickSelect[4].url },
                          ...TheData.Ping,
                        ];
                        for(let i=0;i<TheData.Ping.length;i++){
                          TheData.Ping[i].key=i
                        }
                        this.setState({ refresh: !this.state.refresh });
                      } else {
                        TheData.Ping = [
                          { key: 0, url: TheData.QuickSelect[4].url },
                        ];
                        this.setState({refresh: !this.state.refresh});
                      }
                    } else {
                      this.setState({QuickSelectIndex: 4}, () => {
                        this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                        console.log(this.state.QuickSelectIndex);
                      });
                      TheData.QuickSelect[4].url = 'https://';
                      this.overlay.show();
                    }
                  }}
                  style={{
                    borderRadius: 20,
                    backgroundColor: '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ScaleSize(80),
                  }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}>
                    {TheData.QuickSelect[4].name
                      ? TheData.QuickSelect[4].name
                      : '✚'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onLongPress={() => {
                    this.setState({QuickSelectIndex: 5}, () => {
                      this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                      console.log(this.state.QuickSelectIndex);
                    });
                    this.overlay.show();
                  }}
                  onPress={() => {
                    if (
                      TheData.QuickSelect[5].name &&
                      TheData.QuickSelect[5].url
                    ) {
                      if (TheData.Ping.length != 0) {
                        let key = TheData.Ping[TheData.Ping.length - 1].key + 1;
                        TheData.Ping = [
                          { key: key, url: TheData.QuickSelect[5].url },
                          ...TheData.Ping,
                        ];
                        for(let i=0;i<TheData.Ping.length;i++){
                          TheData.Ping[i].key=i
                        }
                        this.setState({ refresh: !this.state.refresh });
                      } else {
                        TheData.Ping = [
                          { key: 0, url: TheData.QuickSelect[5].url },
                        ];
                        this.setState({refresh: !this.state.refresh});
                      }
                    } else {
                      this.setState({QuickSelectIndex: 5}, () => {
                        this.state.QuickSelectIndex = this.state.QuickSelectIndex;
                        console.log(this.state.QuickSelectIndex);
                      });
                      TheData.QuickSelect[5].url = 'https://';
                      this.overlay.show();
                    }
                  }}
                  style={{
                    borderRadius: 20,
                    backgroundColor: '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ScaleSize(80),
                  }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}>
                    {TheData.QuickSelect[5].name
                      ? TheData.QuickSelect[5].name
                      : '✚'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: '#DDDDDD',
                  height: 1,
                }}>
                <Text></Text>
              </View>
              <View
                flexDirection="row"
                style={{
                  marginLeft: ScaleSizeW(20),
                  marginTop: ScaleSize(20),
                  marginBottom: ScaleSize(10),
                }}>
                <Text style={{color: 'gray', fontSize: SetSpText(30)}}>
                  历史记录
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    TheData.historyPing.splice(0, TheData.historyPing.length);
                    this.setState({refresh: !this.state.refresh});
                  }}
                  style={{marginLeft: ScaleSize(253)}}>
                  <Text style={{color: '#2a82e4', fontSize: SetSpText(25)}}>
                    清空
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  //height: ScaleSize(220),
                  borderBottomWidth: 1,
                  borderColor: '#C4C4C4',
                  borderStyle: 'solid',
                }}>
                <FlatList
                  onRefresh={() => {
                    this.setState((prevState) => ({
                      FlatListIsRefreshing: true,
                    }));
                    setTimeout(() => {
                      this.setState((prevState) => ({
                        FlatListIsRefreshing: false,
                      }));
                    }, 1000);
                  }}
                  refreshing={this.state.FlatListIsRefreshing}
                  renderItem={this._renderitem2}
                  data={TheData.historyPing}></FlatList>
              </View>
            </View> */}
          {/* </View> */}
          {/*快捷输入编辑框*/}
          {/* <Overlay
            ref={(ele) => (this.overlay = ele)}
            style={{justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                if (
                  TheData.QuickSelect[this.state.QuickSelectIndex].name &&
                  TheData.QuickSelect[this.state.QuickSelectIndex].url !=
                    'https://'
                ) {
                  this.overlay.close();
                } else {
                  TheData.QuickSelect[this.state.QuickSelectIndex] = {
                    key: this.state.QuickSelectIndex,
                    name: '',
                    url: 'https://',
                  };
                  this.overlay.close();
                  this.setState({refresh: !this.state.refresh});
                  console.log(TheData.QuickSelect[this.state.QuickSelectIndex]);
                }
              }}
              activeOpacity={1}
              style={{width: Width, height: Height, justifyContent: 'center'}}>
              <View
                style={{
                  height: ScaleSize(185),
                  paddingHorizontal: ScaleSize(10),
                  paddingTop: ScaleSize(20),
                  marginHorizontal: ScaleSize(20),
                  backgroundColor: 'white',
                  borderRadius: 10,
                  elevation: 20,
                  shadowColor: '#ddd',
                  shadowOpacity: 200,
                  shadowRadius: 5,
                }}>
                <TextInput
                  defaultValue={
                    TheData.QuickSelect[this.state.QuickSelectIndex].name
                  }
                  placeholder="请输入代名"
                  style={{
                    borderColor: '#C4C4C4',
                    borderStyle: 'solid',
                    borderBottomWidth: 1,
                    margin: ScaleSize(5),
                    fontSize: SetSpText(35),
                  }}
                  onChangeText={(text) => {
                    TheData.QuickSelect[
                      this.state.QuickSelectIndex
                    ].name = text;
                    store.save(
                      TheData.QuickSelect[this.state.QuickSelectIndex].name,
                      text,
                    );
                    console.log(TheData.QuickSelect);
                  }}></TextInput>
                <TextInput
                  defaultValue={
                    TheData.QuickSelect[this.state.QuickSelectIndex].url
                  }
                  placeholder="请输入网址"
                  style={{
                    borderColor: '#C4C4C4',
                    borderStyle: 'solid',
                    borderBottomWidth: 1,
                    margin: ScaleSize(5),
                    fontSize: SetSpText(35),
                  }}
                  onChangeText={(text) => {
                    TheData.QuickSelect[this.state.QuickSelectIndex].url = text;
                    store.save(
                      TheData.QuickSelect[this.state.QuickSelectIndex].url,
                      text,
                    );
                    console.log(TheData.QuickSelect);
                  }}></TextInput>
                <View flexDirection="row">
                  <View
                    style={{
                      marginBottom: ScaleSize(15),
                      marginTop: ScaleSize(10),
                    }}>
                    <TouchableOpacity
                      style={{
                        height: ScaleSize(40),
                        width: ScaleSize(145),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRightWidth: 1,
                        borderRightColor: '#C4C4C4',
                      }}
                      onPress={() => {
                        if (
                          TheData.QuickSelect[this.state.QuickSelectIndex]
                            .url &&
                          TheData.QuickSelect[this.state.QuickSelectIndex].name
                        ) {
                          this.overlay.close();
                          this.setState({refresh: !this.state.refresh});
                        } else {
                          Toast.message('输入名称或者URL不能为空！');
                        }
                      }}>
                      <Text style={{fontSize: SetSpText(30), color: '#2a82e4'}}>
                        确定
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginBottom: ScaleSize(15),
                      marginTop: ScaleSize(10),
                    }}>
                    <TouchableOpacity
                      style={{
                        height: ScaleSize(40),
                        width: ScaleSize(155),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        if (
                          TheData.QuickSelect[this.state.QuickSelectIndex]
                            .name &&
                          TheData.QuickSelect[this.state.QuickSelectIndex]
                            .url != 'https://'
                        ) {
                          this.overlay.close();
                        } else {
                          TheData.QuickSelect[this.state.QuickSelectIndex] = {
                            key: this.state.QuickSelectIndex,
                            name: '',
                            url: 'https://',
                          };
                          this.overlay.close();
                          this.setState({refresh: !this.state.refresh});
                          console.log(
                            TheData.QuickSelect[this.state.QuickSelectIndex],
                          );
                        }
                      }}>
                      <Text style={{fontSize: SetSpText(30), color: '#2a82e4'}}>
                        取消
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Overlay> */}
        </View>
        </ScrollView>
      );
    }
  }
}
export default My;
