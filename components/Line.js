import React from 'react';
import {View} from 'react-native'
export default class Line extends React.Component {
    render() {
      return (
        <View style={{backgroundColor: this.props.backgroundColor, height: this.props.height, paddingLeft: this.props.paddingLeft, paddingRight: this.props.paddingRight}} >
            <View style={{flex: 1, backgroundColor: this.props.lineColor}} />
        </View>
      );
    }
}