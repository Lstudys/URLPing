import React,{Component} from 'react';
import {Toast} from 'teaset';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  processColor,
  RefreshControl,
  TouchableHighlight,
  FlatList,
  Image,
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



class Ping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqTime: 5, // 控制请求发送持续时间的state
            newReqTime: 0,
            url: '', // 用户输入的url
            url2: '',
            linechart: false, // 用来控制图表的显示,true表示显示输入框，不显示图表
            ifOverlayAble: true, // 用来控制是否可以设置请求时间，当正在Ping时不能设置
            isPing: true, // 控制是否正在ping
            chartToData: false,
            visible: false, // 删除后刷新历史记录
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
            urlsWitch: true, //刷新页面
            urlNumber:0,
            url2Number:0,
            urlfor:false,
            url2for:false,
            minXtime:[10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000],
            minXtimeData:['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']
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
        
        //修改url的值
        const urlData = this.props.route.params.urlData;
        this.state.url = urlData[0].url;
        console.log(urlData.length);
        if(urlData.length>1){
          this.state.url2 = urlData[1].url;
        }
    
        SendRequest.bind(this)();
      }



        pressnum = 0; // 表示安卓手机返回键按压次数，以控制返回上一界面
        firstpress = 0; // 第一次按返回键的时间戟
        maxTime = 0; // 最大时间
        minTime = ''; // 最小时间
        avgTime = 0; // 平均时间
        n95 = ''; // 95%的数据
        status1 = '';
        sumReqTime = []; // 所有请求时间的数组，用来计算标准差
        /**
         * 下面是第二个图表的数据
         */
        maxTime2 = 0; // 最大时间
        minTime2 = ''; // 最小时间
        avgTime2 = 0; // 平均时间
        n952 = ''; // 95%的数据
        status2 = '';
        sumReqTime2 = []; // 所有请求时间的数组，用来计算标准差

        config = {};


        componentDidMount() {
          BackHandler.addEventListener('hardwareBackPress', BackAction.bind(this));
          /* 选择合适语言 */
        }
        componentWillUnmount() {
          BackHandler.removeEventListener('hardwareBackPress', BackAction.bind(this));
        }




    next(
        values,
        colorIndex,
        chartLabels,
        url,
        url2,
        values2,
        colorIndex2,
        chartLabels2,
        ) {
        if (this.state.url != '' && this.state.url2 != '') {
            return {
            data: {
                dataSets: [
                {
                    values: values,
                    label: url,

                    config: {
                    drawValues: false,
                    color: Colors[colorIndex],
                    mode: 'LINEAR',
                    drawCircles: false,
                    lineWidth: 2,
                    },
                },
                {
                    values: values2,
                    label: url2,

                    config: {
                    drawValues: false,
                    color: Colors[colorIndex2],
                    mode: 'LINEAR',
                    drawCircles: false,
                    lineWidth: 2,
                    },
                },
                ],
            },
            xAxis: {
                valueFormatter: chartLabels,
                axisLineWidth: 0,
                drawLabels: true,
                position: 'BOTTOM',
                drawGridLines: false,
            },
            };
        }
        if (this.state.url != '') {
            return {
            data: {
                dataSets: [
                {
                    values: values,
                    label: url,

                    config: {
                    drawValues: false,
                    color: Colors[colorIndex],
                    mode: 'LINEAR',
                    drawCircles: false,
                    lineWidth: 2,
                    },
                },
                ],
            },
            xAxis: {
                valueFormatter: chartLabels,
                axisLineWidth: 0,
                drawLabels: true,
                position: 'BOTTOM',
                drawGridLines: false,
            },
            };
        }
        if (this.state.url2 != '') {
            return {
            data: {
                dataSets: [
                {
                    values: values2,
                    label: url2,

                    config: {
                    drawValues: false,
                    color: Colors[colorIndex2],
                    mode: 'LINEAR',
                    drawCircles: false,
                    lineWidth: 2,
                    },
                },
                ],
            },
            xAxis: {
                valueFormatter: chartLabels2,
                axisLineWidth: 0,
                drawLabels: true,
                position: 'BOTTOM',
                drawGridLines: false,
            },
            };
        }
        }


        ifSecondPing = () => {
            if (this.state.url == '') {
              this.state.secondDataHeight = 140;
            } else {
              this.state.secondDataHeight = 220;
            }
          };


    render(){
        
      if (this.state.url != '' || this.state.url2 != '') {
        if (this.state.ifTwoChartShow) {
            const {values, colorIndex, chartLabels, url, values2, url2, colorIndex2, chartLabels2} = this.state;
            this.config = this.next(values, colorIndex, chartLabels, url, url2, values2, colorIndex2, chartLabels2);
        }
    }
    if (this.state.ifTwoChartShow) {
        this.ifSecondPing();
    }
        return(
          <View style={styles.bottomStyle}>
          <ScrollView>
            {true ? (
                  <LineChart width={Width} height={Height * 0.9}  bottom={0} data={this.config.data} xAxis={this.config.xAxis} yAxis={{
                    left: {
                      enabled: true,
                    },
                    right: {
                      enabled: false,
                    },
                  }} style={styles.container} marker={this.state.marker}
                      chartDescription={{text:''}} ref="chart" />
              ) : (
                  <View />
              )}
              <View style = {[styles.bottomChartData, {marginBottom: 0}]}>
                  <View style = {styles.bottomChartDataItem}>
                      <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(40), position: 'absolute'}}>MAX</Text>
                      <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(220), position: 'absolute'}}>MIN</Text>
                      <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(400), position: 'absolute'}}>AVG</Text>
                      <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(580), position: 'absolute'}}>N95</Text>
                  </View>
                  {   this.state.chart1 ?   <View style={styles.bottomChartDataOne}>
                      <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime}</Text>
                      <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime}</Text>
                      <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime.toFixed(0)}</Text>
                      <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n95 ? `${this.n95.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                  {   this.state.chart2 ?        <View style={styles.bottomChartDataTwo}>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(40), position: 'absolute'}}>{this.maxTime2}</Text>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime2}</Text>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>
                          {this.avgTime2.toFixed(0)}</Text>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n952 ? `${this.n952.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
              </View>
          </ScrollView>
      </View>
        )
    }
}

export default Ping;








const styles = StyleSheet.create({
  bottomChartDataTwo: {
    width: Width,
    height: ScaleSizeH(70),
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
    height: Height * 1.2,
    backgroundColor: '#ffffff',
  },
});