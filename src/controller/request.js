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
  if (TestURL(this.state.url) || TestURL(this.state.url2)) {
    let myNetInfo;
    // alert("no")
    NetInfo.fetch().then((state) => {
      myNetInfo = state.isConnected;
      // alert("r")
      if (!myNetInfo) {
        Toast.message('网络未连接!');
        alert('yes');
      } else {
        this.state.chart1 = false;
        this.state.chart2 = false;
        const {
          values,
          colorIndex,
          chartLabels,
          url,
          values2,
          url2,
          colorIndex2,
          chartLabels2,
        } = this.state;

        this.config = this.next(
          values,
          colorIndex,
          chartLabels,
          url,
          url2,
          values2,
          colorIndex2,
          chartLabels2,
        );
        this.state.chart1 = this.state.url ? true : false;

        this.state.chart2 = this.state.url2 ? true : false;

        this.setState({isPing: true});

        this.setState({ifOverlayAble: false}); // 设置发送请求时不能设置请求时长

        this.setState({backChart: false});
        this.setState({linechart: false}); // 设置状态以显示图表
        // alert(this.state.linechart);
        this.linechartDates = []; // 清空折线图的数据源数组
        this.linechartDates2 = [];
        this.sumReqTime = []; // 清空请求时间的数组
        this.sumReqTime2 = [];
        this.maxTime = 0;
        this.maxTime2 = 0;
        this.minTime = '';
        this.minTime2 = 0;
        this.avgTime = 0;
        this.avgTime2 = 0;
        this.n95 = '';
        this.n952 = '';
        const reqTime = this.state.reqTime; // 获取发送请求的持续时间
        const beginTime = new Date().valueOf(); // 点击PING后获取当前时间（分钟），用来控制循环
        var x = 1; // 图表1的横坐标
        var x2 = 1;
        var nowTime = ''; // 当前时间
        var nowTime2s = '';
        const xhr = new XMLHttpRequest(); // 实例化XMLHttpRequest对象
        const xhr2 = new XMLHttpRequest();
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

        xhr.timeout = 5000; // 设置超时时间（5秒）
        xhr2.timeout = 5000;
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

        // 这是xhr2
        xhr2.onreadystatechange = () => {
          // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
          if (xhr2.readyState == 1) {
            // readystate等于1是请求发送的时刻，获取当前时间
            const t1 = new Date().valueOf();
            value2.begin = t1;
          }
          if (xhr2.readyState == 4) {
            // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
            this.status2 = xhr2.status;
            const t2 = new Date().valueOf();
            value2.end = t2;
            value2.time = value2.end - value2.begin;
            if (value2.time != 0) {
              // const d = new Data();
              // let hour =new Data().getHours();
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              // if (minute < 10) {
              //   minute = '0' + minute;
              // }
              // if (second < 10) {
              //   second = '0' + second;
              // }
              var xtime = `${new Date().getHours()}:` + minute + ':' + second;
              const ydata = value2.time;
              if(this.state.minXtime[this.state.url2Number]> minute + second *0.01){
                this.state.minXtimeData[this.state.url2Number]=xtime;
                this.state.minXtime[this.state.url2Number]=minute + second *0.01
              }else{
                xtime=this.state.minXtimeData[this.state.url2Number];
              }
              this.setState({
                values2: this.state.values2.concat([ydata]),
                chartLabels2: this.state.chartLabels2.concat([xtime]),
              });
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
            if (
              nowTime2s < beginTime + reqTime * 60 * 1000 &&
              this.state.isPing
            ) {
              console.log("进入到url2判断了么");
              if(this.state.url2for==false){
                console.log("进行了xhr2.abort");
                xhr2.abort();
              }
              if(this.state.urlfor==true){
                xhr.abort();
              }
              
              setTimeout(() => {
                if (this.state.isPing && this.state.url2Number<= this.state.urlNumber+1) {
                  this.state.url2Number++;
                  console.log("url2Nummber:",this.state.url2Number);
                  xhr2.open('GET', this.state.url2, true);
                  xhr2.send();
                  if(this.state.isPing && this.state.url2Number > this.state.urlNumber +1 &&this.state.urlfor==true){
                    xhr.open('GET', this.state.url, true);
                    xhr.send();
                  }
                  this.state.url2for=false;
                }else{
                  this.state.url2for=true;
                }
               
              }, 1000);
            }else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
              this.setState({url2: ''});
              this.setState({values: []});
              this.setState({chartLabels2: []});
              this.setState({defaultvalue2: ''});
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
                // const d=new Data();
                // let hours =new Date().getHours();
                let minute = new Date().getMinutes();
                let second = new Date().getSeconds();

                // if (minute < 10) {
                //   minute = '0' + minute;
                // }
                // if (second < 10) {
                //   second = '0' + second;
                // }
                var xtime = `${new Date().getHours()}:` + minute + ':' + second;

                var ytime = value.time;
                if(this.state.minXtime[this.state.urlNumber]>minute + second *0.01){
                  this.state.minXtimeData[this.state.urlNumber]=xtime;
                  this.state.minXtime[this.state.urlNumber]=minute + second *0.01
                }else{
                  xtime=this.state.minXtimeData[this.state.urlNumber];
                }
                
                this.setState({
                  values: this.state.values.concat([ytime]),
                  chartLabels: this.state.chartLabels.concat([xtime]),
                });

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
              if (
                nowTime < beginTime + reqTime * 60 * 1000 &&
                this.state.isPing
              ) {
              console.log("进入到url判断了么");
                if(this.state.urlfor==false){
                  console.log("进行了xhr.abort");
                  xhr.abort();
                }
                if(this.state.url2for==true){
                  xhr2.abort();
                }
                setTimeout(() => {
                if (this.state.isPing && this.state.urlNumber <= this.state.url2Number+1) {
                  this.state.urlNumber++;
                  console.log("urlNumber:",this.state.urlNumber);
                  xhr.open('GET', this.state.url, true);
                  xhr.send();
                  if(this.state.isPing && this.state.urlNumber > this.state.url2Number+1 && this.state.url2for==true){
                    xhr2.open('GET', this.state.url2, true);
                    xhr2.send();
                  }
                  this.state.urlfor=false;
                }else{
                  this.state.urlfor=true;
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
      }
    });
  } else {
    Toast.message('URL格式不正确!');
  }
};
