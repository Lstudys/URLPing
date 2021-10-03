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
import {SendRequest} from '../controller/request';
import {LineChart} from 'react-native-charts-wrapper';
import {Table, Row} from 'react-native-table-component';
import {getIpAddressesForHostname} from 'react-native-dns-lookup';
import I18n from 'i18n-js';
import Data from '../modal/data';
import {LanguageChange} from '../component/LanguageChange';
import {SetSpText, ScaleSize} from '../controller/Adaptation';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const Colors = [
  processColor('red'),
  processColor('#2a82e4'),
  processColor('green'),
  processColor('#f67e1e'),
  processColor('purple'),
];
const textColors = ['red', '#2a82e4', 'green', '#f67e1e', 'purple'];
const gridColor = processColor('#E6E6E6'); //网格线的颜色
class Ping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleX: 1.05,
      zoom: {scaleX: 1, scaleY: 1, xValue: 2},
      tableHead: ['MAX', 'MIN', 'AVG', 'N95', 'ERROR'],
      refresh: false,
      chartHeight: 0,
      reqTime: 5, // 控制请求发送持续时间的state
      newReqTime: 0,

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

      chartLabels: [],

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
    urlCollection = ['', '', '', '', ''];

    LanguageChange.bind(this)();

    this.setState({refresh: !this.state.refresh});

    //修改url的值
    var urlData = this.props.route.params.urlData;
    urlCollection[0] = urlData[0].url;
    if (urlData.length > 1) {
      urlCollection[1] = urlData[1].url;
      if (urlData.length > 2) {
        urlCollection[2] = urlData[2].url;
        if (urlData.length > 3) {
          urlCollection[3] = urlData[3].url;
          if (urlData.length > 4) {
            urlCollection[4] = urlData[4].url;
          }
        }
      }
    }
    //获取IP地址
    for (let i = 0; i < urlData.length; i++) {
      let str = '';
      for (let j = 0; j < urlData[i].url.length; j++) {
        if (urlData[i].url[j] == ':') {
          str = urlData[i].url.substring(j + 3);
          getIpAddressesForHostname(str).then((ipAddresses) => {
            switch (i) {
              case 0:
                Data.IP1 = ipAddresses;
                break;
              case 1:
                Data.IP2 = ipAddresses;
                break;
              case 2:
                Data.IP3 = ipAddresses;
                break;
              case 3:
                Data.IP4 = ipAddresses;
                break;
              case 4:
                Data.IP5 = ipAddresses;
                break;
            }
          });

          break;
        }
      }
    }
    SendRequest.bind(this)();
  }

  resetZoom = (scale_switch) => {
    this.setState({
      zoom: {scaleX: this.state.scaleX, scaleY: 1, xValue: 200, yValue: 500},
    });
    this.state.scaleX = this.state.scaleX + scale_switch;
  };

  pressnum = 0; // 表示安卓手机返回键按压次数，以控制返回上一界面
  firstpress = 0; // 第一次按返回键的时间戟

  maxTime = 0; // 最大时间
  minTime = ''; // 最小时间
  avgTime = 0; // 平均时间
  n95 = ''; // 95%的数据
  status1 = '';
  sumReqTime = []; // 所有请求时间的数组，用来计算标准差
  error1 = 0;

  /**
   * 下面是第二个图表的数据
   */
  maxTime2 = 0; // 最大时间
  minTime2 = ''; // 最小时间
  avgTime2 = 0; // 平均时间
  n952 = ''; // 95%的数据
  status2 = '';
  sumReqTime2 = []; // 所有请求时间的数组，用来计算标准差
  error2 = 0;

  maxTime3 = 0; // 最大时间
  minTime3 = ''; // 最小时间
  avgTime3 = 0; // 平均时间
  n953 = ''; // 95%的数据
  status3 = '';
  sumReqTime3 = []; // 所有请求时间的数组，用来计算标准差
  error3 = 0;

  maxTime4 = 0; // 最大时间
  minTime4 = ''; // 最小时间
  avgTime4 = 0; // 平均时间
  n954 = ''; // 95%的数据
  status4 = '';
  sumReqTime4 = []; // 所有请求时间的数组，用来计算标准差
  error4 = 0;

  maxTime5 = 0; // 最大时间
  minTime5 = ''; // 最小时间
  avgTime5 = 0; // 平均时间
  n955 = ''; // 95%的数据
  status5 = '';
  sumReqTime5 = []; // 所有请求时间的数组，用来计算标准差
  error5 = 0;

  config = {};

  componentDidMount() {
    console.log(urlCollection);
    //定时Ping三分钟自动结束
    this.stoptimer = setTimeout(() => {
      this.setState(() => ({
        isPing: false,
      }));
    }, 180000);
  }

  componentWillUnmount() {
    clearTimeout(this.stoptimer);
  }

  //将数据及配置信息导入到图表中
  next(
    chartLabels,
    urlCollection,
    iptempArr,
    valuestempArr,
    colortempArr,
    dataSets,
  ) {
    for (let i = 0; i < urlCollection.length; i++) {
      if (urlCollection[i] != '') {
        dataSets.push({
          values: valuestempArr[i],
          label: `${urlCollection[i]}(${iptempArr[i]})`,
          config: {
            drawValues: false,
            color: Colors[colortempArr[i]],
            mode: 'LINEAR',
            drawCircles: false,
            lineWidth: 2,
          },
        });
      }
    }
    return {
      data: {
        dataSets,
      },
      xAxis: {
        valueFormatter: chartLabels,
        axisLineWidth: 0,
        drawLabels: true,
        position: 'BOTTOM',
        drawGridLines: true,
        gridColor: gridColor,
      },
    };
  }

  render() {
    // const urlCollection = [
    //   //存储要ping的url 方便调用
    //   this.state.url,
    //   this.state.url2,
    //   this.state.url3,
    //   this.state.url4,
    //   this.state.url5,
    // ];
    const tableDataArr = [
      //存储页面下方表格中的每行数据 方便调用
      [
        this.maxTime,
        this.minTime,
        Math.round(this.avgTime),
        Math.round(this.n95),
        this.error1,
      ],
      [
        this.maxTime2,
        this.minTime2,
        Math.round(this.avgTime2),
        Math.round(this.n952),
        this.error2,
      ],
      [
        this.maxTime3,
        this.minTime3,
        Math.round(this.avgTime3),
        Math.round(this.n953),
        this.error3,
      ],
      [
        this.maxTime4,
        this.minTime4,
        Math.round(this.avgTime4),
        Math.round(this.n954),
        this.error4,
      ],
      [
        this.maxTime5,
        this.minTime5,
        Math.round(this.avgTime5),
        Math.round(this.n955),
        this.error5,
      ],
    ];
    //将数据传入页面下方表格中
    var tableData = [];
    for (let i = 0; i < tableDataArr.length; i++) {
      if (urlCollection[i] != '') {
        tableData.push(tableDataArr[i]);
      }
    }
    //当页面停止测试时保存图表中的数据
    if (!this.state.isPing) {
      tableData = [].concat(tableData);
    }

    const state = this.state;
    if (
      urlCollection[0] != '' ||
      urlCollection[1] != '' ||
      urlCollection[2] != '' ||
      urlCollection[3] != '' ||
      urlCollection[4] != ''
    ) {
      const {
        values,
        values2,
        values3,
        values4,
        values5,

        chartLabels,
      } = this.state;

      var dataSets = [];
      //存储一些必要的数据 方便for循环里调用
      const iptempArr = [Data.IP1, Data.IP2, Data.IP3, Data.IP4, Data.IP5];
      const valuestempArr = [values, values2, values3, values4, values5];
      const colortempArr = [1, 2, 3, 4];

      this.config = this.next(
        chartLabels,
        urlCollection,
        iptempArr,
        valuestempArr,
        colortempArr,
        dataSets,
      );
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
              //当退出Ping页面时把IP地址赋值为空
              Data.IP1 = '';
              Data.IP2 = '';
              Data.IP3 = '';
              Data.IP4 = '';
              Data.IP5 = '';
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
              width={Width * 0.95}
              height={Height * 0.45}
              bottom={0}
              data={this.config.data}
              xAxis={this.config.xAxis}
              yAxis={{
                left: {
                  enabled: true,
                  drawGridLines: true,
                  gridColor: gridColor,
                },
                right: {
                  enabled: false,
                },
              }}
              zoom={this.state.zoom}
              scaleYEnabled={true}
              scaleXEnabled={true}
              doubleTapToZoomEnabled={true}
              dragDecelerationFrictionCoef={0.99}
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
              {/* 给每一行row都一个key值 */}
              {tableData.map((tableData, index) => {
                return (
                  <Row
                    key={index}
                    data={tableData}
                    style={styles.row}
                    // 下面的几行三表达式主要是为了更改文本颜色与页面上方折线的颜色对应
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
                this.setState({
                  isPing: false,
                });
              }}>
              <Text style={styles.stoptext}>{I18n.t('To_stop_testing')}</Text>
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
    color: '#2a82e4',
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
    borderRadius: ScaleSize(15),
    backgroundColor: '#fff',
    borderWidth: ScaleSize(2.5),
    borderColor: '#2a82e4',
    height: ScaleSize(42),
    justifyContent: 'center',
  },
});
