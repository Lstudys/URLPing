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
      FlatListIsRefreshing: false,
      isPing: false, //判断是否正在Ping
      refresh: false,
      currentUrlindex: -1,
      focus: false,
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      keyBoardHeight: 0,
      currentIndex: -1,
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
    return (
      <View
        style={{
          flexDirection: 'row',
          height: Height * 0.05,
          width: Width * 0.95,
          marginTop: ScaleSize(20),
        }}>
        <TouchableOpacity
          onPress={() => {
            Data.InputUrl = Data.InputUrl + ' ' + Data.historyPing[index];

            this.setState({refresh: !this.state.refresh});
          }}>
          <View
            style={{
              width: ScaleSize(255),
              height: ScaleSize(34),
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
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
              // for (
              //   let i = 0, j = Data.historyPing.length;
              //   i < Data.historyPing.length;
              //   i++, j--
              // ) {
              //   Data.historyPing[i].key = j;
              // }
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
          // console.log("history"+Data.historyPing);
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
          // Data.Ping[parseInt(this.state.currentUrlindex)].url =
          //   Data.Ping[parseInt(this.state.currentUrlindex)].url.slice(
          //     0,
          //     this.state.currentIndex,
          //   ) +
          //   Data.urlsArr[key] +
          //   Data.Ping[parseInt(this.state.currentUrlindex)].url.slice(
          //     this.state.currentIndex,
          //   );
          // store.save(Data.pingIndex, Data.Ping);
          console.log('变了吗' + Data.InputUrl);
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
        <View
          style={{
            backgroundColor: '#1f2342',
            height: Height,
            position: 'relative',
          }}>
          <View
            style={{
              backgroundColor: '#1f2342',
              position: 'absolute',
              bottom: ScaleSize(20),
            }}>
            <View
              style={{
                marginBottom: ScaleSize(10),
                width: Width * 0.9,
                marginLeft: Width * 0.08,
              }}>
              <FlatList
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
                  marginLeft: ScaleSize(-4),
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
                width: Width * 0.95,
                marginLeft: Width * 0.025,
                marginBottom: ScaleSize(15),
              }}>
              <FlatList
                scrollEnabled={false}
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
                height: Height * 0.08,
                backgroundColor: '#fff',
                borderRadius: ScaleSize(20),
              }}>
              <TextInput
                value={Data.InputUrl}
                autoFocus={true}
                placeholder={'https://www.geogle.com'}
                onSelectionChange={(event) => {
                  //将当前的光标定位到起点位置
                  this.state.currentIndex = event.nativeEvent.selection.start;
                }}
                style={{
                  paddingBottom: Height * 0.01,

                  marginTop: ScaleSize(3),
                  height: Height * 0.06,
                  backgroundColor: '#fff',
                  width: Width * 0.6,
                  marginLeft: Width * 0.05,
                  position: 'absolute',
                  fontSize: ScaleSize(18),
                }}
                onChangeText={(value) => {
                  Data.InputUrl = value;

                  console.log('来呗' + Data.InputUrl);
                  this.setState({refresh: !this.state.refresh});
                  // store.update(Data.Ping[parseInt(item.key)].url, value);
                  // store.save(Data.pingIndex, Data.Ping);
                }}
                // onKeyPress={
                //   this.props.navigation.navigate('UrlInput')
                // }
              ></TextInput>
              <View
                style={{
                  flexDirection: 'row',

                  width: Width * 0.18,
                  alignItems: 'center',
                  position: 'absolute',
                  right: Width * 0.1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    Data.InputUrl = '';
                    this.setState({refresh: !this.state.refresh});
                  }}>
                  <View>
                    <Image
                      source={require('../imgs/small_delete.png')}
                      style={{
                        marginTop: ScaleSize(16),
                        width: ScaleSize(20),
                        height: ScaleSize(20),
                        marginBottom: ScaleSize(15),
                        marginHorizontal: ScaleSize(10),
                      }}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    let url = Data.InputUrl.trim().split(/\s+/);
                    if (url.length > 5) {
                      Toast.message(I18n.t('maxfiveurl'));
                      return;
                    }
                    for (let i = 0; i < url.length; i++) {
                      Data.pingurl[i] = url[i];
                    }
                    this.identify = true;

                    if (this.identify) {
                      if (Data.pingurl.length != 0) {
                        Data.historyPing.push([Data.InputUrl]);
                        store.save('history', Data.historyPing);
                        // let Ping_length = Data.pingurl.length;
                        // let History_length = Data.historyPing.length;
                        // for (
                        //   let i = 0, j = History_length;
                        //   i < Ping_length;
                        //   i++, j++
                        // ) {
                        //   Data.historyPing = [
                        //     ...Data.historyPing,
                        //     {key: j, url: Data.pingurl[i].url},
                        //   ];
                        // }
                        this.setState({refresh: !this.state.refresh});
                        this.props.navigation.navigate('Ping', {
                          urlData: [...Data.pingurl],
                        });
                        console.log('history:' + Data.historyPing);
                      } else {
                        Toast.message(I18n.t('nourladded'));
                      }
                    } else {
                      Toast.message(I18n.t('reject_Test'));
                    }
                  }}>
                  <Text style={styles.pingtext}>GO!</Text>
                </TouchableOpacity>
              </View>
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
    borderRadius: ScaleSize(13),
    backgroundColor: '#1e1e1e',
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

{
  /* <View style={{marginTop: ScaleSize(20)}}>
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
                </View> */
}
{
  /* <KeyboardAccessory>
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
                </KeyboardAccessory> */
}

{
  /* <TouchableOpacity
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
                </TouchableOpacity> */
}
{
  /* <View style={{height: Height * 0.062}}>
                  <FlatList
                    scrollEnabled={false}
                    keyboardShouldPersistTaps={'handled'}
                    style={styles.urlsArrFlatlist}
                    horizontal={true}
                    data={Data.urlsArr}
                    renderItem={this._renderRow}
                  />
                </View> */
}

{
  /* 
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
          </View> */
}
