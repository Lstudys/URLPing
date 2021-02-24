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
import {Toast,Overlay} from 'teaset';
import {VictoryChart,VictoryTheme,VictoryLine, VictoryZoomContainer} from 'victory-native';

const height=Dimensions.get('window').height;
export default class home extends Component{
    constructor(props){
      super(props);
      this.state={
        modalvisiable:false,
      }
    };

    /*
    下面是发送请求获取所需数据的函数
    */
    getReq=()=>{
      const xhr=new XMLHttpRequest();//实例化XMLHttpRequest对象
      xhr.onreadystatechange=()=>{  //当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间
        if(xhr.readyState==1){//readystate等于1是请求发送的时刻，获取当前时间
          const t1=new Date().valueOf();//
          console.log(t1);
        }
        if(xhr.readyState==3){//readystate等于3是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
          const t2=new Date().valueOf();
          console.log(t2);
        }
      }
      xhr.open('GET','http://gitlab.henu.edu.cn/users/sign_in',true);//写请求头
      xhr.send();//发送请求
    }
    render(){
      return(
        <View height={height} style={{backgroundColor:'#000000'}} >
          <View style={{top:12,left:10}}>
            <Text style={{color:'#ffffff',fontSize:18}}>设置</Text>
          </View>
          <View style={styles.serch}>
            <TextInput
            placeholder='输入网址...'//占位符
            placeholderTextColor='#ccc'//设置占位符颜色
            keyboardType='url'//设置键盘类型，url只在iOS端可用
            color='#ffffff'//设置输入文字的颜色
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
  maxDomain={{x:200}}
  minDomain={{x:0}}
    style={{
      data: { stroke: "#c43a31" },
      parent: { border: "1px solid #ccc"}
    }}
    data={[
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 7 },
      { x: 6, y: 6 },
      { x: 7, y: 8 },
      { x: 8, y: 3 },
      { x: 9, y: 4 },
      { x: 10, y: 9 },
      { x:11, y: 8 },
      { x: 12, y: 5 },
      { x: 20, y: 6 }
    ]}
    containerComponent={
      <VictoryZoomContainer
      zoomDimension='x'
      minimumZoom={1}
      />
    }
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
