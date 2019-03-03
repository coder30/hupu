import React from 'react';
import Team from '../components/Team';
import Game from '../components/Game';
import Player from '../components/Player';
import Injury from '../components/Injury';
import Honour from '../components/Honour';
import LogoTitle from '../components/LogoTitle';
import {createMaterialTopTabNavigator} from 'react-navigation';
import { MaterialTopTabBar } from 'react-navigation-tabs';

import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback} from 'react-native';
const tab = [{name: '赛程', index:'1'},{name: '球队榜', index:'2'},{name: '球员榜', index:'3'},{name: '新秀榜', index:'4'},{name: '日榜', index:'5'},{name: '伤病', index:'6'},{name: '荣誉榜', index:'7'}]
function MaterialTopTabBarWithStatusBar(props) {
  return(
    <View style={{flexDirection:'row'}}>
      <View style={{margin: 16}}>
        {props.navigationState.index == 0?
          <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
            <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[0].name}</Text>
          </ImageBackground>
          :<TouchableWithoutFeedback onPress={() => {props.navigation.navigate('Game')}}>
            <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{tab[0].name}</Text>
          </TouchableWithoutFeedback>
        }
      </View>
      <View style={{margin: 16}}>
        {props.navigationState.index == 1?
          <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
            <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[1].name}</Text>
          </ImageBackground>
          :<TouchableWithoutFeedback onPress={() => {props.navigation.navigate('Team')}}>
            <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{tab[1].name}</Text>
          </TouchableWithoutFeedback>
        }
      </View>
      <View style={{margin: 16}}>
      {props.navigationState.index == 2?
        <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
          <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[2].name}</Text>
        </ImageBackground>
        :<TouchableWithoutFeedback onPress={() => {props.navigation.navigate('Regular')}}>
          <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{tab[2].name}</Text>
        </TouchableWithoutFeedback>
      }
      </View>
      <View style={{margin: 16}}>
      {props.navigationState.index == 3?
        <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
          <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[3].name}</Text>
        </ImageBackground>
        :<TouchableWithoutFeedback onPress={() => {props.navigation.navigate('Rookie')}}>
          <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{tab[3].name}</Text>
        </TouchableWithoutFeedback>
      }
      </View>
      <View style={{margin: 16}}>
      {props.navigationState.index == 4?
        <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
          <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[4].name}</Text>
        </ImageBackground>
        :<TouchableWithoutFeedback onPress={() => {props.navigation.navigate('Daily')}}>
          <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{tab[4].name}</Text>
        </TouchableWithoutFeedback>
      }
      </View>
      <View style={{margin: 16}}>
      {props.navigationState.index == 5?
        <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
          <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[5].name}</Text>
        </ImageBackground>
        :<TouchableWithoutFeedback onPress={() => {props.navigation.navigate('Injury')}}>
          <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{tab[5].name}</Text>
        </TouchableWithoutFeedback>
      }
      </View>
      <View style={{margin: 16}}>
      {props.navigationState.index == 6?
        <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
          <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{tab[6].name}</Text>
        </ImageBackground>
        :<TouchableWithoutFeedback onPress={() => {props.navigation.navigate('Honour')}}>
          <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{tab[6].name}</Text>
        </TouchableWithoutFeedback>
      }
      </View>
    </View>
  )
}
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

const MyNavigator = createMaterialTopTabNavigator({
  Tab1: Game,
  Tab2: Team,
  Tab3: Regular ,
  Tab4: Rookie,
  Tab5: Daily,
  Tab6: Injury,
  Tab7: Honour,
},{
  tabBarComponent:MaterialTopTabBarWithStatusBar
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
