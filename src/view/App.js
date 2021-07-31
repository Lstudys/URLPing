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
import {sendRequest} from '../controller/Request';
import {LineChart} from 'react-native-charts-wrapper';
import {setReqTime, reqTimeChange, confirmRqTime, textInputChange1, textInputChange2, backAction, saveValue} from '../controller/AppPageFunction';
import data from '../modal/data';
import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import {setSpText, scaleSizeH, scaleSizeW} from '../controller/Adaptation';

const locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const systemLanguage = locales[0]?.languageCode; // 用户系统偏好语言
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const colors = [processColor('red'), processColor('blue'), processColor('green'), processColor('yellow'), processColor('purple'), processColor('pink')];
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
            defaultvalue1: '',
            defaultvalue2: '',
            backChart: false, // ping过之后，点击返回图表
            chartToData: false,
            overlay1: false,
            overlay2: false, // 控制两个overlay显示的state
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
                } else if (systemLanguage) {
                    // 获取系统语言
                    I18n.locale = systemLanguage;
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
        BackHandler.addEventListener('hardwareBackPress', backAction.bind(this));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', backAction.bind(this));
    }
    // 设置url和输入框默认值为item
    setDefaultValue = (item) => {
        if (this.state.overlay1) {
            this.setState({defaultvalue1: item});
            this.state.url = item;
        }
        if (this.state.overlay2) {
            this.setState({defaultvalue2: item});
            this.state.url2 = item;
        }
    }

    // flatlist的渲染函数,item是数据，index是序列号
    _renderRow(item, index) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.state.overlay1) {
                        if (this.state.url == '') {
                            this.setState({url: item});
                            this.setState({defaultvalue1: item});
                        } else {
                            this.setState({url: this.state.url + item});
                            this.setState({defaultvalue1: this.state.defaultvalue1 + item});
                        }
                    }
                    if (this.state.overlay2) {
                        if (this.state.url2 == '') {
                            this.setState({url2: item});
                            this.setState({defaultvalue2: item});
                        } else {
                            this.setState({url2: this.state.url2 + item});
                            this.setState({defaultvalue2: this.state.defaultvalue2 + item});
                        }
                    }
                }}
                style={{
                    flexDirection: 'row',
                    borderBottomColor: 'red',
                    justifyItems: 'flex-start',
                    marginRight:8,
                }}>
                <Text style={{backgroundColor:'#e9f1f6', borderRadius:scaleSizeH(12), fontSize: setSpText(40),  margin:scaleSizeH(5)}}>{item}</Text>
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
                                color: colors[colorIndex],
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
                                color: colors[colorIndex2],
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
                                color: colors[colorIndex],
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
                                color: colors[colorIndex2],
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
            const {values, colorIndex, chartLabels, url, values2, url2, colorIndex2, chartLabels2} = this.state;
            this.config = this.next(values, colorIndex, chartLabels, url, url2, values2, colorIndex2, chartLabels2);
        }
        this.ifSecondPing();
        return this.state.linechart ? (
            <TouchableOpacity
                style={{backgroundColor: '#1F2342', height: height}}
                activeOpacity={1.0}
                onPress={() => {
                    this.refs.input1.blur();
                    this.refs.input2.blur();
                    this.setState({setting: false});
                }}>
                <View style={{flexDirection: 'row'}}>
                    {/* 中英文 */}
                    <Text style={{fontFamily: 'iconfont', color: '#FFB6C1', fontSize: setSpText(80), left: scaleSizeW(10)}} onPress={() => {
                        if (I18n.locale === 'zh'){
                            I18n.locale = 'en';
                            data.userChoose = I18n.locale;
                            store.save('Language', data.userChoose);
                            this.setState({langvis: false});
                        } else {
                            I18n.locale = 'zh';
                            data.userChoose = I18n.locale;
                            store.save('Language', data.userChoose);
                            this.setState({langvis: false});
                        }
                    }}>{'\ue645'}</Text>
                    {/* 时间设置 */}
                    <Text style={{fontFamily: 'iconfont', color: '#FFB6C1', fontSize: setSpText(80), left:width / 1.3}} onPress={setReqTime.bind(this)}>
                        {'\ue602'}
                    </Text>
                    {/* 关于 */}
                    {/* <Text style={{fontFamily: 'iconfont', color: '#FFB6C1', fontSize: 35, left: 20, top:2}}
                        onPress={() => {
                            this.setState({linechart: false});
                            // eslint-disable-next-line no-undef
                            Orientation.lockToLandscape();
                        }}>
                        {'\ue629'}
                    </Text> */}
                </View>
                <Overlay
                    style={styles.overlay}
                    isVisible={this.state.overlay1}
                    onBackdropPress={() => {
                        this.setState({overlay1: false});
                        this.refs.input1.blur();
                    }}>
                    <View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', borderBottomColor: '#000000', borderBottomWidth: 1}}>
                                <TextInput
                                    defaultValue={this.state.defaultvalue1}
                                    placeholderTextColor="#ccc" // 设置占位符颜色
                                    color="#000000" // 设置输入文字的颜色
                                    autoFocus={true}
                                    placeholder={I18n.t('inputone')}
                                    onChangeText={(newText) => {
                                        this.state.url = newText;
                                        this.state.defaultvalue1 = newText;
                                    }}
                                    style={{width: width / 1.25, fontSize: setSpText(45)}}
                                />
                                <TouchableOpacity
                                    style={{color: '#000000'}}
                                    onPress={() => {
                                        this.setState({
                                            chartDate: [],
                                        });
                                        this.state.defaultvalue1 = '';
                                        this.state.url = '';
                                    }}>
                                    <Text style={{fontFamily: 'iconfont', fontSize: setSpText(55), top: scaleSizeH(35) }}>{'\ue60f'}</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={{color: '#000000', left: scaleSizeW(20)}}
                                onPress={() => {
                                    this.setState({
                                        chartDate: [],
                                    });
                                    this.refs.input1.blur();
                                    this.setState({overlay1: false});
                                    if (this.state.defaultvalue1 != '') {
                                        saveValue(this.state.url);
                                    }
                                    store.get('local').then((res) => (data.local = res.slice()));
                                }}>
                                <Text style={{fontFamily: 'iconfont', fontSize:  setSpText(45), top:20 }}>{'\ue6d2'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <FlatList
                                style={{maxHeight: scaleSizeH(60)}}
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
                {/* start */}
                <Overlay
                    style={styles.overlay}
                    isVisible={this.state.overlay2}
                    onBackdropPress={() => {
                        this.setState({overlay2: false});
                        this.refs.input2.blur();
                    }}>
                    <View>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row', borderBottomColor: '#000000', borderBottomWidth: 1}}>
                                    <TextInput
                                        defaultValue={this.state.defaultvalue2}
                                        placeholderTextColor="#ccc" // 设置占位符颜色
                                        color="#000000" // 设置输入文字的颜色
                                        autoFocus={true}
                                        placeholder={I18n.t('inputtwo')}
                                        onChangeText={(newText) => {
                                            this.state.url2 = newText;
                                            this.state.defaultvalue2 = newText;
                                        }}
                                        style={{width: width / 1.25, fontSize: setSpText(45)}}
                                    />
                                    <TouchableOpacity
                                        style={{color: '#000000'}}
                                        onPress={() => {
                                            this.setState({
                                                chartDate: [],
                                            });
                                            this.state.defaultvalue2 = '';
                                            this.state.url2 = '';
                                        }}>
                                        <Text style={{fontFamily: 'iconfont', fontSize: setSpText(55), top: scaleSizeH(35) }}>{'\ue60f'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={{color: '#000000', left: scaleSizeW(20)}}
                                    onPress={() => {
                                        this.setState({
                                            chartDate: [],
                                        });
                                        this.refs.input2.blur();
                                        this.setState({overlay2: false});
                                        if (this.state.defaultvalue2 != '') {
                                            saveValue(this.state.url2);
                                        }
                                        store.get('local').then((res) => (data.local = res.slice()));
                                    }}>
                                    <Text style={{fontFamily: 'iconfont', fontSize:  setSpText(45), top:20 }}>{'\ue6d2'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <FlatList
                                style={{maxHeight: scaleSizeH(60)}}
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
                    <View style={{height: scaleSizeH(250)}}>
                        <Text style={{color: '#000000', fontSize: setSpText(40)}}>
                            {I18n.t('currenttime')}:{this.state.reqTime}
                        </Text>
                        <View>
                            <TextInput
                                placeholder={I18n.t('timeinput')}
                                placeholderTextColor="#ccc"
                                color="#000000"
                                onChangeText={reqTimeChange.bind(this)}
                                style={{width: scaleSizeW(500), top: scaleSizeH(6)}}
                            />
                            <Button title={I18n.t('sure') } onPress={confirmRqTime.bind(this)} />
                        </View>
                    </View>
                </Overlay>
                <Text style={{color: 'pink', fontSize: setSpText(112), fontWeight: 'bold', textAlign:'center', marginTop: scaleSizeH(280), marginBottom: scaleSizeH(100)}}>{I18n.t('title')}</Text>
                <View style={styles.serch}>
                    <View style={styles.textinput}>
                        <TextInput
                            ref={'input1'}
                            placeholder={I18n.t('inputone')} // 占位符
                            defaultValue={this.state.defaultvalue1}
                            placeholderTextColor="#ccc" // 设置占位符颜色
                            keyboardType="url" // 设置键盘类型，url只在iOS端可用
                            color="black" // 设置输入文字的颜色
                            onChangeText={textInputChange1.bind(this)}
                            onFocus={() => {
                                this.setState({overlay1: true});
                            }}
                            style={{borderBottomColor: '#ffffff', borderRadius: 15, width: width, height: scaleSizeH(110), bottom: scaleSizeH(10), backgroundColor:'white', fontSize:scaleSizeW(45)}}
                        />
                        <TextInput
                            ref={'input2'}
                            placeholder={I18n.t('inputtwo')} // 占位符
                            defaultValue={this.state.defaultvalue2}
                            placeholderTextColor="#ccc" // 设置占位符颜色
                            keyboardType="url" // 设置键盘类型，url只在iOS端可用
                            color="black" // 设置输入文字的颜色
                            onChangeText={textInputChange2.bind(this)}
                            onFocus={() => {
                                this.setState({overlay2: true});
                            }}
                            style={{borderBottomColor: '#ffffff', borderRadius: 15, width: width, height: scaleSizeH(110), backgroundColor:'white', fontSize:scaleSizeW(45)}}
                        />
                    </View>
                    <Text
                        style={{
                            color: '#ffffff',
                            fontSize: setSpText(65),
                            paddingTop: 5,
                            backgroundColor: 'pink',
                            alignSelf: 'center',
                            textAlign: 'center',
                            height:  scaleSizeH(100),
                            width: scaleSizeW(400),
                            top: scaleSizeH(90),
                            borderRadius: 15,
                        }}
                        onPress={sendRequest.bind(this)}>
                        {I18n.t('ping')}
                    </Text>
                </View>
                {this.state.backChart ? (
                    <Text
                        style={{color: 'pink', top: scaleSizeH(280), fontSize: setSpText(50), textAlign:'right'}}
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
                            <Text style={{color:'pink', fontSize:setSpText(40), left:scaleSizeW(40), position: 'absolute'}}>MAX</Text>
                            <Text style={{color:'pink', fontSize:setSpText(40), left:scaleSizeW(220), position: 'absolute'}}>MIN</Text>
                            <Text style={{color:'pink', fontSize:setSpText(40), left:scaleSizeW(400), position: 'absolute'}}>AVG</Text>
                            <Text style={{color:'pink', fontSize:setSpText(40), left:scaleSizeW(580), position: 'absolute'}}>N95</Text>
                        </View>
                        {   this.state.chart1 ?   <View style={styles.bottomChartDataOne}>
                            <Text style={{color:'red', fontSize:setSpText(35), left:scaleSizeW(40),  position: 'absolute'}}>{this.maxTime}</Text>
                            <Text style={{color:'red', fontSize:setSpText(35), left:scaleSizeW(220), position: 'absolute'}}>{this.minTime}</Text>
                            <Text style={{color:'red', fontSize:setSpText(35), left:scaleSizeW(400), position: 'absolute'}}>{this.avgTime.toFixed(0)}</Text>
                            <Text style={{color:'red', fontSize:setSpText(35), left:scaleSizeW(580), position: 'absolute'}}>
                                {this.n95 ? `${this.n95.toFixed(0)}` : ''}</Text>
                        </View>
                            : <View/>  }
                        {   this.state.chart2 ?        <View style={styles.bottomChartDataTwo}>
                            <Text style={{color:'green', fontSize:setSpText(35), left:scaleSizeW(40), position: 'absolute'}}>{this.maxTime2}</Text>
                            <Text style={{color:'green', fontSize:setSpText(35), left:scaleSizeW(220), position: 'absolute'}}>{this.minTime2}</Text>
                            <Text style={{color:'green', fontSize:setSpText(35), left:scaleSizeW(400), position: 'absolute'}}>
                                {this.avgTime2.toFixed(0)}</Text>
                            <Text style={{color:'green', fontSize:setSpText(35), left:scaleSizeW(580), position: 'absolute'}}>
                                {this.n952 ? `${this.n952.toFixed(0)}` : ''}</Text>
                        </View>
                            : <View/>  }
                    </View>
                    {true ? (
                        <LineChart width={width} height={height * 0.9}  bottom={0} data={this.config.data} xAxis={this.config.xAxis} style={styles.container} marker={this.state.marker}
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
        width: width,
        height:scaleSizeH(50),
        position:'absolute',
        top:scaleSizeH(100),
    },
    bottomChartDataOne:{
        width: width,
        height:scaleSizeH(50),
        position:'absolute',
        top:scaleSizeH(50),
    },
    bottomChartDataItem: {
        flexDirection: 'row',
        position: 'relative',
        height: scaleSizeH(200),
        width: width,
    },
    bottomChartData: {
        flexDirection: 'column',
        position: 'relative',
        height: height * 0.1,
    },
    bottomStyle: {
        height:height,
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
        height: height / 2,
        width: width,
    },
    HistoryList: {
        width: scaleSizeW(730),
        height: scaleSizeH(80),
        backgroundColor: 'white',
    },
    HistoryTextBox: {
        height: scaleSizeH(70),
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#F0F8FF',
        left:5,
    },
    HistoryText: {
        fontSize: setSpText(40),
        color: 'black',
    },
    Delete: {
        width: scaleSizeW(90),
        height: scaleSizeH(70),
        position: 'relative',
        top: scaleSizeH(-70),
        left: scaleSizeW(650),
    },
    DeleteText: {
        fontFamily: 'iconfont',
        position: 'relative',
        top:scaleSizeH(10),
        right:scaleSizeW(-13),
        fontSize: setSpText(60),
    },
    overlay: {
        position: 'absolute',
    },
    language: {
        width: width,
        height: height,
        position: 'absolute',
    },
    iconStyle: {
        fontFamily: 'iconfont',
        fontSize: setSpText(85),
        top: scaleSizeH(1250),
        left: scaleSizeW(20),
        width:scaleSizeW(80),
    },
    Settingarea:{
        position:'absolute',
        top:height / 1.1,
        left: 60,
        flexDirection: 'row',
    },
});

