/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  Button,
  TouchableOpacity, 
  ScrollView,
  FlatList
} from 'react-native';
import {Toast} from 'teaset';
import {VictoryChart,VictoryTheme,VictoryLine, VictoryZoomContainer,VictoryBrushContainer,VictoryAxis,VictoryPie} from 'victory-native';
import {Overlay, withTheme} from 'react-native-elements';
import { BackHandler } from 'react-native';
import {sendRequest} from '../controller/request';
import {setReqTime,reqTimeChange,confirmRqTime,textInputChange1,textInputChange2,overtextInputChange1,backAction, saveValue} from '../controller/AppPageFunction';
import NetInfo from '@react-native-community/netinfo';
import data from '../modal/data';
import store from 'react-native-simple-store';




const height=Dimensions.get('window').height;
export default class home extends Component{
    constructor(props){
      super(props);
      this.state={
        reqTime:5,//控制请求发送持续时间的state
        newReqTime:0,
        url:'',//用户输入的url
        url2:'',
        OverlayAble: false, //控制Overlay组件的显示
        linechart:true,//用来控制图表的显示,true表示显示输入框，不显示图表
        ifOverlayAble:true,//用来控制是否可以设置请求时间，当正在Ping时不能设置
        isPing:false,//控制是否正在ping
        defaultvalue1:'',
        defaultvalue2:'',
        backChart:false,//ping过之后，点击返回图表
        chartToData:false,
        overlay1:false,
        overlay2:false,//控制两个overlay显示的state
        urlArr:['https://','   ','http://','   ','www.','   ','.cn'],
        visible:false,//删除后刷新历史记录
        chartDate://只作为刷新页面用的state，原本是用来作为数据源的，现在不用了所以用来刷新页面
          [
            {y:0,x:0}
          ]
      }
      store.get("local").then(
        res => data.local=res.slice()
    );
};

    pressnum=0;//表示安卓手机返回键按压次数，以控制返回上一界面
    firstpress=0;//第一次按返回键的时间戟
    maxTime=0;//最大时间
    minTime='';//最小时间
    avgTime=0;//平均时间
    n95='';//95%的数据
    status1='';
    sumReqTime=[];//所有请求时间的数组，用来计算标准差
    linechartDates=[];//折线图1的数据源
    /**
     * 下面是第二个图表的数据
     */
     maxTime2=0;//最大时间
    minTime2='';//最小时间
    avgTime2=0;//平均时间
    n952='';//95%的数据
    status2='';
    sumReqTime2=[];//所有请求时间的数组，用来计算标准差
    linechartDates2=[];//折线图2的数据源

    chartDate=[{//用于setState以便刷新页面，并无实际意义
      y:1,
      x:1
    }];

    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress',backAction.bind(this));
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress',backAction.bind(this));
    }

    _renderRow(item,index){//已完成任务列表渲染函数   /**非常重要的函数 */
      return(
          <TouchableOpacity
          onPress={()=>{
            if(this.state.overlay1){
              this.setState({defaultvalue1:item});
            }
            if(this.state.overlay2){
              this.setState({defaultvalue2:item});
            }
          }}
              style={{
                flexDirection:'row',
                  // height:20,
                  borderBottomColor:'red',
                  justifyItems:'flex-start',
                  margin:0,
                 //设置下边框，以便分隔不同的列表元素
                //  borderBottomWidth:1,
                //  borderBottomColor:'#ccc',   
              }}
          >
              <Text style={{left:0,color:'#000000',fontSize:20,}}>{item}</Text>    
          </TouchableOpacity>
      )
  }

              
    render(){

      return(     
       this.state.linechart? <TouchableOpacity  style={{backgroundColor:'#1F2342',height:height}} activeOpacity={1.0} onPress={()=>{this.refs.input1.blur();this.refs.input2.blur();}} >
          <View style={{flexDirection:'row'}}>
         <Text style={styles.settingbtnstyle} onPress={setReqTime.bind(this)}>Set Time</Text>
         <Text style={{color:'#FFB6C1',fontSize:20,left:215,top:10}} onPress={()=>{this.setState({linechart:false});Orientation.lockToLandscape()}} >About</Text>
         </View>
        <View >
            <Overlay
          style={styles.overlay}
          isVisible={this.state.overlay1}
          onBackdropPress={()=>{this.setState({overlay1:false});this.refs.input1.blur()}}
          >
            <View style={{flexDirection:'row'}}>
              <TextInput
              defaultValue={this.state.defaultvalue1}
              placeholderTextColor='#ccc'//设置占位符颜色
              color='#000000'//设置输入文字的颜色
              placeholder='输入网址1'
              onChangeText={(newText)=>{
                this.state.url=newText;
                this.state.defaultvalue1=newText;
              }}
              style={{borderBottomColor:'#000000',borderBottomWidth:1,width:280,left:0,}}
              />
              <TouchableOpacity style={{color:'#000000',top:28}}
              onPress={()=>{this.setState({
                chartDate:[]});
                this.refs.input1.blur();
                this.setState({overlay1:false});
                saveValue(this.state.url)
              }}
              ><Text style={{fontSize: 16}}>Enter</Text></TouchableOpacity>
            </View>
            <View>
              <FlatList
              style={{maxHeight: 30,}}
              horizontal={true}
              data={this.state.urlArr}
              renderItem={({item, index}) => this._renderRow(item, index)}
              keyExtractor={(item, index) => item + index}
              />
            </View>
            <View style={styles.History}>
              <ScrollView
                  ref={(scroll)=>this._scroll = scroll}
                  onScroll={(e)=>{}}>
                  {
                    data.local.map((item, index) => {
                        return (
                          <View style={styles.HistoryList}>
                              <TouchableOpacity
                                key={index}
                                style={styles.HistoryTextBox}
                                onPress={
                                    () => console.log('+++++++++++++++++')
                                }
                              >
                              <Text numberOfLines={index} style={styles.HistoryText}>{item}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                              style={styles.Delete}
                              onPress={
                                  () => {
                                      data.local.splice(data.local.indexOf(item),1);
                                      store.save('local',data.local);
                                      this.setState({
                                          visible:true,
                                      })
                                  }
                              }
                              >
                              <Text style={styles.DeleteText}>X</Text>
                              </TouchableOpacity>
                          </View>
                        )
                    })
                  }
              </ScrollView>    
            </View>
          </Overlay>
        </View>
        
         {/* start */}
        <Overlay
        isVisible={this.state.overlay2}
        onBackdropPress={()=>{this.setState({overlay2:false});this.refs.input2.blur()}}
        >
          <View style={{flexDirection:'row'}}>
          <TextInput
            defaultValue={this.state.defaultvalue2}
            placeholderTextColor='#ccc'//设置占位符颜色
            color='#000000'//设置输入文字的颜色
            placeholder='输入网址2'
            onChangeText={(newText)=>{this.state.url2=newText;this.state.defaultvalue2=newText;}}
            style={{borderBottomColor:'#000000',borderBottomWidth:1,width:280,left:0,}}
          />
          <TouchableOpacity style={{color:'#000000',top:28}}
          onPress={()=>{this.setState({chartDate:[]});this.refs.input2.blur();this.setState({overlay2:false})}}
          ><Text style={{fontSize: 16}}>Enter</Text></TouchableOpacity>
          </View>
          <View>
              <FlatList
              style={{maxHeight: 30,}}
              horizontal={true}
              data={this.state.urlArr}
              renderItem={({item, index}) => this._renderRow(item, index)}
              keyExtractor={(item, index) => item + index}
              />
            </View>
            <View style={styles.History}>
              <ScrollView
                  ref={(scroll)=>this._scroll = scroll}
                  onScroll={(e)=>{}}>
                  {
                    data.local.map((item, index) => {
                        return (
                          <View style={styles.HistoryList}>
                              <TouchableOpacity
                                key={index}
                                style={styles.HistoryTextBox}
                                onPress={
                                    () => console.log('+++++++++++++++++')
                                }
                              >
                              <Text numberOfLines={index} style={styles.HistoryText}>{item}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                              style={styles.Delete}
                              onPress={
                                  () => {
                                      data.local.splice(data.local.indexOf(item),1);
                                      store.save('local',data.local);
                                      this.setState({
                                          visible:true,
                                      })
                                  }
                              }
                              >
                              <Text style={styles.DeleteText}>X</Text>
                              </TouchableOpacity>
                          </View>
                        )
                    })
                  }
              </ScrollView>    
            </View>
        </Overlay>
         {/* end */}
        <Overlay 
         isVisible={this.state.OverlayAble}
         onBackdropPress={()=>{this.setState({OverlayAble:false})}}
         >
           <View style={{height:150}}>
           <Text style={{color:'#000000',fontSize:18}} >当前请求时长:{this.state.reqTime}</Text>
           <View>
           <TextInput
           placeholder='输入请求时长'
           placeholderTextColor='#ccc'
           color='#000000'
           onChangeText={reqTimeChange.bind(this)}
           style={{width:200,top:6,marginBottom:10}}
           />
           <Button title='确定' onPress={confirmRqTime.bind(this)} />
           </View>
           </View>
         </Overlay> 
            <Text style={{color:'pink',fontSize:40,fontWeight:'bold',marginLeft:65,marginTop:180}}>Graphurlping</Text>
            <View style={styles.serch}>
              <View style={styles.textinput}>
            <TextInput
            ref={'input1'}
            placeholder='输入网址1...'//占位符
            defaultValue={this.state.defaultvalue1}
            placeholderTextColor='#ccc'//设置占位符颜色
            keyboardType='url'//设置键盘类型，url只在iOS端可用
            color='#ffffff'//设置输入文字的颜色
            onChangeText={textInputChange1.bind(this)}
            onFocus={()=>{this.setState({overlay1:true})}}
            style={{borderBottomColor:'#ffffff',borderBottomWidth:1,width:280,left:12,}}
            />
             <TextInput
            ref={'input2'}
            placeholder='输入网址2...'//占位符
            defaultValue={this.state.defaultvalue2}
            placeholderTextColor='#ccc'//设置占位符颜色
            keyboardType='url'//设置键盘类型，url只在iOS端可用
            color='#ffffff'//设置输入文字的颜色
            onChangeText={textInputChange2.bind(this)}
            onFocus={()=>{this.setState({overlay2:true})}}
            style={{borderBottomColor:'#ffffff',borderBottomWidth:1,width:280,left:12,}}
            />
            </View>
            <Text style={{
              color:'#ffffff',
              fontSize:25,
              paddingTop:8,
              backgroundColor:'pink',
              alignSelf:'center',
              textAlign:'center',
              height:50,
              width:220,
              top:28,
              left:-8,
              borderRadius:5
              }}
              onPress={sendRequest.bind(this)}
              >PING</Text>
          </View>
          {this.state.backChart?<Text style={{color:'pink',top:200,left:130,fontSize:20,}} onPress={()=>{this.setState({linechart:false})}} >返回图表</Text>:<View></View>}
        </TouchableOpacity> : <View>     
        <ScrollView  >
          {this.state.url?
       <VictoryChart
          width={700}
          scale={{x: "time"}}
        >
          <VictoryLine
          minDomain={{y:0}}
            style={{
              data: {stroke: "tomato"},
              
            }}
            data={this.linechartDates}
          />
          
        </VictoryChart>:<View></View>}
        {this.state.url2?
        <VictoryChart
         width={700}
     
         scale={{x: "time"}}>
            <VictoryLine
          minDomain={{y:0}}
            style={{
              data: {stroke: "#1E90FF"},
              
            }}
            data={this.linechartDates2}
          />
         </VictoryChart>:<View></View>}
        {this.state.url ?
        <View>
        <Text style={{color:'pink',left:20,fontSize:20}}>{`${this.state.url} :`}</Text>
        <Text style={{color:'pink',fontSize:20,top:15,left:18}}>{`status:${this.status1}`}</Text>
        <TouchableOpacity style={{flexDirection:'column'}} activeOpacity={1.0}>
            <Text style={{color:'pink',fontSize:20,top:12,left:20}}>MAX:{this.maxTime}ms</Text>
            <Text style={{color:'pink',fontSize:20,top:2,left:20}}>MIN:{this.minTime}ms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'column',top:0}} activeOpacity={1.0}>
            <Text style={{color:'pink',fontSize:20,top:0,left:20}}>AVG:{this.avgTime}ms</Text>
            <Text style={{color:'pink',fontSize:20,top:0,left:20}}>95%:{this.n95?`${this.n95}ms`:''}</Text>
        </TouchableOpacity></View> : <View></View>}
        {this.state.url2 ? <View>
        <Text style={{color:'pink',left:20,fontSize:20,top:20}}>{`${this.state.url2} :`}</Text>
        <Text style={{color:'pink',fontSize:20,top:18,left:16}}>{`status:${this.status2}`}</Text>
        <TouchableOpacity style={{flexDirection:'column',top:12}} activeOpacity={1.0}>
            <Text style={{color:'pink',fontSize:20,top:0,left:20}}>MAX:{this.maxTime2}ms</Text>
            <Text style={{color:'pink',fontSize:20,bottom:2,left:20}}>MIN:{this.minTime2}ms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:'column',top:0}} activeOpacity={1.0}>
            <Text style={{color:'pink',fontSize:20,left:20,top:2}}>AVG:{this.avgTime2}ms</Text>
            <Text style={{color:'pink',fontSize:20,top:0,left:20}}>95%:{this.n952?`${this.n952}ms`:''}</Text>
        </TouchableOpacity>
        </View> : <View></View>}
        </ScrollView>  
        </View>
      );
    }
}

const styles=StyleSheet.create({
    serch:{
      flexDirection:'column',
      top:20,
    },
    textinput:{
      flexDirection:'column',
      left:28
    },
    TextStyle:{
      margin:10,
      height:50,
      width:250,
      backgroundColor:'white',
      borderRadius:15,
      borderWidth:4,
      color:'#1F2342',
      fontSize:20,
      borderColor:'pink',
      marginLeft:30,
      marginTop:45,
      flexDirection:'row'
    },
    ButtonStyle:{
      width:60,
      height:50,
      marginLeft:-30,
      backgroundColor:'white',
      borderColor:'pink',
      borderRadius:15,
      borderWidth:4,
      marginTop:-3
    },
    settingbtnstyle:{
      color:'#FFB6C1',
      fontSize:20,
      top:10,
      left:5
    },
    History:{
      position:'relative',
      height:300,
      width:300,
    },
    HistoryList:{
      width:310,
      height: 43,
      backgroundColor: 'white',
    },
    HistoryTextBox: {
      height: 40,
      justifyContent: 'center',
      borderRadius:10,
      backgroundColor:'pink',
    },
    HistoryText: {
      fontSize: 20,
      color: 'black',
    },
    Delete:{
      width: 40,
      height: 40,
      position:'relative',
      top: -50,
      left: 270,
    },
    DeleteText:{
      position:'relative',
      top: 5,
      fontSize:35,
    },
    overlay:{
      position:'absolute',
      width:400,
    },
});

