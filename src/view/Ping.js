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
  processColor('black'),
  processColor('#b07219'),
  processColor('#666666'),
  processColor('#f67e1e'),
];



class Ping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqTime: 5, // 控制请求发送持续时间的state
            newReqTime: 0,
            url: '', // 用户输入的url
            url2: '',
            url3:'',
            url4:'',
            url5:'',
            url6:'',
            url7:'',
            url8:'',
            url9:'',
            url10:'',

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
            chartLabels2: [],
            chartLabels3: [],
            chartLabels4: [],
            chartLabels5: [],
            chartLabels6: [],
            chartLabels7: [],
            chartLabels8: [],
            chartLabels9: [],
            chartLabels10: [],

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
        
        //修改url的值
        const urlData = this.props.route.params.urlData;
        this.state.url = urlData[0].url;
        console.log(urlData.length);
        if(urlData.length>1){
          this.state.url2 = urlData[1].url;
          if(urlData.length>2){
            this.state.url3 = urlData[2].url;
            if(urlData.length>3){
              this.state.url4 = urlData[3].url;
              if(urlData.length>4){
                this.state.url5 = urlData[4].url;
                if(urlData.length>5){
                  this.state.url6 = urlData[5].url;
                  if(urlData.length>6){
                    this.state.url7 = urlData[6].url;
                    if(urlData.length>7){
                      this.state.url8 = urlData[7].url;
                      if(urlData.length>8){
                        this.state.url9 = urlData[8].url;
                        if(urlData.length>9){
                          this.state.url10 = urlData[9].url;
                          
            }
          }
        }
      }}}}}}
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
        chartLabels2,
        chartLabels3,
        chartLabels4,
        chartLabels5,
        chartLabels6,
        chartLabels7,
        chartLabels8,
        chartLabels9,
        chartLabels10,

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
          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != ''&& this.state.url4 != ''&& this.state.url5 != ''&& this.state.url6 != ''&& this.state.url7 != ''&& this.state.url8 != ''&& this.state.url9 != ''&& this.state.url10 != '') {
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

          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != ''&& this.state.url4 != ''&& this.state.url5 != ''&& this.state.url6 != ''&& this.state.url7 != ''&& this.state.url8 != ''&& this.state.url9 != '') {
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

          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != ''&& this.state.url4 != ''&& this.state.url5 != ''&& this.state.url6 != ''&& this.state.url7 != ''&& this.state.url8 != '') {
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

          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != ''&& this.state.url4 != ''&& this.state.url5 != ''&& this.state.url6 != ''&& this.state.url7 != '') {
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

          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != ''&& this.state.url4 != ''&& this.state.url5 != ''&& this.state.url6 != '') {
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


          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != ''&& this.state.url4 != ''&& this.state.url5 != '') {
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

          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != ''&& this.state.url4 != '') {
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

          if (this.state.url != '' && this.state.url2 != '' && this.state.url3 != '') {
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
        
      if (this.state.url != '' || this.state.url2 != '' || this.state.url3 != ''||this.state.url4 != '' || this.state.url5 != '' || this.state.url6 != ''||this.state.url7 != '' || this.state.url8 != '' || this.state.url9 != ''||this.state.url10 != '' ) {
        if (this.state.ifTwoChartShow) {
            const {values,
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
              chartLabels2,
              chartLabels3,
              chartLabels4,
              chartLabels5,
              chartLabels6,
              chartLabels7,
              chartLabels8,
              chartLabels9,
              chartLabels10,
      
              url,
              url2,
              url3,
              url4,
              url5,
              url6,
              url7,
              url8,
              url9,
              url10,} = this.state;
            this.config = this.next(values,
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
              chartLabels2,
              chartLabels3,
              chartLabels4,
              chartLabels5,
              chartLabels6,
              chartLabels7,
              chartLabels8,
              chartLabels9,
              chartLabels10,
      
              url,
              url2,
              url3,
              url4,
              url5,
              url6,
              url7,
              url8,
              url9,
              url10,);
        }
    }
    if (this.state.ifTwoChartShow) {
        this.ifSecondPing();
    }
        return(
          <View style={styles.bottomStyle}>
          <ScrollView>
            {true ? (
                  <LineChart width={Width} height={Height * 0.5}  bottom={0} data={this.config.data} xAxis={this.config.xAxis} yAxis={{
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
                      <Text style={{color:'blue', fontSize:SetSpText(35), left:ScaleSizeW(40), position: 'absolute'}}>{this.maxTime2}</Text>
                      <Text style={{color:'blue', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime2}</Text>
                      <Text style={{color:'blue', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>
                          {this.avgTime2.toFixed(0)}</Text>
                      <Text style={{color:'blue', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n952 ? `${this.n952.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                      {   this.state.chart3 ?        <View style={styles.bottomChartDataThree}>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(40), position: 'absolute'}}>{this.maxTime3}</Text>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime3}</Text>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>
                          {this.avgTime3.toFixed(0)}</Text>
                      <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n953 ? `${this.n953.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                  {   this.state.chart4 ?   <View style={styles.bottomChartDataFour}>
                      <Text style={{color:'yellow', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime4}</Text>
                      <Text style={{color:'yellow', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime4}</Text>
                      <Text style={{color:'yellow', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime4.toFixed(0)}</Text>
                      <Text style={{color:'yellow', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n954 ? `${this.n954.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                      {   this.state.chart5 ?   <View style={styles.bottomChartDataFive}>
                      <Text style={{color:'purple', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime5}</Text>
                      <Text style={{color:'purple', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime5}</Text>
                      <Text style={{color:'purple', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime5.toFixed(0)}</Text>
                      <Text style={{color:'purple', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n955 ? `${this.n955.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                      {   this.state.chart6 ?   <View style={styles.bottomChartDataSix}>
                      <Text style={{color:'pink', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime6}</Text>
                      <Text style={{color:'pink', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime6}</Text>
                      <Text style={{color:'pink', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime6.toFixed(0)}</Text>
                      <Text style={{color:'pink', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n956 ? `${this.n956.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                      {   this.state.chart7 ?   <View style={styles.bottomChartDataSeven}>
                      <Text style={{color:'black', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime7}</Text>
                      <Text style={{color:'black', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime7}</Text>
                      <Text style={{color:'black', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime7.toFixed(0)}</Text>
                      <Text style={{color:'black', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n957 ? `${this.n957.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                      {   this.state.chart8 ?   <View style={styles.bottomChartDataEight}>
                      <Text style={{color:'#b07219', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime8}</Text>
                      <Text style={{color:'#b07219', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime8}</Text>
                      <Text style={{color:'#b07219', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime8.toFixed(0)}</Text>
                      <Text style={{color:'#b07219', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n958 ? `${this.n958.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                      {   this.state.chart9 ?   <View style={styles.bottomChartDataNine}>
                      <Text style={{color:'#666666', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime9}</Text>
                      <Text style={{color:'#666666', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime9}</Text>
                      <Text style={{color:'#666666', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime9.toFixed(0)}</Text>
                      <Text style={{color:'#666666', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n959 ? `${this.n959.toFixed(0)}` : ''}</Text>
                  </View>
                      : <View/>  }
                      {   this.state.chart10 ?   <View style={styles.bottomChartDataTen}>
                      <Text style={{color:'#f67e1e', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime10}</Text>
                      <Text style={{color:'#f67e1e', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime10}</Text>
                      <Text style={{color:'#f67e1e', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime10.toFixed(0)}</Text>
                      <Text style={{color:'#f67e1e', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                          {this.n9510 ? `${this.n9510.toFixed(0)}` : ''}</Text>
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
  bottomChartDataThree:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(150),
  },
  bottomChartDataFour:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(200),
  },
  bottomChartDataFive:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(250),
  },
  bottomChartDataSix:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(300),
  },
  bottomChartDataSeven:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(350),
  },
  bottomChartDataEight:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(400),
  },
  bottomChartDataNine:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(450),
  },
  bottomChartDataTen:{
    width: Width,
    height: ScaleSizeH(70),
    position: 'absolute',
    top: ScaleSizeH(500),
  },
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
    height: Height * 0.45,
  },
  bottomStyle: {
    height: Height * 1.2,
    backgroundColor: '#ffffff',
  },
});