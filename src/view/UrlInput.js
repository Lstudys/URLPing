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
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
class Ordinary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Color: '#1f2342',
      editable: false,
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
    store.get(Data.ThemeColor).then((v, r) => {
      if (v == null) this.setState({Color: '#1f2342'});
      else {
        console.log(v);
        this.setState({Color: v});
      }
    });
    // Data.errorIndex=[]
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
      history_height: Height * 0.6,
      keyBoardHeight: 0,
    });
  }
  PING = () => {
    Platform.OS;
    //正则分割字符串
    let last = 'com|edu|cn|gov|org';
    let reg = new RegExp('https?://(www.)?\\w+(.(' + last + '))+\n*', 'g');
    let url = Data.InputUrl.match(reg) ? Data.InputUrl.match(reg) : [];
    //url:从输入框正则出来的标准url格式数组

    let InputUrl = Data.InputUrl.split('\n');
    //InputUrl:
    console.log('lalalaurl ' + url);
    console.log('lalalainput ' + Data.InputUrl.split('\n'));
    let flag = false;
    Data.errorIndex = [];
    Data.emptyIndex = [];
    for (let i = 0, j = 0; j < InputUrl.length; ) {
      if (url[i] != InputUrl[j] + '\n') {
        if (
          j == InputUrl.length - 1 &&
          url[url.length - 1] == InputUrl[InputUrl.length - 1]
        ) {
          break;
        } else {
          if (InputUrl[j].slice(0, 3) == 'www') {
            InputUrl[j] = 'http://' + InputUrl[j];
            Data.InputUrl = InputUrl.join('\n');
          } else if (
            InputUrl[j].slice(0, 4) != 'http' &&
            Data.url_suffix.search(InputUrl[j].slice(-3)) != -1
          ) {
            InputUrl[j] = 'http://' + InputUrl[j];
            Data.InputUrl = InputUrl.join('\n');
          } else Data.errorIndex.push(j);
          if (InputUrl[j].trim() == 'http://' || InputUrl[j].trim() == '') {
            Data.emptyIndex.push(j);
            console.log('empty' + Data.emptyIndex);
          }
        }
        j++;
      } else {
        i++;
        j++;
      }
    }
    console.log('什么类型', InputUrl[0].trim().length, '666');
    // if(Data.errorIndex.length==1){
    //   console.log("长度有问题"+url[Data.errorIndex[0]].length);
    //   console.log("长度有问题2"+InputUrl[Data.errorIndex[0]].length);
    // }

    this.setState({refresh: !this.state.refresh});
    // if (url == null) {
    //   Toast.message(I18n.t('urlempty'));
    //   return;
    // }

    if (url.length > 5) {
      Toast.message(I18n.t('maxfiveurl'));
      return;
    }

    // console.log('清空之前', Data.pingurl);
    Data.pingurl = [''];
    // console.log('清空之后', Data.pingurl);

    for (let i = 0; i < url.length; i++) {
      Data.pingurl[i] = url[i].trim();
    }

    if (!(Data.errorIndex[0] >= 0) && !(Data.emptyIndex[0] >= 0)) {
      if (Data.pingurl.length != 0) {
        //查重并拆分
        let inputUrl = '';
        for (let i = 0; i < url.length; i++) {
          let urlStr = url[i].trim() + '\n';
          inputUrl = inputUrl + urlStr;
          this.checkHistory(url[i]);
        }
        store.save('history', Data.historyPing);
        this.setState({refresh: !this.state.refresh});
        this.props.navigation.navigate('Ping', {
          urlData: [...InputUrl],
        });
      } else {
        Toast.message(I18n.t('nourladded'));
      }
    } else {
      Toast.message(I18n.t('reject_Test'));
    }
  };

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
            style={styles.input}>
            {' '}
          </TextInput>{' '}
        </View>{' '}
        {/*第一个不包含删除按钮*/}{' '}
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
            />{' '}
          </TouchableOpacity>{' '}
        </View>{' '}
      </View>
    );
  };
  renderitem_history = ({item, index}) => {
    let n = item[0].match(/\n/g) == null ? 1 : item[0].match(/\n/g).length;
    let h = Height * 0.03 * n;
    return (
      <View
        style={{
          flexDirection: 'row',
          height: h + ScaleSize(15),
          borderRadius: ScaleSize(10),
          width: Width * 0.95,
          marginLeft: Width * 0.025,
          marginTop: ScaleSize(20),
          backgroundColor:
            this.state.Color == '#4588AA' ? '#6BA5C2' : '#494b6d',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (Data.InputUrl == '') {
              Data.InputUrl = Data.InputUrl.trim();

              let a = Data.InputUrl.split('\n');

              if (a[a.length - 1] == '') {
                a.pop();
                Data.InputUrl = a.join('\n');
              }
              if (Data.InputUrl.split())
                if (Data.InputUrl.split('\n').length > 4) {
                  Toast.message('最多ping五个');
                  return;
                }
              Data.InputUrl =
                Data.InputUrl.trim() + '\n' + Data.historyPing[index];

              Data.InputUrl = Data.InputUrl.trim();

              this.setState({
                numberOfUrlinTextInput: 0,
              });
            } else {
              Data.InputUrl = Data.InputUrl.trim();

              let a = Data.InputUrl.split('\n');

              if (a[a.length - 1] == '') {
                a.pop();
                Data.InputUrl = a.join('\n');
              }
              if (Data.InputUrl.split())
                if (Data.InputUrl.split('\n').length > 4) {
                  Toast.message('最多ping五个');
                  return;
                }
              Data.InputUrl =
                Data.InputUrl.trim() + '\n' + Data.historyPing[index];

              Data.InputUrl = Data.InputUrl.trim();

              this.setState({
                numberOfUrlinTextInput: this.state.numberOfUrlinTextInput + n,
              });
            }
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
              {' '}
              {item}{' '}
            </Text>{' '}
          </View>{' '}
        </TouchableOpacity>{' '}
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
              />{' '}
            </View>{' '}
          </TouchableOpacity>{' '}
        </View>{' '}
      </View>
    );
  };

  //快捷输入框
  _renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // alert(Data.errorIndex);
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
        <Text style={styles._renderRowitem}> {item} </Text>{' '}
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
            backgroundColor: this.state.Color,
            height: Height,
            position: 'relative',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: this.state.Color,
              position: 'absolute',
              bottom: ScaleSize(20),
            }}>
            <View
              style={{
                marginBottom: ScaleSize(20),
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
                  width: Width,
                  borderRadius: ScaleSize(13),
                }}
                refreshing={this.state.FlatListIsRefreshing}
                renderItem={this.renderitem_history}
                data={Data.historyPing}
              />{' '}
            </View>{' '}
            <View
              style={{
                height: Height * 0.062,
                width: Width,
                marginBottom: ScaleSize(10),
                marginTop: ScaleSize(5),
              }}>
              <FlatList
                scrollEnabled={true}
                keyboardShouldPersistTaps={'handled'}
                style={{
                  backgroundColor:
                    this.state.Color == '#4588AA' ? '#6BA5C2' : '#494b6d',
                }}
                horizontal={true}
                data={Data.urlsArr}
                renderItem={this._renderRow}
              />{' '}
            </View>{' '}
            <View
              style={{
                position: 'relative',
                marginBottom: ScaleSize(-15),
                width: Width * 0.9,
                marginLeft: Width * 0.05,
                borderColor: '#fff',
                borderWidth: ScaleSize(4),
                borderBottomWidth: ScaleSize(2),
                height:
                  Height *
                  (0.04 + 0.03 * (this.state.numberOfUrlinTextInput + 1)),
                backgroundColor: '#fff',
                borderRadius: ScaleSize(20),
              }}>
              <View>
                {' '}
                {Data.emptyIndex.indexOf(0) >= 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.02,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: '#2a82e4',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        EMPTY{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.emptyIndex.indexOf(1) >= 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.05,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: '#2a82e4',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        EMPTY{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.emptyIndex.indexOf(2) >= 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.08,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: '#2a82e4',
                      opacity: 0.8,
                    }}>
                    <View
                      style={{
                        marginLeft: Width * 0.72,
                        marginTop: Height * 0.001,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        EMPTY{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.emptyIndex.indexOf(3) >= 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.11,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: '#2a82e4',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        EMPTY{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.emptyIndex.indexOf(4) >= 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.14,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.032,
                      backgroundColor: '#2a82e4',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        EMPTY{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
              </View>{' '}
              <View>
                {' '}
                {Data.errorIndex.indexOf(0) >= 0 &&
                !(Data.emptyIndex.indexOf(0) >= 0) ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.02,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: 'red',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        ERROR{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.errorIndex.indexOf(1) >= 0 &&
                !(Data.emptyIndex.indexOf(1) >= 0) ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.05,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: 'red',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        ERROR{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.errorIndex.indexOf(2) >= 0 &&
                !(Data.emptyIndex.indexOf(2) >= 0) ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.08,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: 'red',
                      opacity: 0.8,
                    }}>
                    <View
                      style={{
                        marginLeft: Width * 0.72,
                        marginTop: Height * 0.001,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        ERROR{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.errorIndex.indexOf(3) >= 0 &&
                !(Data.emptyIndex.indexOf(3) >= 0) ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.11,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.028,
                      backgroundColor: 'red',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        ERROR{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.errorIndex.indexOf(4) >= 0 &&
                !(Data.emptyIndex.indexOf(4) >= 0) ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.14,
                      width: Width * 0.9,
                      borderRadius: ScaleSize(5),
                      marginLeft: -ScaleSize(4),
                      height: Height * 0.032,
                      backgroundColor: 'red',
                      opacity: 0.8,
                    }}>
                    <View style={{marginLeft: Width * 0.72}}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(16),
                        }}>
                        ERROR{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
              </View>{' '}
              <View>
                {' '}
                {Data.InputUrl.split('\n').length > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.022,
                      width: Height * 0.02,
                      borderRadius: Height * 0.032,
                      marginLeft: ScaleSize(10),
                      height: Height * 0.02,
                      backgroundColor: 'red',
                      opacity: 0.8,
                      alignItems: 'center',
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginTop: -ScaleSize(2.5),
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(12),
                        }}>
                        A{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.InputUrl.split('\n').length > 1 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.052,
                      width: Height * 0.02,
                      borderRadius: Height * 0.032,
                      marginLeft: ScaleSize(10),
                      height: Height * 0.02,
                      backgroundColor: '#2a82e4',
                      opacity: 0.8,
                      alignItems: 'center',
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginTop: -ScaleSize(2.5),

                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(12),
                        }}>
                        B{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.InputUrl.split('\n').length > 2 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.082,
                      width: Height * 0.02,
                      borderRadius: Height * 0.032,
                      marginLeft: ScaleSize(10),
                      height: Height * 0.02,
                      backgroundColor: 'green',
                      opacity: 0.8,
                      alignItems: 'center',
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginTop: -ScaleSize(2.5),

                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(12),
                        }}>
                        C{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.InputUrl.split('\n').length > 3 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.112,
                      width: Height * 0.02,
                      borderRadius: Height * 0.032,
                      marginLeft: ScaleSize(10),
                      height: Height * 0.02,
                      backgroundColor: '#f67e1e',
                      opacity: 0.8,
                      alignItems: 'center',
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginTop: -ScaleSize(2.5),

                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(12),
                        }}>
                        D{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
                {Data.InputUrl.split('\n').length > 4 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: Height * 0.142,
                      width: Height * 0.02,
                      borderRadius: Height * 0.032,
                      marginLeft: ScaleSize(10),
                      height: Height * 0.02,
                      backgroundColor: 'purple',
                      opacity: 0.8,
                      alignItems: 'center',
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          marginTop: -ScaleSize(2.5),

                          color: '#fff',
                          fontWeight: '700',
                          fontSize: ScaleSize(12),
                        }}>
                        E{' '}
                      </Text>{' '}
                    </View>{' '}
                  </View>
                ) : (
                  <View />
                )}{' '}
              </View>{' '}
              <TextInput
                ref={(input) => (this.input = input)}
                value={Data.InputUrl}
                numberOfLines={5}
                autoFocus={true}
                multiline={true}
                allowFontScaling={false}
                blurOnSubmit={false}
                enablesReturnKeyAutomatically={true}
                importantForAutofill="auto"
                placeholder={'https://www.baidu.com'}
                onBlur={() => {
                  this.setState({
                    numberOfUrlinTextInput:
                      Data.InputUrl.split('\n').length - 1,
                  });
                }}
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
                  // if(Data.InputUrl.split('\n').length>4) {
                  //   Toast.message("最多ping五个")
                  //   return ;
                  // }
                  this.setState({
                    numberOfUrlinTextInput:
                      Data.InputUrl.split('\n').length - 1,
                  });

                  this.state.currentIndex = event.nativeEvent.selection.start;
                }}
                style={{
                  paddingBottom: Height * 0.01,
                  marginLeft: ScaleSize(40),
                  marginTop: ScaleSize(0),
                  height:
                    Height *
                    (0.03 + 0.03 * (this.state.numberOfUrlinTextInput + 1)),
                  width: Width * 0.8,
                  // marginLeft: Width * 0.05,
                  position: 'absolute',
                  fontSize: ScaleSize(18),
                }}
                onChangeText={(value) => {
                  console.log('我来康康text：' + Data.errorIndex);
                  let index;
                  for (let i = 0; i < Data.InputUrl.split('\n').length; i++) {
                    if (
                      Data.InputUrl.split('\n')[i] != value.split('\n')[i] &&
                      Data.errorIndex.indexOf(i) >= 0
                    ) {
                      index = i;
                      Data.errorIndex.splice(Data.errorIndex.indexOf(i), 1);
                    }
                    if (
                      Data.InputUrl.split('\n')[i] != value.split('\n')[i] &&
                      Data.emptyIndex.indexOf(i) >= 0
                    ) {
                      index = i;
                      Data.emptyIndex.splice(Data.emptyIndex.indexOf(i), 1);
                    }
                    if (Data.InputUrl.split('\n')[i] != value.split('\n')[i]) {
                      index = i;
                    }
                  }
                  console.log('这里' + index);
                  // for(let i=0;i<Data.InputUrl.split('\n').length;i++){

                  // }

                  if (Data.InputUrl.split('\n').length > 5) {
                    Toast.message('最多ping五个');
                    let a = Data.InputUrl.split('\n');
                    a.splice(index, 1);
                    Data.InputUrl = a.join('\n');

                    this.setState({refresh: !this.state.refresh});

                    return;
                  }
                  console.log('次数' + this.state.numberOfUrlinTextInput);
                  Data.InputUrl = value;

                  this.setState({refresh: !this.state.refresh});
                }}
              />{' '}
            </View>{' '}
            {!this.state.keyBoardHeight ? (
              <View
                style={{
                  marginTop: ScaleSize(25),
                  flexDirection: 'row',
                  width: Width,
                  height: Height * 0.07,
                  backgroundColor: this.state.Color,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    marginLeft: Width * 0.08,

                    width: Width * 0.4,
                    height: Height * 0.06,
                    backgroundColor:
                      this.state.Color == '#4588AA' ? '#6BA5C2' : '#494b6d',
                    borderRadius: ScaleSize(10),
                    borderColor: '#fff',
                    borderWidth: ScaleSize(2),
                  }}
                  onPress={() => {
                    Data.InputUrl = '';
                    Data.errorIndex = [];
                    Data.emptyIndex = [];
                    this.setState({numberOfUrlinTextInput: 0});
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.pingtext}> Clear </Text>{' '}
                  </View>{' '}
                </TouchableOpacity>{' '}
                <TouchableOpacity
                  style={{
                    marginLeft: Width * 0.02,
                    width: Width * 0.4,
                    height: Height * 0.06,
                    backgroundColor:
                      this.state.Color == '#4588AA' ? '#336699' : '#2C1F42',
                    borderRadius: ScaleSize(10),
                    borderColor: '#fff',
                    borderWidth: ScaleSize(2),
                  }}
                  onPress={this.PING}>
                  <View style={{alignItems: 'center', height: Height * 0.06}}>
                    <Text style={styles.pingtext}> PING! </Text>{' '}
                  </View>{' '}
                </TouchableOpacity>{' '}
              </View>
            ) : (
              <View />
            )}{' '}
          </View>{' '}
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
    color: '#fff',
    fontWeight: '700',
  },
  pingwhole: {
    marginHorizontal: ScaleSize(5),
    // marginBottom: ScaleSize(10),
    // marginTop: ScaleSize(10),
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
