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
  processColor,
  RefreshControl,
  TouchableHighlight,
  FlatList,
} from 'react-native';
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
import {NavigationBar, Label, Checkbox} from 'teaset';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {SetSpText, ScaleSizeH, ScaleSizeW} from '../controller/Adaptation';
import {color} from 'react-native-reanimated';

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
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reqTime: 5, // 控制请求发送持续时间的state
      newReqTime: 0,
      url: 'https://blog.csdn.net', // 用户输入的url
      url2: 'https://bilibili.com',
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
      urlsWitch:true,
    };

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
            I18n.locale = 'en'; // 用户既没有设置，也没有获取到系统语言，默认加载英语语言资源
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

      for (let i = 0; i < Data.indexArr.length; i++) {
        store.get(Data.indexArr[i]).then((res) => {
          if (res == null) {
            store.push(Data.indexArr[i], '');
          }
        });
      }
  
      store.get(Data.indexIndex).then(
        (res)=>{
          if(res==null)
          store.push(Data.indexIndex,1)
        }
      )

      store
      .get(Data.indexIndex)
      .then((res) => {
        Data.index = res
      });

    store.get(Data.indexArr[Data.index - 1]).then((res) => {
      const {urlsWitch}=this.state
      Data.urls=res
      this.setState({
        urlsWitch:!urlsWitch
      })
    });

  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', BackAction.bind(this));
  }
  // 设置url和输入框默认值为item
  setDefaultValue = (item) => {
    if (this.state.overlayOne) {
      this.setState({defaultvalueOne: item});
      this.state.url = item;
    }
    if (this.state.overlayTwo) {
      this.setState({defaultvalueTwo: item});
      this.state.url2 = item;
    }
  };

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
                mode: 'CUBIC_BEZIER',
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
                mode: 'CUBIC_BEZIER',
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
                mode: 'CUBIC_BEZIER',
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
                mode: 'CUBIC_BEZIER',
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

  // flatlist的渲染函数,item是数据，index是序列号
  // 渲染列表项

  _renderItem = ({item, id, value}) => {
    return (
      <View style={styles.mainLine}>
        <View style={styles.lineId}>
          <Text
            style={{
              fontSize: 25,
              lineHeight: Height * 0.1,
            }}>
            <Checkbox
              size="lg"
              checked={this.state.checked}
              onChange={(checked) => this.setState({checked})}
            />
            URL:
          </Text>
          <TextInput style={{flex: 1, fontSize: 20}}></TextInput>
        </View>
      </View>
    );
  };
  // onChangeText={this.}
  render() {
    if (this.state.url != '' || this.state.url2 != '') {
      const {
        values,
        colorIndex,
        chartLabels,
        url,
        values2,
        url2,
        colorIndex2,
        chartLabels2,
      } = this.state;
      this.config = this.next(
        values,
        colorIndex,
        chartLabels,
        url,
        url2,
        values2,
        colorIndex2,
        chartLabels2,
      );
    }
    return this.state.linechart ? (
      <View>
        <View
          style={{
            height: Height * 0.89,
            marginBottom: 0,
            backgroundColor: '#f1f3f0',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={styles.headerViewStyle}>
              <NavigationBar
                style={{backgroundColor: '#fffef4'}}
                type="ios"
                tintColor="#333"
                title={
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: 4,
                      paddingRight: 4,
                      borderRadius: 60,
                      alignItems: 'center',
                    }}>
                    <Label
                      style={{color: '#333333', fontSize: 20}}
                      text=""
                      style={styles.headerTextStyle}
                    />
                  </View>
                }
                leftView={
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      marginLeft: 10,
                    }}>
                    <NavigationBar.IconButton
                      icon={require('../imgs/back.png')}
                      onPress={() => {
                        this.props.navigation.navigate('Home');
                      }}
                    />
                  </View>
                }
                // rightView={
                //   <View
                //     style={{flexDirection: 'row', marginTop: 10, marginRight: 10}}>
                //     <NavigationBar.IconButton
                //       icon={require('../imgs/caozuo-quanbuxuan.png')}
                //       onPress={this.deletitems}
                //     />
                //     <NavigationBar.IconButton
                //       icon={require('../imgs/total_selection.png')}
                //       onPress={this.addhandle}
                //     />
                //   </View>
                // }
              />
            </View>
            <FlatList
              style={styles.scrollViewStyle}
              ref={(view) => {
                this.myFlatList = view;
              }}
              data={Data.urls} // 数据源
              renderItem={this._renderItem} // 从数据源中挨个取出数据并渲染到列表中
              refreshing={this.state.FlatListIsRefreshing}
              onRefresh={() => {
                //刷新的方法
                this.setState((prevState) => ({FlatListIsRefreshing: true}));
                setTimeout(() => {
                  this.setState((prevState) => ({FlatListIsRefreshing: false}));
                }, 1000);
              }}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'column-reverse',
            height: Height * 0.2,
          }}>
          <Text style={styles.HomeInputs} onPress={SendRequest.bind(this)}>
            {I18n.t('start')}
          </Text>

          <Text
            style={styles.HomeInputs}
            onPress={() => {
              const {urlsWitch} = this.state;
              Data.urls=[{id: Data.index, url: 'https://'},...Data.urls]
              
              store.save(Data.indexArr[Data.index], Data.urls);
              Data.index++;
              store.save(Data.indexIndex, Data.index);
              this.setState({
                urlsWitch:!urlsWitch
              });
            }}>
            {I18n.t('add')}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.bottomStyle}>
        <ScrollView>
          <View style={[styles.bottomChartData, {marginBottom: 0}]}>
            <View style={styles.bottomChartDataItem}>
              <Text
                style={{
                  color: 'pink',
                  fontSize: SetSpText(40),
                  left: ScaleSizeW(40),
                  position: 'absolute',
                }}>
                MAX
              </Text>
              <Text
                style={{
                  color: 'pink',
                  fontSize: SetSpText(40),
                  left: ScaleSizeW(220),
                  position: 'absolute',
                }}>
                MIN
              </Text>
              <Text
                style={{
                  color: 'pink',
                  fontSize: SetSpText(40),
                  left: ScaleSizeW(400),
                  position: 'absolute',
                }}>
                AVG
              </Text>
              <Text
                style={{
                  color: 'pink',
                  fontSize: SetSpText(40),
                  left: ScaleSizeW(580),
                  position: 'absolute',
                }}>
                N95
              </Text>
            </View>
            {this.state.chart1 ? (
              <View style={styles.bottomChartDataOne}>
                <Text
                  style={{
                    color: 'red',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(40),
                    position: 'absolute',
                  }}>
                  {this.maxTime}
                </Text>
                <Text
                  style={{
                    color: 'red',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(220),
                    position: 'absolute',
                  }}>
                  {this.minTime}
                </Text>
                <Text
                  style={{
                    color: 'red',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(400),
                    position: 'absolute',
                  }}>
                  {this.avgTime.toFixed(0)}
                </Text>
                <Text
                  style={{
                    color: 'red',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(580),
                    position: 'absolute',
                  }}>
                  {this.n95 ? `${this.n95.toFixed(0)}` : ''}
                </Text>
              </View>
            ) : (
              <View />
            )}
            {this.state.chart2 ? (
              <View style={styles.bottomChartDataTwo}>
                <Text
                  style={{
                    color: 'green',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(40),
                    position: 'absolute',
                  }}>
                  {this.maxTime2}
                </Text>
                <Text
                  style={{
                    color: 'green',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(220),
                    position: 'absolute',
                  }}>
                  {this.minTime2}
                </Text>
                <Text
                  style={{
                    color: 'green',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(400),
                    position: 'absolute',
                  }}>
                  {this.avgTime2.toFixed(0)}
                </Text>
                <Text
                  style={{
                    color: 'green',
                    fontSize: SetSpText(35),
                    left: ScaleSizeW(580),
                    position: 'absolute',
                  }}>
                  {this.n952 ? `${this.n952.toFixed(0)}` : ''}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </View>
          {true ? (
            <LineChart
              width={Width}
              height={Height * 0.9}
              bottom={0}
              data={this.config.data}
              xAxis={this.config.xAxis}
              style={styles.container}
              marker={this.state.marker}
              chartDescription={{text: ''}}
              ref="chart"
            />
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
    );
  }
}

export default Index;

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
  headerViewStyle: {
    height: 80,
    width: Width * 0.99,
    backgroundColor: '#fffef4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  headerTextStyle: {
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  scrollViewStyle: {
    flex: 1,
    height: Height * 0.7,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  itemViewStyle: {
    height: 80,
    borderWidth: 5,
    borderColor: '#d66e94',
    borderRadius: 20,
    backgroundColor: '#3c3c3c',
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderRightWidth: 0,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemTextStyle: {
    color: '#cccccc',
    fontSize: 20,
    marginLeft: 20,
  },
  container: {
    flex: 1, // 填充满整个屏幕
    alignItems: 'center',
    // backgroundColor: "red"
  },
  mainLine: {
    marginTop: 10,
    height: Height * 0.1,
    width: Width - 35,
    flexDirection: 'row',
  },
  lineId: {
    borderRadius: 10,
    fontSize: 30,
    backgroundColor: '#ffffff',
    lineHeight: Height * 0.1,
    alignSelf: 'center',
    paddingLeft: 20,
    flexDirection: 'row',
  },
  HomeInputs: {
    color: '#ffffff',
    fontSize: SetSpText(65),
    paddingTop: 5,
    marginTop: 10,
    backgroundColor: '#fdc1ca',
    alignSelf: 'center',
    textAlign: 'center',
    height: ScaleSizeH(100),
    width: Width,
    top: ScaleSizeH(90),
    borderRadius: 15,
  },
});
