import {Dimensions, PixelRatio} from 'react-native';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
let fontScale = PixelRatio.getFontScale();
let pixelRatio = PixelRatio.get();
// 高保真的宽度和高度
const DesignWidth = 750.0;
const DesignHeight = 1334.0;

// 根据dp获取屏幕的px
let screenPxW = PixelRatio.getPixelSizeForLayoutSize(screenW);
let screenPxH = PixelRatio.getPixelSizeForLayoutSize(screenH);

/**
 * 设置text
 * @param size  px
 * @returns {Number} dp
 */
export function SetSpText(size) {
  var scaleWidth = screenW / DesignWidth;
  var scaleHeight = screenH / DesignHeight;
  var scale = Math.min(scaleWidth, scaleHeight);
  size = Math.round((size * scale) / fontScale + 0.5);
  return size;
}

/**
 * 设置高度
 * @param size  px
 * @returns {Number} dp
 */
export function ScaleSizeH(size) {
  var scaleHeight = (size * screenPxH) / DesignHeight;
  size = Math.round(scaleHeight / pixelRatio + 0.5);
  return size;
}

/**
 * 设置宽度
 * @param size  px
 * @returns {Number} dp
 */
export function ScaleSizeW(size) {
  var scaleWidth = (size * screenPxW) / DesignWidth;
  size = Math.round(scaleWidth / pixelRatio + 0.5);
  return size;
}

/**
 * 设置图标圆角半径
 * @param scaleWidth,scaleHeight
 * @returns {Number} dp
 */
export function ScaleSizeR(scaleWidth, scaleHeight) {
  var scaleR = Math.sqrt(
    Math.pow(ScaleSizeW(scaleWidth), 2) + Math.pow(ScaleSizeH(scaleHeight), 2),
  );
  return scaleR;
}

/*
  屏幕适配
  手机的逻辑像素 = 手机的屏幕分辨率/手机的倍率，而倍率一般等于2或者3 
  WLR = 设备宽度逻辑像素/设计图宽度(也是逻辑像素)
  在目标设备上要设置的尺寸计算公式就是：
  size = 设置图上元素size * WLR
*/

export function ScaleSize(size) {
  //设计图宽度即本人手机宽度逻辑像素为：360px
  let myScreenW = 360;
  //获取设备的宽度逻辑像素
  let screenW = Dimensions.get('window').width;
  WLR = screenW / myScreenW;
  return size * WLR;
}
