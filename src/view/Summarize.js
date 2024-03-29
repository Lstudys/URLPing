import React, {Component} from 'react';
import {Button, Image} from 'react-native';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  processColor,
  ScrollView,
  Alert,
} from 'react-native';
import {Toast} from 'teaset';
import CameraRoll from '@react-native-community/cameraroll';
import {captureScreen, captureRef} from 'react-native-view-shot';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {LineChart, BarChart, PieChart} from 'react-native-charts-wrapper';
import {SetSpText, ScaleSize} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import Data from '../modal/data';
import {LanguageChange} from '../component/LanguageChange';
import {BackHandler, Platform} from 'react-native';
import {BackAction} from '../controller/AppPageFunction';
import AwesomeAlert from 'react-native-awesome-alerts';
import Permissions from 'react-native-permissions';
import PermissionUtil from '../component/Request_permission';

const Colors = [
  processColor('red'),
  processColor('#2a82e4'),
  processColor('green'),
  processColor('#f67e1e'),
  processColor('purple'),
];
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const gridColor = processColor('#fff'); //网格线的颜色
const dirs = RNFS.ExternalDirectoryPath; // 外部文件，共享目录的绝对路径（仅限android）
// var RNFS = require('react-native-fs');
var uploadUrl = 'http://example.com/';
var files = [
  {
    name: 'test1',
    filename: 'test1.w4a',
    filepath: RNFS.DocumentDirectoryPath + '/test1.w4a',
    filetype: 'audio/x-m4a',
  },
  {
    name: 'test2',
    filename: 'test2.w4a',
    filepath: RNFS.DocumentDirectoryPath + '/test2.w4a',
    filetype: 'audio/x-m4a',
  },
];
var uploadBegin = (response) => {
  var jobId = response.jobId;
  console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
};

var uploadProgress = (response) => {
  var percentage = Math.floor(
    (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
  );
  console.log('UPLOAD IS ' + percentage + '% DONE!');
};
// require the module
// var RNFS = require('react-native-fs');

// create a path you want to write to
// :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
// but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
var path = RNFS.DocumentDirectoryPath + '/test.txt';

// write the file

class Summarize extends Component {
  constructor(props) {
    super(props);

    this.mainViewRef = React.createRef();
    this.state = {
      Colors: '#1f2342',
      urlCollection: Data.urlCollection,
      config: Data.config,
      showAlert: false,
      FlatListIsRefreshing: false,
      isPing: false, //判断是否正在Ping
      refresh: false,
      currentUrlindex: -1,
      focus: false,
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      keyBoardHeight: 0,
      currentIndex: -1,
      isLoading: true,
      showSumAlert: false,
      showPermissionAlert: false,
    };

    LanguageChange.bind(this)();

    store.get(Data.pingIndex).then((res) => {
      if (res != null) {
        Data.Ping = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
    console.log('传过来了吗？ ', Data.config);
    console.log(path);
    RNFS.uploadFiles({
      toUrl: uploadUrl,
      files: files,
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      fields: {
        hello: 'world',
      },
      begin: uploadBegin,
      progress: uploadProgress,
    })
      .promise.then((response) => {
        if (response.statusCode == 200) {
          console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
        } else {
          console.log('SERVER ERROR');
        }
      })
      .catch((err) => {
        if (err.description === 'cancelled') {
          // cancelled by user
        }
        console.log(err);
      });
  }
  identify = true;

  csvstorage() {
    const downloadDest2 = `${dirs}/${Math.random() * 10000000 || 0}.csv`;
    console.log(
      '肯定在这里面' + Data.config.data.dataSets[0].values,
      Data.config.data.dataSets.length,
    );
    var dataSet = Data.config.data.dataSets;
    console.log(
      '这个行不行' + Data.config.data.dataSets[1].values,
      Data.config.data.dataSets[3].values,
    );
    if (Data.pingurl.length == 1)
      var datawd = `${Data.config.xAxis.valueFormatter}\n${Data.values[0]}`;
    else if (Data.pingurl.length == 2)
      var datawd = `${Data.config.xAxis.valueFormatter}\n${Data.values[0]}\n${Data.values[1]}`;
    else if (Data.pingurl.length == 3)
      var datawd = `${Data.config.xAxis.valueFormatter}\n${Data.values[0]}\n${Data.values[1]}\n${Data.values[2]}`;
    else if (Data.pingurl.length == 4)
      var datawd = `${Data.config.xAxis.valueFormatter}\n${Data.values[0]}\n${Data.values[1]}\n${Data.values[2]}\n${Data.values[3]}`;
    else if (Data.pingurl.length == 5)
      var datawd = `${Data.config.xAxis.valueFormatter}\n${Data.values[0]}\n${Data.values[1]}\n${Data.values[2]}\n${Data.values[3]}\n${Data.values[4]}`;
    RNFetchBlob.fs.writeFile(downloadDest2, datawd).then((result) => {
      console.log('result=====', result);
      Toast.message('success');
    });
  }
  componentDidMount() {
    console.log('1        ' + this.state.Colors);
    store.get(Data.ThemeColor).then((v, r) => {
      if (v == null) this.setState({Color: '#1f2342'});
      else {
        this.setState({Colors: v});
      }
    });
    console.log(this.state.Colors);
    Data.InputUrl = '';

    //使安卓手机物理返回键生效
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', BackAction.bind(this));
    }
  }

  showSumAlert = () => {
    this.setState({
      showSumAlert: true,
    });
  };

  hideSumAlert = () => {
    this.setState({
      showSumAlert: false,
    });
  };
  showPermissonAlert = () => {
    this.setState({
      showPermissonAlert: true,
    });
  };

  hidePermissonAlert = () => {
    this.setState({
      showPermissonAlert: false,
    });
  };
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        BackAction.bind(this),
      );
    }
  }

  next(urlCollection, dataSets, colortempArr) {
    for (let i = 0; i < urlCollection.length; i++) {
      if (urlCollection[i] != '') {
        dataSets.push({
          values: Data.compare_data[i],
          // label: 'Company A',
          config: {
            drawValues: false,
            colors: [Colors[colortempArr[i]]],
          },
        });
      }
    }
    if (urlCollection.length == 1) {
      dataSets.push({
        values: Data.compare_data[1],
        // label: 'Company A',
        config: {
          drawValues: false,
          colors: [Colors[colortempArr[1]]],
        },
      });
    }
    return {
      data: {
        dataSets,
      },
    };
  }
  Pie_next(urlCollection, dataSets2) {
    for (let i = 0; i < urlCollection.length; i++) {
      if (urlCollection[i] != '') {
        dataSets2.push([
          {
            values: [{value: Data.Piedata[i][1]}, {value: Data.Piedata[i][0]}],
            config: {
              colors: [processColor('#2a82e4'), processColor('red')],
              valueTextSize: ScaleSize(12),
              valueTextColor: processColor('#fff'),
              sliceSpace: 5,
              selectionShift: 13,
              // xValuePosition: "OUTSIDE_SLICE",
              // yValuePosition: "OUTSIDE_SLICE",
              valueFormatter: "#.#'%'",
              valueLineColor: processColor('green'),
              valueLinePart1Length: 0.5,
            },
          },
        ]);
      }
    }

    return {
      data: {
        dataSets2,
      },
    };
  }
  handleSelect(event) {
    // let entry = event.nativeEvent
    // if (entry == null) {
    //   this.setState({...this.state, selectedEntry: null})
    // } else {
    //   this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    // }
    // console.log(event.nativeEvent)
  }
  async shareScreenShot() {
    const {makingImage} = this.state;
    if (makingImage) return;

    this.setState({makingImage: true}, async () => {
      try {
        const captureConfig = {
          format: 'png',
          quality: 0.7,
          // result: Platform.OS==='ios'? 'data-uri':'base64',
          // result: 'tmpfile',
          result: 'base64',
          width: 750,
        };
        let imgBase64 = '';
        try {
          imgBase64 = await captureScreen(captureConfig);
        } catch (e) {
          try {
            imgBase64 = await captureRef(
              this.mainViewRef.current,
              captureConfig,
            );
          } catch (ex) {
            throw ex;
          }
        }
        this.imgBase64 = imgBase64;
        this.setState({showTitle: true});
        const screenShotShowImg = `data:image/png;base64,${this.imgBase64}`;
        //FIXME screenShotShowImg可直接在Image中展示
        // console.log('this.screenShotShowImg====', this.screenShotShowImg);
        this.saveImage(screenShotShowImg);
      } catch (e) {
        // ${e.toString()}`
        console.log(e);
      } finally {
        this.setState({makingImage: false});
      }
    });
  }
  async saveImage(screenShotShowImg) {
    Toast.message('Picture saving...');
    // if (IS_IOS) {
    //   CameraRoll.saveToCameraRoll(screenShotShowImg).then((result) => {
    //     Toast.message(`保存成功！地址如下：\n${result}`);
    //   }).catch((error) => {
    //     Toast.message(`保存失败！\n${error}`);
    //   });
    // } else {
    //调用该方法是 对 截屏的图片进行拼接，仅限Android端拼接，IOS的我不会，切此处的base64Img是未进行拼接‘data:image/png;base64’字段的base64图片格式
    // await NativeModules.UtilsModule.contactImage(base64Img).then((newImg) => {
    //   // console.log('path====', newImg);
    //   const screenShotShowImg = `data:image/png;base64,${newImg}`;

    // }, (ex) => {
    //   console.log('ex====', ex);
    // });
    //不经过拼接直接保存到相册
    // 地址如下：\n${result}
    this.saveForAndroid(
      screenShotShowImg,
      (result) => {
        Toast.message(`Save success！`);
      },
      () => {
        Toast.message('Save failed！');
      },
    );
  }

  saveForAndroid(base64Img, success, fail) {
    console.log('这是什么外部路径？', dirs);
    const downloadDest = `${dirs}/${Math.random() * 10000000 || 0}.png`;
    const imageDatas = base64Img.split('data:image/png;base64,');
    const imageData = imageDatas[1];
    RNFetchBlob.fs
      .writeFile(downloadDest, imageData, 'base64')
      .then((result) => {
        console.log('result=====', result);
        try {
          CameraRoll.saveToCameraRoll(downloadDest)
            .then((e1) => {
              console.log('success', e1);
              success && success(e1);
            })
            .catch((e2) => {
              console.log('failed', e2);
              this.setState({showPermissionAlert: true});
              // PermissionUtil.checkPermission(
              //   function () {
              //     console.log('wc,成了');
              //   },
              //   function () {
              //     console.log('wc,没成');
              //   },
              //   ['store'],
              // );
            });
        } catch (e3) {
          console.log('catch', e3);
          fail && fail();
        }
      });
  }

  render() {
    const {showSumAlert, showPermissionAlert} = this.state;
    var dataSets = [];
    var dataSets2 = [];
    const colortempArr = [0, 1, 2, 3, 4];

    let config_bar = this.next(Data.pingurl, dataSets, colortempArr);
    let config_Pie = this.Pie_next(Data.pingurl, dataSets2);
    console.log('这里' + config_Pie);
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return (
      <View style={{}} ref={this.mainViewRef}>
        {/* 生成总结的弹窗 */}
        <AwesomeAlert
          show={showSumAlert}
          showProgress={false}
          title="Types"
          titleStyle={{
            fontSize: ScaleSize(40),
            marginTop: ScaleSize(-25),
            fontWeight: '700',
            color: this.state.Colors == '#4588AA' ? '#6BA5C2' : '#1f2342',
          }}
          animatedValue={0.9}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          // onDismiss={() => {
          //   this.setState({showSumAlert: false});
          // }}
          customView={
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({showSumAlert: false});
                  this.shareScreenShot();
                }}
                style={{
                  width: Width * 0.4,
                  height: Height * 0.06,
                  backgroundColor: 'grey',
                  borderRadius: ScaleSize(10),
                  borderColor: '#fff',
                  borderWidth: ScaleSize(2),
                }}>
                <View
                  style={{
                    marginTop: ScaleSize(6),
                  }}>
                  <Text style={styles.alertBtntext}>Screenshot</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.hideSumAlert();
                }}
                style={{
                  width: Width * 0.4,
                  height: Height * 0.06,
                  backgroundColor: 'grey',
                  borderRadius: ScaleSize(10),
                  borderColor: '#fff',
                  borderWidth: ScaleSize(2),
                  marginTop: ScaleSize(10),
                }}>
                <View
                  style={{
                    marginTop: ScaleSize(6),
                  }}>
                  <Text style={styles.alertBtntext}>PDF</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.hideSumAlert();
                }}
                style={{
                  width: Width * 0.4,
                  height: Height * 0.06,
                  backgroundColor: 'grey',
                  borderRadius: ScaleSize(10),
                  borderColor: '#fff',
                  borderWidth: ScaleSize(2),
                  marginTop: ScaleSize(10),
                }}>
                <View
                  style={{
                    marginTop: ScaleSize(6),
                  }}>
                  <Text style={styles.alertBtntext}>CSV</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
        />
        {/* 提示权限问题的弹窗 */}
        <AwesomeAlert
          show={showPermissionAlert}
          showProgress={false}
          title="App has no storage permission."
          titleStyle={{
            fontSize: ScaleSize(20),
            fontWeight: '700',
            color: this.state.Colors == '#4588AA' ? '#6BA5C2' : '#1f2342',
          }}
          message="please go to Settings to enable."
          animatedValue={0.9}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          confirmText="Confirm"
          // onDismiss={() => {
          //   this.setState({showPermissionAlert: false});
          // }}
          cancelButtonStyle={{
            backgroundColor:
              this.state.Colors == '#4588AA' ? '#6BA5C2' : '#1f2342',
            height: Height * 0.05,
            width: Width * 0.25,
            alignItems: 'center',
          }}
          confirmButtonStyle={{
            backgroundColor:
              this.state.Colors == '#4588AA' ? '#6BA5C2' : '#1f2342',
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
            this.setState({showPermissionAlert: false});
            Permissions.openSettings();
          }}
          onCancelPressed={() => {
            this.setState({showPermissionAlert: false});
          }}
        />
        <ScrollView
          style={{
            backgroundColor: this.state.Colors,
            marginBottom: Height * 0.07,
          }}>
          <ViewShot onCapture={this.onCapture} captureMode="mount">
            <View
              style={{
                height: Height * 0.08,
                borderBottomColor:
                  this.state.Colors == '#FFFFFF' ? '#000000' : '#FFFFFF',
                borderBottomWidth: ScaleSize(2),
                marginBottom: Height * 0.04,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Ordinary');
                }}>
                <View>
                  
                    <Image
                      source={require('../imgs/back.png')}
                      style={{
                        marginTop: ScaleSize(16),
                        width: ScaleSize(30),
                        height: ScaleSize(30),
                        marginBottom: ScaleSize(15),
                        marginHorizontal: ScaleSize(10),
                      }}
                    />
                  
                </View>
              </TouchableOpacity>

              <View
                style={{
                  marginTop: -Height * 0.06,
                  marginLeft: Width * 0.28,
                  //   backgroundColor:"pink"
                }}>
                <Text
                  style={{
                    color: this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    fontSize: SetSpText(36),
                  }}>
                  {`${year}/${month}/${day}/${this.state.config.xAxis.valueFormatter[0]}`}
                </Text>
              </View>
            </View>
            {Data.urlData_length > 0 ? (
              <View
                style={{
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  height: Height * 0.04,
                  backgroundColor: 'red',
                  marginBottom: ScaleSize(3),
                }}>
                <Text
                  style={styles.rowlegend}
                  numberOfLines={1}
                  ellipsizeMode="tail">
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
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  height: Height * 0.04,
                  backgroundColor: '#2a82e4',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend} numberOfLines={1}>
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
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  height: Height * 0.04,
                  backgroundColor: 'green',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend} numberOfLines={1}>
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
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  height: Height * 0.04,
                  backgroundColor: '#f67e1e',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend} numberOfLines={1}>
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
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  height: Height * 0.04,
                  backgroundColor: 'purple',
                  marginBottom: ScaleSize(3),
                }}>
                <Text style={styles.rowlegend} numberOfLines={1}>
                  {' '}
                  E : {urlCollection[4]} ({Data.IP5})
                </Text>
              </View>
            ) : (
              <View />
            )}
            {/* <View
            style={{
              // backgroundColor:"blue",
              // width:10,
              flexDirection: 'column',
              top: Height * 0.26,
              left: Width * 0.01,
              transform: [{rotate: '-90deg'}],
              position: 'absolute',
              // backgroundColor: '#1f2342',
            }}>
            <Text
              style={{
                color: '#fff',
                // width:ScaleSize(20)
              }}>
              ms
            </Text>
          </View> */}
            <View style={{marginLeft: Width * 0.05}}>
              {/* 折线图 */}
              <LineChart
                width={Width * 0.92}
                height={Width * 0.56}
                bottom={0}
                data={this.state.config.data}
                xAxis={this.state.config.xAxis}
                yAxis={{
                  left: {
                    axisLineWidth: 1.5,
                    axisLineColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),

                    textColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                    enabled: true,
                    drawGridLines: true,
                    gridColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                  },
                  right: {
                    axisLineWidth: 1.5,
                    axisLineColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),

                    textColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                    enabled: true,
                    drawGridLines: true,
                    gridColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                  },
                }}
                zoom={{scaleX: 1, scaleY: 1, xValue: 2}}
                scaleYEnabled={true}
                scaleXEnabled={true}
                doubleTapToZoomEnabled={true}
                dragDecelerationFrictionCoef={0.99}
                marker={{
                  enabled: true,
                  backgroundTint: processColor('#fff'),
                  markerColor: processColor(
                    this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                  ),
                  textColor: processColor(
                    this.state.Colors == '#FFFFFF' ? '#FFFFFF' : 'red',
                  ),
                }}
                legend={{
                  textColor: gridColor,
                  wordWrapEnabled: true,
                  enabled: true,
                  // xEntrySpace:true,
                  form: 'NONE',
                }}
                extraOffsets={{bottom: 10}}
                chartDescription={{text: ''}}
                ref="chart"
              />
              {/* 柱状图 */}
              <BarChart
                width={Width * 0.92}
                height={Width * 0.56}
                bottom={0}
                data={{
                  dataSets: config_bar.data.dataSets,
                  config: {
                    barWidth: 0.2,
                    group: {
                      fromX: 0,
                      groupSpace: 0.1,
                      barSpace: 0.1,
                    },
                  },
                }}
                xAxis={{
                  // valueFormatter: "none",
                  textColor: processColor(this.state.Colors),
                  granularityEnabled: true,
                  granularity:
                    Data.pingurl.length == 3
                      ? 1
                      : Data.pingurl.length == 2
                      ? 0.7
                      : Data.pingurl.length == 4
                      ? 1.3
                      : Data.pingurl.length == 5
                      ? 1.6
                      : 0.7,
                  axisMaximum:
                    Data.pingurl.length == 1
                      ? 2.6
                      : Data.pingurl.length == 2
                      ? 2.8
                      : Data.pingurl.length == 3
                      ? 4
                      : Data.pingurl.length == 4
                      ? 5.2
                      : Data.pingurl.length == 5
                      ? 6.4
                      : 20,
                  axisMinimum: 0,
                  centerAxisLabels: true,
                }}
                yAxis={{
                  left: {
                    axisLineWidth: 1.5,
                    axisLineColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),

                    textColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                    enabled: true,
                    drawGridLines: true,
                    gridColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                  },
                  right: {
                    axisLineWidth: 1.5,
                    axisLineColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),

                    textColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                    enabled: true,
                    drawGridLines: true,
                    gridColor: processColor(
                      this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    ),
                  },
                }}
                zoom={{scaleX: 1, scaleY: 1, xValue: 1}}
                scaleYEnabled={false}
                scaleXEnabled={false}
                doubleTapToZoomEnabled={true}
                dragDecelerationFrictionCoef={0.99}
                marker={{
                  enabled: true,
                  markerColor: processColor('#F0C0FF8C'),
                  textColor: processColor('white'),
                  markerFontSize: 14,
                }}
                legend={{
                  textColor: gridColor,
                  // wordWrapEnabled: true,
                  enabled: true,
                  // xEntrySpace:true,
                  form: 'NONE',
                }}
                extraOffsets={{bottom: 10}}
                chartDescription={{text: ''}}
                ref="chart"
              />
              <View
                style={{
                  height: Height * 0.03,
                  width: Width * 0.8,
                  marginLeft: Width * 0.05,
                  marginTop: -Height * 0.035,
                }}>
                <Text
                  style={{
                    color: this.state.Colors == '#FFFFFF' ? '#000000' : '#fff',
                    marginLeft: Width * 0.09,
                    fontSize: ScaleSize(12),
                  }}>
                  MIN{'             '} AVG{'             '} N95{'             '}{' '}
                  MAX
                </Text>
              </View>
              {Data.pingurl.length > 0 ? (
                <View
                  style={{
                    height: Height * 0.35,
                    width: Width * 0.7,
                    marginTop: -Height * 0.05,
                  }}>
                  <PieChart
                    style={{height: Height * 0.4}}
                    logEnabled={true}
                    data={{
                      dataSets: config_Pie.data.dataSets2[0],
                    }}
                    chartDescription={{
                      text: '',
                    }}
                    legend={{
                      enabled: true,
                      textColor: processColor('#1f2342'),
                      // textSize: ,
                      form: 'NONE',

                      horizontalAlignment: 'RIGHT',
                      verticalAlignment: 'CENTER',
                      orientation: 'VERTICAL',
                      wordWrapEnabled: true,
                    }}
                    // highlights={[{x:2}]}

                    // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

                    entryLabelColor={processColor('green')}
                    entryLabelTextSize={10}
                    entryLabelFontFamily={'HelveticaNeue-Medium'}
                    // drawEntryLabels={true}

                    rotationEnabled={true}
                    rotationAngle={0}
                    usePercentValues={true}
                    // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
                    // centerTextRadiusPercent={100}
                    holeRadius={0}
                    holeColor={processColor('#f0f0f0')}
                    transparentCircleRadius={20}
                    transparentCircleColor={processColor('#f0f0f088')}
                    maxAngle={360}
                    onSelect={this.handleSelect.bind(this)}
                    onChange={(event) => console.log(event.nativeEvent)}
                  />
                </View>
              ) : (
                <View />
              )}
              {Data.pingurl.length > 1 ? (
                <View
                  style={{
                    height: Height * 0.35,
                    width: Width * 0.7,
                    marginTop: -Height * 0.05,
                  }}>
                  <PieChart
                    style={{height: Height * 0.4}}
                    logEnabled={true}
                    data={{
                      dataSets: config_Pie.data.dataSets2[1],
                      config: {
                        colors: [processColor('#2a82e4'), processColor('red')],
                        valueTextSize: ScaleSize(12),
                        valueTextColor: processColor('#fff'),
                        sliceSpace: 5,
                        selectionShift: 13,
                        // xValuePosition: "OUTSIDE_SLICE",
                        // yValuePosition: "OUTSIDE_SLICE",
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('green'),
                        valueLinePart1Length: 0.5,
                      },
                    }}
                    chartDescription={{
                      text: '',
                    }}
                    legend={{
                      enabled: true,
                      textColor: processColor('#1f2342'),
                      // textSize: ,
                      form: 'NONE',

                      horizontalAlignment: 'RIGHT',
                      verticalAlignment: 'CENTER',
                      orientation: 'VERTICAL',
                      wordWrapEnabled: true,
                    }}
                    // highlights={[{x:2}]}

                    // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

                    entryLabelColor={processColor('green')}
                    entryLabelTextSize={10}
                    entryLabelFontFamily={'HelveticaNeue-Medium'}
                    // drawEntryLabels={true}

                    rotationEnabled={true}
                    rotationAngle={0}
                    usePercentValues={true}
                    // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
                    // centerTextRadiusPercent={100}
                    holeRadius={0}
                    holeColor={processColor('#f0f0f0')}
                    transparentCircleRadius={20}
                    transparentCircleColor={processColor('#f0f0f088')}
                    maxAngle={360}
                    onSelect={this.handleSelect.bind(this)}
                    onChange={(event) => console.log(event.nativeEvent)}
                  />
                </View>
              ) : (
                <View />
              )}
              {Data.pingurl.length > 2 ? (
                <View
                  style={{
                    height: Height * 0.35,
                    width: Width * 0.7,
                    marginTop: -Height * 0.05,
                  }}>
                  <PieChart
                    style={{height: Height * 0.4}}
                    logEnabled={true}
                    data={{
                      dataSets: config_Pie.data.dataSets2[2],
                      config: {
                        colors: [processColor('#2a82e4'), processColor('red')],
                        valueTextSize: ScaleSize(12),
                        valueTextColor: processColor('#fff'),
                        sliceSpace: 5,
                        selectionShift: 13,
                        // xValuePosition: "OUTSIDE_SLICE",
                        // yValuePosition: "OUTSIDE_SLICE",
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('green'),
                        valueLinePart1Length: 0.5,
                      },
                    }}
                    chartDescription={{
                      text: '',
                    }}
                    legend={{
                      enabled: true,
                      textColor: processColor('#1f2342'),
                      // textSize: ,
                      form: 'NONE',

                      horizontalAlignment: 'RIGHT',
                      verticalAlignment: 'CENTER',
                      orientation: 'VERTICAL',
                      wordWrapEnabled: true,
                    }}
                    // highlights={[{x:2}]}

                    // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

                    entryLabelColor={processColor('green')}
                    entryLabelTextSize={10}
                    entryLabelFontFamily={'HelveticaNeue-Medium'}
                    // drawEntryLabels={true}

                    rotationEnabled={true}
                    rotationAngle={0}
                    usePercentValues={true}
                    // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
                    // centerTextRadiusPercent={100}
                    holeRadius={0}
                    holeColor={processColor('#f0f0f0')}
                    transparentCircleRadius={20}
                    transparentCircleColor={processColor('#f0f0f088')}
                    maxAngle={360}
                    onSelect={this.handleSelect.bind(this)}
                    onChange={(event) => console.log(event.nativeEvent)}
                  />
                </View>
              ) : (
                <View />
              )}
              {Data.pingurl.length > 3 ? (
                <View
                  style={{
                    height: Height * 0.35,
                    width: Width * 0.7,
                    marginTop: -Height * 0.05,
                  }}>
                  <PieChart
                    style={{height: Height * 0.4}}
                    logEnabled={true}
                    data={{
                      dataSets: config_Pie.data.dataSets2[3],
                      config: {
                        colors: [processColor('#2a82e4'), processColor('red')],
                        valueTextSize: ScaleSize(12),
                        valueTextColor: processColor('#fff'),
                        sliceSpace: 5,
                        selectionShift: 13,
                        // xValuePosition: "OUTSIDE_SLICE",
                        // yValuePosition: "OUTSIDE_SLICE",
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('green'),
                        valueLinePart1Length: 0.5,
                      },
                    }}
                    chartDescription={{
                      text: '',
                    }}
                    legend={{
                      enabled: true,
                      textColor: processColor('#1f2342'),
                      // textSize: ,
                      form: 'NONE',

                      horizontalAlignment: 'RIGHT',
                      verticalAlignment: 'CENTER',
                      orientation: 'VERTICAL',
                      wordWrapEnabled: true,
                    }}
                    // highlights={[{x:2}]}

                    // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

                    entryLabelColor={processColor('green')}
                    entryLabelTextSize={10}
                    entryLabelFontFamily={'HelveticaNeue-Medium'}
                    // drawEntryLabels={true}

                    rotationEnabled={true}
                    rotationAngle={0}
                    usePercentValues={true}
                    // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
                    // centerTextRadiusPercent={100}
                    holeRadius={0}
                    holeColor={processColor('#f0f0f0')}
                    transparentCircleRadius={20}
                    transparentCircleColor={processColor('#f0f0f088')}
                    maxAngle={360}
                    onSelect={this.handleSelect.bind(this)}
                    onChange={(event) => console.log(event.nativeEvent)}
                  />
                </View>
              ) : (
                <View />
              )}
              {Data.pingurl.length > 4 ? (
                <View
                  style={{
                    height: Height * 0.35,
                    width: Width * 0.7,
                    marginTop: -Height * 0.05,
                  }}>
                  <PieChart
                    style={{height: Height * 0.4}}
                    logEnabled={true}
                    data={{
                      dataSets: config_Pie.data.dataSets2[4],
                      config: {
                        colors: [processColor('#2a82e4'), processColor('red')],
                        valueTextSize: ScaleSize(12),
                        valueTextColor: processColor('#fff'),
                        sliceSpace: 5,
                        selectionShift: 13,
                        // xValuePosition: "OUTSIDE_SLICE",
                        // yValuePosition: "OUTSIDE_SLICE",
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('green'),
                        valueLinePart1Length: 0.5,
                      },
                    }}
                    chartDescription={{
                      text: '',
                    }}
                    legend={{
                      enabled: true,
                      textColor: processColor('#1f2342'),
                      // textSize: ,
                      form: 'NONE',

                      horizontalAlignment: 'RIGHT',
                      verticalAlignment: 'CENTER',
                      orientation: 'VERTICAL',
                      wordWrapEnabled: true,
                    }}
                    // highlights={[{x:2}]}

                    // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

                    entryLabelColor={processColor('green')}
                    entryLabelTextSize={10}
                    entryLabelFontFamily={'HelveticaNeue-Medium'}
                    // drawEntryLabels={true}

                    rotationEnabled={true}
                    rotationAngle={0}
                    usePercentValues={true}
                    // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
                    // centerTextRadiusPercent={100}
                    holeRadius={0}
                    holeColor={processColor('#f0f0f0')}
                    transparentCircleRadius={20}
                    transparentCircleColor={processColor('#f0f0f088')}
                    maxAngle={360}
                    onSelect={this.handleSelect.bind(this)}
                    onChange={(event) => console.log(event.nativeEvent)}
                  />
                </View>
              ) : (
                <View />
              )}
            </View>
          </ViewShot>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            top: Height * 0.93,
            //marginTop: Height * 0.2,
            // bottom:-Height*.1,
            flexDirection: 'row',
            width: Width,
            height: Height * 0.07,
            marginBottom: Height * 0.17,
            alignItems: 'center',
            backgroundColor:
              this.state.Colors == '#4588AA'
                ? '#6BA5C2'
                : this.state.Colors == '#FFFFFF'
                ? '#FFFFFF'
                : '#1f2342',
          }}>
          <TouchableOpacity
            style={{
              marginLeft: Width * 0.06,
              width: Width * 0.4,
              height: Height * 0.06,
              backgroundColor:
                this.state.Colors == '#4588AA'
                  ? '#6BA5C2'
                  : this.state.Colors == '#FFFFFF'
                  ? '#666666'
                  : '#494b6d',
              borderRadius: ScaleSize(10),
              borderColor: '#fff',
              borderWidth: ScaleSize(2),
            }}
            onPress={() => {
              this.props.navigation.navigate('Ordinary');
            }}>
            <View
              style={{
                alignItems: 'center',
                height: Height * 0.06,
                width: Width * 0.4,
              }}>
              <Text style={styles.pingtext}>Quit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginLeft: Width * 0.08,
              width: Width * 0.4,
              height: Height * 0.06,
              borderRadius: ScaleSize(10),
              borderColor: '#fff',
              borderWidth: ScaleSize(2),
              backgroundColor:
                this.state.Colors == '#4588AA'
                  ? '#336699'
                  : this.state.Colors == '#FFFFFF'
                  ? '#000000'
                  : '#2C1F42',
            }}
            onPress={() => {
              this.setState({showSumAlert: 'true'});
            }}>
            <View
              style={{
                alignItems: 'center',
                height: Height * 0.06,
                width: Width * 0.4,
              }}>
              <Text style={styles.pingtext}>Export</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default Summarize;
const styles = StyleSheet.create({
  rowlegend: {
    fontSize: SetSpText(34),
    color: '#fff',
    lineHeight: Height * 0.04,
  },
  renderItem: {
    marginBottom: ScaleSize(20),
    borderBottomWidth: ScaleSize(2),
    borderBottomColor: 'rgba(0,0,0,.1)',
    height: Height * 0.045,
    width: Width * 0.92,
    marginLeft: Width * 0.04,
  },
  input: {
    borderStyle: 'solid',
    marginTop: ScaleSize(1),
    marginLeft: ScaleSize(4),
    paddingRight: ScaleSize(35),
    width: ScaleSize(310),
    height: ScaleSize(50),
    borderRadius: 10,
    paddingBottom: ScaleSize(21),
    fontSize: SetSpText(30),
  },
  pingbutton: {
    marginHorizontal: ScaleSize(2),
    alignItems: 'center',
    marginTop: -Height * 0.15,
    borderRadius: ScaleSize(10),
    backgroundColor: '#2a82e4',
    height: ScaleSize(42),
    justifyContent: 'center',
  },
  pingtext: {
    fontSize: SetSpText(50),
    color: '#fff',
    fontWeight: '700',
  },
  pingwhole: {
    marginHorizontal: ScaleSize(5),
  },
  urlsArrFlatlist: {
    marginLeft: ScaleSize(-4),
    marginBottom: ScaleSize(4),
    borderRadius: ScaleSize(13),
    backgroundColor: '#fff',
  },
  add: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: ScaleSize(10),
  },
  addimage: {
    height: ScaleSize(30),
    width: ScaleSize(30),
  },
  pingTouchable: {
    borderRadius: ScaleSize(40),
    width: ScaleSize(40),
    height: ScaleSize(40),
    marginLeft: ScaleSize(20),
    marginBottom: ScaleSize(20),
    marginTop: ScaleSize(-10),
  },
  renderRow: {
    marginLeft: ScaleSize(13),
    flexDirection: 'row',
    marginTop: ScaleSize(4),
    height: Height * 0.045,
    backgroundColor: '#2782e5',
    marginRight: ScaleSize(9),
    borderRadius: ScaleSize(20),
  },
  _renderRowitem: {
    fontSize: SetSpText(35),
    margin: ScaleSize(2),
    color: '#fff',
    fontWeight: '700',
  },
  deleteimage: {
    height: ScaleSize(20),
    width: ScaleSize(20),
  },
  delete: {
    position: 'absolute',
    right: ScaleSize(10),
    top: ScaleSize(15),
    marginRight: ScaleSize(0),
    marginTop: ScaleSize(-10),
  },
  alertBtntext: {
    fontSize: SetSpText(34),
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
});
