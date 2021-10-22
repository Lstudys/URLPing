import React, {Component} from 'react';
import {Image} from 'react-native';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  DrawerLayoutAndroid,
} from 'react-native';

import {SetSpText, ScaleSize, ScaleSizeH} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import Data from '../modal/data';
import I18n from 'i18n-js';
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

  render() {
    let navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          // onPress={this.close}
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
            // onPress={() => {
            //   // this.props.navigation.navigate('About');
            // }}
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
                  fontSize: SetSpText(85),
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
                  marginTop: ScaleSize(10),
                  height: Height * 0.08,
                  backgroundColor: '#fff',
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  borderColor: 'pink',
                  borderWidth: ScaleSize(4),
                  borderBottomWidth: ScaleSize(2),
                  borderRadius: ScaleSize(20),
                }}>
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
            </View>
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
