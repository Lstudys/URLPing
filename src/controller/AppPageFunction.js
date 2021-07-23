/**
 * 主页面用到的函数
 * created by LYH on 2021/7/23
 */

import {
  BackHandler
} from 'react-native';
import Orientation from 'react-native-orientation';
import {
  Toast
} from 'teaset';
import store from 'react-native-simple-store';
import data from '../modal/data';



const num=2;
//控制安卓设备的返回键
export const backAction = function () {
  if (!this.state.linechart) {//false则当前显示图表
    if (this.state.isPing) {//显示图表有两种情况：ping结束和正在ping
      this.pressnum++;
      if (this.pressnum == 1) {
        this.firstpress = new Date().valueOf();
        Toast.message('再按一次取消Ping');
        return true;
      } else {
        if (this.firstpress + 2000 > new Date().valueOf()) {
          this.pressnum = 0;
          this.firstpress = 0;
          this.setState({
            linechart: true
          });
          this.setState({
            isPing: false
          });
          this.setState({
            url: ''
          });
          this.setState({
            url2: ''
          });
          this.setState({
            defaultvalue1: ''
          });
          this.setState({
            defaultvalue2:''
          })
          this.setState({ifOverlayAble:true})
          Orientation.lockToPortrait();
          return true;
        } else {
          this.pressnum = 1;
          this.firstpress = new Date().valueOf();
          Toast.message('再按一次取消Ping');
          return true;
        }
      }

    } else {
      Orientation.lockToPortrait();
      this.setState({
        linechart: true
      });
      return true;
    }
  } else {
    BackHandler.exitApp();
    // console.log(num);
  }
}


//设置时间的点击事件
export const setReqTime = function () {
  if (this.state.ifOverlayAble) {
    this.setState({
      OverlayAble: true
    });
    return;
  }
  Toast.message('请稍后设置!');
}

export const reqTimeChange = function (newTime) {
  this.setState({
    newReqTime: newTime
  });
}

export const textInputChange1 = function (newText) {
  this.state.url = newText;
}

export const textInputChange2 = function (newText) {
  this.state.url2 = newText;
}

//验证输入的请求时间
export const confirmRqTime = function () {
  const t = this.state.newReqTime; //先获取输入的请求时长
  if (t == 0) { //没有输入或输入为0时提示
    Toast.message('请输入请求时间!');
    return;
  }
  this.setState({
    reqTime: t
  }); //设置新的reqTime
  this.setState({
    OverlayAble: false
  }); //关闭悬浮框
  this.setState({
    newReqTime: 0
  }) //把newReqTime设置为0，否则会影响下一次设置
  Toast.message('设置成功！')
}

//验证URL
export const testURL = function (url) {
  let match = /http|https/;
  // /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
  // /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
  return match.test(url);
}

export const saveValue = function (url) {
  store.get("local").then(
    res => data.local=res.slice()
  );
  /*禁止重复存储，已有存储的话不存储*/
  if(data.local.indexOf(url)==-1){
    data.local.unshift(url);
    store.save('local',data.local);
  }else{
    return;
  }
}
