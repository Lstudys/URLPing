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
  Keyboard,
} from 'react-native';

import {SetSpText, ScaleSize} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import Data from '../modal/data';
import I18n from 'i18n-js';
import {LanguageChange} from '../component/LanguageChange';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Ordinary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history_height: Height * 0.3,
      FlatListIsRefreshing: false,
      isPing: false, //判断是否正在Ping
      refresh: false,
      currentUrlindex: -1,
      focus: false,

      keyBoardHeight: 0,
      currentIndex: -1,
      numberOfUrlinTextInput: 0,
    };
    Data.InputUrl = '';
    Data.pingurl = [''];
    LanguageChange.bind(this)();

    store.get(Data.pingIndex).then((res) => {
      if (res != null) {
        Data.Ping = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
  }
  identify = true;

  componentWillMount() {
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
      history_height: Height * 0.3,

      keyBoardHeight: e.endCoordinates.height,
    });
  }
  _keyboardDidHide() {
    this.setState({
      history_height: Height * 0.7,
      keyBoardHeight: 0,
    });
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

  renderitem_history = ({item, index}) => {
    let n = item[0].match(/\n/g) == null ? 1 : item[0].match(/\n/g).length;
    let h = Height * 0.03 * n;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            height: h + ScaleSize(15),
            borderRadius: ScaleSize(20),
            width: Width * 0.95,
            marginTop: ScaleSize(20),
            backgroundColor:"#494b6d"
          }}>
          <TouchableOpacity
            onPress={() => {
              if(Data.InputUrl=='')
              Data.InputUrl = Data.InputUrl + Data.historyPing[index];
              else{
                Data.InputUrl = Data.InputUrl.trim() +'\n'+ Data.historyPing[index];
              }
              this.setState({
                numberOfUrlinTextInput: this.state.numberOfUrlinTextInput + n,
              });
            }}>
            <View
              style={{
                width: ScaleSize(285),
                paddingLeft: Width * 0.1,
                paddingTop: Width * 0.02,
                justifyContent: 'center',
              }}>
              <Text
                // numberOfLines={1}
                ellipsizeMode={'tail'}
                style={{
                  color: '#fff',
                  fontSize: SetSpText(35),
                }}>
                {item}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              alignSelf: 'center',
              marginLeft: ScaleSize(5),
              marginTop: ScaleSize(15),
            }}>
            <TouchableOpacity
              onPress={() => {
                Data.historyPing.splice(parseInt(index), 1);
                this.setState({refresh: !this.state.refresh});
                console.log(Data.historyPing);
              }}>
              <View>
                <Image
                  source={require('../imgs/delete.png')}
                  style={{
                    width: ScaleSize(20),
                    height: ScaleSize(20),
                    marginBottom: ScaleSize(15),
                    marginHorizontal: ScaleSize(10),
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
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
          Data.InputUrl =
            Data.InputUrl.slice(0, this.state.currentIndex) +
            Data.urlsArr[key] +
            Data.InputUrl.slice(this.state.currentIndex);
          this.setState({refresh: !this.state.refresh});
          this.setState({focus: true});
        }}
        style={styles.renderRow}>
        <Text style={styles._renderRowitem}>{item}</Text>
      </TouchableOpacity>
    );
  };

  checkHistory = (value) => {
    let flag = true;
    for (let i = 0; i < Data.historyPing.length; i++) {
      if (value.trim() == Data.historyPing[i].trim()) {
        flag = false;
        break;
      }
    }
    if (flag) Data.historyPing.unshift(value);
  };
  render() {
    if (this.state.isPing) {
      return;
    } else {
      return (
        <View
          style={{
            backgroundColor: '#1f2342',
            height: Height,
            position: 'relative',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: '#1f2342',
              position: 'absolute',
              bottom: ScaleSize(20),
            }}>
            <View
              style={{
                marginBottom: ScaleSize(20),
                width: Width * 0.9,
              }}>
              <FlatList
                inverted={true}
                scrollEnabled={true}
                keyboardShouldPersistTaps={'handled'}
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
                style={{
                  height: this.state.history_height,
                  width: Width * 0.95,
                  borderRadius: ScaleSize(13),
                }}
                refreshing={this.state.FlatListIsRefreshing}
                renderItem={this.renderitem_history}
                data={Data.historyPing}
              />
            </View>
            <View
              style={{
                height: Height * 0.062,
                width: Width,
                marginBottom: ScaleSize(15),
              }}>
              <FlatList
                scrollEnabled={true}
                keyboardShouldPersistTaps={'handled'}
                style={styles.urlsArrFlatlist}
                horizontal={true}
                data={Data.urlsArr}
                renderItem={this._renderRow}
              />
            </View>
            <View
              style={{
                borderColor: 'pink',
                borderWidth: ScaleSize(4),
                borderBottomWidth: ScaleSize(2),
                height:
                  Height *
                  (0.06 + 0.03 * (this.state.numberOfUrlinTextInput + 1)),
                backgroundColor: '#fff',
                borderRadius: ScaleSize(20),
              }}>
              <TextInput
                value={Data.InputUrl}
                autoFocus={true}
                multiline={true}
                placeholder={'https://www.baidu.com'}
                onSelectionChange={(event) => {
                  //将当前的光标定位到起点位置
                  let last = 'com|edu|cn|gov|org';
                  let reg = new RegExp(
                    'https?://(www.)?\\w+(.(' + last + '))+\n+',
                    'g',
                  );
                  let n =
                    Data.InputUrl.match(reg) == null
                      ? 0
                      : Data.InputUrl.match(reg).length;
                  this.setState({
                    numberOfUrlinTextInput: n,
                  });
                  this.state.currentIndex = event.nativeEvent.selection.start;
                }}
                style={{
                  paddingBottom: Height * 0.01,
                  marginLeft: ScaleSize(10),
                  marginTop: ScaleSize(3),
                  height:
                    Height *
                    (0.04 + 0.03 * (this.state.numberOfUrlinTextInput + 1)),
                  width: Width * 0.9,
                  // marginLeft: Width * 0.05,
                  position: 'absolute',
                  fontSize: ScaleSize(18),
                }}
                onChangeText={(value) => {
                  Data.InputUrl = value;
                  this.setState({refresh: !this.state.refresh});
                }}
              />
            </View>
            <View
              style={{
                marginLeft: Width * 0.01,

                marginTop: ScaleSize(15),
                flexDirection: 'row',
                width: Width * 0.18,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  width: Width * 0.48,
                  height: Height * 0.06,
                  backgroundColor: '#fff',
                  borderRadius: ScaleSize(10),
                  borderColor: 'pink',
                  borderWidth: ScaleSize(2),
                }}
                onPress={() => {
                  Data.InputUrl = '';
                  this.setState({numberOfUrlinTextInput: 0});
                }}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.pingtext}>Clear！</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginLeft: Width * 0.02,
                  width: Width * 0.48,
                  height: Height * 0.06,
                  backgroundColor: '#fff',
                  borderRadius: ScaleSize(10),
                  borderColor: 'pink',
                  borderWidth: ScaleSize(2),
                }}
                onPress={() => {
                  Platform.OS;
                  //正则分割字符串
                  let last = 'com|edu|cn|gov|org';
                  let reg = new RegExp(
                    'https?://(www.)?\\w+(.(' + last + '))+\n*',
                    'g',
                  );
                  let url = Data.InputUrl.match(reg);
                  console.log("lalala"+url);
                  if (url == null) {
                    Toast.message(I18n.t('urlempty'));
                    return;
                  }
                  if (url.length > 5) {
                    Toast.message(I18n.t('maxfiveurl'));
                    return;
                  }
                  console.log('清空之前', Data.pingurl);
                  Data.pingurl = [''];
                  console.log('清空之后', Data.pingurl);

                  for (let i = 0; i < url.length; i++) {
                    // if(url[i].trim().substring(1,4)=='www')
                    // {

                    // }
                    // console.log("是吗"+url[i].trim().substring(1,4));
                    Data.pingurl[i] = url[i].trim();
                  }
                  console.log('赋值之后', Data.pingurl);

                  //检测url合法性
                  this.identify = true;
                  for (let i = 0; i < Data.pingurl.length; i++) {
                    if (Data.pingurl[i].search(reg) < 0) {
                      this.identify = false;
                    }
                  }

                  if (this.identify) {
                    if (Data.pingurl.length != 0) {
                      //查重并拆分
                      let inputUrl = '';
                      for (let i = 0; i < url.length; i++) {
                        let urlStr = url[i].trim() + '\n';
                        inputUrl = inputUrl + urlStr;
                        this.checkHistory(url[i]);
                      }
                      // this.checkHistory(inputUrl);
                      store.save('history', Data.historyPing);
                      this.setState({refresh: !this.state.refresh});
                      console.log(Data.historyPing);
                      this.props.navigation.navigate('Ping', {
                        urlData: [...Data.pingurl],
                      });
                    } else {
                      Toast.message(I18n.t('nourladded'));
                    }
                  } else {
                    Toast.message(I18n.t('reject_Test'));
                  }
                }}>
                <View style={{alignItems: 'center', height: Height * 0.06}}>
                  <Text style={styles.pingtext}>GO!</Text>
                </View>
              </TouchableOpacity>
            </View>
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
    fontSize: SetSpText(50),
    color: 'pink',
    fontWeight: '700',
  },
  pingwhole: {
    marginHorizontal: ScaleSize(5),
    // marginBottom: ScaleSize(10),
    // marginTop: ScaleSize(10),
  },
  urlsArrFlatlist: {
    backgroundColor: '#494b6d',
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
    marginLeft: ScaleSize(10),
    flexDirection: 'row',
    marginTop: ScaleSize(4),
    height: Height * 0.045,
    marginRight: Width * 0.05,
    borderRadius: ScaleSize(20),
  },
  _renderRowitem: {
    fontSize: SetSpText(35),
    marginTop: ScaleSize(5),
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
