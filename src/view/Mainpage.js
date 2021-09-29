import React, {Component} from 'react';
import {Image, Keyboard} from 'react-native';
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
import {getIpAddressesForHostname} from 'react-native-dns-lookup';

import {
  SetSpText,
  ScaleSize,
} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import TheData from '../modal/TheData';
import I18n from 'i18n-js';
import {LanguageChange} from '../component/LanguageChange';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListIsRefreshing: false,
      isPing: false,
      refresh: false,
      currentUrlindex: -1,
      focus: false,
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      keyBoardHeight: 0,
      currentIndex: -1,
      isNew: true, //判断是不是先进入简易模式
      ip: '1234',
      ip2: '',
      ip3: '',
      ip4: '',
      ip5: '',
      IP: [],
    };

    LanguageChange.bind(this)();

    store.get(TheData.pingIndex).then((res) => {
      if (res != null) {
        TheData.Ping = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
  }
  identify = true;

  componentWillMount() {
    store.get('historyPing').then((res) => {
      if (res != null) {
        TheData.historyPing = res;
        this.setState({refresh: !this.state.refresh});
      }
    });

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow(e) {
    this.setState({
      keyBoardHeight: e.endCoordinates.height,
    });
    console.log('键盘高度为:', this.state.keyBoardHeight);
    console.log('屏幕高度为:', Height);
  }
  _keyboardDidHide() {
    this.setState({
      keyBoardHeight: 0,
    });
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.renderItem}>
        <View
          style={{
            // paddingRight: ScaleSize(-20),
            marginRight: ScaleSize(0),
          }}>
          <TextInput
            onSelectionChange={(event) => {
              (this.state.currentIndex = event.nativeEvent.selection.start),
                console.log('光标位置', this.state.currentIndex);
            }}
            defaultValue={TheData.Ping[parseInt(item.key)].url}
            onFocus={(value) => {
              this.state.currentUrlindex = item.key;
              console.log('currentUrlindex', this.state.currentUrlindex);
              console.log('key:', this.state.currentUrlindex);
            }}
            onChangeText={(value) => {
              TheData.Ping[parseInt(item.key)].url = value;
              this.setState({refresh: !this.state.refresh});
              store.update(TheData.Ping[parseInt(item.key)].url, value);
              console.log(TheData.Ping);
              store.save(TheData.pingIndex, TheData.Ping);
              store.get(TheData.pingIndex).then((res) => {
                console.log('res:', res);
              });
            }}
            placeholder={I18n.t('input')}
            style={styles.input}></TextInput>
        </View>
        {/*第一个不包含删除按钮*/}

        <View style={styles.delete}>
          <TouchableOpacity
            onPress={() => {
              TheData.Ping.splice(parseInt(item.key), 1);
              for (let i = 0; i < TheData.Ping.length; i++) {
                TheData.Ping[i].key = i;
              }
              this.setState({refresh: !this.state.refresh});
              console.log(TheData.Ping);
              store.save(TheData.pingIndex, TheData.Ping);
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
  _renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          for (let i = 0; i < TheData.urlsArr.length; i++) {
            if (TheData.urlsArr[i] == item) {
              var key = i;
              break;
            }
          }
          if (this.state.currentUrlindex == -1) {
            // alert(I18n.t('selectinputbox'));
            return;
          }

          // alert(TheData.urlsArr[item.key])
          TheData.Ping[parseInt(this.state.currentUrlindex)].url =
            TheData.Ping[parseInt(this.state.currentUrlindex)].url.slice(
              0,
              this.state.currentIndex,
            ) +
            TheData.urlsArr[key] +
            TheData.Ping[parseInt(this.state.currentUrlindex)].url.slice(
              this.state.currentIndex,
            );
          store.save(TheData.pingIndex, TheData.Ping);
          store.get(TheData.pingIndex).then((res) => {
            console.log('res:', res);
          });
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
        <View>
          <View style={{height: Height - 100, position: 'relative'}}>
            <View
              ref={(ScrollView) => {
                ScrollView = ScrollView;
              }}
              keyboardShouldPersistTaps={true}
              style={{flex: 1, height: Height, position: 'relative'}}>
              <View>
                <View style={styles.navigation}>
                  <Text style={styles.navigationtext}>GraphURLPing</Text>
                </View>

                <View style={{marginTop: ScaleSize(20)}}>
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    data={TheData.Ping}
                    renderItem={this.renderItem}
                    refreshing={this.state.FlatListIsRefreshing}
                    onRefresh={() => {
                      this.setState((prevState) => ({
                        FlatListIsRefreshing: true,
                      }));
                      setTimeout(() => {
                        this.setState((prevState) => ({
                          FlatListIsRefreshing: false,
                        }));
                      }, 1000);
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={styles.pingTouchable}
                  onPress={() => {
                    if (TheData.Ping.length != 0) {
                      let key = TheData.Ping.length;
                      if (key >= 5) {
                        alert(I18n.t('maxfiveurl'));
                        return;
                      }
                      TheData.Ping = [...TheData.Ping, {key: key, url: ''}];
                      for (let i = 0; i < TheData.Ping.length; i++) {
                        TheData.Ping[i].key = i;
                      }
                      this.setState({refresh: !this.state.refresh});
                    } else {
                      TheData.Ping = [{key: 0, url: ''}];
                      this.setState({refresh: !this.state.refresh});
                    }
                    store.save(TheData.pingIndex, TheData.Ping);
                  }}>
                  <View style={styles.add}>
                    <Image
                      source={require('../imgs/add.png')}
                      style={styles.addimage}
                    />
                  </View>
                </TouchableOpacity>
                <View
                  style={{height: Height * 0.062}}>
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    style={styles.urlsArrFlatlist}
                    horizontal={true}
                    data={TheData.urlsArr}
                    renderItem={this._renderRow}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.pingwhole}>
            <TouchableOpacity
              onPress={() => {
                for (let i = 0; i < TheData.Ping.length; i++) {
                  if (
                    TheData.Ping[i].url == 'https://' ||
                    TheData.Ping[i].url == ''
                  ) {
                    this.identify = false;
                    break;
                  } else {
                    this.identify = true;
                  }
                }
                if (this.identify) {
                  if (TheData.Ping.length != 0) {
                    
                    let Ping_length = TheData.Ping.length;
                    let History_length = TheData.historyPing.length;
                    for (
                      let i = 0, j = History_length;
                      i < Ping_length;
                      i++, j++
                    ) {
                      TheData.historyPing = [
                        ...TheData.historyPing,
                        {key: j, url: TheData.Ping[i].url},
                      ];
                    }
                    this.setState({refresh: !this.state.refresh});
                    this.props.navigation.navigate('Ping', {
                      urlData: [...TheData.Ping],
                    });
                  } else {
                    Toast.message(I18n.t('nourladded'));
                  }
                } else {
                  Toast.message(I18n.t('urlempty'));
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
export default My;

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
    marginTop: ScaleSize(5),
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
    marginBottom: ScaleSize(10),
    marginTop: ScaleSize(10),
  },
  urlsArrFlatlist: {
    marginLeft: ScaleSize(3),
    marginRight: ScaleSize(3),
    marginBottom: ScaleSize(4),
    borderRadius: ScaleSize(13),
    backgroundColor: '#2a82e4',
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
    height: Height * 0.058,
    alignItems: 'center',
    borderBottomWidth: 1.4,
    borderColor: '#2a82e4',
    marginTop: ScaleSize(20),
  },
  renderRow: {
    marginLeft: ScaleSize(13),
    flexDirection: 'row',
    marginTop: ScaleSize(4),
    height: Height * 0.045,
    backgroundColor: '#ffffff',
    marginRight: ScaleSize(9),
    borderRadius: ScaleSize(20),
  },
  _renderRowitem: {
    fontSize: SetSpText(35),
    margin: ScaleSize(2),
    color: '#2782e5',
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
