import React from 'react';
import{View, Text, Image, ImageBackground} from 'react-native'
export default class Rectangle extends React.Component {
  render() {
    if(this.props.type=='light')
      return (
          <ImageBackground source={require('../assets/images/timeCard.png')} style={{width:128, height: 22 ,margin: 16, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                  <Image source={require('../assets/images/light.png')} style={{width: 24, height: 24, marginRight:3, tintColor: '#fff'}}/>
                  <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight:22}}>这些评论亮了</Text>
              </View>
          </ImageBackground>
      );
    else if(this.props.type=='reply')
        return (
          <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:80, height: 22 ,margin: 16, alignItems: 'center'}}>
            <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight:22}}>最新评论</Text>
          </ImageBackground>
        )
    }
}