import React, {Component} from 'react';
import {Button, Image} from 'react-native';
import {
  View,
  TextInput,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  DrawerLayoutAndroid,
} from 'react-native';

import {SetSpText, ScaleSize, ScaleSizeH} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import Data from '../modal/data';
import I18n, {toHumanSize} from 'i18n-js';
import {LanguageChange} from '../component/LanguageChange';
import {BackHandler, Platform} from 'react-native';
import {ExitApp} from '../controller/AppPageFunction';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Ordinary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAbout: false,
      FlatListIsRefreshing: false,
      isPing: false, //判断是否正在Ping
      refresh: false,
      currentUrlindex: -1,
      focus: false,
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      keyBoardHeight: 0,
      currentIndex: -1,
      isLoading: true,
    };

    LanguageChange.bind(this)();

    store.get(Data.pingIndex).then((res) => {
      if (res != null) {
        Data.Ping = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
  }
  open = () => {
    this.drawer.openDrawer();
  };

  close = () => {
    this.drawer.closeDrawer();
  };
  identify = true;

  componentDidMount() {
    Data.IP1 = '';
    Data.IP2 = '';
    Data.IP3 = '';
    Data.IP4 = '';
    Data.IP5 = '';
    Data.InputUrl = '';
    Data.pingurl = [];

    store.get('history').then((res) => {
      if (res != null) {
        Data.historyPing = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
    //使安卓手机物理返回键生效
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', ExitApp.bind(this));
    }
    if (this.state.isAbout) {
      this.props.navigation.navigate('About');
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', ExitApp.bind(this));
    }
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.renderItem}>
        <View
          style={{
            marginRight: ScaleSize(0),
          }}>
          <TextInput
            //当在item中选择的位置发生变化时就会调用这个方法 简单点儿就是光标位置和上次不同,就会调用
            onSelectionChange={(event) => {
              //将当前的光标定位到起点位置
              this.state.currentIndex = event.nativeEvent.selection.start;
            }}
            defaultValue={Data.Ping[parseInt(item.key)].url}
            onFocus={(value) => {
              this.state.currentUrlindex = item.key;
            }}
            //保存输入文本框中的内容并全局共享
            onChangeText={(value) => {
              Data.Ping[parseInt(item.key)].url = value;
              this.setState({refresh: !this.state.refresh});
              store.update(Data.Ping[parseInt(item.key)].url, value);
              store.save(Data.pingIndex, Data.Ping);
            }}
            placeholder={I18n.t('input')}
            style={styles.input}></TextInput>
        </View>
        {/*第一个不包含删除按钮*/}

        <View style={styles.delete}>
          <TouchableOpacity
            onPress={() => {
              Data.Ping.splice(parseInt(item.key), 1);
              for (let i = 0; i < Data.Ping.length; i++) {
                Data.Ping[i].key = i;
              }
              this.setState({refresh: !this.state.refresh});
              store.save(Data.pingIndex, Data.Ping);
            }}>
            <Image
              source={require('../imgs/delete.png')}
              style={styles.deleteimage}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  //快捷输入框
  _renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          for (let i = 0; i < Data.urlsArr.length; i++) {
            if (Data.urlsArr[i] == item) {
              var key = i;
              break;
            }
          }
          if (this.state.currentUrlindex == -1) {
            return;
          }
          Data.Ping[parseInt(this.state.currentUrlindex)].url =
            Data.Ping[parseInt(this.state.currentUrlindex)].url.slice(
              0,
              this.state.currentIndex,
            ) +
            Data.urlsArr[key] +
            Data.Ping[parseInt(this.state.currentUrlindex)].url.slice(
              this.state.currentIndex,
            );
          store.save(Data.pingIndex, Data.Ping);

          this.setState({refresh: !this.state.refresh});
          this.setState({focus: true});
        }}
        style={styles.renderRow}>
        <Text style={styles._renderRowitem}>{item}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    let navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.close}
          style={{
            marginTop: ScaleSize(20),
            height: Height * 0.08,
            backgroundColor: '#fff',
            width: Width * 0.5,
            marginLeft: Width * 0.02,
            borderColor: 'pink',
            borderWidth: ScaleSize(4),
            borderBottomWidth: ScaleSize(2),
            borderRadius: ScaleSize(2),
            borderBottomRightRadius: ScaleSize(20),
            borderTopRightRadius: ScaleSize(20),
            //  position: 'absolute',
          }}>
          <View
            style={{
              position: 'absolute',
              right: Width * 0.15,
              top: Height * 0.015,
            }}>
            <Text
              style={{
                color: 'pink',
                fontSize: ScaleSize(20),
                fontWeight: '700',
              }}>
              {I18n.t('home')}
            </Text>
          </View>
          <View
            style={{
              width: Width * 0.1,
              height: Width * 0.15,
              alignItems: 'center',
              position: 'absolute',
              left: Width * 0.01,
              top: Height * -0.008,
            }}>
            <Image
              source={require('../imgs/home.png')}
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

        <View style={{position: 'absolute', bottom: ScaleSize(30)}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.props.navigation.navigate('About');
            }}
            style={{
              marginTop: ScaleSize(20),
              height: Height * 0.08,
              backgroundColor: '#fff',
              width: Width * 0.5,
              marginLeft: Width * 0.02,
              borderColor: 'pink',
              borderWidth: ScaleSize(4),
              borderBottomWidth: ScaleSize(2),
              borderRadius: ScaleSize(2),
              borderBottomRightRadius: ScaleSize(20),
              borderTopRightRadius: ScaleSize(20),
              //  position: 'absolute',
            }}>
            <View
              style={{
                position: 'absolute',
                right: Width * 0.08,
                top: Height * 0.015,
              }}>
              <Text
                style={{
                  color: 'pink',
                  fontSize: ScaleSize(20),
                  fontWeight: '700',
                }}>
                {I18n.t('about')}
              </Text>
            </View>
            <View
              style={{
                width: Width * 0.1,
                height: Width * 0.15,
                alignItems: 'center',
                position: 'absolute',
                left: Width * 0.01,
                top: Height * -0.01,
              }}>
              <Image
                source={require('../imgs/about.png')}
                style={{
                  marginTop: ScaleSize(16),
                  width: ScaleSize(35),
                  height: ScaleSize(35),
                  marginBottom: ScaleSize(15),
                  marginHorizontal: ScaleSize(10),
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
    if (this.state.isPing) {
      return;
    } else {
      return (
        <DrawerLayoutAndroid
          ref={(drawer) => {
            this.drawer = drawer;
          }}
          //
          drawerWidth={ScaleSize(200)}
          // 设置导航视图从窗口边缘拉入的视图的宽度。
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          // 设置导航视图从屏幕的哪一边拉入。
          renderNavigationView={() => navigationView}
          // 被拉入的导航视图的内容。

          onDrawerClose={() => {}}
          // 导航视图被关闭后的回调函数。
          keyboardDismissMode="none"
          // 设置拖动过程中是否隐藏软键盘,'none' (默认)，拖动时不隐藏软键盘。'on-drag'，拖动时隐藏软键盘。
          onDrawerOpen={() => {}}
          // 导航视图被打开后的回调函数。
        >
          <View style={{backgroundColor: '#1f2342'}}>
            <View style={{height: Height, position: 'relative'}}>
              <TouchableOpacity onPress={this.open}>
                <View>
                  <Image
                    source={require('../imgs/draw.png')}
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
              <Text
                style={{
                  color: 'pink',
                  fontSize: SetSpText(90),
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: ScaleSize(160),
                  marginBottom: ScaleSizeH(100),
                }}>
                {I18n.t('title')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  this.props.navigation.navigate('UrlInput');
                }}
                style={{
                  marginTop: ScaleSize(20),
                  height: Height * 0.08,
                  backgroundColor: '#fff',
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  borderColor: 'pink',
                  borderWidth: ScaleSize(4),
                  borderBottomWidth: ScaleSize(2),
                  borderRadius: ScaleSize(20),
                  //  position: 'absolute',
                }}>
                {/* <View
                    style={{
                      marginTop: ScaleSize(20),
                      height:Height*.08,
                      backgroundColor: '#fff',
                      width: Width * 0.9,
                      marginLeft: Width * 0.05,
                      borderColor: 'pink',
                      borderWidth: ScaleSize(4),
                      borderBottomWidth: ScaleSize(2),
                      borderRadius:ScaleSize(20),
                      position: 'absolute',
                     
                    }}
                    
                    // onKeyPress={
                    //   this.props.navigation.navigate('UrlInput')
                    // }
                    ></View> */}
                <View
                  style={{
                    width: Width * 0.18,
                    alignItems: 'center',
                    position: 'absolute',
                    right: Width * 0.03,
                    top: Height * 0.006,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('UrlInput');
                    }}>
                    <Text style={styles.pingtext}>GO!</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* <View style={{marginTop: ScaleSize(20)}}>
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    data={Data.Ping}
                    renderItem={this.renderItem}
                    refreshing={this.state.FlatListIsRefreshing}
                    onRefresh={() => {
                      this.setState(() => ({
                        FlatListIsRefreshing: true,
                      }));
                      setTimeout(() => {
                        this.setState(() => ({
                          FlatListIsRefreshing: false,
                        }));
                      }, 1000);
                    }}
                  />
                </View> */}
              {/* <KeyboardAccessory>
                  <View style={{height: Height * 0.062}}>
                    <FlatList
                      scrollEnabled={false}
                      keyboardShouldPersistTaps={'handled'}
                      style={styles.urlsArrFlatlist}
                      horizontal={true}
                      data={Data.urlsArr}
                      renderItem={this._renderRow}
                    />
                  </View>
                </KeyboardAccessory> */}

              {/* <TouchableOpacity
                  style={styles.pingTouchable}
                  onPress={() => {
                    if (Data.Ping.length != 0) {
                      let key = Data.Ping.length;
                      if (key >= 5) {
                        alert(I18n.t('maxfiveurl'));
                        return;
                      }
                      Data.Ping = [...Data.Ping, {key: key, url: ''}];
                      for (let i = 0; i < Data.Ping.length; i++) {
                        Data.Ping[i].key = i;
                      }
                      this.setState({refresh: !this.state.refresh});
                    } else {
                      Data.Ping = [{key: 0, url: ''}];
                      this.setState({refresh: !this.state.refresh});
                    }
                    store.save(Data.pingIndex, Data.Ping);
                  }}>
                  <View style={styles.add}>
                    <Image
                      source={require('../imgs/add.png')}
                      style={styles.addimage}
                    />
                  </View>
                </TouchableOpacity> */}
              {/* <View style={{height: Height * 0.062}}>
                  <FlatList
                    scrollEnabled={false}
                    keyboardShouldPersistTaps={'handled'}
                    style={styles.urlsArrFlatlist}
                    horizontal={true}
                    data={Data.urlsArr}
                    renderItem={this._renderRow}
                  />
                </View> */}
            </View>
            {/* 
          <View style={styles.pingwhole}>
            <TouchableOpacity
              onPress={() => {
                for (let i = 0; i < Data.Ping.length; i++) {
                  if (!TestURL(Data.Ping[i].url)) {
                    this.identify = false;
                    break;
                  } else {
                    this.identify = true;
                  }
                }
                if (this.identify) {
                  if (Data.Ping.length != 0) {
                    let Ping_length = Data.Ping.length;
                    let History_length = Data.historyPing.length;
                    for (
                      let i = 0, j = History_length;
                      i < Ping_length;
                      i++, j++
                    ) {
                      Data.historyPing = [
                        ...Data.historyPing,
                        {key: j, url: Data.Ping[i].url},
                      ];
                    }
                    this.setState({refresh: !this.state.refresh});
                    this.props.navigation.navigate('Ping', {
                      urlData: [...Data.Ping],
                    });
                  } else {
                    Toast.message(I18n.t('nourladded'));
                  }
                } else {
                  Toast.message(I18n.t('reject_Test'));
                }
              }}
              style={styles.pingbutton}>
              <Text style={styles.pingtext}>Ping</Text>
            </TouchableOpacity>
          </View> */}
          </View>
        </DrawerLayoutAndroid>
      );
    }
  }
}
export default Ordinary;

const styles = StyleSheet.create({
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
    fontSize: SetSpText(60),
    color: 'pink',
    fontWeight: '700',
  },
  pingwhole: {
    marginHorizontal: ScaleSize(5),
    // marginBottom: ScaleSize(10),
    // marginTop: ScaleSize(10),
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
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * zhuoyuan93@gmail.com
 *
 */

//  import React, {Component} from 'react';
//  import {
//      Platform,
//      StyleSheet,
//      Text,
//      View,
//      Dimensions
//  } from 'react-native';
//  import SideMenu from 'react-native-side-menu';

//  const instructions = Platform.select({
//      ios: 'Press Cmd+R to reload,\n' +
//      'Cmd+D or shake for dev menu',
//      android: 'Double tap R on your keyboard to reload,\n' +
//      'Shake or press menu button for dev menu',
//  });
//  const {width, height} = Dimensions.get('window');

//  export default class App extends Component {

//      constructor(props) {
//          super(props);
//          this.state = {
//              isOpen: false
//          }
//      }

//      render() {
//          const menu = <Text style={{marginTop: 22}} onPress={() => alert('点击了aaa')}>aaa</Text>;
//          return (

//              <SideMenu
//                  menu={menu}                    //抽屉内的组件
//                  isOpen={this.state.isOpen}     //抽屉打开/关闭
//                  openMenuOffset={width / 2}     //抽屉的宽度
//                  hiddenMenuOffset={20}          //抽屉关闭状态时,显示多少宽度 默认0 抽屉完全隐藏
//                  edgeHitWidth={60}              //距离屏幕多少距离可以滑出抽屉,默认60
//                  disableGestures={false}        //是否禁用手势滑动抽屉 默认false 允许手势滑动
//                  /*onStartShouldSetResponderCapture={
//                      () => console.log('开始滑动')}*/
//                  onChange={                   //抽屉状态变化的监听函数
//                      (isOpen) => {
//                          isOpen ? console.log('抽屉当前状态为开着')
//                              :
//                              console.log('抽屉当前状态为关着')

//                      }}

//                  onMove={                     //抽屉移动时的监听函数 , 参数为抽屉拉出来的距离 抽屉在左侧时参数为正,右侧则为负
//                      (marginLeft) => {
//                          console.log(marginLeft)
//                      }}

//                  menuPosition={'left'}     //抽屉在左侧还是右侧
//                  autoClosing={false}         //默认为true 如果为true 一有事件发生抽屉就会关闭
//              >
//                  <View style={styles.container}>
//                      <Text style={styles.welcome} onPress={() => {
//                          this.setState({
//                              isOpen: true
//                          })
//                      }}>
//                          Open Draw!
//                      </Text>
//                      <Text style={styles.instructions}>
//                          To get started, edit App.js
//                      </Text>
//                      <Text style={styles.instructions}>
//                          {instructions}
//                      </Text>
//                  </View>
//              </SideMenu>

//          );
//      }
//  }

//  const styles = StyleSheet.create({
//      container: {
//          flex: 1,
//          justifyContent: 'center',
//          alignItems: 'center',
//          backgroundColor: '#F5FCFF',
//          marginTop: 22
//      },
//      welcome: {
//          fontSize: 20,
//          textAlign: 'center',
//          margin: 10,
//      },
//      instructions: {
//          textAlign: 'center',
//          color: '#333333',
//          marginBottom: 5,
//      },
//  });
