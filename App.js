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
  TouchableOpacity,
  Alert,
  Button
} from 'react-native';
import {Toast} from 'teaset';
import {VictoryChart,VictoryTheme,VictoryLine, VictoryZoomContainer} from 'victory-native';
import {Overlay} from 'react-native-elements';
import {store} from './redux/store'


const height=Dimensions.get('window').height;
export default class home extends Component{
    constructor(props){
      super(props);
      this.state={
        reqTime:5,//控制请求发送持续时间的state
        newReqTime:0,
        url:'',//用户输入的url
        OverlayAble:false,//控制Overlay组件的显示
        chartDate:
          [
            {y:0,x:0}
          ]
        
      };
      store.subscribe(()=>{
        const {timeDate}=store.getState();
        const date1=this.state.chartDate;
        date1.push(timeDate);
        this.setState({chartDate:date1},()=>{console.log(this.state.chartDate)});
      });
    };


    setReqTime=()=>{
      this.setState({OverlayAble:true});
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
    const reqTime=this.state.reqTime;//获取发送请求的持续时间
    const beginTime=new Date().getMinutes();//点击PING后获取当前时间（分钟），用来控制循环
    var x=1;//图表的横坐标
    var nowTime='';
      //x++;//x自增1，对应图表横坐标下表自增1
    const xhr=new XMLHttpRequest();//实例化XMLHttpRequest对象
      const action={//action对象，发送到redux的reducer中
        type:'req',
        value:{
          begin:0,//发送请求时时间
          end:0,//收到响应时时间
          time:0,//时间差
          x:1,//横坐标数据
        }
      }
    xhr.onreadystatechange=()=>{  //当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if(xhr.readyState==2){//readystate等于2是请求发送的时刻，获取当前时间
        const t1=new Date().valueOf();//
        action.value.begin=t1;//存储到action中，否则会被覆盖
      }
      if(xhr.readyState==4){//readystate等于3是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        const t2=new Date().valueOf();
        action.value.end=t2;
        action.value.time=action.value.end-action.value.begin;//获取时间差
        action.value.x=x;
        store.dispatch(action);//将action对象发送到reducer
        nowTime=new Date().getMinutes();
        if(nowTime<beginTime+reqTime){
          x++;
          xhr.abort();
          xhr.open('GET',this.state.url,true);
          xhr.send();
        }
      }
    }
    xhr.open('GET',this.state.url,true);//写请求头
    xhr.send();//发送请求
    
  }         
    render(){
      return(
        <View height={height} style={{backgroundColor:'#000000'}} >
         <Overlay 
         visible={this.state.OverlayAble}
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
          <View style={{top:12,left:10,flexDirection:'row'}}>
            <Text style={{color:'#ffffff',fontSize:18,bottom:5}} onPress={this.setReqTime} >设置</Text>
            <Text style={{color:'#ffffff',fontSize:18,left:256}} >关于</Text>
          </View>
          <View style={styles.serch}>
            <TextInput
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
          <View style={{top:30,left:25}}>
          <VictoryChart
  theme={VictoryTheme.material}
>
  <VictoryLine
    style={{
     
    }}
    data={this.state.chartDate}
  />
</VictoryChart>
          </View>
        </View>
      );
    }
}

const styles=StyleSheet.create({
    serch:{
      flexDirection:'row',
      top:20,
    },
});
