/**
 * 页面代码
 *created by LYH on 2021/7/23
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Component} from 'react';
import {Dimensions, StyleSheet, TextInput, View, Text, Button, TouchableOpacity, ScrollView, FlatList, processColor} from 'react-native';
import {Overlay} from 'react-native-elements';
import {BackHandler} from 'react-native';
import {SendRequest} from '../controller/request';
import {LineChart} from 'react-native-charts-wrapper';
import {ReqTimeChange, ConfirmRqTime, TextInputChange1, TextInputChange2, BackAction, SaveValue} from '../controller/AppPageFunction';
import data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {SetSpText, ScaleSizeH, ScaleSizeW} from '../controller/Adaptation';

const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const Colors = [processColor('red'), processColor('blue'), processColor('green'), processColor('yellow'), processColor('purple'), processColor('pink')];
export default class home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqTime: 5, // 控制请求发送持续时间的state
            newReqTime: 0,
            url: '', // 用户输入的url
            url2: '',
            OverlayAble: false, // 控制Overlay组件的显示
            linechart: true, // 用来控制图表的显示,true表示显示输入框，不显示图表
            ifOverlayAble: true, // 用来控制是否可以设置请求时间，当正在Ping时不能设置
            isPing: false, // 控制是否正在ping
            defaultvalueOne: '',
            defaultvalueTwo: '',
            backChart: false, // ping过之后，点击返回图表
            chartToData: false,
            overlayOne: false,
            overlayTwo: false, // 控制两个overlay显示的state
            urlArr: ['https://', 'http://', 'www.', '.cn', '.com'],
            visible: false, // 删除后刷新历史记录
            langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
            selectedDomain: '',
            zoomDomain: '',
            values: [],
            colorIndex: 0,
            chartLabels: [],
            values2: [],
            colorIndex2: 2,
            chartLabels2: [],
            marker: {
                enabled: true,
                digits: 2,
                backgroundTint: processColor('teal'),
                markerColor: processColor('#F0C0FF8C'),
                textColor: processColor('white'),
            },
            chartDate: [{y: 0, x: 0}], // 只作为刷新页面用的state
            setting: false,
            secondDataHeight: 120, // 第二个图表数据style属性的bottom值
            chart1: false,
            chart2: false,
            ifTwoChartShow: true,
        };

        /* 选择合适语言 */
        store.get('Language')
            .then((res) => {
                data.userChoose = res;
            })
            .finally(() => {
                if (data.userChoose.length !== 0) {
                    // 首选用户设置记录
                    I18n.locale = data.userChoose;
                } else if (SystemLanguage) {
                    // 获取系统语言
                    I18n.locale = SystemLanguage;
                } else {
                    I18n.locale = 'en'; // 用户既没有设置，也没有获取到系统语言，默认加载英语语言资源
                }
                this.setState({
                    langvis: false,
                });
            });

        /* 获取历史记录数据 */
        store.get('local').then((res) => (data.local = res.slice()));
        I18n.fallbacks = true;
        // 加载语言包
        I18n.translations = {zh, en};
    }

     pressnum = 0 // 表示安卓手机返回键按压次数，以控制返回上一界面
     firstpress = 0 // 第一次按返回键的时间戟
     maxTime = 0 // 最大时间
     minTime = '' // 最小时间
     avgTime = 0 // 平均时间
     n95 = '' // 95%的数据
    status1 = ''
    sumReqTime = [] // 所有请求时间的数组，用来计算标准差
    /**
     * 下面是第二个图表的数据
     */
    maxTime2 = 0 // 最大时间
    minTime2 = '' // 最小时间
    avgTime2 = 0 // 平均时间
    n952 = '' // 95%的数据
    status2 = ''
    sumReqTime2 = [] // 所有请求时间的数组，用来计算标准差

    config = {};

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', BackAction.bind(this));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', BackAction.bind(this));
    }
    // 设置url和输入框默认值为item
    setDefaultValue = (item) => {
        if (this.state.overlayOne) {
            this.setState({defaultvalueOne: item});
            this.state.url = item;
        }
        if (this.state.overlayTwo) {
            this.setState({defaultvalueTwo: item});
            this.state.url2 = item;
        }
    }

    // flatlist的渲染函数,item是数据，index是序列号
    _renderRow(item, index) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.state.overlayOne) {
                        if (this.state.url == '') {
                            this.setState({url: item});
                            this.setState({defaultvalueOne: item});
                        } else {
                            this.setState({url: this.state.url + item});
                            this.setState({defaultvalueOne: this.state.defaultvalueOne + item});
                        }
                    }
                    if (this.state.overlayTwo) {
                        if (this.state.url2 == '') {
                            this.setState({url2: item});
                            this.setState({defaultvalueTwo: item});
                        } else {
                            this.setState({url2: this.state.url2 + item});
                            this.setState({defaultvalueTwo: this.state.defaultvalueTwo + item});
                        }
                    }
                }}
                style={{
                    flexDirection: 'row',
                    borderBottomColor: 'red',
                    justifyItems: 'flex-start',
                    marginRight:8,
                }}>
                <Text style={{backgroundColor:'#e9f1f6', color:"#666", borderRadius:ScaleSizeH(12), fontSize: SetSpText(40),  margin:ScaleSizeH(5)}}>{item}</Text>
            </TouchableOpacity>
        );
    }

    next(values, colorIndex, chartLabels, url, url2, values2, colorIndex2, chartLabels2) {
        if (this.state.url != '' && this.state.url2 != ''){
            return {
                data: {
                    dataSets: [
                        {
                            values: values,
                            label: url,

                            config: {
                                drawValues: false,
                                color: Colors[colorIndex],
                                mode: 'CUBIC_BEZIER',
                                drawCircles: false,
                                lineWidth: 2,
                            },
                        },
                        {
                            values: values2,
                            label: url2,

                            config: {
                                drawValues: false,
                                color: Colors[colorIndex2],
                                mode: 'CUBIC_BEZIER',
                                drawCircles: false,
                                lineWidth: 2,
                            },
                        },
                    ],
                },
                xAxis: {
                    valueFormatter: chartLabels,
                    axisLineWidth: 0,
                    drawLabels: true,
                    position: 'BOTTOM',
                    drawGridLines: false,
                },
            };
        }
        if (this.state.url != ''){
            return {
                data: {
                    dataSets: [
                        {
                            values: values,
                            label: url,

                            config: {
                                drawValues: false,
                                color: Colors[colorIndex],
                                mode: 'CUBIC_BEZIER',
                                drawCircles: false,
                                lineWidth: 2,
                            },
                        },
                    ],
                },
                xAxis: {
                    valueFormatter: chartLabels,
                    axisLineWidth: 0,
                    drawLabels: true,
                    position: 'BOTTOM',
                    drawGridLines: false,
                },
            };
        }
        if (this.state.url2 != ''){
            return {
                data: {
                    dataSets: [
                        {
                            values: values2,
                            label: url2,

                            config: {
                                drawValues: false,
                                color: Colors[colorIndex2],
                                mode: 'CUBIC_BEZIER',
                                drawCircles: false,
                                lineWidth: 2,
                            },
                        },
                    ],
                },
                xAxis: {
                    valueFormatter: chartLabels2,
                    axisLineWidth: 0,
                    drawLabels: true,
                    position: 'BOTTOM',
                    drawGridLines: false,
                },
            };
        }
    }

    
    ifSecondPing= () => {
        if (this.state.url == '') {
            this.state.secondDataHeight = 140;
        } else {
            this.state.secondDataHeight = 220;
        }
    }

    render() {
        if (this.state.url != '' || this.state.url2 != '') {
            if (this.state.ifTwoChartShow) {
                const {values, colorIndex, chartLabels, url, values2, url2, colorIndex2, chartLabels2} = this.state;
                this.config = this.next(values, colorIndex, chartLabels, url, url2, values2, colorIndex2, chartLabels2);
            }
        }
        if (this.state.ifTwoChartShow) {
            this.ifSecondPing();
        }
        return this.state.linechart ? (
            <TouchableOpacity
                style={{backgroundColor: '#f1f3f0', height: Height}}
                activeOpacity={.9}
                onPress={() => {
                    this.refs.input1.blur();
                    this.refs.input2.blur();
                    this.setState({setting: false});
                }}>
                <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(60), left: ScaleSizeW(40), top: ScaleSizeW(40), color: 'white', width:30}}
                    onPress={() => this.props.navigation.openDrawer()}
                >{'\ue629'}</Text>
                <Overlay
                    style={styles.overlay}
                    isVisible={this.state.overlayOne}
                    onBackdropPress={() => {
                        this.setState({overlayOne: false});
                        this.refs.input1.blur();
                    }}>
                    <View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', borderBottomColor: '#000000', borderBottomWidth: 2}}>
                                <TextInput
                                    defaultValue={this.state.defaultvalueOne}
                                    placeholderTextColor="#ccc" // 设置占位符颜色
                                    color="#000000" // 设置输入文字的颜色
                                    autoFocus={true}
                                    placeholder={I18n.t('inputone')}
                                    onChangeText={(newText) => {
                                        this.state.url = newText;
                                        this.state.defaultvalueOne = newText;
                                    }}
                                    style={{width: Width / 1.25, fontSize: SetSpText(35)}}
                                />
                                <TouchableOpacity
                                    style={{color: '#000000'}}
                                    onPress={() => {
                                        this.setState({
                                            chartDate: [],
                                        });
                                        this.state.defaultvalueOne = '';
                                        this.state.url = '';
                                    }}>
                                    <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(55), top: ScaleSizeH(20) }}>{'\ue60f'}</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={{color: '#000000', left: ScaleSizeW(20)}}
                                onPress={() => {
                                    this.setState({
                                        chartDate: [],
                                    });
                                    this.refs.input1.blur();
                                    this.setState({overlayOne: false});
                                    if (this.state.defaultvalueOne != '') {
                                        SaveValue(this.state.url);
                                    }
                                    store.get('local').then((res) => (data.local = res.slice()));
                                }}>
                                <Text style={{fontFamily: 'iconfont', fontSize:  SetSpText(45), top:20 }}>{'\ue6d2'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <FlatList
                                style={{maxHeight: ScaleSizeH(60)}}
                                horizontal={true}
                                data={this.state.urlArr}
                                renderItem={({item, index}) => this._renderRow(item, index)}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        <View style={styles.History}>
                            <ScrollView ref={(scroll) => (this._scroll = scroll)} onScroll={(e) => {}}>
                                {data.local.map((item, index) => {
                                    return (
                                        <View style={styles.HistoryList} key={index}>
                                            <TouchableOpacity
                                                // key={index}
                                                style={styles.HistoryTextBox}
                                                onPress={() => {
                                                    this.setDefaultValue(item);
                                                }}>
                                                <Text numberOfLines={index} style={styles.HistoryText}>
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.Delete}
                                                onPress={() => {
                                                    data.local.splice(data.local.indexOf(item), 1);
                                                    store.save('local', data.local);
                                                    this.setState({
                                                        visible: true,
                                                    });
                                                }}>
                                                <Text style={styles.DeleteText}>×</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </Overlay>
                {/* start */}
                <Overlay
                    style={styles.overlay}
                    isVisible={this.state.overlayTwo}
                    onBackdropPress={() => {
                        this.setState({overlayTwo: false});
                        this.refs.input2.blur();
                    }}>
                    <View>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row', borderBottomColor: '#000000', borderBottomWidth: 1}}>
                                    <TextInput
                                        defaultValue={this.state.defaultvalueTwo}
                                        placeholderTextColor="#ccc" // 设置占位符颜色
                                        color="#000000" // 设置输入文字的颜色
                                        autoFocus={true}
                                        placeholder={I18n.t('inputtwo')}
                                        onChangeText={(newText) => {
                                            this.state.url2 = newText;
                                            this.state.defaultvalueTwo = newText;
                                        }}
                                        style={{width: Width / 1.25, fontSize: SetSpText(45)}}
                                    />
                                    <TouchableOpacity
                                        style={{color: '#000000'}}
                                        onPress={() => {
                                            this.setState({
                                                chartDate: [],
                                            });
                                            this.state.defaultvalueTwo = '';
                                            this.state.url2 = '';
                                        }}>
                                        <Text style={{fontFamily: 'iconfont', fontSize: SetSpText(55), top: ScaleSizeH(25) }}>{'\ue60f'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={{color: '#000000', left: ScaleSizeW(20)}}
                                    onPress={() => {
                                        this.setState({
                                            chartDate: [],
                                        });
                                        this.refs.input2.blur();
                                        this.setState({overlayTwo: false});
                                        if (this.state.defaultvalueTwo != '') {
                                            SaveValue(this.state.url2);
                                        }
                                        store.get('local').then((res) => (data.local = res.slice()));
                                    }}>
                                    <Text style={{fontFamily: 'iconfont', fontSize:  SetSpText(45), top:10 }}>{'\ue6d2'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <FlatList
                                style={{maxHeight: ScaleSizeH(60)}}
                                horizontal={true}
                                data={this.state.urlArr}
                                renderItem={({item, index}) => this._renderRow(item, index)}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>
                        <View style={styles.History}>
                            <ScrollView ref={(scroll) => (this._scroll = scroll)} onScroll={(e) => {}}>
                                {data.local.map((item, index) => {
                                    return (
                                        <View style={styles.HistoryList} key={index}>
                                            <TouchableOpacity
                                                // key={index}
                                                style={styles.HistoryTextBox}
                                                onPress={() => {
                                                    this.setDefaultValue(item);
                                                }}>
                                                <Text numberOfLines={index} style={styles.HistoryText}>
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.Delete}
                                                onPress={() => {
                                                    data.local.splice(data.local.indexOf(item), 1);
                                                    store.save('local', data.local);
                                                    this.setState({
                                                        visible: true,
                                                    });
                                                }}>
                                                <Text style={styles.DeleteText}>{'\ue60f'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </Overlay>
                {/* end */}
                <Overlay
                    isVisible={this.state.OverlayAble}
                    onBackdropPress={() => {
                        this.setState({OverlayAble: false});
                    }}>
                    <View style={{height: ScaleSizeH(250)}}>
                        <Text style={{color: '#000000', fontSize: SetSpText(40)}}>
                            {I18n.t('currenttime')}:{this.state.reqTime}
                        </Text>
                        <View>
                            <TextInput
                                placeholder={I18n.t('timeinput')}
                                placeholderTextColor="#ccc"
                                color="#000000"
                                onChangeText={ReqTimeChange.bind(this)}
                                style={{width: ScaleSizeW(500), top: ScaleSizeH(6)}}
                            />
                            <Button title={I18n.t('sure') } onPress={ConfirmRqTime.bind(this)} />
                        </View>
                    </View>
                </Overlay>
                <Text style={{color: 'pink', fontSize: SetSpText(100), fontWeight: 'bold', textAlign:'center', marginTop: ScaleSizeH(280), marginBottom: ScaleSizeH(100)}}>{I18n.t('title')}</Text>
                <View style={styles.serch}>
                    <View style={styles.textinput}>
                        <TextInput
                            ref={'input1'}
                            placeholder={I18n.t('inputone')} // 占位符
                            defaultValue={this.state.defaultvalueOne}
                            placeholderTextColor="#ccc" // 设置占位符颜色
                            keyboardType="url" // 设置键盘类型，url只在iOS端可用
                            color="black" // 设置输入文字的颜色
                            onChangeText={TextInputChange1.bind(this)}
                            onFocus={() => {
                                this.setState({overlayOne: true});
                            }}
                            style={{borderBottomColor: '#ffffff', borderRadius: 15, width: Width * 0.95, left:Width * 0.025,
                                height: ScaleSizeH(110), bottom: ScaleSizeH(10), backgroundColor:'white', fontSize:ScaleSizeW(45)}}
                        />
                        <TextInput
                            ref={'input2'}
                            placeholder={I18n.t('inputtwo')} // 占位符
                            defaultValue={this.state.defaultvalueTwo}
                            placeholderTextColor="#ccc" // 设置占位符颜色
                            keyboardType="url" // 设置键盘类型，url只在iOS端可用
                            color="black" // 设置输入文字的颜色
                            onChangeText={TextInputChange2.bind(this)}
                            onFocus={() => {
                                this.setState({overlayTwo: true});
                            }}
                            style={{borderBottomColor: '#ffffff', borderRadius: 15, width: Width * 0.95, left:Width * 0.025, height: ScaleSizeH(110), backgroundColor:'white', fontSize:ScaleSizeW(45)}}
                        />
                    </View>
                    <Text
                        style={{
                            color: '#ffffff',
                            fontSize: SetSpText(65),
                            paddingTop: 5,
                            backgroundColor: 'pink',
                            alignSelf: 'center',
                            textAlign: 'center',
                            height:  ScaleSizeH(100),
                            width: ScaleSizeW(400),
                            top: ScaleSizeH(90),
                            borderRadius: 15,
                        }}
                        onPress={SendRequest.bind(this)}>
                        {I18n.t('ping')}
                    </Text>
                </View>
                {this.state.backChart ? (
                    <Text
                        style={{color: 'pink', top: ScaleSizeH(280), fontSize: SetSpText(50), textAlign:'right'}}
                        onPress={() => {
                            this.setState({linechart: false});
                        }}>
                        {I18n.t('return')}
                    </Text>
                ) : (
                    <View />
                )}
            </TouchableOpacity>
        ) : (
            <View style={styles.bottomStyle}>
                <ScrollView>
                    <View style = {[styles.bottomChartData, {marginBottom: 0}]}>
                        <View style = {styles.bottomChartDataItem}>
                            <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(40), position: 'absolute'}}>MAX</Text>
                            <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(220), position: 'absolute'}}>MIN</Text>
                            <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(400), position: 'absolute'}}>AVG</Text>
                            <Text style={{color:'pink', fontSize:SetSpText(40), left:ScaleSizeW(580), position: 'absolute'}}>N95</Text>
                        </View>
                        {   this.state.chart1 ?   <View style={styles.bottomChartDataOne}>
                            <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(40),  position: 'absolute'}}>{this.maxTime}</Text>
                            <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime}</Text>
                            <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>{this.avgTime.toFixed(0)}</Text>
                            <Text style={{color:'red', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                                {this.n95 ? `${this.n95.toFixed(0)}` : ''}</Text>
                        </View>
                            : <View/>  }
                        {   this.state.chart2 ?        <View style={styles.bottomChartDataTwo}>
                            <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(40), position: 'absolute'}}>{this.maxTime2}</Text>
                            <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(220), position: 'absolute'}}>{this.minTime2}</Text>
                            <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(400), position: 'absolute'}}>
                                {this.avgTime2.toFixed(0)}</Text>
                            <Text style={{color:'green', fontSize:SetSpText(35), left:ScaleSizeW(580), position: 'absolute'}}>
                                {this.n952 ? `${this.n952.toFixed(0)}` : ''}</Text>
                        </View>
                            : <View/>  }
                    </View>
                    {true ? (
                        <LineChart width={Width} height={Height * 0.9}  bottom={0} data={this.config.data} xAxis={this.config.xAxis} style={styles.container} marker={this.state.marker}
                            chartDescription={{text:''}} ref="chart" />
                    ) : (
                        <View />
                    )}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomChartDataTwo:{
        width: Width,
        height:ScaleSizeH(50),
        position:'absolute',
        top:ScaleSizeH(100),
    },
    bottomChartDataOne:{
        width: Width,
        height:ScaleSizeH(50),
        position:'absolute',
        top:ScaleSizeH(50),
    },
    bottomChartDataItem: {
        flexDirection: 'row',
        position: 'relative',
        height: ScaleSizeH(200),
        width: Width,
    },
    bottomChartData: {
        flexDirection: 'column',
        position: 'relative',
        height: Height * 0.1,
    },
    bottomStyle: {
        height:Height,
        backgroundColor: '#ffffff',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'transparent',
    },
    serch: {
        flexDirection: 'column',
        top: 20,
    },
    textinput: {
        flexDirection: 'column',
    },
    TextStyle: {
        margin: 10,
        height: 50,
        width: 250,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 4,
        color: '#1F2342',
        fontSize: 20,
        borderColor: 'pink',
        marginLeft: 30,
        marginTop: 45,
        flexDirection: 'row',
    },
    ButtonStyle: {
        width: 60,
        height: 50,
        marginLeft: -30,
        backgroundColor: 'white',
        borderColor: 'pink',
        borderRadius: 15,
        borderWidth: 4,
        marginTop: -3,
    },
    settingbtnstyle: {
        fontFamily: 'iconfont',
        color: '#FFB6C1',
        fontSize: 30,
        top: 40,
        left: 5,
    },
    History: {
        position: 'relative',
        height: Height / 2,
        width: Width,
    },
    HistoryList: {
        width: ScaleSizeW(730),
        height: ScaleSizeH(80),
        backgroundColor: 'white',
    },
    HistoryTextBox: {
        height: ScaleSizeH(70),
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#F0F8FF',
        left:5,
        paddingLeft:10,
        marginTop:10
    },
    HistoryText: {
        fontSize: SetSpText(40),
        color: "#666",
    },
    Delete: {
        width: ScaleSizeW(90),
        height: ScaleSizeH(70),
        position: 'relative',
        top: ScaleSizeH(-85),
        left: ScaleSizeW(640),
    },
    DeleteText: {
        fontFamily: 'iconfont',
        position: 'relative',
        top:ScaleSizeH(10),
        right:ScaleSizeW(-13),
        fontSize: SetSpText(60),
    },
    overlay: {
        position: 'absolute',
    },
    language: {
        width: Width,
        height: Height,
        position: 'absolute',
    },
    iconStyle: {
        fontFamily: 'iconfont',
        fontSize: SetSpText(85),
        top: ScaleSizeH(1250),
        left: ScaleSizeW(20),
        width:ScaleSizeW(80),
    },
    Settingarea:{
        position:'absolute',
        top:Height / 1.1,
        left: 60,
        flexDirection: 'row',
    },
});

