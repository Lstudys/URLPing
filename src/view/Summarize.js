import React, {Component} from 'react';
import {Image} from 'react-native';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  processColor,
  ScrollView,
} from 'react-native';
import Drawer from 'react-native-drawer';
import {LineChart, BarChart, PieChart} from 'react-native-charts-wrapper';
import {SetSpText, ScaleSize, ScaleSizeH} from '../controller/Adaptation';
import store from 'react-native-simple-store';
import Data from '../modal/data';
import I18n from 'i18n-js';
import {LanguageChange} from '../component/LanguageChange';
import {BackHandler, Platform} from 'react-native';
import {ExitApp, BackAction} from '../controller/AppPageFunction';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ReloadInstructions} from 'react-native/Libraries/NewAppScreen';
const Colors = [
  processColor('red'),
  processColor('#2a82e4'),
  processColor('green'),
  processColor('#f67e1e'),
  processColor('purple'),
];
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const gridColor = processColor('#fff'); //网格线的颜色

class Summarize extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      urlCollection: Data.urlCollection,
      config: Data.config,
      showAlert: false,
      FlatListIsRefreshing: false,
      isPing: false, //判断是否正在Ping
      refresh: false,
      currentUrlindex: -1,
      focus: false,
      langvis: false, // 选择语言后刷新页面(控制语言选择overlay显示的state)
      keyBoardHeight: 0,
      currentIndex: -1,
      isLoading: true,
    };

    LanguageChange.bind(this)();

    store.get(Data.pingIndex).then((res) => {
      if (res != null) {
        Data.Ping = res;
        this.setState({refresh: !this.state.refresh});
      }
    });
    console.log('传过来了吗？ ', Data.config);
  }
  identify = true;

  componentDidMount() {
    Data.InputUrl = '';
    // Data.pingurl = [];
  }

  next(urlCollection, dataSets, colortempArr) {
    for (let i = 0; i < urlCollection.length; i++) {
      if (urlCollection[i] != '') {
        dataSets.push({
          values: Data.compare_data[i],
          // label: 'Company A',
          config: {
            drawValues: false,
            colors: [Colors[colortempArr[i]]],
          },
        });
      }
    }
    if (urlCollection.length == 1) {
      dataSets.push({
        values: Data.compare_data[1],
        // label: 'Company A',
        config: {
          drawValues: false,
          colors: [Colors[colortempArr[1]]],
        },
      });
    }
    return {
      data: {
        dataSets,
      },
    };
  }
  Pie_next(urlCollection, dataSets2) {
    for (let i = 0; i < urlCollection.length; i++) {
      if (urlCollection[i] != '') {
        dataSets2.push({
          values: [{value: Data.Piedata[i][1]},
            {value: Data.Piedata[i][0]},
       ],
          config: {
            colors: [processColor('#2a82e4'), processColor('red')],
            valueTextSize: ScaleSize(12),
            valueTextColor: processColor('#fff'),
            sliceSpace: 5,
            selectionShift: 13,
            // xValuePosition: "OUTSIDE_SLICE",
            // yValuePosition: "OUTSIDE_SLICE",
            valueFormatter: "#.#'%'",
            valueLineColor: processColor('green'),
            valueLinePart1Length: 0.5
          }
        });
      }
    }
    
    return {
      data: {
        dataSets2,
      },
    };
      
  
  }
  handleSelect(event) {
    // let entry = event.nativeEvent
    // if (entry == null) {
    //   this.setState({...this.state, selectedEntry: null})
    // } else {
    //   this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    // }

    // console.log(event.nativeEvent)
  }

  render() {
    var dataSets = [];
    var dataSets2 = [];
    const colortempArr = [0, 1, 2, 3, 4];

    let config_bar = this.next(Data.pingurl, dataSets, colortempArr);
let config_Pie=this.Pie_next(Data.pingurl,dataSets2)
    console.log("这里"+config_Pie);
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return (
      <View style={{backgroundColor: '#1f2342'}}>
        <ScrollView style={{}}>
          <View
            style={{
              height: Height * 0.08,
              borderBottomColor: '#fff',
              borderBottomWidth: ScaleSize(2),
              marginBottom: Height * 0.04,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Ordinary');
              }}>
              <View>
                <Image
                  source={require('../imgs/back.png')}
                  style={{
                    marginTop: ScaleSize(16),
                    width: ScaleSize(30),
                    height: ScaleSize(30),
                    marginBottom: ScaleSize(15),
                    marginHorizontal: ScaleSize(10),
                  }}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginTop: -Height * 0.066,
                marginLeft: Width * 0.28,
                //   backgroundColor:"pink"
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: ScaleSize(22),
                }}>
                {`${year}/${month}/${day}/${this.state.config.xAxis.valueFormatter[0]}`}
              </Text>
            </View>
          </View>
          {Data.urlData_length > 0 ? (
            <View
              style={{
                width: Width * 0.9,
                marginLeft: Width * 0.05,
                height: Height * 0.04,
                backgroundColor: 'red',
                marginBottom: ScaleSize(3),
              }}>
              <Text
                style={styles.rowlegend}
                numberOfLines={1}
                ellipsizeMode="tail">
                {' '}
                A : {urlCollection[0]} ({Data.IP1})
              </Text>
            </View>
          ) : (
            <View />
          )}
          {Data.urlData_length > 1 ? (
            <View
              style={{
                width: Width * 0.9,
                marginLeft: Width * 0.05,
                height: Height * 0.04,
                backgroundColor: '#2a82e4',
                marginBottom: ScaleSize(3),
              }}>
              <Text style={styles.rowlegend} numberOfLines={1}>
                {' '}
                B : {urlCollection[1]} ({Data.IP2})
              </Text>
            </View>
          ) : (
            <View />
          )}
          {Data.urlData_length > 2 ? (
            <View
              style={{
                width: Width * 0.9,
                marginLeft: Width * 0.05,
                height: Height * 0.04,
                backgroundColor: 'green',
                marginBottom: ScaleSize(3),
              }}>
              <Text style={styles.rowlegend} numberOfLines={1}>
                {' '}
                C : {urlCollection[2]} ({Data.IP3})
              </Text>
            </View>
          ) : (
            <View />
          )}
          {Data.urlData_length > 3 ? (
            <View
              style={{
                width: Width * 0.9,
                marginLeft: Width * 0.05,
                height: Height * 0.04,
                backgroundColor: '#f67e1e',
                marginBottom: ScaleSize(3),
              }}>
              <Text style={styles.rowlegend} numberOfLines={1}>
                {' '}
                D : {urlCollection[3]} ({Data.IP4})
              </Text>
            </View>
          ) : (
            <View />
          )}
          {Data.urlData_length > 4 ? (
            <View
              style={{
                width: Width * 0.9,
                marginLeft: Width * 0.05,
                height: Height * 0.04,
                backgroundColor: 'purple',
                marginBottom: ScaleSize(3),
              }}>
              <Text style={styles.rowlegend} numberOfLines={1}>
                {' '}
                E : {urlCollection[4]} ({Data.IP5})
              </Text>
            </View>
          ) : (
            <View />
          )}
          {/* <View
            style={{
              // backgroundColor:"blue",
              // width:10,
              flexDirection: 'column',
              top: Height * 0.26,
              left: Width * 0.01,
              transform: [{rotate: '-90deg'}],
              position: 'absolute',
              // backgroundColor: '#1f2342',
            }}>
            <Text
              style={{
                color: '#fff',
                // width:ScaleSize(20)
              }}>
              ms
            </Text>
          </View> */}
          <View style={{marginLeft: Width * 0.05}}>
            {/* 折线图 */}
            <LineChart
              width={Width * 0.92}
              height={Width * 0.56}
              bottom={0}
              data={this.state.config.data}
              xAxis={this.state.config.xAxis}
              yAxis={{
                left: {
                  axisLineWidth: 1.5,
                  axisLineColor: gridColor,

                  textColor: gridColor,
                  enabled: true,
                  drawGridLines: true,
                  gridColor: gridColor,
                },
                right: {
                  axisLineWidth: 1.5,
                  axisLineColor: gridColor,

                  textColor: gridColor,
                  enabled: true,
                  drawGridLines: true,
                  gridColor: gridColor,
                },
              }}
              zoom={{scaleX: 1, scaleY: 1, xValue: 2}}
              scaleYEnabled={true}
              scaleXEnabled={true}
              doubleTapToZoomEnabled={true}
              dragDecelerationFrictionCoef={0.99}
              marker={{
                enabled: true,
                backgroundTint: processColor('#fff'),
                markerColor: processColor('#fff'),
                textColor: processColor('red'),
              }}
              legend={{
                textColor: gridColor,
                wordWrapEnabled: true,
                enabled: true,
                // xEntrySpace:true,
                form: 'NONE',
              }}
              extraOffsets={{bottom: 10}}
              chartDescription={{text: ''}}
              ref="chart"
            />
            {/* 柱状图 */}
            <BarChart
              width={Width * 0.92}
              height={Width * 0.56}
              bottom={0}
              data={{
                dataSets: config_bar.data.dataSets,
                config: {
                  barWidth: 0.2,
                  group: {
                    fromX: 0,
                    groupSpace: 0.1,
                    barSpace: 0.1,
                  },
                },
              }}
              xAxis={{
                // valueFormatter: "none",
                textColor: processColor('#1f2342'),
                granularityEnabled: true,
                granularity:
                  Data.pingurl.length == 3
                    ? 1
                    : Data.pingurl.length == 2
                    ? 0.7
                    : Data.pingurl.length == 4
                    ? 1.3
                    : Data.pingurl.length == 5
                    ? 1.6
                    : 0.7,
                axisMaximum:
                  Data.pingurl.length == 1
                    ? 2.6
                    : Data.pingurl.length == 2
                    ? 2.8
                    : Data.pingurl.length == 3
                    ? 4
                    : Data.pingurl.length == 4
                    ? 5.2
                    : Data.pingurl.length == 5
                    ? 6.4
                    : 20,
                axisMinimum: 0,
                centerAxisLabels: true,
              }}
              yAxis={{
                left: {
                  axisLineWidth: 1.5,
                  axisLineColor: gridColor,

                  textColor: gridColor,
                  enabled: true,
                  drawGridLines: true,
                  gridColor: gridColor,
                },
                right: {
                  axisLineWidth: 1.5,
                  axisLineColor: gridColor,

                  textColor: gridColor,
                  enabled: true,
                  drawGridLines: true,
                  gridColor: gridColor,
                },
              }}
              zoom={{scaleX: 1, scaleY: 1, xValue: 1}}
              scaleYEnabled={true}
              scaleXEnabled={true}
              doubleTapToZoomEnabled={true}
              dragDecelerationFrictionCoef={0.99}
              marker={{
                enabled: true,
                markerColor: processColor('#F0C0FF8C'),
                textColor: processColor('white'),
                markerFontSize: 14,
              }}
              legend={{
                textColor: gridColor,
                // wordWrapEnabled: true,
                enabled: true,
                // xEntrySpace:true,
                form: 'NONE',
              }}
              extraOffsets={{bottom: 10}}
              chartDescription={{text: ''}}
              ref="chart"
            />
            <View
              style={{height: Height * 0.03, width:Width*.8,marginLeft:Width*.05,marginTop:-Height*.035}}>
                <Text style={{color:"#fff",marginLeft:Width*.11,fontSize:ScaleSize(12)}}>MIN               AVG              N95             MAX</Text>
              </View>
              {Data.pingurl.length>0?<View style={{height:Height*.35,width:Width*.7,marginTop:-Height*.05}}>
        <PieChart
            style={{height:Height*.4}}
            logEnabled={true}
            data={{
              dataSets:config_Pie.data.dataSets2[0],
              config: {
                colors: [processColor('#2a82e4'), processColor('red')],
                valueTextSize: ScaleSize(12),
                valueTextColor: processColor('#fff'),
                sliceSpace: 5,
                selectionShift: 13,
                // xValuePosition: "OUTSIDE_SLICE",
                // yValuePosition: "OUTSIDE_SLICE",
                valueFormatter: "#.#'%'",
                valueLineColor: processColor('green'),
                valueLinePart1Length: 0.5
              }
            }}
            chartDescription={ {
              text: 'This is Pie chart description',
              textSize: 15,
              textColor: processColor('#1f2342'),
      
            }}

            legend={{
              enabled: true,
              textColor:processColor('#1f2342'),
              // textSize: ,
              form: 'NONE',
      
              horizontalAlignment: "RIGHT",
              verticalAlignment: "CENTER",
              orientation: "VERTICAL",
              wordWrapEnabled: true
            }}
            // highlights={[{x:2}]}

            // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

            entryLabelColor={processColor('green')}
            entryLabelTextSize={10}
            entryLabelFontFamily={'HelveticaNeue-Medium'}
            // drawEntryLabels={true}

            rotationEnabled={true}
            rotationAngle={0}
            usePercentValues={true}
            // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
            // centerTextRadiusPercent={100}
            holeRadius={0}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={20}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={360}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />
          </View>
          :<View/>}
          {Data.pingurl.length>1?<View style={{height:Height*.35,width:Width*.7,marginTop:-Height*.05}}>
        <PieChart
            style={{height:Height*.4}}
            logEnabled={true}
            data={{
              dataSets:config_Pie.data.dataSets2[1],
              config: {
                colors: [processColor('#2a82e4'), processColor('red')],
                valueTextSize: ScaleSize(12),
                valueTextColor: processColor('#fff'),
                sliceSpace: 5,
                selectionShift: 13,
                // xValuePosition: "OUTSIDE_SLICE",
                // yValuePosition: "OUTSIDE_SLICE",
                valueFormatter: "#.#'%'",
                valueLineColor: processColor('green'),
                valueLinePart1Length: 0.5
              }
            }}
            chartDescription={ {
              text: 'This is Pie chart description',
              textSize: 15,
              textColor: processColor('#1f2342'),
      
            }}

            legend={{
              enabled: true,
              textColor:processColor('#1f2342'),
              // textSize: ,
              form: 'NONE',
      
              horizontalAlignment: "RIGHT",
              verticalAlignment: "CENTER",
              orientation: "VERTICAL",
              wordWrapEnabled: true
            }}
            // highlights={[{x:2}]}

            // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

            entryLabelColor={processColor('green')}
            entryLabelTextSize={10}
            entryLabelFontFamily={'HelveticaNeue-Medium'}
            // drawEntryLabels={true}

            rotationEnabled={true}
            rotationAngle={0}
            usePercentValues={true}
            // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
            // centerTextRadiusPercent={100}
            holeRadius={0}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={20}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={360}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />
          </View>
  :<View/>}
          {Data.pingurl.length>2?<View style={{height:Height*.35,width:Width*.7,marginTop:-Height*.05}}>
        <PieChart
            style={{height:Height*.4}}
            logEnabled={true}
            data={{
              dataSets:config_Pie.data.dataSets2[2],
              config: {
                colors: [processColor('#2a82e4'), processColor('red')],
                valueTextSize: ScaleSize(12),
                valueTextColor: processColor('#fff'),
                sliceSpace: 5,
                selectionShift: 13,
                // xValuePosition: "OUTSIDE_SLICE",
                // yValuePosition: "OUTSIDE_SLICE",
                valueFormatter: "#.#'%'",
                valueLineColor: processColor('green'),
                valueLinePart1Length: 0.5
              }
            }}
            chartDescription={ {
              text: 'This is Pie chart description',
              textSize: 15,
              textColor: processColor('#1f2342'),
      
            }}

            legend={{
              enabled: true,
              textColor:processColor('#1f2342'),
              // textSize: ,
              form: 'NONE',
      
              horizontalAlignment: "RIGHT",
              verticalAlignment: "CENTER",
              orientation: "VERTICAL",
              wordWrapEnabled: true
            }}
            // highlights={[{x:2}]}

            // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

            entryLabelColor={processColor('green')}
            entryLabelTextSize={10}
            entryLabelFontFamily={'HelveticaNeue-Medium'}
            // drawEntryLabels={true}

            rotationEnabled={true}
            rotationAngle={0}
            usePercentValues={true}
            // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
            // centerTextRadiusPercent={100}
            holeRadius={0}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={20}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={360}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />
          </View>
  :<View/>}
          {Data.pingurl.length>3?<View style={{height:Height*.35,width:Width*.7,marginTop:-Height*.05}}>
        <PieChart
            style={{height:Height*.4}}
            logEnabled={true}
            data={{
              dataSets:config_Pie.data.dataSets2[3],
              config: {
                colors: [processColor('#2a82e4'), processColor('red')],
                valueTextSize: ScaleSize(12),
                valueTextColor: processColor('#fff'),
                sliceSpace: 5,
                selectionShift: 13,
                // xValuePosition: "OUTSIDE_SLICE",
                // yValuePosition: "OUTSIDE_SLICE",
                valueFormatter: "#.#'%'",
                valueLineColor: processColor('green'),
                valueLinePart1Length: 0.5
              }
            }}
            chartDescription={ {
              text: 'This is Pie chart description',
              textSize: 15,
              textColor: processColor('#1f2342'),
      
            }}

            legend={{
              enabled: true,
              textColor:processColor('#1f2342'),
              // textSize: ,
              form: 'NONE',
      
              horizontalAlignment: "RIGHT",
              verticalAlignment: "CENTER",
              orientation: "VERTICAL",
              wordWrapEnabled: true
            }}
            // highlights={[{x:2}]}

            // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

            entryLabelColor={processColor('green')}
            entryLabelTextSize={10}
            entryLabelFontFamily={'HelveticaNeue-Medium'}
            // drawEntryLabels={true}

            rotationEnabled={true}
            rotationAngle={0}
            usePercentValues={true}
            // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
            // centerTextRadiusPercent={100}
            holeRadius={0}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={20}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={360}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />
          </View>
  :<View/>}
          {Data.pingurl.length>4?<View style={{height:Height*.35,width:Width*.7,marginTop:-Height*.05}}>
        <PieChart
            style={{height:Height*.4}}
            logEnabled={true}
            data={{
              dataSets:config_Pie.data.dataSets2[4],
              config: {
                colors: [processColor('#2a82e4'), processColor('red')],
                valueTextSize: ScaleSize(12),
                valueTextColor: processColor('#fff'),
                sliceSpace: 5,
                selectionShift: 13,
                // xValuePosition: "OUTSIDE_SLICE",
                // yValuePosition: "OUTSIDE_SLICE",
                valueFormatter: "#.#'%'",
                valueLineColor: processColor('green'),
                valueLinePart1Length: 0.5
              }
            }}
            chartDescription={ {
              text: 'This is Pie chart description',
              textSize: 15,
              textColor: processColor('#1f2342'),
      
            }}

            legend={{
              enabled: true,
              textColor:processColor('#1f2342'),
              // textSize: ,
              form: 'NONE',
      
              horizontalAlignment: "RIGHT",
              verticalAlignment: "CENTER",
              orientation: "VERTICAL",
              wordWrapEnabled: true
            }}
            // highlights={[{x:2}]}

            // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

            entryLabelColor={processColor('green')}
            entryLabelTextSize={10}
            entryLabelFontFamily={'HelveticaNeue-Medium'}
            // drawEntryLabels={true}

            rotationEnabled={true}
            rotationAngle={0}
            usePercentValues={true}
            // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
            // centerTextRadiusPercent={100}
            holeRadius={0}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={20}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={360}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />
          </View>
  :<View/>}
          </View>
        </ScrollView>
        
      </View>
    );
  }
}
export default Summarize;
const styles = StyleSheet.create({
  rowlegend: {
    color: '#fff',
    lineHeight: Height * 0.04,
  },
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
    color: '#1f2342',
    fontWeight: '700',
  },
  pingwhole: {
    marginHorizontal: ScaleSize(5),
  },
  urlsArrFlatlist: {
    marginLeft: ScaleSize(-4),
    marginBottom: ScaleSize(4),
    borderRadius: ScaleSize(13),
    backgroundColor: '#fff',
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
