import React from 'react';
import { Platform } from 'react-native';
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

