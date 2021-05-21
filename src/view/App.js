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
  ScrollView
} from 'react-native';
import {Toast} from 'teaset';
import {VictoryChart,VictoryTheme,VictoryLine, VictoryZoomContainer,VictoryBrushContainer,VictoryAxis,VictoryPie} from 'victory-native';
import {Overlay, withTheme} from 'react-native-elements';
import { BackHandler } from 'react-native';
import NetInfo from '@react-native-community/netinfo'





const height=Dimensions.get('window').height;
export default class home extends Component{
    constructor(props){
      super(props);
      this.state={
        reqTime:5,//控制请求发送持续时间的state
        newReqTime:0,
        url:'',//用户输入的url
        url2:'',
        OverlayAble:false,//控制Overlay组件的显示
        linechart:true,//用来控制图表的显示,true表示显示输入框，不显示图表
        ifOverlayAble:true,//用来控制是否可以设置请求时间，当正在Ping时不能设置
        isPing:false,//控制是否正在ping
        defaultvalue1:'',
        defaultvalue2:'',
        backChart:false,//ping过之后，点击返回图表
        chartToData:false,
        chartDate://只作为刷新页面用的state，原本是用来作为数据源的，现在不用了所以用来刷新页面
          [
            {y:0,x:0}
          ]
      };
   
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
      BackHandler.addEventListener('hardwareBackPress',this.backAction);
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress',this.backAction);
    }



   
      backAction=()=>{
        if(!this.state.linechart){
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
            this.setState({url:''});
            this.setState({url2:''});
            Orientation.lockToPortrait();
            return true;
          }else{
            this.pressnum=1;
            this.firstpress=new Date().valueOf();
            Toast.message('再按一次取消Ping');
            return true;
          }
        }
       
      }else{
        Orientation.lockToPortrait();
        this.setState({linechart:true});
        return true;
      }
    }else{
      BackHandler.exitApp();
    }
        
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

    textInputChange1=(newText)=>{
      this.state.url=newText;
    }
    textInputChange2=(newText)=>{
      this.state.url2=newText;
    }

    testURL=(url)=>{
      let match=/http|https/;
      // /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
     // /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
      return match.test(url);
    }
    /*
    下面是发送请求获取所需数据的函数,变量中有2的表明是第二个图表的数据
    */
   getReq=()=>{
     if((this.testURL(this.state.url)||this.testURL(this.state.url2))){
      let myNetInfo;
      NetInfo.fetch().then(state => {
        myNetInfo=state.isConnected;
      if(!myNetInfo){
        Toast.message('网络未连接!');
      }else{
        Orientation.lockToLandscape();//横屏
     this.setState({isPing:true});
     this.setState({ifOverlayAble:false});//设置发送请求时不能设置请求时长
     this.refs.input1.blur();//输入框失去焦点
     this.refs.input2.blur();
     this.setState({linechart:false})//设置状态以显示图表
     this.linechartDates=[];//清空折线图的数据源数组
     this.linechartDates2=[];
     this.sumReqTime=[];//清空请求时间的数组
     this.sumReqTime2=[];
     this.maxTime=0;
     this.maxTime2=0;
     this.minTime='';
     this.minTime2=0;
     this.avgTime=0;
     this.avgTime2=0;
     this.n95='';
     this.n952='';
     //以上代码都是把数据清空
    const reqTime=this.state.reqTime;//获取发送请求的持续时间
    const beginTime=new Date().valueOf();//点击PING后获取当前时间（分钟），用来控制循环
    var x=1;//图表1的横坐标
    var x2=1;
    var nowTime='';//当前时间
    var nowTime2s='';
    const xhr=new XMLHttpRequest();//实例化XMLHttpRequest对象
    const xhr2=new XMLHttpRequest();
    const value={//存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin:0,//发送请求时的时间戟
      end:0,//收到响应时的时间戟
      time:0,//响应时长
      sumtime:0,//每次请求的响应时长的总和
    } 

    const value2={//存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin:0,//发送请求时的时间戟
      end:0,//收到响应时的时间戟
      time:0,//响应时长
      sumtime:0,//每次请求的响应时长的总和
    } 
  
    xhr.timeout=5000;//设置超时时间（5秒）
    xhr2.timeout=5000;
    xhr.ontimeout=(e)=>{//超时事件，请求超时时触发
      Toast.message(`${this.state.url}请求超时!`);
      xhr.abort();
      return;
    }
    xhr2.ontimeout=(e)=>{//超时事件，请求超时时触发
      Toast.message(`${this.state.url2}请求超时!`);
      xhr2.abort();
      return;
    }
    
    //这是xhr2
    xhr2.onreadystatechange=()=>{  //当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if(xhr2.readyState==1){//readystate等于1是请求发送的时刻，获取当前时间
        const t1=new Date().valueOf();
        value2.begin=t1;
      }
      if(xhr2.readyState==4){//readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间



        this.status2=xhr2.status;
         const t2=new Date().valueOf();
        value2.end=t2;
        value2.time=value2.end-value2.begin;
        if(value2.time!=0){
        const data={y:value2.time,x:x2};
        if(this.linechartDates2.length>130){
          this.linechartDates2.shift();
        }
        this.linechartDates2.push(data);
        this.sumReqTime2.push(value2.time);
        value2.sumtime+=value2.time;//求和，算出总时间
        this.avgTime2=value2.sumtime/x2;
        if(value2.time>this.maxTime2){
          this.maxTime2=value2.time;
        }
        if(this.minTime2==''){
          this.minTime2=value2.time;
        }else if(this.minTime2>value2.time){
          this.minTime2=value2.time;
        }
        this.setState({chartDate:this.chartDate})//仅仅用来刷新UI
        x2++;
      }
        nowTime2s=new Date().valueOf();//获取当前时间戟
        if(nowTime2s<beginTime+reqTime*60*1000&&this.state.isPing){
          xhr2.abort();
          setTimeout(()=>{
            if(this.state.isPing){
            xhr2.open('GET',this.state.url2,true);
            xhr2.send();
            }
          },1000)
          // xhr2.open('GET',this.state.url2,true);
          // xhr2.send();
        }else{
          Orientation.lockToPortrait();//竖屏
          let sum=0;//存储每个数减去平均数的平方的和
          this.sumReqTime2.forEach((num)=>{
            const bzc=num-this.avgTime2;
            sum+=bzc*bzc;
          });
          let num1=sum/x2;
          let num2=Math.sqrt(num1);//num2是标准差,平均数减去标准差就是95%的数据分布点
          if(num2>this.avgTime2){
            this.n952=num2-this.avgTime2;
          }else{
            this.n952=this.avgTime2-num2;
          }
          this.setState({isPing:false})
          this.setState({ifOverlayAble:true});
          if(nowTime>beginTime+reqTime*60*1000){
            this.setState({backChart:true});
          }
        }
      }
    }
    //这是xhr1
    xhr.onreadystatechange=()=>{  //当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if(xhr.readyState==1){//readystate等于1是请求发送的时刻，获取当前时间
        const t1=new Date().valueOf();
        value.begin=t1;
      }
      if(xhr.readyState==4){//readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        if(xhr.status!=0){
        this.status1=xhr.status;
        const t2=new Date().valueOf();
        value.end=t2;
        value.time=value.end-value.begin;
        if(value.time!=0){
        const data={y:value.time,x:x};
        if(this.linechartDates.length>130){
          this.linechartDates.shift();
        }
        this.linechartDates.push(data);
        this.sumReqTime.push(value.time);
        value.sumtime+=value.time;//求和，算出总时间
        this.avgTime=value.sumtime/x;
        if(value.time>this.maxTime){
          this.maxTime=value.time;
        }
        if(this.minTime==''){
          this.minTime=value.time;
        }else if(this.minTime>value.time){
          this.minTime=value.time;
        }
        this.setState({chartDate:this.chartDate})//仅仅用来刷新UI
        x++;
      }
        nowTime=new Date().valueOf();//获取当前时间戟
        if(nowTime<beginTime+reqTime*60*1000&&this.state.isPing){
          xhr.abort();
          setTimeout(()=>{
            if(this.state.isPing){
            xhr.open('GET',this.state.url,true);
          xhr.send();
            }
          },1000)
          // xhr.open('GET',this.state.url,true);
          // xhr.send();
        }else{
          Orientation.lockToPortrait();
          let sum=0;//存储每个数减去平均数的平方的和
          this.sumReqTime.forEach((num)=>{
            const bzc=num-this.avgTime;
            sum+=bzc*bzc;
          });
          let num1=sum/x;
          let num2=Math.sqrt(num1);//num2是标准差,平均数减去标准差就是95%的数据分布点
          if(num2>this.avgTime){
            this.n95=num2-this.avgTime;
          }else{
            this.n95=this.avgTime-num2;
          }
          this.setState({isPing:false})
          this.setState({ifOverlayAble:true});
          if(nowTime>beginTime+reqTime*60*1000){
            this.setState({backChart:true});
          }
          return;
        }
      }else{
        Toast.message('服务器错误!');//************************************* */
      }
      }
    }
    if(this.state.url!=''){
    xhr.open('GET',this.state.url,true);//写请求头
    xhr.send();//发送请求
    }
    if(this.state.url2!=''){
    xhr2.open('GET',this.state.url2,true)
    xhr2.send();
    }
  }
})
}else{
    Toast.message('URL格式不正确!');
  }
   
  }   

              
    render(){

      return(
       
       this.state.linechart? <TouchableOpacity  style={{backgroundColor:'#1F2342',height:height}} activeOpacity={1.0} onPress={()=>{this.refs.input1.blur();this.refs.input2.blur();}} >
          <View style={{flexDirection:'row'}}>
         <Text style={styles.settingbtnstyle} onPress={this.setReqTime}>Set Time</Text>
         <Text style={{color:'#FFB6C1',fontSize:20,left:215,top:10}} onPress={()=>{this.setState({linechart:false});Orientation.lockToLandscape()}} >About</Text>
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
              <View style={styles.textinput}>
            <TextInput
            ref={'input1'}
            placeholder='输入网址1...'//占位符
            defaultValue={this.state.defaultvalue1}
            placeholderTextColor='#ccc'//设置占位符颜色
            keyboardType='url'//设置键盘类型，url只在iOS端可用
            color='#ffffff'//设置输入文字的颜色
            onChangeText={this.textInputChange1}
            style={{borderBottomColor:'#ffffff',borderBottomWidth:1,width:280,left:12,}}
            />
             <TextInput
            ref={'input2'}
            placeholder='输入网址2...'//占位符
            defaultValue={this.state.defaultvalue2}
            placeholderTextColor='#ccc'//设置占位符颜色
            keyboardType='url'//设置键盘类型，url只在iOS端可用
            color='#ffffff'//设置输入文字的颜色
            onChangeText={this.textInputChange2}
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
              onPress={this.getReq}
              >PING</Text>
          </View>
          {this.state.backChart?<Text style={{color:'pink',top:200,left:130,fontSize:20,}}>返回图表</Text>:<View></View>}
        </TouchableOpacity> : <View>     
        <ScrollView  >
          {this.state.url?
       <VictoryChart
          width={700}
          // height={100}
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
           // labels={({ datum }) => datum.y}
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
    

});

