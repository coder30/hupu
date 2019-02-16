import React from 'react';
import{View, Text, Image, ImageBackground, Dimensions} from 'react-native'
export default class Header extends React.Component {
  render() {
        return ( 
        <View style={{height:70, width: Dimensions.get("window").width , alignItems: 'center'}}>
            <Text style={{textAlign: 'center'}}>123</Text>
        </View>
        )
    }
}