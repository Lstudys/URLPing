import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ScrollView,
  processColor,
  BackHandler,
} from 'react-native';
import {SendRequest} from '../controller/request';
import {LineChart} from 'react-native-charts-wrapper';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import {getIpAddressesForHostname} from 'react-native-dns-lookup';
import Data from '../modal/data';
import {LanguageChange} from '../component/LanguageChange';
import {SetSpText, ScaleSize} from '../controller/Adaptation';
import KeepAwake from 'react-native-keep-awake';
import AwesomeAlert from 'react-native-awesome-alerts';

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
const gridColor = processColor('#fff'); //网格线的颜色
class Ping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      scaleX: 1.05,
      zoom: {scaleX: 1, scaleY: 1, xValue: 2},
      tableHead: ['#', 'MIN', 'P50', 'AVG', 'P95', 'MAX', 'ERR'],
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
        backgroundTint: processColor('#fff'),
        markerColor: processColor('#fff'),
        textColor: processColor('red'),
      },
      legend: {
        textColor: gridColor,
        wordWrapEnabled: true,
        enabled: true,
        // xEntrySpace:true,
        form: 'CIRCLE',
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
    console.log('urldataii', urlData.length);
    Data.urlData_length = urlData.length;
    console.log('还能怎样' + Data.urlData_length);
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
  Median = 0;
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
  Median2 = 0;

  minTime2 = ''; // 最小时间
  avgTime2 = 0; // 平均时间
  n952 = ''; // 95%的数据
  status2 = '';
  sumReqTime2 = []; // 所有请求时间的数组，用来计算标准差
  error2 = 0;

  maxTime3 = 0; // 最大时间
  Median3 = 0;

  minTime3 = ''; // 最小时间
  avgTime3 = 0; // 平均时间
  n953 = ''; // 95%的数据
  status3 = '';
  sumReqTime3 = []; // 所有请求时间的数组，用来计算标准差
  error3 = 0;

  maxTime4 = 0; // 最大时间
  Median4 = 0;

  minTime4 = ''; // 最小时间
  avgTime4 = 0; // 平均时间
  n954 = ''; // 95%的数据
  status4 = '';
  sumReqTime4 = []; // 所有请求时间的数组，用来计算标准差
  error4 = 0;

  maxTime5 = 0; // 最大时间
  Median5 = 0;

  minTime5 = ''; // 最小时间
  avgTime5 = 0; // 平均时间
  n955 = ''; // 95%的数据
  status5 = '';
  sumReqTime5 = []; // 所有请求时间的数组，用来计算标准差
  error5 = 0;

  config = {};

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  componentDidMount() {
    clearTimeout(this.stoptimer);
    clearTimeout(this.send_request5);
    clearTimeout(this.send_request4);
    clearTimeout(this.send_request3);
    clearTimeout(this.send_request2);
    clearTimeout(this.send_request1);
    clearInterval(this.chart_refresh);
    console.log(urlCollection);
    //定时Ping三分钟自动结束
    this.stoptimer = setTimeout(() => {
      this.setState(() => ({
        isPing: false,
      }));
    }, 300000);
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.showAlert);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.stoptimer);
    clearTimeout(this.send_request5);
    clearTimeout(this.send_request4);
    clearTimeout(this.send_request3);
    clearTimeout(this.send_request2);
    clearTimeout(this.send_request1);
    clearInterval(this.chart_refresh);
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.showAlert);
    }
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
          // axisLineColor: gridColor,
          values: valuestempArr[i],
          // label: `${urlCollection[i]}(${iptempArr[i]})`,
          config: {
            textColor: '#fff',
            drawValues: false,
            color: Colors[colortempArr[i]],
            mode: 'LINEAR',
            drawCircles: false,
            lineWidth: 2.2,
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
        axisLineWidth: 2,
        axisLineColor: gridColor,
        drawLabels: true,
        position: 'BOTTOM',
        drawGridLines: true,
        gridColor: processColor('#1f2342'),
        gridLineWidth: false,
      },
    };
  }

  //高亮每一列最小数据所在cell的函数
  minCellHighLight(rowIndex, cellIndex, tableDataArr, cellData) {
    //当前数据
    if (cellIndex == 0) return true;
    // if (
    //   (cellData == 0 && cellIndex != 6) ||
    //   Data.pingurl.length == 1
    // )
    //   return false;
    let currentValue = cellData;
    let i;
    if (tableDataArr[rowIndex][1] == tableDataArr[rowIndex][5]) return false;

    //当前数据小于等于本列全部数据时就返回true，否则返回false。
    for (i = 0; i < tableDataArr.length; i++) {
      if (cellIndex != 6) {
        if (
          currentValue > tableDataArr[i][cellIndex] &&
          tableDataArr[i][cellIndex] != 0
        )
          return false;
      } else {
        if (
          currentValue > tableDataArr[i][cellIndex] &&
          tableDataArr[i][5] != 0
        )
          return false;
      }
    }

    return true;
  }

  render() {
    const {showAlert} = this.state;
    const tableDataArr = [
      [
        'A',
        this.minTime,
        Math.round(this.Median),
        Math.round(this.avgTime),
        Math.round(this.n95),
        this.maxTime,

        this.error1,
      ],
      [
        'B',

        this.minTime2,
        Math.round(this.Median2),
        Math.round(this.avgTime2),
        Math.round(this.n952),
        this.maxTime2,

        this.error2,
      ],
      [
        'C',
        this.minTime3,
        Math.round(this.Median3),
        Math.round(this.avgTime3),
        Math.round(this.n953),
        this.maxTime3,

        this.error3,
      ],
      [
        'D',
        this.minTime4,
        Math.round(this.Median4),
        Math.round(this.avgTime4),
        Math.round(this.n954),
        this.maxTime4,

        this.error4,
      ],
      [
        'E',
        this.minTime5,
        Math.round(this.Median5),
        Math.round(this.avgTime5),
        Math.round(this.n955),
        this.maxTime5,

        this.error5,
      ],
    ];
    //高亮表格对比所用的源数组compareData;
    var compareData = [];
    //将数据传入页面下方表格和compareData中
    var tableData = [];
    for (let i = 0; i < tableDataArr.length; i++) {
      if (urlCollection[i] != '') {
        tableData.push(tableDataArr[i]);
        compareData.push(tableDataArr[i]);
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
      <View style={{flex: 1, position: 'relative'}}>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Stop Ping?"
          titleStyle={{
            fontSize: ScaleSize(40),
            fontWeight: '700',
            color: '#494b6d',
          }}
          animatedValue={0.9}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Cancel"
          confirmText="Confirm"
          cancelButtonStyle={{
            backgroundColor: '#494b6d',
            height: Height * 0.05,
            width: Width * 0.25,
            alignItems: 'center',
          }}
          confirmButtonStyle={{
            backgroundColor: '#494b6d',
            height: Height * 0.05,
            width: Width * 0.25,
            alignItems: 'center',
          }}
          cancelButtonTextStyle={{
            fontSize: ScaleSize(18),
            fontWeight: '700',
          }}
          confirmButtonTextStyle={{
            fontSize: ScaleSize(18),
            fontWeight: '700',
          }}
          onConfirmPressed={() => {
            this.hideAlert();
            this.props.navigation.navigate('UrlInput');
          }}
          onCancelPressed={() => {
            this.hideAlert();
          }}
        />
        <View style={styles.bottomStyle}>
          <View
            style={{
              // backgroundColor:"blue",
              // width:10,
              flexDirection: 'column',
              top: Height * 0.2,
              left: ScaleSize(2),
              transform: [{rotate: '-90deg'}],
              position: 'absolute',
              // backgroundColor: '#1f2342',
            }}>
            <Text
              style={{
                color: '#fff',
                // width:ScaleSize(20)
              }}>
              ( ms )
            </Text>
          </View>
          <View
            style={{
              // backgroundColor:"blue",
              // width:10,
              flexDirection: 'column',
              top: Height * 0.42,
              right: Width * 0.2, // transform: [{rotate:'-90deg'}],
              position: 'absolute',
              // backgroundColor: '#1f2342',
            }}>
            <Text
              style={{
                color: '#fff',
                // width:ScaleSize(20)
              }}>
              ( time )
            </Text>
          </View>

          <ScrollView style={{marginLeft: Width * 0.07}}>
            <LineChart
              width={Width * 0.92}
              height={Width * 0.86}
              bottom={0}
              data={this.config.data}
              xAxis={this.config.xAxis}
              yAxis={{
                left: {
                  axisLineWidth: 2,
                  axisLineColor: gridColor,

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
              extraOffsets={{bottom: 10}}
              chartDescription={{text: ''}}
              ref="chart"
            />
          </ScrollView>
          {/* 弹窗 */}

          <View style={{position: 'absolute', top: Height * 0.47}}>
            {Data.urlData_length > 0 ? (
              <View
                style={{
                  width: Width * 5,
                  height: Height * 0.04,
                  backgroundColor: 'red',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend}>
                  {' '}
                  A : {urlCollection[0]} ({Data.IP1})
                </Text>
              </View>
            ) : (
              <View />
            )}
            {Data.urlData_length > 1 ? (
              <View
                style={{
                  width: Width * 5,
                  height: Height * 0.04,
                  backgroundColor: '#2a82e4',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend}>
                  {' '}
                  B : {urlCollection[1]} ({Data.IP2})
                </Text>
              </View>
            ) : (
              <View />
            )}
            {Data.urlData_length > 2 ? (
              <View
                style={{
                  width: Width * 5,
                  height: Height * 0.04,
                  backgroundColor: 'green',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend}>
                  {' '}
                  C : {urlCollection[2]} ({Data.IP3})
                </Text>
              </View>
            ) : (
              <View />
            )}
            {Data.urlData_length > 3 ? (
              <View
                style={{
                  width: Width * 5,
                  height: Height * 0.04,
                  backgroundColor: '#f67e1e',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend}>
                  {' '}
                  D : {urlCollection[3]} ({Data.IP4})
                </Text>
              </View>
            ) : (
              <View />
            )}
            {Data.urlData_length > 4 ? (
              <View
                style={{
                  width: Width * 5,
                  height: Height * 0.04,
                  backgroundColor: 'purple',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend}>
                  {' '}
                  E : {urlCollection[4]} ({Data.IP5})
                </Text>
              </View>
            ) : (
              <View />
            )}
            <View style={styles.table}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#fff'}}>
                <Row
                  data={state.tableHead}
                  flexArr={[1, 1, 1]}
                  style={styles.head}
                  textStyle={styles.textHead}
                />
              </Table>

              <Table borderStyle={{borderWidth: 1, borderColor: '#fff'}}>
                {tableData.map((rowData, rowIndex) => {
                  return (
                    <TableWrapper key={rowIndex} style={styles.row}>
                      {rowData.map((cellData, cellIndex) => {
                        return (
                          <Cell
                            key={cellIndex}
                            data={cellData}
                            style={
                              !this.minCellHighLight(
                                rowIndex,
                                cellIndex,
                                compareData,
                                cellData,
                              )
                                ? styles.cellHighLight
                                : rowIndex == 0
                                ? styles.cell1
                                : rowIndex == 1
                                ? styles.cell2
                                : rowIndex == 2
                                ? styles.cell3
                                : rowIndex == 3
                                ? styles.cell4
                                : rowIndex == 4
                                ? styles.cell5
                                : {}
                            }
                            textStyle={
                              !this.minCellHighLight(
                                rowIndex,
                                cellIndex,
                                compareData,
                                cellData,
                              )
                                ? styles.textformatHighLight
                                : styles.textformat
                            }
                          />
                        );
                      })}
                    </TableWrapper>
                  );
                })}
              </Table>
            </View>
          </View>
        </View>
        <KeepAwake />
      </View>
    );
  }
}

export default Ping;
const styles = StyleSheet.create({
  rowlegend: {
    color: '#fff',
    lineHeight: Height * 0.04,
  },
  bottomStyle: {
    height: Height * 1.2,
    backgroundColor: '#1f2342',
  },
  table: {
    marginTop: ScaleSize(30),
    flex: 1,
    width: Width,
    // marginLeft: Width * 0.05,
  },
  head: {height: ScaleSize(26), backgroundColor: '#1f2342'},
  wrapper: {flexDirection: 'row'},
  row: {height: ScaleSize(26), flexDirection: 'row'},
  cell1: {width: Width * 0.1425, backgroundColor: 'red'},
  cell2: {width: Width * 0.1425, backgroundColor: '#2a82e4'},
  cell3: {width: Width * 0.1425, backgroundColor: 'green'},
  cell4: {width: Width * 0.1425, backgroundColor: '#f67e1e'},
  cell5: {width: Width * 0.1425, backgroundColor: 'purple'},

  cellHighLight: {width: Width * 0.1425, backgroundColor: '#fff', opacity: 0.8},
  textHead: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: ScaleSize(15),
  },
  textformatHighLight: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ScaleSize(14),
    color: 'black',
  },
  textformat: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ScaleSize(14),
    color: '#fff',
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
    color: '#fff',
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
    borderColor: '#fff',
    height: ScaleSize(42),
    justifyContent: 'center',
  },
});
