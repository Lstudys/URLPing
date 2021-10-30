import NetInfo from '@react-native-community/netinfo';
import {Toast} from 'teaset';
const TABLE_INITIAL_VALUE = 0;
const TIMER_PERIOD = 1250;
const SEND_REQUEST_STATUS = 1;
const RECEIVE_REQUEST_STATUS = 4;
// 向URL发送请求的函数
export const SendRequest = function () {
  //检查网络是否连接
  NetInfo.fetch().then((state) => {
    let myNetInfo = state.isConnected;
    if (!myNetInfo) Toast.message('网络未连接! 请及时连接网络');
    else request();
  });

  //网络连接后开始功能函数
  let request = () => {
    this.setState({ifOverlayAble: false}); // 设置发送请求时不能设置请求时长

    this.setState({backChart: false});
    this.setState({linechart: false}); // 设置状态以显示图表
    this.linechartDates = []; // 清空折线图的数据源数组
    this.linechartDates2 = [];
    this.linechartDates3 = [];
    this.linechartDates4 = [];
    this.linechartDates5 = [];

    (this.state.p95_arr1 = []),
      (this.state.p95_arr2 = []),
      (this.state.p95_arr3 = []),
      (this.state.p95_arr4 = []),
      (this.state.p95_arr5 = []),
      (this.sumReqTime = []); // 清空请求时间的数组
    this.sumReqTime2 = [];
    this.sumReqTime3 = [];
    this.sumReqTime4 = [];
    this.sumReqTime5 = [];

    this.maxTime = TABLE_INITIAL_VALUE;
    this.maxTime2 = TABLE_INITIAL_VALUE;
    this.maxTime3 = TABLE_INITIAL_VALUE;
    this.maxTime4 = TABLE_INITIAL_VALUE;
    this.maxTime5 = TABLE_INITIAL_VALUE;
    
    this.Median = TABLE_INITIAL_VALUE;
    this.Median2 = TABLE_INITIAL_VALUE;
    this.Median3 = TABLE_INITIAL_VALUE;
    this.Median4 = TABLE_INITIAL_VALUE;
    this.Median5 = TABLE_INITIAL_VALUE;

    this.minTime = TABLE_INITIAL_VALUE;
    this.minTime2 = TABLE_INITIAL_VALUE;
    this.minTime3 = TABLE_INITIAL_VALUE;
    this.minTime4 = TABLE_INITIAL_VALUE;
    this.minTime5 = TABLE_INITIAL_VALUE;

    this.avgTime = TABLE_INITIAL_VALUE;
    this.avgTime2 = TABLE_INITIAL_VALUE;
    this.avgTime3 = TABLE_INITIAL_VALUE;
    this.avgTime4 = TABLE_INITIAL_VALUE;
    this.avgTime5 = TABLE_INITIAL_VALUE;
    this.outData = [10000, 10000, 10000, 10000, 10000];

    this.n95 = '';
    this.n952 = '';
    this.n953 = '';
    this.n954 = '';
    this.n955 = '';

    const reqTime = this.state.reqTime; // 获取发送请求的持续时间
    const beginTime = new Date().valueOf(); // 点击PING后获取当前时间（分钟），用来控制循环

    var x = 1; //每一个站点的步数
    var x2 = 1;
    var x3 = 1;
    var x4 = 1;
    var x5 = 1;

    var nowTime = ''; // 当前时间
    var nowTime2s = '';
    var nowTime3s = '';
    var nowTime4s = '';
    var nowTime5s = '';

    const xhr = new XMLHttpRequest(); // 实例化XMLHttpRequest对象
    const xhr2 = new XMLHttpRequest();
    const xhr3 = new XMLHttpRequest();
    const xhr4 = new XMLHttpRequest();
    const xhr5 = new XMLHttpRequest();

    const value = {
      // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin: TABLE_INITIAL_VALUE, // 发送请求时的时间戟
      end: TABLE_INITIAL_VALUE, // 收到响应时的时间戟
      time: TABLE_INITIAL_VALUE, // 响应时长
      sumtime: TABLE_INITIAL_VALUE, // 每次请求的响应时长的总和
    };

    const value2 = {
      // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin: TABLE_INITIAL_VALUE, // 发送请求时的时间戟
      end: TABLE_INITIAL_VALUE, // 收到响应时的时间戟
      time: TABLE_INITIAL_VALUE, // 响应时长
      sumtime: TABLE_INITIAL_VALUE, // 每次请求的响应时长的总和
    };

    const value3 = {
      // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin: TABLE_INITIAL_VALUE, // 发送请求时的时间戟
      end: TABLE_INITIAL_VALUE, // 收到响应时的时间戟
      time: TABLE_INITIAL_VALUE, // 响应时长
      sumtime: TABLE_INITIAL_VALUE, // 每次请求的响应时长的总和
    };

    const value4 = {
      // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin: TABLE_INITIAL_VALUE, // 发送请求时的时间戟
      end: TABLE_INITIAL_VALUE, // 收到响应时的时间戟
      time: TABLE_INITIAL_VALUE, // 响应时长
      sumtime: TABLE_INITIAL_VALUE, // 每次请求的响应时长的总和
    };

    const value5 = {
      // 存储每次的发送、接收请求的时间戟和请求收到响应的时间
      begin: TABLE_INITIAL_VALUE, // 发送请求时的时间戟
      end: TABLE_INITIAL_VALUE, // 收到响应时的时间戟
      time: TABLE_INITIAL_VALUE, // 响应时长
      sumtime: TABLE_INITIAL_VALUE, // 每次请求的响应时长的总和
    };
    this.setState({
      values: this.state.values.concat([0]),
      values2: this.state.values2.concat([0]),
      values3: this.state.values3.concat([0]),
      values4: this.state.values4.concat([0]),
      values5: this.state.values5.concat([0]),
    });

    xhr.timeout = 5000; // 设置超时时间（5秒）
    xhr2.timeout = 5000;
    xhr3.timeout = 5000;
    xhr4.timeout = 5000;
    xhr5.timeout = 5000;

    let minuteall = new Date().getMinutes();
    let secondall = new Date().getSeconds();
    let secondall_small_1 = new Date().getSeconds() - 1;

    let hourall = new Date().getHours();
    let xData = hourall * 10000 + minuteall * 100 + secondall;
    if (minuteall < 10) {
      minuteall = '0' + minuteall;
    }
    if (secondall < 10) {
      secondall = '0' + secondall;
    }
    if (secondall_small_1 < 10) {
      secondall_small_1 = '0' + secondall_small_1;
    }

    let xtimeall = hourall + ':' + minuteall + ':' + secondall;

    this.setState({
      urlDatafirst: [],
      urlDatasecond: [],
      urlDatathrid: [],
      urlDatafour: [],
      urlDatafive: [],
    });
    var start_scale1 = false;
    var start_scale2 = false;
    var start_scale3 = false;
    var start_scale4 = false;
    var start_scale5 = false;

    this.chart_refresh = setInterval(() => {
      if (this.state.isPing == false) return;
      this.setState({
        chartLabels: this.state.chartLabels.concat([xtimeall]),
      });
      let flag1 = false;
      let flag2 = false;
      let flag3 = false;
      let flag4 = false;
      let flag5 = false;
      let scale_flag = false;

      for (let i = 0; i < this.state.urlDatafirst.length; i++) {
        let Data = this.state.urlDatafirst[i].xTimeall;
        let yData1 = this.state.urlDatafirst[i].yData;
        if (Data >= xData && Data < xData + 1) {
          this.setState({
            values: this.state.values.concat([yData1]),
          });
          flag1 = true;
          scale_flag = true;
        }
      }

      for (let i = 0; i < this.state.urlDatasecond.length; i++) {
        let Data2 = this.state.urlDatasecond[i].xTimeall;
        let yData2 = this.state.urlDatasecond[i].yData;
        if (Data2 >= xData && Data2 < xData + 1) {
          this.setState({
            values2: this.state.values2.concat([yData2]),
          });
          flag2 = true;
          scale_flag = true;
        }
      }

      for (let i = 0; i < this.state.urlDatathrid.length; i++) {
        let Data3 = this.state.urlDatathrid[i].xTimeall;
        let yData3 = this.state.urlDatathrid[i].yData;
        if (Data3 >= xData && Data3 < xData + 1) {
          this.setState({
            values3: this.state.values3.concat([yData3]),
          });
          flag3 = true;
          scale_flag = true;
        }
      }

      for (let i = 0; i < this.state.urlDatafour.length; i++) {
        let Data4 = this.state.urlDatafour[i].xTimeall;
        let yData4 = this.state.urlDatafour[i].yData;
        if (Data4 >= xData && Data4 < xData + 1) {
          this.setState({
            values4: this.state.values4.concat([yData4]),
          });
          flag4 = true;
          scale_flag = true;
        }
      }

      for (let i = 0; i < this.state.urlDatafive.length; i++) {
        let Data5 = this.state.urlDatafive[i].xTimeall;
        let yData5 = this.state.urlDatafive[i].yData;
        if (Data5 >= xData && Data5 < xData + 1) {
          this.setState({
            values5: this.state.values5.concat([yData5]),
          });
          flag5 = true;
          scale_flag = true;
        }
      }
      if (flag1 == false) {
        this.setState({
          values: this.state.values.concat(null),
        });
      }
      if (flag2 == false) {
        this.setState({
          values2: this.state.values2.concat(null),
        });
      }
      if (flag3 == false) {
        this.setState({
          values3: this.state.values3.concat(null),
        });
      }
      if (flag4 == false) {
        this.setState({
          values4: this.state.values4.concat(null),
        });
      }
      if (flag5 == false) {
        this.setState({
          values5: this.state.values5.concat(null),
        });
      }
      let minuteall1 = new Date().getMinutes();
      let secondall1 = new Date().getSeconds();
      let hourall1 = new Date().getHours();

      if (
        (secondall1 - secondall == 40 && minuteall1 == minuteall) ||
        (minuteall1 - minuteall == 1 && secondall1 + 60 - secondall == 40) ||
        (hourall1 - hourall == 1 && secondall1 + 60 - secondall == 40)
      ) {
        start_scale1 = true;
      }
      if (
        (secondall1 - secondall == 59 && minuteall1 == minuteall) ||
        (minuteall1 - minuteall == 1 && secondall1 + 60 - secondall == 59) ||
        (hourall1 - hourall == 1 && secondall1 + 60 - secondall == 59)
      ) {
        start_scale2 = true;
      }
      if (
        (secondall1 - secondall == 30 && minuteall1 - minuteall == 1) ||
        (minuteall1 - minuteall == 2 && secondall1 - secondall == -30)
      ) {
        start_scale3 = true;
      }
      if (
        (secondall1 - secondall == 30 && minuteall1 - minuteall == 2) ||
        (minuteall1 - minuteall == 3 && secondall1 - secondall == -30)
      ) {
        start_scale4 = true;
      }
      if (
        (secondall1 - secondall == 30 && minuteall1 - minuteall == 3) ||
        (minuteall1 - minuteall == 4 && secondall1 - secondall == -30)
      ) {
        start_scale5 = true;
      }

      if (
        start_scale1 == true &&
        scale_flag == true &&
        start_scale2 == false &&
        start_scale3 == false &&
        start_scale4 == false &&
        start_scale5 == false
      ) {
        let scale_switch = 0.018;
        this.resetZoom(scale_switch);
      } else if (
        start_scale1 == true &&
        scale_flag == true &&
        start_scale2 == true &&
        start_scale3 == false &&
        start_scale4 == false &&
        start_scale5 == false
      ) {
        let scale_switch = 0.025;
        this.resetZoom(scale_switch);
      } else if (
        start_scale1 == true &&
        scale_flag == true &&
        start_scale2 == true &&
        start_scale3 == true &&
        start_scale4 == false &&
        start_scale5 == false
      ) {
        let scale_switch = 0.03;
        this.resetZoom(scale_switch);
      } else if (
        start_scale1 == true &&
        scale_flag == true &&
        start_scale2 == true &&
        start_scale3 == true &&
        start_scale4 == true &&
        start_scale5 == false
      ) {
        let scale_switch = 0.038;
        this.resetZoom(scale_switch);
      } else if (
        start_scale1 == true &&
        scale_flag == true &&
        start_scale2 == true &&
        start_scale3 == true &&
        start_scale4 == true &&
        start_scale5 == true
      ) {
        let scale_switch = 0.044;
        this.resetZoom(scale_switch);
      }

      xData = hourall1 * 10000 + minuteall1 * 100 + secondall1;
      if (minuteall1 < 10) {
        minuteall1 = '0' + minuteall1;
      }
      if (secondall1 < 10) {
        secondall1 = '0' + secondall1;
      }
      xtimeall = hourall1 + ':' + minuteall1 + ':' + secondall1;
    }, TIMER_PERIOD);

    xhr.ontimeout = (e) => {
      // 超时事件，请求超时时触发
      Toast.message(`${urlCollection[0]}请求超时!`);
      xhr.abort();
      return;
    };
    xhr2.ontimeout = (e) => {
      // 超时事件，请求超时时触发
      Toast.message(`${urlCollection[1]}请求超时!`);
      xhr2.abort();
      return;
    };
    xhr3.ontimeout = (e) => {
      // 超时事件，请求超时时触发
      Toast.message(`${urlCollection[2]}请求超时!`);
      xhr3.abort();
      return;
    };
    xhr4.ontimeout = (e) => {
      // 超时事件，请求超时时触发
      Toast.message(`${urlCollection[3]}请求超时!`);
      xhr4.abort();
      return;
    };
    xhr5.ontimeout = (e) => {
      // 超时事件，请求超时时触发
      Toast.message(`${urlCollection[4]}请求超时!`);
      xhr5.abort();
      return;
    };

    // 这是xhr5
    xhr5.onreadystatechange = () => {
      // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if (xhr5.readyState == SEND_REQUEST_STATUS) {
        // readystate等于1是请求发送的时刻，获取当前时间
        let t5 = new Date().valueOf();
        value5.begin = t5;
      }
      if (xhr5.readyState == RECEIVE_REQUEST_STATUS) {
        // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        this.status5 = xhr5.status;
        if (this.status5 != 200) {
          this.error5++;
        } else {
          let t5 = new Date().valueOf();
          value5.end = t5;
          value5.time = value5.end - value5.begin;
          if (value5.time > this.outData[4]) {
            this.error5++;
          } else if (value5.time != 0) {
            let hour = new Date().getHours();
            let minute = new Date().getMinutes();
            let second = new Date().getSeconds();
            let xData5 = hour * 10000 + minute * 100 + second;

            if (minute < 10) {
              minute = '0' + minute;
            }
            if (second < 10) {
              second = '0' + second;
            }
            var xtime = hour + ':' + minute + ':' + second;
            let ytime = value5.time;

            if (x5 == 1) {
              x5++;
            } else {
              this.state.p95_arr5.push(ytime);
              this.state.urlDatafive.push({
                xTimeall: xData5,
                xData: xtime,
                yData: ytime,
              });

              this.sumReqTime5.push(value5.time);
              value5.sumtime += value5.time; // 求和，算出总时间
              this.avgTime5 = value5.sumtime / (x5 - 1);
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
                let bzc = num - this.avgTime5;
                sum += bzc * bzc;
              });
              let num1 = sum / (x5 - 1);
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (x5 - 1 > 3) this.outData[4] = this.avgTime5 + 2.5 * num2;
              this.state.p95_arr5.sort(function (a, b) {
                return a - b;
              });
              if(x5<2){
                this.Median5=0
              }
              else if(x5%2!=0){
                this.Median5=this.state.p95_arr5[(x5-1)/2]
              }
              else{
                this.Median5=(this.state.p95_arr5[x5/2]+this.state.p95_arr5[(x5-2)/2])/2
              }
              let division = ((x5 - 1) / 20) * 19;
              if (x5 - 1 > 2)
                this.n955 =
                  this.state.p95_arr5[parseInt(division) - 1] +
                  (this.state.p95_arr5[parseInt(division)] -
                    this.state.p95_arr5[parseInt(division) - 1]) *
                    (division - parseInt(division));
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x5++;
            }
          }
          nowTime5s = new Date().valueOf(); // 获取当前时间戟
        }
        if (nowTime5s < beginTime + reqTime * 60 * 1000 && this.state.isPing) {
          xhr5.abort();
          this.send_request5 = setTimeout(() => {
            if (this.state.isPing) {
              xhr5.open('GET', urlCollection[4], true);
              xhr5.send();
            }
          }, TIMER_PERIOD);
        } else {
          this.setState({isPing: false});
          this.setState({ifOverlayAble: true});
          this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置

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
      if (xhr4.readyState == SEND_REQUEST_STATUS) {
        // readystate等于1是请求发送的时刻，获取当前时间
        let t4 = new Date().valueOf();
        value4.begin = t4;
      }
      if (xhr4.readyState == RECEIVE_REQUEST_STATUS) {
        // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        this.status4 = xhr4.status;
        if (this.status4 != 200) {
          this.error4++;
        } else {
          let t4 = new Date().valueOf();
          value4.end = t4;
          value4.time = value4.end - value4.begin;
          if (value4.time > this.outData[3]) {
            this.error4++;
          } else if (value4.time != TABLE_INITIAL_VALUE) {
            let hour = new Date().getHours();

            let minute = new Date().getMinutes();
            let second = new Date().getSeconds();
            let xData4 = hour * 10000 + minute * 100 + second;

            if (minute < 10) {
              minute = '0' + minute;
            }
            if (second < 10) {
              second = '0' + second;
            }
            var xtime = `${new Date().getHours()}:` + minute + ':' + second;
            let ytime = value4.time;

            if (x4 == 1) {
              x4++;
            } else {
              this.state.p95_arr4.push(ytime);

              this.state.urlDatafour.push({
                xTimeall: xData4,
                xData: xtime,
                yData: ytime,
              });

              this.sumReqTime4.push(value4.time);
              value4.sumtime += value4.time; // 求和，算出总时间
              this.avgTime4 = value4.sumtime / (x4 - 1);
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
                let bzc = num - this.avgTime4;
                sum += bzc * bzc;
              });
              let num1 = sum / (x4 - 1);
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (x4 - 1 > 3) this.outData[3] = this.avgTime4 + 2.5 * num2;
              this.state.p95_arr4.sort(function (a, b) {
                return a - b;
              });
              if(x4<2){
                this.Median4=0
              }
              else if(x4%2!=0){
                this.Median4=this.state.p95_arr4[(x4-1)/2]
              }
              else{
                this.Median4=(this.state.p95_arr4[x4/2]+this.state.p95_arr4[(x4-2)/2])/2
              }
              let division = ((x4 - 1) / 20) * 19;
              if (x4 - 1 > 2)
                this.n954 =
                  this.state.p95_arr4[parseInt(division) - 1] +
                  (this.state.p95_arr4[parseInt(division)] -
                    this.state.p95_arr4[parseInt(division) - 1]) *
                    (division - parseInt(division));
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x4++;
            }
          }
          nowTime4s = new Date().valueOf(); // 获取当前时间戟
          if (
            nowTime4s < beginTime + reqTime * 60 * 1000 &&
            this.state.isPing
          ) {
            xhr4.abort();
            this.send_request4 = setTimeout(() => {
              if (this.state.isPing) {
                xhr4.open('GET', urlCollection[3], true);
                xhr4.send();
              }
            }, TIMER_PERIOD);
          } else {
            this.setState({isPing: false});
            this.setState({ifOverlayAble: true});
            this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置
            this.setState({backChart: true});
            if (nowTime > beginTime + reqTime * 60 * 1000) {
              this.setState({backChart: true});
            }
          }
        }
      }
    };

    // 这是xhr3
    xhr3.onreadystatechange = () => {
      // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if (xhr3.readyState == SEND_REQUEST_STATUS) {
        // readystate等于1是请求发送的时刻，获取当前时间
        let t1 = new Date().valueOf();
        value3.begin = t1;
      }
      if (xhr3.readyState == RECEIVE_REQUEST_STATUS) {
        // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        this.status3 = xhr3.status;
        if (this.status3 != 200) {
          this.error3++;
        } else {
          let t3 = new Date().valueOf();
          value3.end = t3;
          value3.time = value3.end - value3.begin;
          if (value3.time > this.outData[2]) {
            this.error3++;
          } else if (value3.time != TABLE_INITIAL_VALUE) {
            let minute = new Date().getMinutes();
            let second = new Date().getSeconds();
            let hour = new Date().getHours();
            let xData3 = hour * 10000 + minute * 100 + second;

            if (minute < 10) {
              minute = '0' + minute;
            }
            if (second < 10) {
              second = '0' + second;
            }
            var xtime = hour + ':' + minute + ':' + second;
            let ytime = value3.time;

            if (x3 == 1) {
              x3++;
            } else {
              this.state.p95_arr3.push(ytime);

              this.state.urlDatathrid.push({
                xTimeall: xData3,
                xData: xtime,
                yData: ytime,
              });

              this.sumReqTime3.push(value3.time);
              value3.sumtime += value3.time; // 求和，算出总时间
              this.avgTime3 = value3.sumtime / (x3 - 1);
              if (value3.time > this.maxTime3) {
                this.maxTime3 = value3.time;
              }
              if (this.minTime3 == '') {
                this.minTime3 = value3.time;
              } else if (this.minTime3 > value3.time) {
                this.minTime3 = value3.time;
              }
              // start
              let sum = TABLE_INITIAL_VALUE; // 存储每个数减去平均数的平方的和
              this.sumReqTime3.forEach((num) => {
                let bzc = num - this.avgTime3;
                sum += bzc * bzc;
              });
              let num1 = sum / (x3 - 1);
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (x3 - 1 > 3) this.outData[2] = this.avgTime3 + 2.5 * num2;
              this.state.p95_arr3.sort(function (a, b) {
                return a - b;
              });
              if(x3<2){
                this.Median3=0
              }
              else if(x3%2!=0){
                this.Median3=this.state.p95_arr3[(x3-1)/2]
              }
              else{
                this.Median3=(this.state.p95_arr3[x3/2]+this.state.p95_arr3[(x3-2)/2])/2
              }
              let division = ((x3 - 1) / 20) * 19;
              if (x3 - 1 > 2)
                this.n953 =
                  this.state.p95_arr3[parseInt(division) - 1] +
                  (this.state.p95_arr3[parseInt(division)] -
                    this.state.p95_arr3[parseInt(division) - 1]) *
                    (division - parseInt(division));
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x3++;
            }
          }
          nowTime3s = new Date().valueOf(); // 获取当前时间戟
          if (
            nowTime3s < beginTime + reqTime * 60 * 1000 &&
            this.state.isPing
          ) {
            xhr3.abort();
            this.send_request3 = setTimeout(() => {
              if (this.state.isPing) {
                xhr3.open('GET', urlCollection[2], true);
                xhr3.send();
              }
            }, TIMER_PERIOD);
          } else {
            this.setState({isPing: false});
            this.setState({ifOverlayAble: true});
            this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置

            this.setState({backChart: true});
            if (nowTime > beginTime + reqTime * 60 * 1000) {
              this.setState({backChart: true});
            }
          }
        }
      }
    };

    // 这是xhr2
    xhr2.onreadystatechange = () => {
      // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if (xhr2.readyState == SEND_REQUEST_STATUS) {
        // readystate等于1是请求发送的时刻，获取当前时间
        let t1 = new Date().valueOf();
        value2.begin = t1;
      }
      if (xhr2.readyState == RECEIVE_REQUEST_STATUS) {
        // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        this.status2 = xhr2.status;
        if (this.status2 != 200) {
          this.error2++;
        } else {
          let t2 = new Date().valueOf();
          value2.end = t2;
          value2.time = value2.end - value2.begin;
          if (value2.time > this.outData[1]) {
            this.error2++;
          } else if (value2.time != TABLE_INITIAL_VALUE) {
            let minute = new Date().getMinutes();
            let second = new Date().getSeconds();
            let hour = new Date().getHours();
            let xData2 = hour * 10000 + minute * 100 + second;

            if (minute < 10) {
              minute = '0' + minute;
            }
            if (second < 10) {
              second = '0' + second;
            }
            var xtime = hour + ':' + minute + ':' + second;
            let ytime = value2.time;
            if (x2 == 1) {
              x2++;
            } else {
              this.state.p95_arr2.push(ytime);

              this.state.urlDatasecond.push({
                xTimeall: xData2,
                xData: xtime,
                yData: ytime,
              });

              this.sumReqTime2.push(value2.time);
              value2.sumtime += value2.time; // 求和，算出总时间
              this.avgTime2 = value2.sumtime / (x2 - 1);
              if (value2.time > this.maxTime2) {
                this.maxTime2 = value2.time;
              }
              if (this.minTime2 == '') {
                this.minTime2 = value2.time;
              } else if (this.minTime2 > value2.time) {
                this.minTime2 = value2.time;
              }
              // start
              let sum = TABLE_INITIAL_VALUE; // 存储每个数减去平均数的平方的和
              this.sumReqTime2.forEach((num) => {
                let bzc = num - this.avgTime2;
                sum += bzc * bzc;
              });
              let num1 = sum / (x2 - 1);
              let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
              if (x2 - 1 > 3) this.outData[1] = this.avgTime2 + 2.5 * num2;
              this.state.p95_arr2.sort(function (a, b) {
                return a - b;
              });
              if(x2<2){
                this.Median2=0
              }
              else if(x2%2!=0){
                this.Median2=this.state.p95_arr2[(x2-1)/2]
              }
              else{
                this.Median2=(this.state.p95_arr2[x2/2]+this.state.p95_arr2[(x2/2)-1])/2
              }
              let division = ((x2 - 1) / 20) * 19;
              if (x2 - 1 > 2)
                this.n952 =
                  this.state.p95_arr2[parseInt(division) - 1] +
                  (this.state.p95_arr2[parseInt(division)] -
                    this.state.p95_arr2[parseInt(division) - 1]) *
                    (division - parseInt(division));
              this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
              x2++;
            }
          }
          nowTime2s = new Date().valueOf(); // 获取当前时间戟
          if (
            nowTime2s < beginTime + reqTime * 60 * 1000 &&
            this.state.isPing
          ) {
            xhr2.abort();
            this.send_request2 = setTimeout(() => {
              if (this.state.isPing) {
                xhr2.open('GET', urlCollection[1], true);
                xhr2.send();
              }
            }, TIMER_PERIOD);
          } else {
            this.setState({isPing: false});
            this.setState({ifOverlayAble: true});
            this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url2和values2之前设置

            this.setState({backChart: true});
            if (nowTime > beginTime + reqTime * 60 * 1000) {
              this.setState({backChart: true});
            }
          }
        }
      }
    };
    // 这是xhr1的回调
    xhr.onreadystatechange = () => {
      // 当readystate变化时，触发onreadystatechange函数，在该函数中获取请求时间(该函数不会立即执行，当readystate值变化时才执行)
      if (xhr.readyState == SEND_REQUEST_STATUS) {
        // readystate等于1是请求发送的时刻，获取当前时间
        const t1 = new Date().valueOf();
        value.begin = t1;
      }
      if (xhr.readyState == RECEIVE_REQUEST_STATUS) {
        // readystate等于4是客户端收到响应头的时刻，获取当前时间，t2减t1即发送请求到收到响应的时间
        if (xhr.status != TABLE_INITIAL_VALUE) {
          this.status1 = xhr.status;
          if (this.status1 != 200) {
            this.error1++;
          } else {
            const t2 = new Date().valueOf();
            value.end = t2;
            value.time = value.end - value.begin;
            if (value.time > this.outData[0]) {
              this.error1++;
            } else if (value.time != TABLE_INITIAL_VALUE) {
              let minute = new Date().getMinutes();
              let second = new Date().getSeconds();
              let hour = new Date().getHours();
              let xData1 = hour * 10000 + minute * 100 + second;

              if (minute < 10) {
                minute = '0' + minute;
              }
              if (second < 10) {
                second = '0' + second;
              }
              var xtime = hour + ':' + minute + ':' + second;

              var ytime = value.time;

              if (x == 1) {
                x++;
              } else {
                this.state.p95_arr1.push(ytime);

                this.state.urlDatafirst.push({
                  xTime_format: xtime,
                  xTimeall: xData1,
                  xData: xtime,
                  yData: ytime,
                });

                // else return;
                this.sumReqTime.push(value.time);
                value.sumtime += value.time; // 求和，算出总时间
                this.avgTime = value.sumtime / x - 1;
                if (value.time > this.maxTime) {
                  this.maxTime = value.time;
                }
                if (this.minTime == '') {
                  this.minTime = value.time;
                } else if (this.minTime > value.time) {
                  this.minTime = value.time;
                }
                // start(计算n95的值)
                let sum = TABLE_INITIAL_VALUE; // 存储每个数减去平均数的平方的和
                this.sumReqTime.forEach((num) => {
                  const bzc = num - this.avgTime;
                  sum += bzc * bzc;
                });
                let num1 = sum / (x - 1);
                let num2 = Math.sqrt(num1); // num2是标准差,平均数减去标准差就是95%的数据分布点
                if (x > 3) this.outData[0] = this.avgTime + 2.5 * num2;

                this.state.p95_arr1.sort(function (a, b) {
                  return a - b;
                });
                if(x<2){
                  this.Median=0
                }
                else if(x%2!=0){
                  this.Median=this.state.p95_arr1[(x-1)/2]
                }
                else{
                  this.Median=(this.state.p95_arr1[x/2]+this.state.p95_arr1[(x-2)/2])/2
                }
                console.log('p95_arr1' + this.state.p95_arr1);
                let division = ((x - 1) / 20) * 19;
                console.log('division' + division);
                if (x - 1 > 2)
                  this.n95 =
                    this.state.p95_arr1[parseInt(division) - 1] +
                    (this.state.p95_arr1[parseInt(division)] -
                      this.state.p95_arr1[parseInt(division) - 1]) *
                      (division - parseInt(division));
                // console.log(this.state.p95_arr1);
                console.log('p95' + this.n95);
                this.setState({chartDate: this.chartDate}); // 仅仅用来刷新UI
                x++;

                nowTime = new Date().valueOf(); // 获取当前时间戟
              }
            }
            if (
              nowTime < beginTime + reqTime * 60 * 1000 &&
              this.state.isPing
            ) {
              xhr.abort();
              this.send_request1 = setTimeout(() => {
                if (this.state.isPing) {
                  xhr.open('GET', urlCollection[0], true);
                  xhr.send();
                }
              }, TIMER_PERIOD);
            } else {
              this.setState({isPing: false});
              this.setState({ifOverlayAble: true});
              this.setState({ifTwoChartShow: false}); // ifTwoChartShow要放在url和values之前设置
              this.setState({backChart: true});
              return;
            }
          }
        }
      }
    };
    if (urlCollection[0] != '') {
      xhr.open('GET', urlCollection[0], true); // 写请求头
      xhr.send(); // 发送请求
    }
    if (urlCollection[1] != '') {
      xhr2.open('GET', urlCollection[1], true);
      xhr2.send();
    }
    if (urlCollection[2] != '') {
      xhr3.open('GET', urlCollection[2], true);
      xhr3.send();
    }
    if (urlCollection[3] != '') {
      xhr4.open('GET', urlCollection[3], true);
      xhr4.send();
    }
    if (urlCollection[4] != '') {
      xhr5.open('GET', urlCollection[4], true);
      xhr5.send();
    }
  };
};
