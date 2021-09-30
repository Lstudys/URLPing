import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  processColor,
  Image,
} from 'react-native';
import {BackHandler} from 'react-native';
import {SendRequest} from '../controller/request';
import {LineChart} from 'react-native-charts-wrapper';
import {Table, Row} from 'react-native-table-component';
import {getIpAddressesForHostname} from 'react-native-dns-lookup';

import {BackAction} from '../controller/AppPageFunction';
import I18n from 'i18n-js';
import TheData from '../modal/TheData';
import {LanguageChange} from '../component/LanguageChange';

import {
  ScaleSizeH,
  ScaleSizeR,
  ScaleSizeW,
  SetSpText,
  ScaleSize,
} from '../controller/Adaptation';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const Colors = [
  processColor('red'),
  processColor('#2a82e4'),
  processColor('green'),
  processColor('#f67e1e'),
  processColor('purple'),
];
var a = '123';
const textColors = ['red', '#2a82e4', 'green', '#f67e1e', 'purple'];
class Ping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['MAX', 'MIN', 'AVG', 'N95'],
      refresh: false,
      chartHeight: 0,
      reqTime: 5, // 控制请求发送持续时间的state
      newReqTime: 0,
      url: '', // 用户输入的url
      url2: '',
      url3: '',
      url4: '',
      url5: '',

      values: [],
      values2: [],
      values3: [],
      values4: [],
      values5: [],

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

      chartLabels: [],

      chart1: false,
      chart2: false,
      chart3: false,
      chart4: false,
      chart5: false,

      isPing: true, // 控制是否正在ping

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
      secondDataHeight: 120, // 第二个图表数据style属性的bottom值

      ifTwoChartShow: true,
      FlatListIsRefreshing: false,
      checked: true,
      chartDisplay: false,
      urlsWitch: true, //刷新页面
    };

    LanguageChange.bind(this)();

    this.setState({refresh: !this.state.refresh});

    //修改url的值
    var urlData = this.props.route.params.urlData;
    this.state.url = urlData[0].url;
    if (urlData.length > 1) {
      this.state.url2 = urlData[1].url;
      if (urlData.length > 2) {
        this.state.url3 = urlData[2].url;
        if (urlData.length > 3) {
          this.state.url4 = urlData[3].url;
          if (urlData.length > 4) {
            this.state.url5 = urlData[4].url;
          }
        }
      }
    }
    for (let i = 0; i < urlData.length; i++) {
      let str = '';
      for (let j = 0; j < urlData[i].url.length; j++) {
        if (urlData[i].url[j] == 'w') {
          str = urlData[i].url.substring(j);
          getIpAddressesForHostname(str).then((ipAddresses) => {
            switch (i) {
              case 0:
                TheData.IP1 = ipAddresses;
                break;
              case 1:
                TheData.IP2 = ipAddresses;
                break;
              case 2:
                TheData.IP3 = ipAddresses;
                break;
              case 3:
                TheData.IP4 = ipAddresses;
                break;
              case 4:
                TheData.IP5 = ipAddresses;
                break;
            }
          });

          break;
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

  config = {};

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', BackAction.bind(this));

    /* 选择合适语言 */
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', BackAction.bind(this));
  }

  // `${this.state.url}(${TheData.IP1})`
  next(
    values,
    values2,
    values3,
    values4,
    values5,

    colorIndex,
    colorIndex2,
    colorIndex3,
    colorIndex4,
    colorIndex5,

    chartLabels,

    url,
    url2,
    url3,
    url4,
    url5,
  ) {
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
              label: `${this.state.url}(${TheData.IP1})`,

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
              label: `${this.state.url2}(${TheData.IP2})`,

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
              label: `${this.state.url3}(${TheData.IP3})`,

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
              label: `${this.state.url4}(${TheData.IP4})`,

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
              label: `${this.state.url5}(${TheData.IP5})`,

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
              label: `${this.state.url}(${TheData.IP1})`,

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
              label: `${this.state.url2}(${TheData.IP2})`,

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
              label: `${this.state.url3}(${TheData.IP3})`,

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
              label: `${this.state.url4}(${TheData.IP4})`,

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
              label: `${this.state.url}(${TheData.IP1})`,

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
              label: `${this.state.url2}(${TheData.IP2})`,

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
              label: `${this.state.url3}(${TheData.IP3})`,

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
              label: `${this.state.url}(${TheData.IP1})`,

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
              label: `${this.state.url2}(${TheData.IP2})`,

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
              label: `${this.state.url}(${TheData.IP1})`,

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
  }

  ifSecondPing = () => {
    if (this.state.url == '') {
      this.state.secondDataHeight = 140;
    } else {
      this.state.secondDataHeight = 220;
    }
  };

  render() {
    const urlArr = [
      this.state.url,
      this.state.url2,
      this.state.url3,
      this.state.url4,
      this.state.url5,
    ];
    const tableDataArr = [
      [
        this.maxTime,
        this.minTime,
        Math.round(this.avgTime),
        Math.round(this.n95),
      ],
      [
        this.maxTime2,
        this.minTime2,
        Math.round(this.avgTime2),
        Math.round(this.n952),
      ],
      [
        this.maxTime3,
        this.minTime3,
        Math.round(this.avgTime3),
        Math.round(this.n953),
      ],
      [
        this.maxTime4,
        this.minTime4,
        Math.round(this.avgTime4),
        Math.round(this.n954),
      ],
      [
        this.maxTime5,
        this.minTime5,
        Math.round(this.avgTime5),
        Math.round(this.n955),
      ],
    ];

    if (urlArr[0] != '') {
      var tableData = [tableDataArr[0]];

      if (urlArr[1] != '') {
        tableData = [tableDataArr[0], tableDataArr[1]];
        if (urlArr[2] != '') {
          tableData = [tableDataArr[0], tableDataArr[1], tableDataArr[2]];
          if (urlArr[3] != '') {
            tableData = [
              tableDataArr[0],
              tableDataArr[1],
              tableDataArr[2],
              tableDataArr[3],
            ];
            if (urlArr[4] != '') {
              tableData = [
                tableDataArr[0],
                tableDataArr[1],
                tableDataArr[2],
                tableDataArr[3],
                tableDataArr[4],
              ];
            }
          }
        }
      }
    }

    if (!this.state.isPing) {
      tableData = [].concat(tableData);
    }

    const state = this.state;
    if (
      this.state.url != '' ||
      this.state.url2 != '' ||
      this.state.url3 != '' ||
      this.state.url4 != '' ||
      this.state.url5 != ''
    ) {
      const {
        values,
        values2,
        values3,
        values4,
        values5,

        colorIndex,
        colorIndex2,
        colorIndex3,
        colorIndex4,
        colorIndex5,

        chartLabels,

        url,
        url2,
        url3,
        url4,
        url5,
      } = this.state;
      this.config = this.next(
        values,
        values2,
        values3,
        values4,
        values5,

        colorIndex,
        colorIndex2,
        colorIndex3,
        colorIndex4,
        colorIndex5,

        chartLabels,

        url,
        url2,
        url3,
        url4,
        url5,
      );
      // if (!this.state.isPing) {
      //   this.config = this.config;
      // }
    }

    return (
      <View>
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.backbutton}
            onPress={() => {
              this.props.navigation.navigate('Ordinary');
              this.setState({
                isPing: false,
              });
              TheData.IP1 = '';
              TheData.IP2 = '';
              TheData.IP3 = '';
              TheData.IP4 = '';
              TheData.IP5 = '';
            }}>
            <Image source={require('../imgs/back.png')} style={styles.back} />
          </TouchableOpacity>
          <Text style={styles.test}>{I18n.t('test')}...</Text>
        </View>
        <View
          style={{
            backgroundColor: '#fefefe',
          }}>
          <Text
            style={{
              opacity: 0.7,
              marginTop: ScaleSize(5),
              marginLeft: ScaleSize(3),
            }}>
            (ms)
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
              marker={this.state.marker}
              legend={this.state.legend}
              chartDescription={{text: ''}}
              ref="chart"
            />
          </ScrollView>

          <View style={styles.table}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#323233'}}>
              <Row
                data={state.tableHead}
                flexArr={[1, 1, 1]}
                style={styles.head}
                textStyle={styles.textHead}
              />
            </Table>
            <Table borderStyle={{borderWidth: 1, borderColor: '#323233'}}>
              {tableData.map((tableData, index) => {
                return (
                  <Row
                    key={index}
                    data={tableData}
                    //flexArr={[1, 1, 1]}
                    style={styles.row}
                    //只需要找到key值判断一下可以了
                    textStyle={
                      index == 0
                        ? styles.textformat
                        : index == 1
                        ? styles.textformat2
                        : index == 2
                        ? styles.textformat3
                        : index == 3
                        ? styles.textformat4
                        : index == 4
                        ? styles.textformat5
                        : {}
                    }
                  />
                );
              })}
            </Table>
          </View>

          <View style={styles.stopwhole}>
            <TouchableOpacity
              style={styles.stopbutton}
              onPress={() => {
                //这里写函数stop
                this.setState({
                  isPing: false,
                });
              }}>
              {/* 这里要把纯中文改一下 */}
              <Text style={styles.stoptext}>停止测试</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Ping;

const styles = StyleSheet.create({
  bottomStyle: {
    height: Height * 1.2,
    backgroundColor: '#ffffff',
  },
  table: {
    flex: 1,
    marginBottom: Width * 1.45,
    width: 0.9 * Width,
    marginLeft: Width * 0.05,
  },
  head: {height: 40, backgroundColor: '#2a82e4'},
  wrapper: {flexDirection: 'row'},
  row: {height: ScaleSize(30)},
  textHead: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: ScaleSize(15),
  },
  textformat: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ScaleSize(14),
    color: textColors[0],
  },
  textformat2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ScaleSize(14),
    color: textColors[1],
  },
  textformat3: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ScaleSize(14),
    color: textColors[2],
  },
  textformat4: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ScaleSize(14),
    color: textColors[3],
  },
  textformat5: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ScaleSize(14),
    color: textColors[4],
  },
  navigation: {
    width: Width,
    height: Height * 0.07,
    backgroundColor: '#fff',
    borderBottomWidth: 1.3,
    borderBottomColor: '#2a82e4',
  },

  backbutton: {
    width: Width * 0.1,
    marginLeft: ScaleSize(5),
    height: Height * 0.055,
  },
  back: {
    height: ScaleSize(30),
    width: ScaleSize(30),
    marginLeft: Width * 0.03,
    marginTop: ScaleSize(12),
  },
  test: {
    marginLeft: Width * 0.41,
    color: '#2a82e4',
    marginTop: ScaleSize(-25),
    fontSize: SetSpText(38),
    paddingTop: ScaleSize(0),
  },

  stoptext: {
    fontSize: SetSpText(40),
    color: 'white',
    fontWeight: '600',
  },
  stopwhole: {
    marginBottom: Width * 0.42,
    marginTop: -(Height * 0.4),
    width: 0.975 * Width,
    marginLeft: Width * 0.0125,
    height: 0.2 * Height,
  },
  stopbutton: {
    marginHorizontal: ScaleSize(2),
    alignItems: 'center',
    marginTop: ScaleSize(5),
    borderRadius: ScaleSize(10),
    backgroundColor: '#2a82e4',
    height: ScaleSize(42),
    justifyContent: 'center',
  },
});
