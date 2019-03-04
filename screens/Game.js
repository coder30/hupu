import React from 'react';
import Team from '../components/Team';
import Game from '../components/Game';
import Player from '../components/Player';
import Injury from '../components/Injury';
import Honour from '../components/Honour';
import LogoTitle from '../components/LogoTitle';
import {createMaterialTopTabNavigator} from 'react-navigation';

import { View, Text, ImageBackground} from 'react-native';
const tab = [{name: '赛程', index:'1'},{name: '球队榜', index:'2'},{name: '球员榜', index:'3'},{name: '新秀榜', index:'4'},{name: '日榜', index:'5'},{name: '伤病', index:'6'},{name: '荣誉榜', index:'7'}]

class Regular extends React.Component {
  render() {
    return <Player type='regular'/>;
  }
}
class Rookie extends React.Component {
  render() {
    return <Player type='rookie'/>;
  }
}
class Daily extends React.Component {
  render() {
    return <Player type='daily'/>;
  }
}
class Rectangle extends React.Component {
  render() {
    return <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
      <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[this.props.index].name}</Text>
    </ImageBackground>;
  }
}
class Tint extends React.Component {
  render() {
    return <View style={{height:22, width:57}}>
      <Text style={{ color:"rgba(0, 0, 0, 0.54)", lineHeight: 22, textAlign: 'center'}}>{tab[this.props.index].name}</Text>
    </View>
  }
}
const MyNavigator = createMaterialTopTabNavigator({
  Tab1: {
    screen: Game,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) =>{
        if(focused)
          return (<Rectangle index={0}/>)
        else 
          return (<Tint index={0}/>)
      },
    }
  },
  Tab2: {
    screen: Team,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle index={1}/>)
          else 
            return (<Tint index={1}/>)
      },
    }
  },
  Tab3: {
    screen: Regular,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle index={2}/>)
          else 
            return (<Tint index={2}/>)
      },
    }
  },
  Tab4: {
    screen: Rookie,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle index={3}/>)
          else 
            return (<Tint index={3}/>)
      },
    }
  },
  Tab5: {
    screen: Daily,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle index={4}/>)
          else 
            return (<Tint index={4}/>)
      },
    }
  },
  Tab6: {
    screen: Injury,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle index={5}/>)
          else 
            return (<Tint index={5}/>)
      },
    }
  },
  Tab7: {
    screen: Honour,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle index={6}/>)
          else 
            return (<Tint index={6}/>)
      },
    }
  },
},{
  tabBarOptions:{
    scrollEnabled: true,
    showIcon: true,
    showLabel: false,
    indicatorStyle: {
      height: 2,
      backgroundColor: 'white',
    },//标签指示器的样式
    tabStyle :{width:80, height:45},
    style: {
      backgroundColor: '#fff',//TabBar 的背景颜色
    },
  },
  lazy :true,
  initialLayout :{width:80, height:45},
  animationEnabled : true
})
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#C01E2F',
    },
  };
  constructor(props){
    super(props);
  }  
  static router = MyNavigator.router;
  render() {
    return (
      <MyNavigator navigation={this.props.navigation}/>
    );
  }
}
