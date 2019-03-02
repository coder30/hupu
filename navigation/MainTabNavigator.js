import React from 'react';
import { createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/Game';
import ForumScreen from '../screens/ForumScreen';
import PostScreen from '../screens/PostScreen';
import TopicScreen from '../screens/TopicScreen';
import NewsScreen from '../screens/NewsScreen';
import GameDetail from '../screens/GameDetail';
import PlateScreen from '../screens/PlateScreen'

let lastPick = new Date();

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: '主页',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='home'
    />
  ),
  tabBarOnPress: (scene) => {
    const { navigation } = scene;
    if(navigation.isFocused()){
      if(navigation.state.routes[0].params){
        let now = new Date();
        if(now - lastPick < 500)
          navigation.state.routes[0].params.scrollToTop();
        lastPick = now;
      }
    }
    else {
      navigation.navigate('Home')
    }
  }
};

const GameStack = createStackNavigator({
  Game: GameScreen,
});

GameStack.navigationOptions = {
  tabBarLabel: '比赛',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='game'
    />
  ),
  // tabBarOnPress: (scene) => {
  //   const { navigation } = scene;
  //   if(navigation.isFocused()){
  //     if(navigation.state.routes[0].params){
  //       let now = new Date();
  //       if(now - lastPick < 700)
  //         navigation.state.routes[0].params.scrollToTop();
  //       lastPick = now;
  //     }
  //   }
  //   else {
  //     navigation.navigate('Game')
  //   }
  // }
};

const ForumStack = createStackNavigator({
  Forum: ForumScreen
});

ForumStack.navigationOptions = {
  tabBarLabel: '论坛',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='forum'
    />
  ),
  tabBarOnPress: (scene) => {
    const { navigation } = scene;
    if(navigation.isFocused()){
      if(navigation.state.routes[0].params){
        let now = new Date();
        if(now - lastPick < 500)
          navigation.state.routes[0].params.scrollToTop();
        lastPick = now;
      }
    }
    else {
      navigation.navigate('Forum')
    }
  }
};

const TabNav = createBottomTabNavigator(
  {
  HomeStack,
  GameStack,
  ForumStack,
  },
  {
    tabBarOptions: {
      activeTintColor: '#C01E2F',
      inactiveTintColor: 'gray',
    },
  }
  );

const StacksOverTabs = createStackNavigator(
  {
    Root: {
      screen: TabNav,
      navigationOptions: {
        header: null
      }
    },
    Details: {
      screen: PostScreen
    },
    Topic: {
      screen: TopicScreen
    },
    News: {
      screen: NewsScreen
    },
    GameDetail: {
      screen: GameDetail
    },
    Plate: {
      screen: PlateScreen
    }
  }, {
    mode: 'card',
    defaultNavigationOptions: {
      gesturesEnabled: true,
      gestureResponseDistance:150
    },
    transitionConfig: () => ({
      screenInterpolator: CardStackStyleInterpolator.forHorizontal,
      transitionSpec: {
        duration: 250,
      },
    })
  }
);

export default StacksOverTabs;

