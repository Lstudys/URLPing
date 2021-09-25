/**
 * 发送HTTP请求用的函数
 * created by LYH on 2021/7/23
 */

import NetInfo from '@react-native-community/netinfo';
import {registerCustomIconType} from 'react-native-elements';
import {Toast} from 'teaset';
import Data from '../modal/data';
import {TestURL} from './AppPageFunction';
// 向URL发送请求的函数
export const SendRequest = function () {
  // console.log("循环之前");
  // console.log(this.state.url);
  // console.log(this.state.url2);
  //  for(let i=0;i<Data.urls.length;i++){
  //      if(Data.urls[i].mark==true&&this.state.url==''){
  //          this.setState({
  //              url:Data.urls[i].url
  //          })
  //      }
  //      else  if(Data.urls[i].mark==true&&this.state.url2==''){
  //         this.setState({
  //             url2:Data.urls[i].url
  //         })
  //      }

  //  }
  //  console.log("循环之后");
  //  console.log(this.state.url);
  //  console.log(this.state.url2);
  // if(this.state.url==''&&this.state.url2==''){
  //     return;
  // }
  if (TestURL(this.state.url) || TestURL(this.state.url2)|| TestURL(this.state.url3)|| TestURL(this.state.url4)|| TestURL(this.state.url5)|| TestURL(this.state.url6)|| TestURL(this.state.url7)|| TestURL(this.state.url8)|| TestURL(this.state.url9)|| TestURL(this.state.url10)) {
    let myNetInfo;
    // alert("no")
    NetInfo.fetch().then((state) => {
      myNetInfo = state.isConnected;
      // alert("r")
      if (!myNetInfo) {
        Toast.message('网络未连接!');
        alert('yes');
      } else {
        this.state.chart1=false;
        this.state.chart2=false;
        this.state.chart3=false;
        this.state.chart4=false;
        this.state.chart5=false;
        this.state.chart6=false;
        this.state.chart7=false;
        this.state.chart8=false;
        this.state.chart9=false;
        this.state.chart10= false;
        const {
          values,
              values2,
              values3,
              values4,
              values5,
              values6,
              values7,
              values8,
              values9,
              values10,
      
              colorIndex,
              colorIndex2,
              colorIndex3,
              colorIndex4,
              colorIndex5,
              colorIndex6,
              colorIndex7,
              colorIndex8,
              colorIndex9,
              colorIndex10,
      
              chartLabels,
              chartLabels2,
              chartLabels3,
              chartLabels4,
              chartLabels5,
              chartLabels6,
              chartLabels7,
              chartLabels8,
              chartLabels9,
              chartLabels10,
      
              url,
              url2,
              url3,
              url4,
              url5,
              url6,
              url7,
              url8,
              url9,
              url10,
        } = this.state;

        this.config = this.next(
          values,
              values2,
              values3,
              values4,
              values5,
              values6,
              values7,
              values8,
              values9,
              values10,
      
              colorIndex,
              colorIndex2,
              colorIndex3,
              colorIndex4,
              colorIndex5,
              colorIndex6,
              colorIndex7,
              colorIndex8,
              colorIndex9,
              colorIndex10,
      
              chartLabels,
              chartLabels2,
              chartLabels3,
              chartLabels4,
              chartLabels5,
              chartLabels6,
              chartLabels7,
              chartLabels8,
              chartLabels9,
              chartLabels10,
      
              url,
              url2,
              url3,
              url4,
              url5,
              url6,
              url7,
              url8,
              url9,
              url10,
        );
        this.state.chart1 = this.state.url ? true : false;

        this.state.chart2 = this.state.url2 ? true : false;

        this.state.chart3 = this.state.url3 ? true : false;

        this.state.chart4 = this.state.url4 ? true : false;


        this.state.chart5 = this.state.url5 ? true : false;


        this.state.chart6 = this.state.url6 ? true : false;

        this.state.chart7 = this.state.url7 ? true : false;
        this.state.chart8 = this.state.url8 ? true : false;
        this.state.chart9 = this.state.url9 ? true : false;
        this.state.chart10 = this.state.url10 ? true : false;


        // this.setState({isPing: true});

        this.setState({ifOverlayAble: false}); // 设置发送请求时不能设置请求时长
        

        this.setState({backChart: false});
        this.setState({linechart: false}); // 设置状态以显示图表
        // alert(this.state.linechart);

        this.linechartDates = []; // 清空折线图的数据源数组
        this.linechartDates2 = [];
        this.linechartDates3 = [];
        this.linechartDates4 = [];
        this.linechartDates5 = [];
        this.linechartDates6 = [];
        this.linechartDates7 = [];
        this.linechartDates8 = [];
        this.linechartDates9 = [];
        this.linechartDates10 = [];

        this.sumReqTime = []; // 清空请求时间的数组
        this.sumReqTime2 = [];
        this.sumReqTime3 = [];
        this.sumReqTime4 = [];
        this.sumReqTime5 = [];
        this.sumReqTime6 = [];
        this.sumReqTime7 = [];
        this.sumReqTime8 = [];
        this.sumReqTime9 = [];
        this.sumReqTime10 = [];


        this.maxTime = 0;
        this.maxTime2 = 0;
        this.maxTime3 = 0;
        this.maxTime4 = 0;
        this.maxTime5 = 0;
        this.maxTime6 = 0;
        this.maxTime7 = 0;
        this.maxTime8 = 0;
        this.maxTime9 = 0;
        this.maxTime10 = 0;



        this.minTime = 0;
        this.minTime2 = 0;
        this.minTime3 = 0;
        this.minTime4 = 0;
        this.minTime5 = 0;
        this.minTime6 = 0;
        this.minTime7 = 0;
        this.minTime8 = 0;
        this.minTime9 = 0;
        this.minTime10 = 0;


        this.avgTime = 0;
        this.avgTime2 = 0;
        this.avgTime3 = 0;
        this.avgTime4 = 0;
        this.avgTime5 = 0;
        this.avgTime6 = 0;
        this.avgTime7 = 0;
        this.avgTime8 = 0;
        this.avgTime9 = 0;
        this.avgTime10 = 0;



        this.n95 = '';
        this.n952 = '';
        this.n953 = '';
        this.n954 = '';
        this.n955 = '';
        this.n956 = '';
        this.n957 = '';
        this.n958 = '';
        this.n959 = '';
        this.n9510 = '';

        
        const reqTime = this.state.reqTime; // 获取发送请求的持续时间
        const beginTime = new Date().valueOf(); // 点击PING后获取当前时间（分钟），用来控制循环
        
        
        var x = 1; // 图表1的横坐标
        var x2 = 1;
        var x3 = 1;
        var x4 = 1;
        var x5 = 1;
        var x6 = 1;
        var x7 = 1;
        var x8 = 1;
        var x9 = 1;
        var x10 = 1;

        var nowTime = ''; // 当前时间
        var nowTime2s = '';
        var nowTime3s = '';
        var nowTime4s = '';
        var nowTime5s = '';
        var nowTime6s = '';
        var nowTime7s = '';
        var nowTime8s = '';
        var nowTime9s = '';
        var nowTime10s = '';


        const xhr = new XMLHttpRequest(); // 实例化XMLHttpRequest对象
        const xhr2 = new XMLHttpRequest();
        const xhr3 = new XMLHttpRequest();
        const xhr4 = new XMLHttpRequest();
        const xhr5 = new XMLHttpRequest();
        const xhr6 = new XMLHttpRequest();
        const xhr7 = new XMLHttpRequest();
        const xhr8 = new XMLHttpRequest();
        const xhr9 = new XMLHttpRequest();
        const xhr10 = new XMLHttpRequest();

        const value = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value2 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value3 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value4 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value5 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value6 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value7 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value8 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value9 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        const value10 = {
          // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
          begin: 0, // 发送请求时的时间戟
          end: 0, // 收到响应时的时间戟
          time: 0, // 响应时长
          sumtime: 0, // 每次请求的响应时长的总和
        };

        xhr.timeout = 5000; // 设置超时时间（5秒）
        xhr2.timeout = 5000;
        xhr3.timeout = 5000;
        xhr4.timeout = 5000;
        xhr5.timeout = 5000;
        xhr6.timeout = 5000;
        xhr7.timeout = 5000;
        xhr8.timeout = 5000;
        xhr9.timeout = 5000;
        xhr10.timeout = 5000;

        
        let minuteall = new Date().getMinutes();
        let secondall = new Date().getSeconds();
        let hourall = new Date().getHours();
        let xData = hourall*10000+minuteall*100+secondall;
        if (minuteall < 10) {
          minuteall = '0' + minuteall;
        }
        if (secondall < 10) {
          secondall = '0' + secondall;
        }
        let xtimeall = hourall+':' + minuteall + ':' + secondall;

        this.setState({
          urlDatafirst: [],
          urlDatasecond: [],
          urlDatathrid: [],
          urlDatafour: [],
          urlDatafive: []
        }); // 设置发送请求时不能设置请求时长

        console.log("xData :"+xData);
        console.log("xtimeall :"+xtimeall);
        setInterval(()=>{
          if(this.state.isPing==false) return;
          // console.log("values1:"+this.state.values);
          // console.log("chartLabels:"+this.state.chartLabels);
          // console.log("values2:"+this.state.values2);
          // console.log("chartLabels2:"+this.state.chartLabels2);
          this.setState({
            chartLabels: this.state.chartLabels.concat([xtimeall]),
          })
          let flag1=false;
          let flag2=false;
          let flag3=false;
          let flag4=false;
          let flag5=false;

          for(let i=0;i<this.state.urlDatafirst.length;i++){
            let Data=this.state.urlDatafirst[i].xTimeall;
            let yData1=this.state.urlDatafirst[i].yData;
            let xDataformat=this.state.urlDatafirst[i].xTime_format;
            if(Data>=xData&&Data<xData+1){
              
              this.setState({
                  values: this.state.values.concat([yData1]),
              })
              flag1=true;
            }
            
        }
        
          for(let i=0;i<this.state.urlDatasecond.length;i++){
            let Data2=this.state.urlDatasecond[i].xTimeall;
            let yData2=this.state.urlDatasecond[i].yData;
            if(Data2>=xData&&Data2<xData+1){

              this.setState({
                  values2: this.state.values2.concat([yData2]),
              })
              flag2=true;
            }
          }

          for(let i=0;i<this.state.urlDatathrid.length;i++){
            let Data3=this.state.urlDatathrid[i].xTimeall;
            let yData3=this.state.urlDatathrid[i].yData;
            if(Data3>=xData&&Data3<xData+1){
              this.setState({
                  values3: this.state.values3.concat([yData3]),
              })
              flag3=true;
            }
          }

          for(let i=0;i<this.state.urlDatafour.length;i++){
            let Data4=this.state.urlDatafour[i].xTimeall;
            let yData4=this.state.urlDatafour[i].yData;
            if(Data4>=xData&&Data4<xData+1){
              this.setState({
                  values4: this.state.values4.concat([yData4]),
              })
              flag4=true;
            }
          }

          for(let i=0;i<this.state.urlDatafive.length;i++){
            let Data5=this.state.urlDatafive[i].xTimeall;
            let yData5=this.state.urlDatafive[i].yData;
            if(Data5>=xData&&Data5<xData+1){
              this.setState({
                  values5: this.state.values5.concat([yData5]),
              })
              flag5=true;
            }
          }
        if(flag1==false){
            this.setState({
              values: this.state.values.concat(null)
          
          })
        }
        if(flag2==false){
          this.setState({
            values2: this.state.values2.concat(null)
        
        })
      }
      if(flag3==false){
        this.setState({
          values3: this.state.values3.concat(null)
      
      })
    }
    if(flag4==false){
      this.setState({
        values4: this.state.values4.concat(null)
    
    })
  }
  if(flag5==false){
    this.setState({
      values5: this.state.values5.concat(null)
  
  })
}
        let minuteall1 = new Date().getMinutes();
        let secondall1 = new Date().getSeconds();
        let hourall1 = new Date().getHours();
        xData = hourall1*10000+minuteall1*100+secondall1;
        if (minuteall1 < 10) {
          minuteall1 = '0' + minuteall1;
        }
        if (secondall1 < 10) {
          secondall1 = '0' + secondall1;
        }
        xtimeall = hourall1+':' + minuteall1 + ':' + secondall1;
          console.log("后两位："+xtimeall.charAt(xtimeall.length-1)+'+'+xtimeall);
        
        },1000);


        xhr.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url}请求超时!`);
          xhr.abort();
          return;
        };
        xhr2.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url2}请求超时!`);
          xhr2.abort();
          return;
        };
        xhr3.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url3}请求超时!`);
          xhr3.abort();
          return;
        };
        xhr4.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url4}请求超时!`);
          xhr4.abort();
          return;
        };
        xhr5.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url5}请求超时!`);
          xhr5.abort();
          return;
        };
        xhr6.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url6}请求超时!`);
          xhr6.abort();
          return;
        };
        xhr7.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url7}请求超时!`);
          xhr7.abort();
          return;
        };
        xhr8.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url8}请求超时!`);
          xhr8.abort();
          return;
        };
        xhr9.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url9}请求超时!`);
          xhr9.abort();
          return;
        };
        xhr10.ontimeout = (e) => {
          // 超时事件，请求超时时触发
          Toast.message(`${this.state.url10}请求超时!`);
          xhr10.abort();
          return;
        };

        // 这是xhr10
        xhr10.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr10.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t10 = new Date().valueOf();
            value10.begin = t10;
          }
          if (xhr10.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status10 = xhr10.status;
            const t10 = new Date().valueOf();
            value10.end = t10;
            value10.time = value10.end - value10.begin;
            if (value10.time != 0) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = `${new Date().getHours()}:` + minute + ':' + second;
              const ydata = value10.time;
              
              this.setState({
                values10: this.state.values10.concat([ydata]),
                chartLabels10: this.state.chartLabels10.concat([xtime]),
              });

              this.sumReqTime10.push(value10.time);
              value10.sumtime += value10.time; // 求和，算出总时间
              this.avgTime10 = value10.sumtime / x10;
              if (value10.time > this.maxTime10) {
                this.maxTime10 = value10.time;
              }
              if (this.minTime10 == '') {
                this.minTime10 = value10.time;
              } else if (this.minTime10 > value10.time) {
                this.minTime10 = value10.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime10.forEach((num) => {
                const bzc = num - this.avgTime10;
                sum += bzc * bzc;
              });
              let num1 = sum / x10;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime10) {
                this.n9510 = num2 - this.avgTime10;
              } else {
                this.n9510 = this.avgTime10 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x10++;
            }
            nowTime10s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime10s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr10.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr10.open('GET', this.state.url10, true);
                      xhr10.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url10: ''});
              this.setState({values: []});
              this.setState({chartLabels10: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr9
        xhr9.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr9.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t9 = new Date().valueOf();
            value9.begin = t9;
          }
          if (xhr9.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status9 = xhr9.status;
            const t9 = new Date().valueOf();
            value9.end = t9;
            value9.time = value9.end - value9.begin;
            if (value9.time != 0) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = `${new Date().getHours()}:` + minute + ':' + second;
              const ydata = value9.time;
              
              this.setState({
                values9: this.state.values9.concat([ydata]),
                chartLabels9: this.state.chartLabels9.concat([xtime]),
              });
              this.sumReqTime9.push(value9.time);
              value9.sumtime += value9.time; // 求和，算出总时间
              this.avgTime9 = value9.sumtime / x9;
              if (value9.time > this.maxTime9) {
                this.maxTime9 = value9.time;
              }
              if (this.minTime9 == '') {
                this.minTime9 = value9.time;
              } else if (this.minTime9 > value9.time) {
                this.minTime9 = value9.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime9.forEach((num) => {
                const bzc = num - this.avgTime9;
                sum += bzc * bzc;
              });
              let num1 = sum / x9;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime9) {
                this.n959 = num2 - this.avgTime9;
              } else {
                this.n959 = this.avgTime9 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x9++;
            }
            nowTime9s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime9s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr9.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr9.open('GET', this.state.url9, true);
                      xhr9.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url9: ''});
              this.setState({values: []});
              this.setState({chartLabels9: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr8
        xhr8.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr8.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t8 = new Date().valueOf();
            value8.begin = t8;
          }
          if (xhr8.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status8 = xhr8.status;
            const t8 = new Date().valueOf();
            value8.end = t8;
            value8.time = value8.end - value8.begin;
            if (value8.time != 0) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = `${new Date().getHours()}:` + minute + ':' + second;
              const ydata = value8.time;
              
              this.setState({
                values8: this.state.values8.concat([ydata]),
                chartLabels8: this.state.chartLabels8.concat([xtime]),
              });
              this.sumReqTime8.push(value8.time);
              value8.sumtime += value8.time; // 求和，算出总时间
              this.avgTime8 = value8.sumtime / x8;
              if (value8.time > this.maxTime8) {
                this.maxTime8 = value8.time;
              }
              if (this.minTime8 == '') {
                this.minTime8 = value8.time;
              } else if (this.minTime8 > value8.time) {
                this.minTime8 = value8.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime8.forEach((num) => {
                const bzc = num - this.avgTime8;
                sum += bzc * bzc;
              });
              let num1 = sum / x8;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime8) {
                this.n958 = num2 - this.avgTime8;
              } else {
                this.n958 = this.avgTime8 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x8++;
            }
            nowTime8s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime8s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr8.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr8.open('GET', this.state.url8, true);
                      xhr8.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url8: ''});
              this.setState({values: []});
              this.setState({chartLabels8: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr7
        xhr7.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr7.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t7 = new Date().valueOf();
            value7.begin = t7;
          }
          if (xhr7.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status7 = xhr7.status;
            const t7 = new Date().valueOf();
            value7.end = t7;
            value7.time = value7.end - value7.begin;
            if (value7.time != 0) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = `${new Date().getHours()}:` + minute + ':' + second;
              const ydata = value7.time;
              
              this.setState({
                values7: this.state.values7.concat([ydata]),
                chartLabels7: this.state.chartLabels7.concat([xtime]),
              });
              this.sumReqTime7.push(value7.time);
              value7.sumtime += value7.time; // 求和，算出总时间
              this.avgTime7 = value7.sumtime / x7;
              if (value7.time > this.maxTime7) {
                this.maxTime7 = value7.time;
              }
              if (this.minTime7 == '') {
                this.minTime7 = value7.time;
              } else if (this.minTime7 > value7.time) {
                this.minTime7 = value7.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime7.forEach((num) => {
                const bzc = num - this.avgTime7;
                sum += bzc * bzc;
              });
              let num1 = sum / x7;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime7) {
                this.n957 = num2 - this.avgTime7;
              } else {
                this.n957 = this.avgTime7 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x7++;
            }
            nowTime7s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime7s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr7.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr7.open('GET', this.state.url7, true);
                      xhr7.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url7: ''});
              this.setState({values: []});
              this.setState({chartLabels7: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr6
        xhr6.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr6.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t6 = new Date().valueOf();
            value6.begin = t6;
          }
          if (xhr6.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status6 = xhr6.status;
            const t6 = new Date().valueOf();
            value6.end = t6;
            value6.time = value6.end - value6.begin;
            if (value6.time != 0) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = `${new Date().getHours()}:` + minute + ':' + second;
              const ydata = value6.time;
              
              this.setState({
                values6: this.state.values6.concat([ydata]),
                chartLabels6: this.state.chartLabels6.concat([xtime]),
              });
              this.sumReqTime6.push(value6.time);
              value6.sumtime += value6.time; // 求和，算出总时间
              this.avgTime6 = value6.sumtime / x6;
              if (value6.time > this.maxTime6) {
                this.maxTime6 = value6.time;
              }
              if (this.minTime6 == '') {
                this.minTime6 = value6.time;
              } else if (this.minTime6 > value6.time) {
                this.minTime6 = value6.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime6.forEach((num) => {
                const bzc = num - this.avgTime6;
                sum += bzc * bzc;
              });
              let num1 = sum / x6;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime6) {
                this.n956 = num2 - this.avgTime6;
              } else {
                this.n956 = this.avgTime6 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x6++;
            }
            nowTime6s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime6s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr6.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr6.open('GET', this.state.url6, true);
                      xhr6.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url6: ''});
              this.setState({values: []});
              this.setState({chartLabels6: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr5
        xhr5.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr5.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t5 = new Date().valueOf();
            // let hour = new Date().getHours();
            // let minute = new Date().getMinutes();
            // let second = new Date().getSeconds();
            // let xData5 = hour*10000+minute*100+second;
            // console.log("xhr5的发送请求时间是"+xData5);

            value5.begin = t5;
          }
          if (xhr5.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status5 = xhr5.status;
            const t5 = new Date().valueOf();
            value5.end = t5;
            value5.time = value5.end - value5.begin;
            if (value5.time != 0) {
              let hour = new Date().getHours();
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              let xData5 = hour*10000+minute*100+second;

              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = hour+ ':' + minute + ':' + second;
              const ytime = value5.time;

              console.log("xData5第一次结束时间:"+xData5);
              this.state.urlDatafive.push({
                xTimeall:xData5,
                xData:xtime,
                yData:ytime
              })
              // this.setState({
              //   values5: this.state.values5.concat([ydata]),
              //   chartLabels5: this.state.chartLabels5.concat([xtime]),
              // });
              this.sumReqTime5.push(value5.time);
              value5.sumtime += value5.time; // 求和，算出总时间
              this.avgTime5 = value5.sumtime / x5;
              if (value5.time > this.maxTime5) {
                this.maxTime5 = value5.time;
              }
              if (this.minTime5 == '') {
                this.minTime5 = value5.time;
              } else if (this.minTime5 > value5.time) {
                this.minTime5 = value5.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime5.forEach((num) => {
                const bzc = num - this.avgTime5;
                sum += bzc * bzc;
              });
              let num1 = sum / x5;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime5) {
                this.n955 = num2 - this.avgTime5;
              } else {
                this.n955 = this.avgTime5 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x5++;
            }
            nowTime5s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime5s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr5.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr5.open('GET', this.state.url5, true);
                      xhr5.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url5: ''});
              this.setState({values: []});
              this.setState({chartLabels5: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr4
        xhr4.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr4.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t4 = new Date().valueOf();
            // let hour = new Date().getHours();
            // let minute = new Date().getMinutes();
            // let second = new Date().getSeconds();
            // let xData4 = hour*10000+minute*100+second;
            // console.log("xhr4的发送请求时间是"+xData4);

            value4.begin = t4;
          }
          if (xhr4.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status4 = xhr4.status;
            const t4 = new Date().valueOf();
            value4.end = t4;
            value4.time = value4.end - value4.begin;
            if (value4.time != 0) {
              let hour = new Date().getHours();

              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              let xData4 = hour*10000+minute*100+second;

              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = `${new Date().getHours()}:` + minute + ':' + second;
              const ytime = value4.time;

              console.log("xData4第一次结束时间:"+xData4);
              
              this.state.urlDatafour.push({
                xTimeall:xData4,
                xData:xtime,
                yData:ytime
              })
              // this.setState({
              //   values4: this.state.values4.concat([ydata]),
              //   chartLabels4: this.state.chartLabels4.concat([xtime]),
              // });
              this.sumReqTime4.push(value4.time);
              value4.sumtime += value4.time; // 求和，算出总时间
              this.avgTime4 = value4.sumtime / x4;
              if (value4.time > this.maxTime4) {
                this.maxTime4 = value4.time;
              }
              if (this.minTime4 == '') {
                this.minTime4 = value4.time;
              } else if (this.minTime4 > value4.time) {
                this.minTime4 = value4.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime4.forEach((num) => {
                const bzc = num - this.avgTime4;
                sum += bzc * bzc;
              });
              let num1 = sum / x4;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime4) {
                this.n954 = num2 - this.avgTime4;
              } else {
                this.n954 = this.avgTime4 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x4++;
            }
            nowTime4s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime4s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr4.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr4.open('GET', this.state.url4, true);
                      xhr4.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url4: ''});
              this.setState({values: []});
              this.setState({chartLabels4: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr3
        xhr3.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr3.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t1 = new Date().valueOf();
        //     let hour = new Date().getHours();
        //     let minute = new Date().getMinutes();
        //     let second = new Date().getSeconds();
        // let xData3 = hour*10000+minute*100+second;
        //     console.log("xhr3的发送请求时间是"+xData3);

            value3.begin = t1;
          }
          if (xhr3.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status3 = xhr3.status;
            const t3 = new Date().valueOf();
            value3.end = t3;
            value3.time = value3.end - value3.begin;
            if (value3.time != 0) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              let hour = new Date().getHours();
              let xData3 = hour*10000+minute*100+second;

              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = hour+':' + minute + ':' + second;
              const ytime = value3.time;
        console.log("xData3第一次结束时间:"+xData3);

              
              this.state.urlDatathrid.push({
                xTimeall:xData3,
                xData:xtime,
                yData:ytime
              })
             
              // this.setState({
              //   values3: this.state.values3.concat([ydata]),
              //   chartLabels3: this.state.chartLabels3.concat([xtime]),
              // });
              this.sumReqTime3.push(value3.time);
              value3.sumtime += value3.time; // 求和，算出总时间
              this.avgTime3 = value3.sumtime / x3;
              if (value3.time > this.maxTime3) {
                this.maxTime3 = value3.time;
              }
              if (this.minTime3 == '') {
                this.minTime3 = value3.time;
              } else if (this.minTime3 > value3.time) {
                this.minTime3 = value3.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime3.forEach((num) => {
                const bzc = num - this.avgTime3;
                sum += bzc * bzc;
              });
              let num1 = sum / x3;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime3) {
                this.n953 = num2 - this.avgTime3;
              } else {
                this.n953 = this.avgTime3 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x3++;
            }
            nowTime3s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime3s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr3.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr3.open('GET', this.state.url3, true);
                      xhr3.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url3: ''});
              this.setState({values: []});
              this.setState({chartLabels3: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };

        // 这是xhr2
        xhr2.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr2.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t1 = new Date().valueOf();
        //     let hour = new Date().getHours();
        //     let minute = new Date().getMinutes();
        //     let second = new Date().getSeconds();
        // let xData2 = hour*10000+minute*100+second;
        //     console.log("xhr2的发送请求时间是"+xData2);
            value2.begin = t1;
          }
          if (xhr2.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status2 = xhr2.status;
            const t2 = new Date().valueOf();
            value2.end = t2;
            value2.time = value2.end - value2.begin;
            if (value2.time != 0) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              let hour = new Date().getHours();
              let xData2 = hour*10000+minute*100+second;

              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = hour+ ':' + minute + ':' + second;
              const ytime = value2.time;
                console.log("xData2第一次结束时间:"+xData2);

              this.state.urlDatasecond.push({
                xTimeall:xData2,
                xData:xtime,
                yData:ytime
              })
              // this.setState({
              //   values2: this.state.values2.concat([ydata]),
              //   chartLabels2: this.state.chartLabels2.concat([xtime]),
              // });
              this.sumReqTime2.push(value2.time);
              value2.sumtime += value2.time; // 求和，算出总时间
              this.avgTime2 = value2.sumtime / x2;
              if (value2.time > this.maxTime2) {
                this.maxTime2 = value2.time;
              }
              if (this.minTime2 == '') {
                this.minTime2 = value2.time;
              } else if (this.minTime2 > value2.time) {
                this.minTime2 = value2.time;
              }
              // start
              let sum = 0; // 存储每个数减去平均数的平方的和
              this.sumReqTime2.forEach((num) => {
                const bzc = num - this.avgTime2;
                sum += bzc * bzc;
              });
              let num1 = sum / x2;
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (num2 > this.avgTime2) {
                this.n952 = num2 - this.avgTime2;
              } else {
                this.n952 = this.avgTime2 - num2;
                // this.n952 = Math.floor(this.n952 * 100) / 100;
              } // end
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x2++;
            }
            nowTime2s = new Date().valueOf(); // 获取当前时间戟
            if (nowTime2s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
              xhr2.abort();
              setTimeout(() => {
                  if (this.state.isPing) {
                      xhr2.open('GET', this.state.url2, true);
                      xhr2.send();
                  }
              }, 1000);
          }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url2: ''});
              this.setState({values: []});
              this.setState({chartLabels2: []});
              this.setState({backChart: true});
              if (nowTime > beginTime + reqTime * 60 * 1000) {
                this.setState({backChart: true});
              }
            }
          }
        };
        // 这是xhr1的回调
        xhr.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t1 = new Date().valueOf();
        //     let hour = new Date().getHours();
        //     let minute = new Date().getMinutes();
        //     let second = new Date().getSeconds();
        //     let hour = new Date().getHours();

        // let xData1 = hour*10000+minute*100+second;
        //     console.log("xhr1的发送请求时间是"+xData1);
            value.begin = t1;
          }
          if (xhr.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            if (xhr.status != 0) {
              this.status1 = xhr.status;
              const t2 = new Date().valueOf();
              value.end = t2;
              value.time = value.end - value.begin;

              if (value.time != 0) {
                let minute = new Date().getMinutes();
                let second = new Date().getSeconds();
                let hour = new Date().getHours();
                let xData1 = hour*10000+minute*100+second;

                if (minute < 10) {
                  minute = '0' + minute;
                }
                if (second < 10) {
                  second = '0' + second;
                }
                var xtime = hour+ ':' + minute + ':' + second;

                var ytime = value.time;
                
                console.log("xData1第一次结束时间:"+xData1);
                this.state.urlDatafirst.push({
                  xTime_format:xtime,
                  xTimeall:xData1,
                  xData:xtime,
                  yData:ytime
                })
                

                // this.setState({
                //   values: this.state.values.concat([ytime]),
                //   chartLabels: this.state.chartLabels.concat([xtime]),
                // });

                this.sumReqTime.push(value.time);
                value.sumtime += value.time; // 求和，算出总时间
                this.avgTime = value.sumtime / x;
                if (value.time > this.maxTime) {
                  this.maxTime = value.time;
                }
                if (this.minTime == '') {
                  this.minTime = value.time;
                } else if (this.minTime > value.time) {
                  this.minTime = value.time;
                }
                // start(计算n95的值)
                let sum = 0; // 存储每个数减去平均数的平方的和
                this.sumReqTime.forEach((num) => {
                  const bzc = num - this.avgTime;
                  sum += bzc * bzc;
                });
                let num1 = sum / x;
                let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
                if (num2 > this.avgTime) {
                  this.n95 = num2 - this.avgTime;
                } else {
                  this.n95 = this.avgTime - num2;
                } // end
                this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
                x++;
              }
              nowTime = new Date().valueOf(); // 获取当前时间戟
              if (nowTime < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
                xhr.abort();
                setTimeout(() => {
                    if (this.state.isPing) {
                        xhr.open('GET', this.state.url, true);
                        xhr.send();
                    }
                }, 1000);
            }else {
                this.setState({isPing: false});
                this.setState({ifOverlayAble: true});
                this.setState({defaultvalue1: ''});
                this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url和values之前设置
                this.setState({url: ''});
                this.setState({values: []});
                this.setState({chartLabels: []});
                this.setState({backChart: true});
                return;
              }
            } else {
              Toast.message('服务器错误!');
            }
          }
        };
        if (this.state.url != '') {
          xhr.open('GET', this.state.url, true); // 写请求头
          xhr.send(); // 发送请求
        }
        if (this.state.url2 != '') {
          xhr2.open('GET', this.state.url2, true);
          xhr2.send();
        }
        if (this.state.url3 != '') {
          xhr3.open('GET', this.state.url3, true);
          xhr3.send();
        }
        if (this.state.url4 != '') {
          xhr4.open('GET', this.state.url4, true);
          xhr4.send();
        }
        if (this.state.url5 != '') {
          xhr5.open('GET', this.state.url5, true);
          xhr5.send();
        }
        if (this.state.url6 != '') {
          xhr6.open('GET', this.state.url6, true);
          xhr6.send();
        }
        if (this.state.url7 != '') {
          xhr7.open('GET', this.state.url7, true);
          xhr7.send();
        }
        if (this.state.url8 != '') {
          xhr8.open('GET', this.state.url8, true);
          xhr8.send();
        }
        if (this.state.url9 != '') {
          xhr9.open('GET', this.state.url9, true);
          xhr9.send();
        }
        if (this.state.url10 != '') {
          xhr10.open('GET', this.state.url10, true);
          xhr10.send();
        }
      }
    });
  } else {
    Toast.message('URL格式不正确!');
  }
};
