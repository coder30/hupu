import React from 'react';
import {Image} from 'react-native'
export default class TabBarIcon extends React.Component {
  render() {
    if(this.props.focused){
      if(this.props.name == 'home')
        return(
          <Image source={require('../assets/images/home_select.png')} style={{width: 36, height: 36, marginBottom: -3}}/>
        )
      if(this.props.name == 'game')
        return(
          <Image source={require('../assets/images/game_select.png')} style={{width: 36, height: 36, marginBottom: -3}}/>
        )
      if(this.props.name == 'forum')
        return(
          <Image source={require('../assets/images/forum_select.png')} style={{width: 36, height: 36, marginBottom: -3}}/>
        )
    }
    else {
      if(this.props.name == 'home')
        return(
          <Image source={require('../assets/images/home_defualt.png')} style={{width: 36, height: 36, marginBottom: -3}}/>
        )
      if(this.props.name == 'game')
        return(
          <Image source={require('../assets/images/game_defualt.png')} style={{width: 36, height: 36, marginBottom: -3}}/>
        )
      if(this.props.name == 'forum')
        return(
          <Image source={require('../assets/images/forum_defualt.png')} style={{width: 36, height: 36, marginBottom: -3}}/>
        )
    }
  }
}