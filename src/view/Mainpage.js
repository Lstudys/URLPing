import React, {Component} from 'react';
import {Button, Image} from 'react-native';
import {UrlInput} from './UrlInput';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Drawer from 'react-native-drawer';
import {
  SetSpText,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import Data from '../modal/data';
import I18n from 'i18n-js';
import {LanguageChange} from '../component/LanguageChange';
import {BackHandler, Platform} from 'react-native';
import {ExitApp, BackAction} from '../controller/AppPageFunction';
import AwesomeAlert from 'react-native-awesome-alerts';
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const ThemeColor = ['#1f2342', '#4588AA','#FFFFFF'];
class Ordinary extends Component {
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };

  constructor(props) {
    super(props);
    this.state = {
      disabled_drawer:false,
      Color: '#1f2342',
      showAlert: false,
      showAlert2: false,
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
    //Data.ThemeColor="#1f2342";
    Data.pioneerData = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    LanguageChange.bind(this)();

    store.get(Data.pingIndex).then((res) => {
      if (res != null) {
        Data.Ping = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
  }
  identify = true;

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
  showAlert2 = () => {
    this.setState({
      showAlert2: true,
    });
  };

  hideAlert2 = () => {
    this.setState({
      showAlert2: false,
    });
  };

  componentDidMount() {
    Data.IP1 = '';
    Data.IP2 = '';
    Data.IP3 = '';
    Data.IP4 = '';
    Data.IP5 = '';
    Data.InputUrl = '';
    Data.pingurl = [];
    store.get(Data.ThemeColor).then((v, r) => {
      if (v == null) this.setState({Color: '#1f2342'});
      else this.setState({Color: v});
    });
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
    const {showAlert, showAlert2} = this.state;

    let navigationView = (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.Color,
          height: Height * 1.2,
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.closeControlPanel}
          style={{
            marginTop: ScaleSize(20),
            height: Height * 0.08,
            backgroundColor: '#fff',
            width: Width * 0.57,
            // marginLeft: Width * 0.02,
            borderColor: this.state.Color==ThemeColor[2]?'#000000':'#fff',
            //borderWidth: ScaleSize(4),
            borderBottomWidth: ScaleSize(2),
            // borderRadius: ScaleSize(2),
            // borderBottomRightRadius: ScaleSize(20),
            // borderTopRightRadius: ScaleSize(20),
          }}>
          <View
            style={{
              position: 'absolute',
              right: Width * 0.2,
              top: Height * 0.025,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: SetSpText(34),
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

        {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            this.showAlert2();
          }}
          style={{
            marginTop: ScaleSize(5),
            height: Height * 0.08,
            backgroundColor: '#fff',
            width: Width * 0.57,
            // marginLeft: Width * 0.02,
            borderColor: this.state.Color==ThemeColor[2]?'#000000':'#fff',
            //borderWidth: ScaleSize(4),
            borderBottomWidth: ScaleSize(2),
            // borderRadius: ScaleSize(2),
            // borderBottomRightRadius: ScaleSize(20),
            // borderTopRightRadius: ScaleSize(20),
          }}>
          <View
            style={{
              position: 'absolute',
              right: Width * 0.15,
              top: Height * 0.017,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: SetSpText(34),
                fontWeight: '700',
              }}>
              {I18n.t('Theme')}
            </Text>
          </View>
          <View
            style={{
              width: Width * 0.1,
              height: Width * 0.15,
              alignItems: 'center',
              //position: 'absolute',
              left: Width * 0.01,
              top: Height * -0.008,
            }}>
            <Image
              source={require('../imgs/Theme.png')}
              style={{
                marginTop: ScaleSize(16),
                width: ScaleSize(35),
                height: ScaleSize(35),
                marginBottom: ScaleSize(15),
                marginHorizontal: ScaleSize(10),
              }}
            />
          </View>
        </TouchableOpacity> */}

        <View style={{position: 'absolute', bottom: ScaleSize(30)}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({disabled_drawer:true})
              this.showAlert();
            }}
            style={{
              marginTop: ScaleSize(20),
              height: Height * 0.08,
              backgroundColor: '#fff',
              width: Width * 0.55,
              // marginLeft: Width * 0.02,
              borderColor: this.state.Color==ThemeColor[2]?'#000000':'#fff',
              //borderWidth: ScaleSize(2),
              borderBottomWidth: ScaleSize(2),
              // borderRadius: ScaleSize(2),
              // borderBottomRightRadius: ScaleSize(20),
              // borderTopRightRadius: ScaleSize(20),
              //  position: 'absolute',
            }}>
            <View
              style={{
                position: 'absolute',
                right: Width * 0.08,
                top: Height * 0.01,
              }}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: SetSpText(34),
                  fontWeight: '700',
                }}>
                {I18n.t('about')}
              </Text>
              <Text
                style={{
                  color:'#000000',
                  fontSize: SetSpText(26),
                  fontWeight: '700',
                }}>
                {I18n.t('version')}
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
        <Drawer
          ref={(ref) => (this._drawer = ref)}
          content={navigationView}
          // captureGestures={true}
          acceptTap={true}
          acceptPan={true}
          openDrawerOffset={0.45} // 20% gap on the right side of drawer
          closedDrawerOffset={-3}
          tweenHandler={(ratio) => ({
            main: {opacity: (2 - ratio) / 2 + 0.4},
          })}
          type="static"
          disabled={this.state.disabled_drawer}
          tapToClose={false}>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Graph URL Ping"
            message={I18n.t('aboutDetails')}
            titleStyle={{
              fontSize: SetSpText(36),
              fontWeight: '700',
              color: '#000000',
            }}
            messageStyle={{
              color:'#000000',
              // backgroundColor:"#fff",
              width: Width * 0.55,
              marginTop: ScaleSize(20),
              marginBottom: ScaleSize(20),
              fontSize: SetSpText(34),
            }}
            useNativeDriver={true}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={true}
            showCancelButton={true}
            // showConfirmButton={true}
            cancelText={I18n.t('ok')}
            onDismiss={() => {
              this.setState({disabled_drawer:false})

              this.setState({showAlert: false});
            }}
            onCancelPressed={() => {
              this.hideAlert();
            }}
            // confirmText="Yes, delete it"
            cancelButtonStyle={{
              backgroundColor: this.state.Color == '#4588AA' ? '#4588AA' : (this.state.Color==ThemeColor[2]?'#000000':'#1f2342'),
              height: Height * 0.05,
              width: Width * 0.65,
              alignItems: 'center',
            }}
            cancelButtonTextStyle={{
              fontSize: SetSpText(34),
              fontWeight: '700',
            }}
          />

          <AwesomeAlert
            onDismiss={() => {
              this.setState({showAlert2: false});
            }}
            show={showAlert2}
            customView={
              <View>
                <View style={{marginLeft:ScaleSizeW(25)}}>
                  <Text style={{fontSize: ScaleSize(20)}}>选择主题颜色</Text>
                </View>
                <View
                  backgroundColor="#1f2342"
                  style={{marginTop: ScaleSizeH(10)}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({Color: ThemeColor[0]});
                      store.update(Data.ThemeColor, ThemeColor[0]);
                      this.hideAlert2();
                    }}
                    style={{
                      height: ScaleSizeH(50),
                      width: ScaleSizeW(150),
                      marginLeft: Width * 0.13,
                      marginTop: Height * 0.01,
                    }}>
                    <Text style={{fontSize: SetSpText(30),color: '#fff'}}>蓝紫色</Text>
                  </TouchableOpacity>
                </View>
                <View
                  backgroundColor="#4588AA"
                  style={{marginTop: ScaleSizeH(10)}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({Color: ThemeColor[1]});
                      store.update(Data.ThemeColor, ThemeColor[1]);
                      this.hideAlert2();
                    }}
                    style={{
                      height: ScaleSizeH(50),
                      width: ScaleSizeW(150),
                      marginLeft: Width * 0.13,
                      marginTop: Height * 0.01,
                    }}>
                    <Text style={{fontSize: SetSpText(30),color: '#fff'}}>浅蓝色</Text>
                  </TouchableOpacity>
                </View>
                <View
                  backgroundColor='#E6E6E6'
                  style={{marginTop: ScaleSizeH(10)}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({Color: ThemeColor[2]});
                      store.update(Data.ThemeColor, ThemeColor[2]);
                      this.hideAlert2();
                    }}
                    style={{
                      height: ScaleSizeH(50),
                      width: ScaleSizeW(150),
                      marginLeft: Width * 0.15,
                      marginTop: Height * 0.01,
                    }}>
                    <Text style={{fontSize:SetSpText(30),color: '#000000'}}>白色</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            showProgress={false}
          />
          <View style={{backgroundColor: this.state.Color}}>
            <View style={{height: Height * 1.25, position: 'relative'}}>
              <TouchableOpacity
                onPress={() => {
                  this._drawer.open();
                }}>
                <View>
                  <Image
                  source={require('../imgs/draw.png')}
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
              <Text
                style={{
                  color: this.state.Color==ThemeColor[2]?'#000000':'#FFFFFF',
                  fontSize: SetSpText(80),
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: ScaleSize(155),
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
                  marginTop: ScaleSize(-15),
                  height: Height * 0.09,
                  backgroundColor: '#fff',
                  width: Width * 0.9,
                  marginLeft: Width * 0.05,
                  borderColor: this.state.Color==ThemeColor[2]?'#000000':'#FFFFFF',
                  borderWidth: ScaleSize(4),
                  borderBottomWidth: ScaleSize(4),
                  borderRadius: ScaleSize(20),
                }}>
                <View
                  style={{
                    width: Width * 0.3,
                    alignItems: 'center',
                    position: 'absolute',
                    left: Width * 0.62,
                    top: Height * 0.015,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('UrlInput');
                    }}>
                    <Text
                      style={{
                        fontSize: SetSpText(52),
                        color:
                        this.state.Color == '#4588AA' ? '#4588AA' : (this.state.Color==ThemeColor[2]?'#000000':'#1f2342'),
                        fontWeight: '700',
                      }}>
                      PING!
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Drawer>
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
