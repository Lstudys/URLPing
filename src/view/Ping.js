import React, {Component} from 'react';
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
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

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
import TheData from '../modal/TheData';

import {
  ScaleSizeH,
  ScaleSizeR,
  ScaleSizeW,
  SetSpText,
  ScaleSize,
} from '../controller/Adaptation';

const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const Colors = [
  processColor('red'),
  processColor('#2a82e4'),
  processColor('green'),
  processColor('yellow'),
  processColor('purple'),
  processColor('pink'),
  processColor('black'),
  processColor('#b07219'),
  processColor('#666666'),
  processColor('#f67e1e'),
];

class Ping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['MAX','MIN', 'AVG', 'N95'],
      tableData: [
        ['2','1', '2', '3'],
        ['a','3', 'b', 'c'],
        ['1', '4','2', '3'],
        ['a', '3','b', 'c']
      ],

      refresh: false,
      chartHeight: 0,
      reqTime: 5, // 控制请求发送持续时间的state
      newReqTime: 0,
      url: '', // 用户输入的url
      url2: '',
      url3: '',
      url4: '',
      url5: '',
      url6: '',
      url7: '',
      url8: '',
      url9: '',
      url10: '',

      values: [],
      values2: [],
      values3: [],
      values4: [],
      values5: [],
      values6: [],
      values7: [],
      values8: [],
      values9: [],
      values10: [],

      urlDatafirst: [],
      urlDatasecond: [],
      urlDatathrid: [],
      urlDatafour: [],
      urlDatafive: [],

      colorIndex: 0,
      colorIndex2: 1,
      colorIndex3: 2,
      colorIndex4: 3,
      colorIndex5: 4,
      colorIndex6: 5,
      colorIndex7: 6,
      colorIndex8: 7,
      colorIndex9: 8,
      colorIndex10: 9,

      chartLabels: [],
     

      chart1: false,
      chart2: false,
      chart3: false,
      chart4: false,
      chart5: false,
      chart6: false,
      chart7: false,
      chart8: false,
      chart9: false,
      chart10: false,

      linechart: false, // 用来控制图表的显示,true表示显示输入框，不显示图表
      ifOverlayAble: true, // 用来控制是否可以设置请求时间，当正在Ping时不能设置
      isPing: true, // 控制是否正在ping
      chartToData: false,
      visible: false, // 删除后刷新历史记录
      selectedDomain: '',
      zoomDomain: '',

      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white'),
      },
      legend: {
        wordWrapEnabled: true,
      },
      chartDate: [{y: 0, x: 0}], // 只作为刷新页面用的state
      setting: false,
      secondDataHeight: 120, // 第二个图表数据style属性的bottom值

      ifTwoChartShow: true,
      FlatListIsRefreshing: false,
      checked: true,
      chartDisplay: false,
      urlsWitch: true, //刷新页面
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

    var pingLength = TheData.Ping.length;
    console.log('pingLength:', pingLength);

    this.setState({refresh: !this.state.refresh});

    //修改url的值
    const urlData = this.props.route.params.urlData;
    this.state.url = urlData[0].url;
    console.log(urlData.length);
    if (urlData.length > 1) {
      this.state.url2 = urlData[1].url;
      if (urlData.length > 2) {
        this.state.url3 = urlData[2].url;
        if (urlData.length > 3) {
          this.state.url4 = urlData[3].url;
          if (urlData.length > 4) {
            this.state.url5 = urlData[4].url;
            if (urlData.length > 5) {
              this.state.url6 = urlData[5].url;
              if (urlData.length > 6) {
                this.state.url7 = urlData[6].url;
                if (urlData.length > 7) {
                  this.state.url8 = urlData[7].url;
                  if (urlData.length > 8) {
                    this.state.url9 = urlData[8].url;
                    if (urlData.length > 9) {
                      this.state.url10 = urlData[9].url;
                    }
                  }
                }
              }
            }
          }
        }
      }
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

  maxTime3 = 0; // 最大时间
  minTime3 = ''; // 最小时间
  avgTime3 = 0; // 平均时间
  n953 = ''; // 95%的数据
  status3 = '';
  sumReqTime3 = []; // 所有请求时间的数组，用来计算标准差

  maxTime4 = 0; // 最大时间
  minTime4 = ''; // 最小时间
  avgTime4 = 0; // 平均时间
  n954 = ''; // 95%的数据
  status4 = '';
  sumReqTime4 = []; // 所有请求时间的数组，用来计算标准差

  maxTime5 = 0; // 最大时间
  minTime5 = ''; // 最小时间
  avgTime5 = 0; // 平均时间
  n955 = ''; // 95%的数据
  status5 = '';
  sumReqTime5 = []; // 所有请求时间的数组，用来计算标准差

  maxTime6 = 0; // 最大时间
  minTime6 = ''; // 最小时间
  avgTime6 = 0; // 平均时间
  n956 = ''; // 95%的数据
  status6 = '';
  sumReqTime6 = []; // 所有请求时间的数组，用来计算标准差

  maxTime7 = 0; // 最大时间
  minTime7 = ''; // 最小时间
  avgTime7 = 0; // 平均时间
  n957 = ''; // 95%的数据
  status7 = '';
  sumReqTime7 = []; // 所有请求时间的数组，用来计算标准差

  maxTime8 = 0; // 最大时间
  minTime8 = ''; // 最小时间
  avgTime8 = 0; // 平均时间
  n958 = ''; // 95%的数据
  status8 = '';
  sumReqTime8 = []; // 所有请求时间的数组，用来计算标准差

  maxTime9 = 0; // 最大时间
  minTime9 = ''; // 最小时间
  avgTime9 = 0; // 平均时间
  n959 = ''; // 95%的数据
  status9 = '';
  sumReqTime9 = []; // 所有请求时间的数组，用来计算标准差

  maxTime10 = 0; // 最大时间
  minTime10 = ''; // 最小时间
  avgTime10 = 0; // 平均时间
  n9510 = ''; // 95%的数据
  status10 = '';
  sumReqTime10 = []; // 所有请求时间的数组，用来计算标准差

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
    values2,
    values3,
    values4,
    values5,
    values6,
    values7,
    values8,
    values9,
    values10,

    colorIndex,
    colorIndex2,
    colorIndex3,
    colorIndex4,
    colorIndex5,
    colorIndex6,
    colorIndex7,
    colorIndex8,
    colorIndex9,
    colorIndex10,

    chartLabels,
    

    url,
    url2,
    url3,
    url4,
    url5,
    url6,
    url7,
    url8,
    url9,
    url10,
  ) {
    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != '' &&
      this.state.url4 != '' &&
      this.state.url5 != '' &&
      this.state.url6 != '' &&
      this.state.url7 != '' &&
      this.state.url8 != '' &&
      this.state.url9 != '' &&
      this.state.url10 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values4,
              label: url4,

              config: {
                drawValues: false,
                color: Colors[colorIndex4],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values5,
              label: url5,

              config: {
                drawValues: false,
                color: Colors[colorIndex5],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values6,
              label: url6,

              config: {
                drawValues: false,
                color: Colors[colorIndex6],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values7,
              label: url7,

              config: {
                drawValues: false,
                color: Colors[colorIndex7],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values8,
              label: url8,

              config: {
                drawValues: false,
                color: Colors[colorIndex8],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values9,
              label: url9,

              config: {
                drawValues: false,
                color: Colors[colorIndex9],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values10,
              label: url10,

              config: {
                drawValues: false,
                color: Colors[colorIndex10],
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

    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != '' &&
      this.state.url4 != '' &&
      this.state.url5 != '' &&
      this.state.url6 != '' &&
      this.state.url7 != '' &&
      this.state.url8 != '' &&
      this.state.url9 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values4,
              label: url4,

              config: {
                drawValues: false,
                color: Colors[colorIndex4],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values5,
              label: url5,

              config: {
                drawValues: false,
                color: Colors[colorIndex5],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values6,
              label: url6,

              config: {
                drawValues: false,
                color: Colors[colorIndex6],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values7,
              label: url7,

              config: {
                drawValues: false,
                color: Colors[colorIndex7],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values8,
              label: url8,

              config: {
                drawValues: false,
                color: Colors[colorIndex8],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values9,
              label: url9,

              config: {
                drawValues: false,
                color: Colors[colorIndex9],
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

    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != '' &&
      this.state.url4 != '' &&
      this.state.url5 != '' &&
      this.state.url6 != '' &&
      this.state.url7 != '' &&
      this.state.url8 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values4,
              label: url4,

              config: {
                drawValues: false,
                color: Colors[colorIndex4],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values5,
              label: url5,

              config: {
                drawValues: false,
                color: Colors[colorIndex5],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values6,
              label: url6,

              config: {
                drawValues: false,
                color: Colors[colorIndex6],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values7,
              label: url7,

              config: {
                drawValues: false,
                color: Colors[colorIndex7],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values8,
              label: url8,

              config: {
                drawValues: false,
                color: Colors[colorIndex8],
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

    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != '' &&
      this.state.url4 != '' &&
      this.state.url5 != '' &&
      this.state.url6 != '' &&
      this.state.url7 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values4,
              label: url4,

              config: {
                drawValues: false,
                color: Colors[colorIndex4],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values5,
              label: url5,

              config: {
                drawValues: false,
                color: Colors[colorIndex5],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values6,
              label: url6,

              config: {
                drawValues: false,
                color: Colors[colorIndex6],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values7,
              label: url7,

              config: {
                drawValues: false,
                color: Colors[colorIndex7],
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

    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != '' &&
      this.state.url4 != '' &&
      this.state.url5 != '' &&
      this.state.url6 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values4,
              label: url4,

              config: {
                drawValues: false,
                color: Colors[colorIndex4],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values5,
              label: url5,

              config: {
                drawValues: false,
                color: Colors[colorIndex5],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values6,
              label: url6,

              config: {
                drawValues: false,
                color: Colors[colorIndex6],
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

    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != '' &&
      this.state.url4 != '' &&
      this.state.url5 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values4,
              label: url4,

              config: {
                drawValues: false,
                color: Colors[colorIndex4],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values5,
              label: url5,

              config: {
                drawValues: false,
                color: Colors[colorIndex5],
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

    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != '' &&
      this.state.url4 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
                mode: 'LINEAR',
                drawCircles: false,
                lineWidth: 2,
              },
            },
            {
              values: values4,
              label: url4,

              config: {
                drawValues: false,
                color: Colors[colorIndex4],
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

    if (
      this.state.url != '' &&
      this.state.url2 != '' &&
      this.state.url3 != ''
    ) {
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
            {
              values: values3,
              label: url3,

              config: {
                drawValues: false,
                color: Colors[colorIndex3],
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
          drawGridLines: true,
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
          valueFormatter: chartLabels,
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

  render() {
    const state = this.state;
    if (
      this.state.url != '' ||
      this.state.url2 != '' ||
      this.state.url3 != '' ||
      this.state.url4 != '' ||
      this.state.url5 != '' ||
      this.state.url6 != '' ||
      this.state.url7 != '' ||
      this.state.url8 != '' ||
      this.state.url9 != '' ||
      this.state.url10 != ''
    ) {
      if (this.state.ifTwoChartShow) {
        const {
          values,
          values2,
          values3,
          values4,
          values5,
          values6,
          values7,
          values8,
          values9,
          values10,

          colorIndex,
          colorIndex2,
          colorIndex3,
          colorIndex4,
          colorIndex5,
          colorIndex6,
          colorIndex7,
          colorIndex8,
          colorIndex9,
          colorIndex10,

          chartLabels,
          

          url,
          url2,
          url3,
          url4,
          url5,
          url6,
          url7,
          url8,
          url9,
          url10,
        } = this.state;
        this.config = this.next(
          values,
          values2,
          values3,
          values4,
          values5,
          values6,
          values7,
          values8,
          values9,
          values10,

          colorIndex,
          colorIndex2,
          colorIndex3,
          colorIndex4,
          colorIndex5,
          colorIndex6,
          colorIndex7,
          colorIndex8,
          colorIndex9,
          colorIndex10,

          chartLabels,
      

          url,
          url2,
          url3,
          url4,
          url5,
          url6,
          url7,
          url8,
          url9,
          url10,
        );
      }
    }
    if (this.state.ifTwoChartShow) {
      this.ifSecondPing();
    }
    return (
      <View>
        <View
          style={{
            width: Width,
            height: Height * 0.07,
            backgroundColor: '#fff',
            borderBottomWidth: 2,
            borderBottomColor: '#2a82e4',
          }}>
          <TouchableOpacity
            style={{
              width: Width * 0.1,
              marginLeft: ScaleSize(5),
              height: Height * 0.055,
            }}
            onPress={() => {
              this.props.navigation.navigate('Ordinary');
              this.setState({
                isPing:false
              })
            }}>
            <Image
              source={require('../imgs/退.png')}
              style={{
                height: ScaleSize(20),
                width: ScaleSize(20),
                marginLeft: Width * 0.03,
                marginTop: ScaleSize(15),
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: Width * 0.41,
              color: '#2a82e4',
              marginTop: ScaleSize(-25),
              fontSize: SetSpText(35),
              paddingTop: ScaleSize(0),
            }}>
            {I18n.t('test')}...
          </Text>
        </View>
        <View style={styles.bottomStyle}>
          <ScrollView>
              <LineChart
                width={Width * 0.9}
                height={Height * 0.45}
                bottom={0}
                data={this.config.data}
                xAxis={this.config.xAxis}
                yAxis={{
                  left: {
                    enabled: true,
                  },
                  right: {
                    enabled: false,
                  },
                }}
                style={styles.container}
                marker={this.state.marker}
                legend={this.state.legend}
                chartDescription={{text: ''}}
                ref="chart"
              />
            </ScrollView>

            <View style={styles.container2}>
              <Table borderStyle={{borderWidth: 1,borderColor:"#323233"}}>
              <Row data={state.tableHead} flexArr={[1, 1, 1]} style={styles.head} textStyle={styles.textHead}/>               
                <TableWrapper style={styles.wrapper}>
                  <Rows data={state.tableData} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.textformat}/>
                </TableWrapper>
              </Table>
            </View>
 {/* <Rows data={state.tableData} textStyle={styles.text}/> */}

            
        </View>
      </View>
    );
  }
}

export default Ping;

const styles = StyleSheet.create({
  bottomChartDataThree: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(150),
    marginLeft: -52,
  },
  bottomChartDataFour: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(200),
    marginLeft: -52,
  },
  bottomChartDataFive: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(250),
    marginLeft: -52,
  },
  bottomChartDataSix: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(300),
    marginLeft: -52,
  },
  bottomChartDataSeven: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(350),
    marginLeft: -52,
  },
  bottomChartDataEight: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(400),
    marginLeft: -52,
  },
  bottomChartDataNine: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(450),
    marginLeft: -52,
  },
  bottomChartDataTen: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(500),
    marginLeft: -52,
  },
  bottomChartDataTwo: {
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(100),
    marginLeft: -52,
  },
  bottomChartDataOne: {
    width: Width,
    height: ScaleSizeH(50),
    position: 'absolute',
    top: ScaleSizeH(50),
    marginLeft: -52,
  },
  bottomChartDataItem: {
    flexDirection: 'row',
    position: 'relative',
    height: ScaleSizeH(200),
    width: Width,
    marginLeft: -52,
  },
  bottomChartData: {
    // width:ScaleSizeH(400),
    margin: 60,
    marginTop: 20,
    flexDirection: 'column',
    position: 'relative',
    height: Height * 0.5,
    // height: ScaleSize(27) * (TheData.Ping.length+1),
    backgroundColor: '#ffffff',
  },
  bottomStyle: {
    height: Height * 1.2,
    backgroundColor: '#ffffff',
  },
  container2: { flex: 1, marginBottom:Width*1.2,width:.9*Width,marginLeft:Width*.05 },
  head: {  height: 40,  backgroundColor: '#2a82e4'},
  wrapper: { flexDirection: 'row' },
  row: {  height: ScaleSize(30)  },
  textHead: { textAlign: 'center',color:"#ffffff",fontWeight:"bold",fontSize:ScaleSize(15) },
  textformat: { textAlign: 'center',color:"#2a82e4",fontWeight:"bold",fontSize:ScaleSize(14) }

});

//  <View style={styles.bottomChartData}>
              
//               borderBottomWidth:ScaleSize(2),borderBottomColor:"rgba(0,0,0,.3)",borderTopWidth:ScaleSize(2),borderTopColor:"rgba(0,0,0,.3)" */}
//               <View style={styles.bottomChartDataItem}>
//                 <Text
//                   style={{
//                     color: '#000',
//                     fontSize: SetSpText(35),
//                     left: ScaleSizeW(115),
//                     position: 'absolute',
//                     fontWeight: '300',
//                   }}>
//                   MAX
//                 </Text>
//                 <Text
//                   style={{
//                     color: '#000',
//                     fontSize: SetSpText(35),
//                     left: ScaleSizeW(265),
//                     position: 'absolute',
//                     fontWeight: '300',
//                   }}>
//                   MIN
//                 </Text>
//                 <Text
//                   style={{
//                     color: '#000',
//                     fontSize: SetSpText(35),
//                     left: ScaleSizeW(400),
//                     position: 'absolute',
//                     fontWeight: '300',
//                   }}>
//                   AVG
//                 </Text>
//                 <Text
//                   style={{
//                     color: '#000',
//                     fontSize: SetSpText(35),
//                     left: ScaleSizeW(540),
//                     position: 'absolute',
//                     fontWeight: '300',
//                   }}>
//                   N95
//                 </Text>
//               </View>
//               {this.state.chart1 ? (
//                 <View style={styles.bottomChartDataOne}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>

//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: 'red',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'red',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
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
//                       left: ScaleSizeW(540),
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
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: '#2a82e4',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime2}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#2a82e4',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime2}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#2a82e4',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime2.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#2a82e4',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n952 ? `${this.n952.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart3 ? (
//                 <View style={styles.bottomChartDataThree}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime3}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime3}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime3.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'green',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n953 ? `${this.n953.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart4 ? (
//                 <View style={styles.bottomChartDataFour}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: 'yellow',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime4}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'yellow',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime4}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'yellow',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime4.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'yellow',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n954 ? `${this.n954.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart5 ? (
//                 <View style={styles.bottomChartDataFive}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: 'purple',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime5}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'purple',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime5}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'purple',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime5.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'purple',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n955 ? `${this.n955.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart6 ? (
//                 <View style={styles.bottomChartDataSix}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: 'pink',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime6}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'pink',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime6}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'pink',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime6.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'pink',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n956 ? `${this.n956.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart7 ? (
//                 <View style={styles.bottomChartDataSeven}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: 'black',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime7}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'black',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime7}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'black',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime7.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: 'black',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n957 ? `${this.n957.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart8 ? (
//                 <View style={styles.bottomChartDataEight}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: '#b07219',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime8}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#b07219',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime8}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#b07219',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime8.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#b07219',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n958 ? `${this.n958.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart9 ? (
//                 <View style={styles.bottomChartDataNine}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: '#666666',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime9}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#666666',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime9}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#666666',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime9.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#666666',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n959 ? `${this.n959.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {this.state.chart10 ? (
//                 <View style={styles.bottomChartDataTen}>
//                   <View
//                     style={{
//                       width: Width * 0.66,
//                       borderBottomColor: '#000',
//                       borderBottomWidth: ScaleSize(1.3),
//                       position: 'absolute',
//                       left: ScaleSizeW(115),
//                       top: ScaleSizeW(52),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(235),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(375),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>
//                   <View
//                     style={{
//                       height: ScaleSizeW(30),
//                       borderLeftWidth: ScaleSize(2),
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(510),
//                       position: 'absolute',
//                       width: ScaleSize(2),
//                       top: ScaleSizeW(10),
//                     }}></View>

//                   <Text
//                     style={{
//                       color: '#f67e1e',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(115),
//                       position: 'absolute',
//                     }}>
//                     {this.maxTime10}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#f67e1e',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(265),
//                       position: 'absolute',
//                     }}>
//                     {this.minTime10}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#f67e1e',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(400),
//                       position: 'absolute',
//                     }}>
//                     {this.avgTime10.toFixed(0)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: '#f67e1e',
//                       fontSize: SetSpText(35),
//                       left: ScaleSizeW(540),
//                       position: 'absolute',
//                     }}>
//                     {this.n9510 ? `${this.n9510.toFixed(0)}` : ''}
//                   </Text>
//                 </View>
//               ) : (
//                 <View />
//               )}
//               {/* <View style={{borderBottomWidth:ScaleSize(2),marginTop:ScaleSize(-25),borderBottomColor:"#",borderTopWidth:ScaleSize(2),borderTopColor:"#2a82e4"}}></View> */}
//             </View> */}