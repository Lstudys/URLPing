import {Dimensions, PixelRatio} from 'react-native';

let screenW = Dimensions.get('window').width;
let screenH = Dimensions.get('window').height;
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
    size = Math.round(size * scale / fontScale + 0.5);
    return size;
}

/**
  * 设置高度
  * @param size  px
  * @returns {Number} dp
  */
export function ScaleSizeH(size) {
    var scaleHeight = size * screenPxH / DesignHeight;
    size = Math.round((scaleHeight / pixelRatio + 0.5));
    return size;
}

/**
  * 设置宽度
  * @param size  px
  * @returns {Number} dp
  */
export function ScaleSizeW(size) {
    var scaleWidth = size * screenPxW / DesignWidth;
    size = Math.round((scaleWidth / pixelRatio + 0.5));
    return size;
}
