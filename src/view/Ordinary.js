import {blue} from 'chalk';
import React, {Component} from 'react';
import {Image, Keyboard,KeyboardAvoidingView } from 'react-native';
import {Toast,Carousel} from 'teaset';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  Button,
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Overlay,
} from 'react-native';

import {
  ScaleSizeH,
  ScaleSizeR,
  ScaleSizeW,
  SetSpText,
  ScaleSize,
} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import TheData from '../modal/TheData';
import {ScrollView} from 'react-native';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import Data from '../modal/data';
import ActionButton from 'react-native-action-button';

const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
//样式数据
const history = [
  {key: '0', url: 'http://www.baidu.com'},
  {key: '1', url: 'http://www.souhu.com'},
  {key: '2', url: 'http://www.souhu.com'},
];

class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QuickSelectIndex: 0,
      visible: false,
      FlatListIsRefreshing: false,
      isPing: false,
      refresh: false,
      currentUrlindex: -1,
      focus: false,
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      keyBoardHeight: 0,
      currentIndex: -1,
      isNew: true, //判断是不是先进入简易模式
    };

    store
      .get('Language')
      .then((res) => {
        Data.userChoose = res;
      })
      .finally(() => {
        if (Data.userChoose) {
          // 首选用户设置记录
          I18n.locale = Data.userChoose;
        } else if (SystemLanguage) {
          // 获取系统语言
          I18n.locale = SystemLanguage;
        } else {
          // 用户既没有设置，也没有获取到系统语言，默认加载英语语言资源
          I18n.locale = 'en';
        }
        this.setState({
          langvis: false,
        });
      });

    I18n.fallbacks = true;
    // 加载语言包
    I18n.translations = {zh, en};

    store.get(TheData.pingIndex).then((res) => {
      if (res != null) {
        TheData.Ping = res;
        console.log('res:', res);
        this.setState({refresh: !this.state.refresh});
      }
    });
  }
  identify = true;

  componentWillMount() {
    

    store.get('historyPing').then((res) => {
      if(res!=null){
      TheData.historyPing=res;
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

  _renderItem1 = ({item}) => {
    return (
      <View
        style={{
          marginBottom: ScaleSize(20),
          borderBottomWidth: ScaleSize(2),
          borderBottomColor: 'rgba(0,0,0,.1)',
          height: Height * 0.055,
          width: Width * 0.92,
          marginLeft: Width * 0.04,
        }}>
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
            style={{
              borderStyle: 'solid',
              marginTop: ScaleSize(1),
              marginLeft: ScaleSize(4),
              paddingRight: ScaleSize(35),
              width: ScaleSize(310),
              height: ScaleSize(50),
              // backgroundColor:"pink",
              borderRadius: 10,
              paddingBottom: ScaleSize(25),
              fontSize: SetSpText(30),
            }}></TextInput>
        </View>
        {/*第一个不包含删除按钮*/}
        
          <View
            style={{
              position: 'absolute',
              right: ScaleSize(5),
              top: ScaleSize(20),
              marginRight: ScaleSize(0),
              marginTop: ScaleSize(-10),
            }}>
            <TouchableOpacity
              onPress={() => {
                TheData.Ping.splice(parseInt(item.key), 1);
                //可能会有问题 标记一下
                for (let i = 0; i < TheData.Ping.length; i++) {
                  TheData.Ping[i].key = i;
                }
                this.setState({refresh: !this.state.refresh});
                console.log(TheData.Ping);
                store.save(TheData.pingIndex, TheData.Ping);
              }}>
              <Text
                style={{
                  color: '#2a82e4',
                  fontSize: SetSpText(30),
                  position: 'relative',
                  top: ScaleSize(-3),
                  right: ScaleSize(15),
                }}>
                {I18n.t('delete')}
              </Text>
            </TouchableOpacity>
          </View>
        
      </View>
      //<Text>{this.Data}</Text>
    );
  };

  _renderitem2 = ({item}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View>
          <Image
            source={require('../imgs/task.png')}
            style={{
              width: ScaleSize(30),
              height: ScaleSize(30),
              marginVertical: ScaleSize(5),
              marginHorizontal: ScaleSize(10),
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            let length = TheData.Ping.length;
            TheData.Ping = [
              ...TheData.Ping,
              {key: length, url: TheData.historyPing[item.key].url},
            ];
            this.setState({refresh: !this.state.refresh});
          }}>
          <View
            style={{
              width: ScaleSize(255),
              height: ScaleSize(34),
              justifyContent: 'center',
              borderBottomColor: '#919191',
              borderBottomWidth: 1,
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: '#919191',
                fontSize: SetSpText(35),
              }}>
              {item.url}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: ScaleSize(15),
            marginTop: ScaleSize(15),
          }}>
          <TouchableOpacity
            onPress={() => {
              // TheData.historyPing.splice(parseInt(item.key), 1);

              // for (let i = 0,j=TheData.historyPing.length; i < TheData.historyPing.length; i++,j--) {
              //   TheData.historyPing[i].key = j;
              // }
              // this.setState({refresh: !this.state.refresh});
              // console.log(TheData.historyPing);
            }}>
            <Text
              style={{
                color: '#2a82e4',
                fontSize: SetSpText(25),
              }}>
              删除
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  onLayout = (event) => {
    const viewHeight = event.nativeEvent.layout.height;
    console.log('view的高度', viewHeight);
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
            alert('请先选择输入框');
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
        style={{
          marginLeft: ScaleSize(7),
          flexDirection: 'row',
          marginTop: ScaleSize(4),
          height: Height * 0.045,
          backgroundColor: '#ffffff',
          marginRight: ScaleSize(9),
          borderRadius: ScaleSize(20),
        }}>
        <Text
          style={{
            borderRadius: ScaleSizeH(12),
            fontSize: SetSpText(35),
            margin: ScaleSizeH(5),
            color: '#2a82e4',
            fontWeight: '550',
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.isPing) {
      return;
    } else {
      return (
        <View>
        <View style={{height: Height-100, position:"relative"}}>
          {this.state.isNew ? (
            <View
              onLayout={(event) => this.onLayout(event)}
              ref={(ScrollView) => {
                ScrollView = ScrollView;
              }}
              keyboardShouldPersistTaps={true}
              style={{ flex: 1,height: Height,position:"relative"}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: ScaleSize(360),
                    height: Height * 0.058,
                    alignItems: 'center',
                    borderBottomWidth: 2,
                    borderColor: '#2a82e4',
                    marginTop: ScaleSize(20),
                  }}>
                    {/* <View flexDirection="row">
            <TouchableOpacity
              onPress={() => {
                if (TheData.Ping.length != 0) {
                  let key = TheData.Ping.length;
                  TheData.Ping = [...TheData.Ping,{key: key, url: ''}];
                  for (let i = 0; i < TheData.Ping.length; i++) {
                    TheData.Ping[i].key = i;
                  }
                  this.setState({refresh: !this.state.refresh});
                  console.log('1');
                } else {
                  TheData.Ping = [{key: 0, url: ''}];
                  this.setState({refresh: !this.state.refresh});
                  console.log('2');
                }
                store.save(TheData.pingIndex, TheData.Ping);
                store.get(TheData.pingIndex).then((res) => {
                  console.log('res:', res);
                });
                console.log();
              }}
              style={{
                position: 'absolute',
                right: ScaleSize(5),
                top: ScaleSize(-55),
                marginRight: ScaleSize(14),
                marginTop: ScaleSize(-10),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: ScaleSize(20),
                  marginBottom: ScaleSize(20),
                }}>
                <Image
                  source={require('../imgs/add4.png')}
                  style={{
                    height: ScaleSize(20),
                    width: ScaleSize(20),
                  }}
                />
                <Text
                  style={{
                    color: '#2a82e4',
                    fontSize: SetSpText(30),
                    paddingTop: ScaleSize(0),
                  }}>
                  {I18n.t('add')}
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}
                    
                  
                    <TouchableOpacity
                      style={{backgroundColor:"#ffffff",borderRadius:ScaleSize(40),width:ScaleSize(40),height:ScaleSize(40),position:"absolute",right:ScaleSize(10),top:ScaleSize(-10)}}
                      onPress={() => {
                        if (TheData.Ping.length != 0) {
                          let key = TheData.Ping.length;
                          if(key>=5){
                            alert("为保证软件性能，一次最多ping5个网址！");
                            return
                          }
                          TheData.Ping = [...TheData.Ping,{key: key, url: ''}];
                          for (let i = 0; i < TheData.Ping.length; i++) {
                            TheData.Ping[i].key = i;
                          }
                          this.setState({refresh: !this.state.refresh});
                          console.log('1');
                        } else {
                          TheData.Ping = [{key: 0, url: ''}];
                          this.setState({refresh: !this.state.refresh});
                          console.log('2');
                        }
                        store.save(TheData.pingIndex, TheData.Ping);
                        store.get(TheData.pingIndex).then((res) => {
                          console.log('res:', res);
                        });
                        console.log();
                        }}>
                          <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: ScaleSize(10),
                  marginBottom: ScaleSize(20),
                }}>
                <Image
                  source={require('../imgs/add4.png')}
                  style={{
                    height: ScaleSize(20),
                    width: ScaleSize(20),
                  }}
                />
                
              </View>
                      
                    </TouchableOpacity>


                    <Text
                    style={{color:"#2a82e4",fontSize:SetSpText(35),marginLeft:ScaleSize(15),marginBottom:ScaleSize(15),fontWeight:"500"}}
                    >Welcome to GraphURLPing !</Text>

                    {/* <TouchableOpacity
                      onPress={() => {
                        // this.props.navigation.navigate('Ordinary');
                      }}>
                      <Image
                        source={require('../imgs/转换.png')}
                        style={{
                          height: ScaleSize(20),
                          width: ScaleSize(20),
                          position: 'absolute',
                          left: Width * 0.43,
                          top: ScaleSize(-12),
                        }}></Image>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity
                      style={{
                        position: 'absolute',
                        height: Height * 0.09,
                        top: ScaleSize(-45),
                        width: Width * 0.48,
                        left: Width * 0.47,
                      }}
                      onPress={() => {
                        store.save('isNew', false);
                        store.get('isNew').then((res) => {
                          console.log('点击之后isNew:', res);
                        });
                        this.setState({
                          isNew: false,
                        });
                      }}>
                      <Text
                        style={{
                          position: 'absolute',
                          left: Width * 0.15,
                          top: ScaleSize(30),
                          fontSize: SetSpText(33),
                          color: '#666',
                        }}>
                        {I18n.t('professional')}
                      </Text>
                    </TouchableOpacity> 
                    */}
                    
                </View>

                {/* <View
                  style={{
                    borderBottomWidth: 1,
                    width: Width * 0.5 + 2,
                    borderBottomColor: '#2a82e4',
                  }}></View> */}

                {/* <View
                  style={{height: Height * 0.062, marginTop: ScaleSizeH(60)}}
        
                  >
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    style={{
                      marginLeft: ScaleSizeH(4),
                      marginRight: ScaleSizeH(4),
                      marginBottom: ScaleSizeH(10),
                      borderRadius: ScaleSize(13),
                      backgroundColor: '#2a82e4',
                    }}
                    horizontal={true}
                    data={TheData.urlsArr}
                    renderItem={this._renderRow}
                  />
                </View> */}

                <View
      style={{marginTop: ScaleSize(20)}}

      >
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    data={TheData.Ping}
                    renderItem={this._renderItem1}
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
                {/*console.log(TheData.Ping)*/}

                <View
                  style={{height: Height * 0.062, marginTop: ScaleSizeH(0)}}
        
                  >
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    style={{
                      marginLeft: ScaleSizeH(4),
                      marginRight: ScaleSizeH(4),
                      marginBottom: ScaleSizeH(10),
                      borderRadius: ScaleSize(13),
                      backgroundColor: '#2a82e4',
                    }}
                    horizontal={true}
                    data={TheData.urlsArr}
                    renderItem={this._renderRow}
                  />
                </View>

                
                
        </View>
              </View>
              
          ) : (
            ///////////////////////////////////////////////////////////////////////

//             <ScrollView
//               onLayout={(event) => this.onLayout(event)}
//               ref={(ScrollView) => {
//                 ScrollView = ScrollView;
//               }}
//               keyboardShouldPersistTaps={true}
//               style={{backgroundColor: '#ffffff', flex: 1}}>
//               <View>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     width: ScaleSize(360),
//                     height: Height * 0.058,
//                     alignItems: 'center',
//                     borderBottomWidth: 1,
//                     borderColor: 'rgba(0,0,0,.05)',
//                     marginTop: ScaleSize(20),
//                   }}>
//                   <View
//                     style={{
//                       position: 'absolute',
//                       left: ScaleSize(15),
//                     }}>
//                     <TouchableOpacity
//                       style={{
//                         position: 'absolute',
//                         height: Height * 0.09,
//                         top: ScaleSize(-45),
//                         width: Width * 0.48,
//                         left: Width * -0.03,
//                       }}
//                       onPress={() => {
//                         store.save('isNew', true);
//                         store.get('isNew').then((res) => {
//                           console.log('点击之后isNew:', res);
//                         });
//                         this.setState({
//                           isNew: true,
//                         });
//                       }}>
//                       <Text
//                         style={{
//                           position: 'absolute',
//                           left: Width * 0.13,
//                           top: ScaleSize(30),
//                           fontSize: SetSpText(33),
//                           color: '#666',
//                         }}>
//                         {I18n.t('ordinary')}
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() => {
//                         this.setState({
//                           isNew: true,
//                         });
//                         store.save('isNew', this.state.isNew);
//                       }}>
//                       <Image
//                         source={require('../imgs/转换.png')}
//                         style={{
//                           height: ScaleSize(20),
//                           width: ScaleSize(20),
//                           position: 'absolute',
//                           left: Width * 0.43,
//                           top: ScaleSize(-12),
//                         }}></Image>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={{
//                         position: 'absolute',
//                         height: Height * 0.09,
//                         top: ScaleSize(-45),
//                         width: Width * 0.48,
//                         left: Width * 0.47,
//                       }}
//                       onPress={() => {}}>
//                       <Text
//                         style={{
//                           position: 'absolute',
//                           left: Width * 0.15,
//                           top: ScaleSize(30),
//                           fontSize: SetSpText(33),
//                           color: '#2a82e4',
//                         }}>
//                         {I18n.t('professional')}
//                       </Text>
//                       {/* position:"absolute",left:Width *0.60,top:ScaleSize(0),fontSize:SetSpText(330),color:"#666" */}
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 <View
//                   style={{
//                     marginLeft: Width * 0.5,
//                     borderBottomWidth: 1,
//                     width: Width * 0.5 + 2,
//                     borderBottomColor: '#2a82e4',
//                   }}></View>

//                 <View
//                   style={{height: Height * 0.062, marginTop: ScaleSizeH(60)}}>
//                   <FlatList
//                     keyboardShouldPersistTaps={'handled'}
//                     style={{
//                       marginLeft: ScaleSizeH(4),
//                       marginRight: ScaleSizeH(4),
//                       marginBottom: ScaleSizeH(10),
//                       borderRadius: ScaleSize(13),
//                       backgroundColor: '#2a82e4',
//                     }}
//                     horizontal={true}
//                     data={TheData.urlsArr}
//                     renderItem={this._renderRow}
//                   />
//                 </View>

//                 <View style={{marginTop: ScaleSize(40)}}>
//                   <FlatList
//                     keyboardShouldPersistTaps={'handled'}
//                     data={TheData.Ping}
//                     renderItem={this._renderItem1}
//                     refreshing={this.state.FlatListIsRefreshing}
//                     onRefresh={() => {
//                       this.setState((prevState) => ({
//                         FlatListIsRefreshing: true,
//                       }));
//                       setTimeout(() => {
//                         this.setState((prevState) => ({
//                           FlatListIsRefreshing: false,
//                         }));
//                       }, 1000);
//                     }}
//                   />
//                 </View>
//                 {/*console.log(TheData.Ping)*/}

//                 <View
//                   style={{
//                     marginHorizontal: ScaleSize(5),
//                     marginBottom: ScaleSize(10),
//                     marginTop: ScaleSize(30),
//                   }}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       for (let i = 0; i < TheData.Ping.length; i++) {
//                         if (
//                           TheData.Ping[i].url == 'https://' ||
//                           TheData.Ping[i].url == ''
//                         ) {
//                           this.identify = false;
//                           break;
//                         } else {
//                           this.identify = true;
//                         }
//                       }
//                       if (this.identify) {
//                         if (TheData.Ping.length != 0) {
//                           //if (TheData.historyPing.length != 0) {
//                           //TheData.historyPing = [];
//                           //}
//                           let Ping_length = TheData.Ping.length;
//                           let History_length = TheData.historyPing.length;
//                           for (
//                             let i = 0, j = History_length;
//                             i < Ping_length;
//                             i++, j++
//                           ) {
//                             TheData.historyPing = [
//                               ...TheData.historyPing,
//                               {key: j, url: TheData.Ping[i].url},
//                             ];
//                           }
//                           this.setState({refresh: !this.state.refresh});
//                           console.log(TheData.historyPing);
//                           store.save("historyPing",TheData.historyPing);
//                           this.props.navigation.navigate('Ping', {
//                             urlData: [...TheData.Ping],
//                           });
//                         } else {
//                           Toast.message('尚未添加需要Ping的网址!');
//                         }
//                         //TheData.Ping.splice(0, TheData.Ping.length);
//                       } else {
//                         Toast.message('输入网址不能有空!');
//                       }
//                     }}
//                     style={{
//                       marginHorizontal: ScaleSize(2),
//                       alignItems: 'center',
//                       marginTop: ScaleSize(5),
//                       borderRadius: ScaleSize(10),
//                       backgroundColor: '#2a82e4',
//                       height: ScaleSize(42),
//                       justifyContent: 'center',
//                     }}>
//                     <Text
//                       style={{
//                         fontSize: SetSpText(40),
//                         color: 'white',
//                         fontWeight: '600',
//                       }}>
//                       Ping
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                       <View>
//                       <TouchableOpacity
//                       style={{
//                         marginLeft:Width * .4+ScaleSize(18),
//                         width: Width * 0.1,
//                       }}
//                       onPress={() => {
//                         this.props.navigation.navigate('Setting')
//                       }}>
//                       <Text
//                         style={{
//                           fontSize: SetSpText(30),
//                           color: '#666',
//                         }}>
//                         {I18n.t('settings')}
//                       </Text>
//                       {/* position:"absolute",left:Width *0.60,top:ScaleSize(0),fontSize:SetSpText(330),color:"#666" */}
//                     </TouchableOpacity>
//                       </View>


//               </View>
//               <View style={{height:Height * .02,backgroundColor:"#e5e5e5",marginTop:ScaleSize(25)}}></View>

//               <Carousel style={{height: Height * .4,marginTop:ScaleSize(0)}} control={true} carousel={false}>
//                   <View>
//                   <View
//                 flexDirection="row"
//                 style={{
//                   marginLeft: ScaleSizeW(20),
//                   marginTop: ScaleSize(20),
//                   marginBottom: ScaleSize(10),
//                 }}>
//                 <Text style={{color: 'gray', fontSize: SetSpText(30),color:"#2a82e4"}}>
//                   历史输入
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     TheData.historyPing.splice(0, TheData.historyPing.length);
//                     this.setState({refresh: !this.state.refresh});
//                   }}
//                   style={{marginLeft: ScaleSize(253)}}>
//                   <Text style={{color: '#2a82e4', fontSize: SetSpText(25)}}>
//                     清空
//                   </Text>
//                 </TouchableOpacity>
//               </View>
              
//               <ScrollView
//                 style={{
//                   //height: ScaleSize(220),
//                   // borderBottomWidth: 1,
//                   borderColor: '#C4C4C4',
//                   borderStyle: 'solid',
//                 }}>
//                 <FlatList
//                   onRefresh={() => {
//                     this.setState((prevState) => ({
//                       FlatListIsRefreshing: true,
//                     }));
//                     setTimeout(() => {
//                       this.setState((prevState) => ({
//                         FlatListIsRefreshing: false,
//                       }));
//                     }, 1000);
//                   }}
//                   refreshing={this.state.FlatListIsRefreshing}
//                   renderItem={this._renderitem2}
//                   data={TheData.historyPing}></FlatList>
//               </ScrollView>
//                   </View>
//                   <View><Text>2</Text></View>
//                   <View><Text>3</Text></View>
// </Carousel>
//             </ScrollView>
<View></View>
          )}
        </View>

                  <View
                  style={{
                    marginHorizontal: ScaleSize(5),
                    marginBottom: ScaleSize(10),
                    marginTop: ScaleSize(10),
                  }}>
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
                          //if (TheData.historyPing.length != 0) {
                          //TheData.historyPing = [];
                          //}
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
                          // console.log(TheData.historyPing);
                          this.props.navigation.navigate('Ping', {
                            urlData: [...TheData.Ping],
                          });
                        } else {
                          Toast.message('尚未添加需要Ping的网址!');
                        }
                        //TheData.Ping.splice(0, TheData.Ping.length);
                      } else {
                        Toast.message('输入网址不能有空!');
                      }
                    }}
                    style={{
                      marginHorizontal: ScaleSize(2),
                      alignItems: 'center',
                      marginTop: ScaleSize(5),
                      borderRadius: ScaleSize(10),
                      backgroundColor: '#2a82e4',
                      height: ScaleSize(42),
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: SetSpText(40),
                        color: 'white',
                        fontWeight: '600',
                      }}>
                      Ping
                    </Text>
                  </TouchableOpacity>
                </View>


        </View>
      );
    }
  }
}
export default My;



