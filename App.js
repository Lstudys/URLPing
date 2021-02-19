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
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

const height=Dimensions.get('window').height;
export default class home extends Component{
    constructor(props){
      super(props);
      this.state={

      }
    };
    render(){
      return(
        <View height={height}>
          <View>
            <Text style={{fontSize:100,left:80,top:240}}>ping</Text>
          </View>
        </View>
      );
    }
}
