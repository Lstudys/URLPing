/**
 * 主页面用到的函数
 * created by LYH on 2021/7/23
 */

import {BackHandler} from 'react-native';
import Orientation from 'react-native-orientation';
import {Toast} from 'teaset';
import store from 'react-native-simple-store';
import data from '../modal/data';
import Data from '../modal/data';

// 控制安卓设备的返回键
export const BackAction = function () {
  if (this.state.isPing) {
    // 显示图表有两种情况：ping结束和正在ping
    this.pressnum++;
    if (this.pressnum == 1) {
      this.firstpress = new Date().valueOf();
      for (let i = 0; i < data.urls.length; i++) {
        data.urls[i].mark = false;
      }

      Toast.message('再按一次暂停Ping');
      return true;
    } else {
      if (this.firstpress + 2000 > new Date().valueOf()) {
        this.pressnum = 0;
        this.firstpress = 0;
        this.setState({
          isPing: false,
        });
        this.setState({ifOverlayAble: true});
        Orientation.lockToPortrait();
        return true;
      } else {
        this.pressnum = 1;
        this.firstpress = new Date().valueOf();
        for (let i = 0; i < data.urls.length; i++) {
          data.urls[i].mark = false;
        }
        Toast.message('再按一次暂停Ping');
        return true;
      }
    }
  } else {
    Data.InputUrl = '';

    this.props.navigation.navigate('Ordinary');
    this.setState({
      isPing: false,
    });
    return true;
  }
};

export const ExitApp = function () {
  if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
    //最近2秒内按过back键，可以退出应用。
    BackHandler.exitApp();
    return false;
  }
  this.props.navigation.navigate('Ordinary');

  this.lastBackPressed = Date.now();
  Toast.message('再按一次退出应用');
  return true; //默认行为
};

// 设置时间的点击事件
export const SetReqTime = function () {
  if (this.state.ifOverlayAble) {
    this.setState({
      OverlayAble: true,
    });
    return;
  }
  Toast.message('请稍后设置!');
};

export const ReqTimeChange = function (newTime) {
  this.setState({
    newReqTime: newTime,
  });
};

export const TextInputChange1 = function (newText) {
  this.state.url = newText;
};

export const TextInputChange2 = function (newText) {
  this.state.url2 = newText;
};

// 验证输入的请求时间
export const ConfirmRqTime = function () {
  let t = this.state.newReqTime; // 先获取输入的请求时长
  if (t == 0) {
    // 没有输入或输入为0时提示
    Toast.message('请输入请求时间!');
    return;
  }
  this.setState({
    reqTime: t,
  }); // 设置新的reqTime
  this.setState({
    OverlayAble: false,
  }); // 关闭悬浮框
  this.setState({
    newReqTime: 0,
  }); // 把newReqTime设置为0，否则会影响下一次设置
  Toast.message('设置成功！');
};

//  验证URL
export const TestURL = function (url) {
  var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  if (!reg.test(url)) {
    return false;
  } else {
    return true;
  }
};

export const SaveValue = function (url) {
  store.get('local').then((res) => (data.local = res.slice()));
  /* 禁止重复存储，已有存储的话不存储*/
  if (data.local.indexOf(url) == -1) {
    data.local.unshift(url);
    store.save('local', data.local);
  } else {
    return;
  }
};
