import React from 'react';
import {Image} from 'react-native';

export default class LogoTitle extends React.Component {
    render() {
      return (
        <Image
          source={require('../assets/images/hupuBar.png')}
          style={{ width: 62, height: 22, marginLeft:18, paddingBottom:16 }}
        />
      );
    }
}