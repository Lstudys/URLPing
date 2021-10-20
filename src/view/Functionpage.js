import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  processColor,
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
const gridColor = processColor('pink'); //网格线的颜色
class Ping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleX: 1.05,
      zoom: {scaleX: 1, scaleY: 1, xValue: 2},
      tableHead: ['MAX', 'MIN', 'AVG', 'P95', 'ERR'],
      refresh: false,
      chartHeight: 0,
      reqTime: 5, // 控制请求发送持续时间的state
      newReqTime: 0,

      outData: [10000, 10000, 10000, 10000, 10000],

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

      p95_arr1: [],
      p95_arr2: [],
      p95_arr3: [],
      p95_arr4: [],
      p95_arr5: [],

      isPing: true, // 控制是否正在ping

      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('pink'),
        markerColor: processColor('pink'),
        textColor: processColor('red'),
      },
      legend: {
        textColor: gridColor,
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
    urlCollection[0] = urlData[0];
    if (urlData.length > 1) {
      urlCollection[1] = urlData[1];
      if (urlData.length > 2) {
        urlCollection[2] = urlData[2];
        if (urlData.length > 3) {
          urlCollection[3] = urlData[3];
          if (urlData.length > 4) {
            urlCollection[4] = urlData[4];
          }
        }
      }
    }
    //获取IP地址
    for (let i = 0; i < urlData.length; i++) {
      let str = '';
      for (let j = 0; j < urlData[i].length; j++) {
        if (urlData[i][j] == ':') {
          str = urlData[i].substring(j + 3);
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
      zoom: {scaleX: this.state.scaleX, scaleY: 1, xValue: 800, yValue: 1500},
    });
    this.state.scaleX = this.state.scaleX + scale_switch;
  };

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
    }, 300000);
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
          textColor: gridColor,
          axisLineColor: gridColor,
          values: valuestempArr[i],
          label: `${urlCollection[i]}(${iptempArr[i]})`,
          config: {
            textColor: 'pink',
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
        textColor: gridColor,
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
    const tableDataArr = [
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
      const colortempArr = [0, 1, 2, 3, 4];

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
      <View style={{position: 'relative'}}>
        <View
          style={{
            backgroundColor: '#1f2342',
          }}>
          <Text
            style={{
              color: 'pink',
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
              width={Width * 0.98}
              height={Height * 0.6}
              bottom={0}
              data={this.config.data}
              xAxis={this.config.xAxis}
              yAxis={{
                left: {
                  textColor: gridColor,
                  enabled: true,
                  drawGridLines: true,
                  gridColor: gridColor,
                },
                right: {
                  enabled: false,
                },
              }}
              zoom={this.state.zoom}
              scaleYEnabled={false}
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
            <Table borderStyle={{borderWidth: 1, borderColor: 'pink'}}>
              <Row
                data={state.tableHead}
                flexArr={[1, 1, 1]}
                style={styles.head}
                textStyle={styles.textHead}
              />
            </Table>

            <Table borderStyle={{borderWidth: 1, borderColor: 'pink'}}>
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
        </View>
      </View>
    );
  }
}

export default Ping;

const styles = StyleSheet.create({
  bottomStyle: {
    height: Height * 1.2,
    backgroundColor: '#1f2342',
  },
  table: {
    top: -Height * 0.28,
    flex: 1,
    width: 0.9 * Width,
    marginLeft: Width * 0.05,

    
  },
  head: {height: ScaleSize(26), backgroundColor: '#1f2342'},
  wrapper: {flexDirection: 'row'},
  row: {height: ScaleSize(26)},
  textHead: {
    textAlign: 'center',
    color: 'pink',
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
    color: 'pink',
    fontWeight: '700',
  },

  stopwhole: {
    marginBottom: 60,
    marginTop: -(Height * 0.4),
    width: 0.975 * Width,
    marginLeft: Width * 0.0125,
    height: 0.2 * Height,
  },
  stopbutton: {
    marginHorizontal: ScaleSize(2),
    alignItems: 'center',
    marginTop: ScaleSize(-15),
    borderRadius: ScaleSize(15),
    backgroundColor: '#fff',
    borderWidth: ScaleSize(3),
    borderColor: 'pink',
    height: ScaleSize(42),
    justifyContent: 'center',
  },
});
