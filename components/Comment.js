import React from 'react';
import{View, Text, Image, ImageBackground} from 'react-native'
export default class Com extends React.Component {
  render() {
    if(this.props.type=='light')
      return (
          <ImageBackground source={require('../assets/images/timeCard.png')} style={{width:128, height: 22 ,margin: 16}}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/images/light.png')} style={{width: 11, height: 14, marginRight:3, tintColor :'#FFFFFF'}}/>
                  <Text style={{color:'#FFFFFF', textAlign: 'center'}}>这些评论亮了</Text>
              </View>
          </ImageBackground>
      );
    else if(this.props.type=='reply')
        return (
          <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:80, height: 22 ,margin: 16, alignItems: 'center'}}>
            <Text style={{color:'#FFFFFF', textAlign: 'center'}}>最新评论</Text>
          </ImageBackground>
        )
    }
}