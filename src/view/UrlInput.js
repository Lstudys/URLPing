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
import LinearGradient from 'react-native-linear-gradient';

import {TestURL} from '../controller/AppPageFunction';
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

    let InputUrl = Data.InputUrl.split('\n');
    console.log('lalalaurl ' + url);
    console.log('lalalainput ' + Data.InputUrl.split('\n'));
    let flag = false;
    Data.errorIndex = [];
    let errorIndex = Data.errorIndex;
    for (let i = 0, j = 0; j < InputUrl.length; ) {
      if (url[i] != Data.InputUrl.split('\n')[j] + '\n') {
        flag = true;

        Data.errorIndex.push(j);
        let errorIndex = Data.errorIndex;

        console.log('这来了么' + Data.errorIndex);
        alert(Data.errorIndex);
        j++;
      } else {
        i++;
        j++;
      }
    }
    // return
    if (TestURL(InputUrl[errorIndex[errorIndex.length - 1]])) {
      console.log('合法了');
      errorIndex.pop();
      Data.errorIndex = errorIndex;
    }
    if (flag) {
      alert(errorIndex);
      // return

      if (errorIndex.length == 1 && Data.InputUrl != '') {
        let errorLength = 0;
        for (let i = 0; i <= Data.errorIndex[0]; i++) {
          errorLength += InputUrl[i].length;
        }
        alert('到这了');

        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength + errorIndex[0]) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength + errorIndex[0]);
        this.setState({refresh: !this.state.refresh});
        return;
      } else if (errorIndex.length == 2) {
        let errorLength1 = 0;
        let errorLength2 = 0;
        for (let i = 0; i <= errorIndex[0]; i++) {
          errorLength1 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[1]; i++) {
          errorLength2 += InputUrl[i].length;
        }

        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength1 + errorIndex[0]) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength1 + errorIndex[0]);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength2 + errorIndex[1] + 15) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength2 + errorIndex[1] + 15);
        this.setState({refresh: !this.state.refresh});
        return;
      } else if (errorIndex.length == 3) {
        // let errorLength1 = 0;
        // let errorLength2 = 0;
        // for (let i = 0; i <= errorIndex[0]; i++) {
        //   errorLength1 += InputUrl[i].length;
        // }
        // for (let i = 0; i <= errorIndex[1]; i++) {
        //   errorLength2 += InputUrl[i].length;
        // }

        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength1 + errorIndex[0]) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength1 + errorIndex[0]);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength2 + errorIndex[1] + 15) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength2 + errorIndex[1] + 15);
        this.setState({refresh: !this.state.refresh});
        return;
      } else if (errorIndex.length == 4) {
        let errorLength1 = 0;
        let errorLength2 = 0;
        let errorLength3 = 0;
        let errorLength4 = 0;
        for (let i = 0; i <= errorIndex[0]; i++) {
          errorLength1 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[1]; i++) {
          errorLength2 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[2]; i++) {
          errorLength3 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[3]; i++) {
          errorLength4 += InputUrl[i].length;
        }

        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength1 + errorIndex[0]) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength1 + errorIndex[0]);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength2 + errorIndex[1] + 15) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength2 + errorIndex[1] + 15);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength3 + errorIndex[2] + 30) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength3 + errorIndex[2] + 30);
        // this.setState({refresh: !this.state.refresh});
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength4 + errorIndex[3] + 45) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength4 + errorIndex[3] + 45);
        this.setState({refresh: !this.state.refresh});
        return;
      } else if (errorIndex.length == 5) {
        let errorLength1 = 0;
        let errorLength2 = 0;
        let errorLength3 = 0;
        let errorLength4 = 0;
        let errorLength5 = 0;
        for (let i = 0; i <= errorIndex[0]; i++) {
          errorLength1 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[1]; i++) {
          errorLength2 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[2]; i++) {
          errorLength3 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[3]; i++) {
          errorLength4 += InputUrl[i].length;
        }
        for (let i = 0; i <= errorIndex[4]; i++) {
          errorLength5 += InputUrl[i].length;
        }

        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength1 + errorIndex[0]) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength1 + errorIndex[0]);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength2 + errorIndex[1] + 15) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength2 + errorIndex[1] + 15);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength3 + errorIndex[2] + 30) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength3 + errorIndex[2] + 30);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength4 + errorIndex[3] + 45) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength4 + errorIndex[3] + 45);
        // Data.InputUrl =
        //   Data.InputUrl.slice(0, errorLength5 + errorIndex[4] + 60) +
        //   '     <=== ERROR' +
        //   Data.InputUrl.slice(errorLength5 + errorIndex[4] + 60);
        this.setState({refresh: !this.state.refresh});
        return;
      }
    }
    this.setState({refresh: !this.state.refresh});

    // Data.InputUrl.slice(0, this.state.currentIndex) +
    // Data.urlsArr[key] +
    // Data.InputUrl.slice(this.state.currentIndex);
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
      <View
        style={{
          flexDirection: 'row',
          height: h + ScaleSize(15),
          borderRadius: ScaleSize(10),
          width: Width * 0.95,
          marginLeft: Width * 0.025,
          marginTop: ScaleSize(20),
          backgroundColor: '#494b6d',
        }}>
        <TouchableOpacity
          onPress={() => {
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
    );
  };

  //快捷输入框
  _renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          alert(Data.errorIndex);
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
              />
            </View>
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
                style={styles.urlsArrFlatlist}
                horizontal={true}
                data={Data.urlsArr}
                renderItem={this._renderRow}
              />
            </View>
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
                {Data.errorIndex.indexOf(0) == 0 ? (
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
                        ERROR
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
                {Data.errorIndex.indexOf(1) >= 0 ? (
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
                        ERROR
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
                {Data.errorIndex.indexOf(2) >= 0 ? (
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
                        ERROR
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
                {Data.errorIndex.indexOf(3) >= 0 ? (
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
                        ERROR
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
                {Data.errorIndex.indexOf(4) >= 0 ? (
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
                        ERROR
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
              </View>
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
                  marginLeft: ScaleSize(20),
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
                  let index;
                  for (let i = 0; i < Data.InputUrl.split('\n').length; i++) {
                    if (
                      Data.InputUrl.split('\n')[i] != value.split('\n')[i] &&
                      Data.errorIndex.indexOf(i) >= 0
                    ) {
                      index = i;
                      Data.errorIndex.splice(Data.errorIndex.indexOf(i), 1);
                    }
                    if (Data.InputUrl.split('\n')[i] != value.split('\n')[i]) {
                      index = i;
                    }
                  }
                  console.log('这里' + index);

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
              />
            </View>
            {!this.state.keyBoardHeight ? (
              <View
                style={{
                  marginTop: ScaleSize(25),
                  flexDirection: 'row',
                  width: Width,
                  height: Height * 0.07,
                  backgroundColor: '#494b6d',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    marginLeft: Width * 0.08,

                    width: Width * 0.4,
                    height: Height * 0.06,
                    backgroundColor: '#76779b',
                    borderRadius: ScaleSize(10),
                    borderColor: '#fff',
                    borderWidth: ScaleSize(2),
                  }}
                  onPress={() => {
                    Data.InputUrl = '';
                    Data.errorIndex = [];
                    this.setState({numberOfUrlinTextInput: 0});
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.pingtext}>Clear</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginLeft: Width * 0.02,
                    width: Width * 0.4,
                    height: Height * 0.06,
                    backgroundColor: '#1f2342',
                    borderRadius: ScaleSize(10),
                    borderColor: '#fff',
                    borderWidth: ScaleSize(2),
                  }}
                  onPress={this.PING}>
                  <View style={{alignItems: 'center', height: Height * 0.06}}>
                    <Text style={styles.pingtext}>PING!</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
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
    color: '#fff',
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
