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
  TouchableOpacity 
} from 'react-native';
import {Toast} from 'teaset';
import {VictoryChart,VictoryTheme,VictoryLine, VictoryZoomContainer,VictoryBrushContainer,VictoryAxis,VictoryPie} from 'victory-native';
import {Overlay, withTheme} from 'react-native-elements';
import { BackHandler } from 'react-native';




const height=Dimensions.get('window').height;
export default class home extends Component{
    constructor(props){
      super(props);
      this.state={
        reqTime:5,//控制请求发送持续时间的state
        newReqTime:0,
        url:'',//用户输入的url
        OverlayAble:false,//控制Overlay组件的显示
        linechart:true,//用来控制图表的显示
        ifOverlayAble:true,//用来控制是否可以设置请求时间，当正在Ping时不能设置
        isPing:false,//控制是否正在ping
        chartDate://只作为刷新页面用的state，原本是用来作为数据源的，现在不用了所以用来刷新页面
          [
            {y:0,x:0}
          ]
      };
   
    };


    pressnum=0;
    firstpress=0;
    linechartDates=[];//折线图数据源

    chartDate=[{//用于setState以便刷新页面，并无实际意义
      y:1,
      x:1
    }];

   
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress',this.backAction);
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress',this.backAction);
    }



   
      backAction=()=>{
        if(this.state.isPing){
          this.pressnum++;
        if(this.pressnum==1){
          this.firstpress=new Date().valueOf();
          Toast.message('再按一次取消Ping');
          return true;
        }else {
           if(this.firstpress+2000>new Date().valueOf()){
             this.pressnum=0;
             this.firstpress=0;
            this.setState({linechart:true});
            this.setState({isPing:false});
            return true;
          }else{
            this.pressnum=1;
            this.firstpress=new Date().valueOf();
            Toast.message('再按一次取消Ping');
            return true;
          }
        }
       
      }else{
        this.setState({linechart:true});
        return true;
      }
        
      }




//handleZoom、handleBrus是图表放大需要用到的函数
    handleZoom(domain) {
      this.setState({selectedDomain: domain});
    }
  
    handleBrush(domain) {
      this.setState({zoomDomain: domain});
    }

//setReqTime控制浮层(设置时间)的显示
    setReqTime=()=>{
      if(this.state.ifOverlayAble){
      this.setState({OverlayAble:true});
    return;  
    }
      Toast.message('请稍后设置!');
    }

    reqTimeChange=(newTime)=>{
      this.setState({newReqTime:newTime});
    }

    textInputChange=(newText)=>{
      this.state.url=newText;
    }
    /*
    下面是发送请求获取所需数据的函数
    */
   getReq=()=>{
     this.setState({isPing:true});
     this.setState({ifOverlayAble:false});
     this.refs.input.blur();//输入框失去焦点
     this.setState({linechart:false})//设置状态以显示图表
    const reqTime=this.state.reqTime;//获取发送请求的持续时间
    const beginTime=new Date().valueOf();//点击PING后获取当前时间（分钟），用来控制循环
    var x=1;//图表的横坐标
    var nowTime='';//当前时间
    const xhr=new XMLHttpRequest();//实例化XMLHttpRequest对象
    const value={//存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin:0,
      end:0,
      time:0
    } 
  
    
    xhr.onreadystatechange=()=>{  //当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if(xhr.readyState==2){//readystate等于2是请求发送的时刻，获取当前时间
        const t1=new Date().valueOf();
        value.begin=t1;
      }
      if(xhr.readyState==4){//readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        

        const t2=new Date().valueOf();
        value.end=t2;
        value.time=value.end-value.begin;
        const data={y:value.time,x:x};
        if(this.linechartDates.length>100){
          this.linechartDates.shift();
        }
        this.linechartDates.push(data);
      

        this.setState({chartDate:this.chartDate})
        nowTime=new Date().valueOf();
        if(nowTime<beginTime+reqTime*60*1000&&this.state.isPing){
        
          x++;
          xhr.abort();
          xhr.open('GET',this.state.url,true);
          xhr.send();
        }else{
          this.setState({isPing:false})
          this.setState({ifOverlayAble:true});
          this.linechartDates=[];
          return;
        }
      }
    }
    xhr.open('GET',this.state.url,true);//写请求头
    xhr.send();//发送请求

   
  }   

              
    render(){

      return(
       
       this.state.linechart? <TouchableOpacity  style={{backgroundColor:'#1F2342',height:height}} activeOpacity={1.0} onPress={()=>{this.refs.input.blur()}} >
          <View style={{flexDirection:'row'}}>
         <Text style={styles.settingbtnstyle} onPress={this.setReqTime}>Set Time</Text>
         <Text style={{color:'#FFB6C1',fontSize:20,left:215,top:10}} >About</Text>
         </View>
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
           onChangeText={this.reqTimeChange}
           style={{width:200,top:6,marginBottom:10}}
           />
           <Button title='确定' onPress={()=>{
             const t=this.state.newReqTime;//先获取输入的请求时长
             if(t==0){//没有输入或输入为0时提示
               Toast.message('请输入请求时间!');
               return;
             }
             this.setState({reqTime:t});//设置新的reqTime
             this.setState({OverlayAble:false});//关闭悬浮框
             this.setState({newReqTime:0})//把newReqTime设置为0，否则会影响下一次设置
             Toast.message('设置成功！')}} />
           </View>
           </View>
         </Overlay> 
            <Text style={{color:'pink',fontSize:40,fontWeight:'bold',marginLeft:65,marginTop:180}}>Graphurlping</Text>
            <View style={styles.serch}>
            <TextInput
            ref={'input'}
            placeholder='输入网址...'//占位符
            placeholderTextColor='#ccc'//设置占位符颜色
            keyboardType='url'//设置键盘类型，url只在iOS端可用
            color='#ffffff'//设置输入文字的颜色
            onChangeText={this.textInputChange}
            style={{borderBottomColor:'#ffffff',borderBottomWidth:1,width:280,left:12,}}
            />
            <Text style={{
              color:'#ffffff',
              backgroundColor:'#1E90FF',
              alignSelf:'center',
              textAlign:'center',
              height:25,
              width:40,
              top:12,
              left:20,
              borderRadius:5
              }}
              onPress={this.getReq}
              >PING</Text>
          </View>
        </TouchableOpacity> : <View style={{top:50,left:0}}>         
       <VictoryChart
          width={550}
          height={300}
          scale={{x: "time"}}
       /*   containerComponent={
            <VictoryZoomContainer responsive={false}
              zoomDimension="x"
              zoomDomain={this.state.zoomDomain}
              onZoomDomainChange={this.handleZoom.bind(this)}
            />
          }*/
        >
          <VictoryLine
          minDomain={{y:0}}
            style={{
              data: {stroke: "tomato"},
              
            }}
            data={this.linechartDates}
           // labels={({ datum }) => datum.y}
          />
        </VictoryChart>
        </View>
      );
    }
}

const styles=StyleSheet.create({
    serch:{
      flexDirection:'row',
      top:20,
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
    }
});

