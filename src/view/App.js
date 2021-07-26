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
            urlArr: ['https://', '   ', 'http://'],
            visible: false, // 删除后刷新历史记录
            langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
            selectedDomain: '',
            zoomDomain: '',
            values: [0],
            colorIndex: 0,
            chartLabels: [],
            values2: [0],
            colorIndex2: 0,
            chartLabels2: [],
            marker: {
                enabled: true,
                digits: 2,
                backgroundTint: processColor('teal'),
                markerColor: processColor('#F0C0FF8C'),
                textColor: processColor('white'),
            },
            chartDate: [{y: 0, x: 0}], // 只作为刷新页面用的state
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
                    this.setDefaultValue(item);
                }}
                style={{
                    flexDirection: 'row',
                    borderBottomColor: 'red',
                    justifyItems: 'flex-start',
                    margin: 0,
                }}>
                <Text style={{left: 0, color: '#000000', fontSize: 20}}>{item}</Text>
            </TouchableOpacity>
        );
    }
    // 获取图表属性值的函数，参数意义分别为图表数据源、颜色名称索引、图表横坐标数据源、图表下方显示的label
    next(values, colorIndex, chartLabels, url) {
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

    render() {
        // 两个图表的属性值对象
        const {values, colorIndex, chartLabels, url} = this.state;
        const config = this.next(values, colorIndex, chartLabels, url);
        const {values2, colorIndex2, chartLabels2, url2} = this.state;
        const config2 = this.next(values2, colorIndex2, chartLabels2, url2);
        return this.state.linechart ? (
            <TouchableOpacity
                style={{backgroundColor: '#1F2342', height: height}}
                activeOpacity={1.0}
                onPress={() => {
                    this.refs.input1.blur();
                    this.refs.input2.blur();
                }}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.settingbtnstyle} onPress={setReqTime.bind(this)}>
                        {I18n.t('setTime')}
                    </Text>
                    <Text
                        style={{color: '#FFB6C1', fontSize: 20, left: 215, top: 10}}
                        onPress={() => {
                            this.setState({linechart: false});
                            // eslint-disable-next-line no-undef
                            Orientation.lockToLandscape();
                        }}>
                        {I18n.t('about')}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({langvis: true});
                    }}>
                    <Text style={styles.settingbtnstyle}>{I18n.t('chooselanguage')}</Text>
                </TouchableOpacity>
                {/* 用户语言选择列表 start */}
                {
                    <Overlay
                        isVisible={this.state.langvis}
                        onBackdropPress={() => {
                            this.setState({langvis: false});
                        }}>
                        <View style={styles.History}>
                            <ScrollView ref={(scroll) => (this._scroll = scroll)} onScroll={(e) => {}}>
                                {data.languageshow.map((item, index) => {
                                    return (
                                        <View>
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.HistoryTextBox}
                                                onPress={() => {
                                                    I18n.locale = data.language[data.languageshow.indexOf(item)];
                                                    data.userChoose = I18n.locale;
                                                    store.save('Language', data.userChoose);
                                                    this.setState({langvis: false});
                                                }}>
                                                <Text numberOfLines={index} style={styles.HistoryText}>
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </Overlay>
                }
                {/* 用户语言选择列表 end */}
                <View>
                    <Overlay
                        style={styles.overlay}
                        isVisible={this.state.overlay1}
                        onBackdropPress={() => {
                            this.setState({overlay1: false});
                            this.refs.input1.blur();
                        }}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                defaultValue={this.state.defaultvalue1}
                                placeholderTextColor="#ccc" // 设置占位符颜色
                                color="#000000" // 设置输入文字的颜色
                                placeholder={I18n.t('inputone')}
                                onChangeText={(newText) => {
                                    this.state.url = newText;
                                    this.state.defaultvalue1 = newText;
                                }}
                                style={{borderBottomColor: '#000000', borderBottomWidth: 1, width: 280, left: 0}}
                            />
                            <View>
                                <TouchableOpacity
                                    style={{color: '#000000', top: 0}}
                                    onPress={() => {
                                        this.setState({
                                            chartDate: [],
                                        });
                                        this.state.defaultvalue1 = '';
                                        this.state.url = '';
                                    }}>
                                    <Text style={{fontSize: 16}}>清除</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{color: '#000000', top: 12}}
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
                                    <Text style={{fontSize: 20, fontWeight: 'bold', left: 5}}>{I18n.t('enter')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <FlatList
                                style={{maxHeight: 30}}
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
                                        <View style={styles.HistoryList}>
                                            <TouchableOpacity
                                                key={index}
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
                                                <Text style={styles.DeleteText}>X</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </Overlay>
                </View>

                {/* start */}
                <Overlay
                    isVisible={this.state.overlay2}
                    onBackdropPress={() => {
                        this.setState({overlay2: false});
                        this.refs.input2.blur();
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput
                            defaultValue={this.state.defaultvalue2}
                            placeholderTextColor="#ccc" // 设置占位符颜色
                            color="#000000" // 设置输入文字的颜色
                            placeholder={I18n.t('inputtwo')}
                            onChangeText={(newText) => {
                                this.state.url2 = newText;
                                this.state.defaultvalue2 = newText;
                            }}
                            style={{borderBottomColor: '#000000', borderBottomWidth: 1, width: 280, left: 0}}
                        />
                        <View>
                            <TouchableOpacity
                                style={{color: '#000000', top: 0}}
                                onPress={() => {
                                    this.setState({
                                        chartDate: [],
                                    });
                                    this.state.defaultvalue2 = '';
                                    this.state.url2 = '';
                                }}>
                                <Text style={{fontSize: 16}}>清除</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{color: '#000000', top: 12}}
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
                                <Text style={{fontSize: 20, fontWeight: 'bold', left: 5}}>{I18n.t('enter')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <FlatList
                            style={{maxHeight: 30}}
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
                                    <View style={styles.HistoryList}>
                                        <TouchableOpacity
                                            key={index}
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
                                            <Text style={styles.DeleteText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                </Overlay>
                {/* end */}
                <Overlay
                    isVisible={this.state.OverlayAble}
                    onBackdropPress={() => {
                        this.setState({OverlayAble: false});
                    }}>
                    <View style={{height: 150}}>
                        <Text style={{color: '#000000', fontSize: 18}}>
                            {I18n.t('currenttime')}:{this.state.reqTime}
                        </Text>
                        <View>
                            <TextInput
                                placeholder={I18n.t('timeinput')}
                                placeholderTextColor="#ccc"
                                color="#000000"
                                onChangeText={reqTimeChange.bind(this)}
                                style={{width: 200, top: 6, marginBottom: 10}}
                            />
                            <Button title={I18n.t('sure')} onPress={confirmRqTime.bind(this)} />
                        </View>
                    </View>
                </Overlay>
                <Text style={{color: 'pink', fontSize: 40, fontWeight: 'bold', marginLeft: 65, marginTop: 180}}>{I18n.t('title')}</Text>
                <View style={styles.serch}>
                    <View style={styles.textinput}>
                        <TextInput
                            ref={'input1'}
                            placeholder={I18n.t('inputone')} // 占位符
                            defaultValue={this.state.defaultvalue1}
                            placeholderTextColor="#ccc" // 设置占位符颜色
                            keyboardType="url" // 设置键盘类型，url只在iOS端可用
                            color="#ffffff" // 设置输入文字的颜色
                            onChangeText={textInputChange1.bind(this)}
                            onFocus={() => {
                                this.setState({overlay1: true});
                            }}
                            style={{borderBottomColor: '#ffffff', borderBottomWidth: 1, width: 280, left: 12}}
                        />
                        <TextInput
                            ref={'input2'}
                            placeholder={I18n.t('inputtwo')} // 占位符
                            defaultValue={this.state.defaultvalue2}
                            placeholderTextColor="#ccc" // 设置占位符颜色
                            keyboardType="url" // 设置键盘类型，url只在iOS端可用
                            color="#ffffff" // 设置输入文字的颜色
                            onChangeText={textInputChange2.bind(this)}
                            onFocus={() => {
                                this.setState({overlay2: true});
                            }}
                            style={{borderBottomColor: '#ffffff', borderBottomWidth: 1, width: 280, left: 12}}
                        />
                    </View>
                    <Text
                        style={{
                            color: '#ffffff',
                            fontSize: 25,
                            paddingTop: 8,
                            backgroundColor: 'pink',
                            alignSelf: 'center',
                            textAlign: 'center',
                            height: 50,
                            width: 220,
                            top: 28,
                            left: -8,
                            borderRadius: 5,
                        }}
                        onPress={sendRequest.bind(this)}>
                        {I18n.t('ping')}
                    </Text>
                </View>
                {this.state.backChart ? (
                    <Text
                        style={{color: 'pink', top: 200, left: 130, fontSize: 20}}
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
                    {this.state.url ? (
                        <LineChart width={width} height={600} data={config.data} xAxis={config.xAxis} style={styles.container} marker={this.state.marker} ref="chart" />
                    ) : (
                        <View />
                    )}
                    {this.state.url2 ? (
                        <LineChart width={width} height={600} data={config2.data} xAxis={config2.xAxis} style={styles.container} marker={this.state.marker} ref="chart2" />
                    ) : (
                        <View />
                    )}
                    {this.state.url ? (
                        <View>
                            <Text style={{color: 'pink', left: 20, fontSize: 20, top: 10}}>{`${this.state.url} :`}</Text>
                            <Text style={{color: 'pink', fontSize: 20, top: 15, left: 20}}>{`status:${this.status1}`}</Text>
                            <TouchableOpacity style={{flexDirection: 'column'}} activeOpacity={1.0}>
                                <Text style={{color: 'pink', fontSize: 20, top: 12, left: 20}}>
                                    {I18n.t('max')}:{this.maxTime}ms
                                </Text>
                                <Text style={{color: 'pink', fontSize: 20, top: 6, left: 20}}>
                                    {I18n.t('min')}:{this.minTime}ms
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'column', top: 0}} activeOpacity={1.0}>
                                <Text style={{color: 'pink', fontSize: 20, top: 0, left: 20}}>
                                    {I18n.t('avg')}:{this.avgTime.toFixed(2)}ms
                                </Text>
                                <Text style={{color: 'pink', fontSize: 20, top: 0, left: 20}}>95%:{this.n95 ? `${this.n95.toFixed(2)}ms` : ''}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View />
                    )}
                    {this.state.url2 ? (
                        <View>
                            <Text style={{color: 'pink', left: 20, fontSize: 20, top: 16}}>{`${this.state.url2} :`}</Text>
                            <Text style={{color: 'pink', fontSize: 20, top: 18, left: 20}}>{`status:${this.status2}`}</Text>
                            <TouchableOpacity style={{flexDirection: 'column', top: 12}} activeOpacity={1.0}>
                                <Text style={{color: 'pink', fontSize: 20, top: 0, left: 20}}>
                                    {I18n.t('max')}:{this.maxTime2}ms
                                </Text>
                                <Text style={{color: 'pink', fontSize: 20, bottom: 5, left: 20}}>
                                    {I18n.t('min')}:{this.minTime2}ms
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'column', top: 0}} activeOpacity={1.0}>
                                <Text style={{color: 'pink', fontSize: 20, left: 20, top: 2}}>
                                    {I18n.t('avg')}:{this.avgTime2.toFixed(2)}ms
                                </Text>
                                <Text style={{color: 'pink', fontSize: 20, top: 0, left: 20}}>95%:{this.n952 ? `${this.n952.toFixed(2)}ms` : ''}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View />
                    )}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomStyle: {
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
        left: 28,
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
        color: '#FFB6C1',
        fontSize: 20,
        top: 10,
        left: 5,
    },
    History: {
        position: 'relative',
        height: 300,
        width: 300,
    },
    HistoryList: {
        width: 310,
        height: 43,
        backgroundColor: 'white',
    },
    HistoryTextBox: {
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#F0F8FF',
    },
    HistoryText: {
        fontSize: 20,
        color: 'black',
    },
    Delete: {
        width: 40,
        height: 40,
        position: 'relative',
        top: -50,
        left: 270,
    },
    DeleteText: {
        position: 'relative',
        top: 5,
        fontSize: 35,
    },
    overlay: {
        position: 'absolute',
        width: 400,
    },
    language: {
        width: width,
        height: height,
        position: 'absolute',
    },
});
