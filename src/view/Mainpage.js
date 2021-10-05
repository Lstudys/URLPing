import React, {Component} from 'react';
import {Image} from 'react-native';
import {Toast} from 'teaset';
import {
  View,
  TextInput,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {TestURL} from '../controller/AppPageFunction';

import {SetSpText, ScaleSize} from '../controller/Adaptation';
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
      FlatListIsRefreshing: false,
      isPing: false, //判断是否正在Ping
      refresh: false,
      currentUrlindex: -1,
      focus: false,
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      keyBoardHeight: 0,
      currentIndex: -1,
      isNew: true, //判断是不是先进入简易模式
    };

    LanguageChange.bind(this)();

    store.get(Data.pingIndex).then((res) => {
      if (res != null) {
        Data.Ping = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
  }
  identify = true;

  componentDidMount() {
    store.get('historyPing').then((res) => {
      if (res != null) {
        Data.historyPing = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
    //使安卓手机物理返回键生效
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', ExitApp.bind(this));
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
    if (this.state.isPing) {
      return;
    } else {
      return (
        <View style={{backgroundColor: '#fff'}}>
          <View style={{height: Height, position: 'relative'}}>
            <View style={{flex: 1, height: Height, position: 'relative'}}>
              <View>
                <View style={styles.navigation}>
                  <Text style={styles.navigationtext}>GraphURLPing</Text>
                </View>

                <View style={{marginTop: ScaleSize(20)}}>
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
                </View>

                <TouchableOpacity
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
                </TouchableOpacity>
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
              </View>
            </View>
          </View>

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
          </View>
        </View>
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
    fontSize: SetSpText(40),
    color: 'white',
    fontWeight: '600',
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
    borderBottomWidth: ScaleSize(1),
    borderBottomColor: '#2782e5',
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
  navigationtext: {
    color: '#2782e5',
    position: 'absolute',
    left: Width * 0.26,
    bottom: ScaleSize(0),
    fontSize: SetSpText(40),
    marginLeft: ScaleSize(15),
    marginBottom: ScaleSize(15),
  },
  navigation: {
    flexDirection: 'row',
    width: ScaleSize(360),
    height: Height * 0.068,
    alignItems: 'center',
    borderBottomWidth: 1.4,
    borderColor: '#2a82e4',
    marginTop: ScaleSize(5),
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
