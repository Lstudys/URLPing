import store from 'react-native-simple-store';
import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import zh from '../modal/Langguage/zh_CN';
import en from '../modal/Langguage/en_US';
import Data from '../modal/Data';
const Locales = RNLocalize.getLocales(); // 获取手机本地国际化信息
const SystemLanguage = Locales[0]?.languageCode; // 用户系统偏好语言

export const LanguageChange = function () {

    store
        .get('Language')
        .then((res) => {
            Data.userChoose = res;
        })
        .finally(() => {
            if (Data.userChoose) {
            // 首选用户设置记录
            I18n.locale = Data.userChoose;
            } else 
            if (SystemLanguage) {
            // 获取系统语言
            I18n.locale = SystemLanguage;
            } else {
            // 用户既没有设置，也没有获取到系统语言，默认加载英语语言资源
            I18n.locale = 'en';
            }
            this.setState({
            langvis: false,
            });
        });


        I18n.fallbacks = true;
        // 加载语言包
        I18n.translations = {zh, en};

}

