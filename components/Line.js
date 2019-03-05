import React from 'react';
import {View,StyleSheet,Text} from 'react-native'
export default class Rectangle extends React.Component {
  constructor(props){
    super(props);
  } 
  render() {
      return (
        <View style={{height:22,flexDirection:'row'}}>
          <View style={styles.left}></View>
          <View style={{height:22, backgroundColor:'#C01E2F', justifyContent:'center'}}><Text style={{color:'#fff', fontWeight:'400', width:45, textAlign:'center'}}>{this.props.name}</Text></View>
          <View style={styles.right}></View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  left: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderRightWidth: 0,
    borderBottomWidth:22,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#C01E2F',
    borderLeftColor:'transparent',
    position: 'relative',
    top:-5,
  },
  right: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 22,
    borderRightWidth: 5,
    borderBottomWidth:5,
    borderLeftWidth: 0,
    borderTopColor: '#C01E2F',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor:'transparent',
  },
})