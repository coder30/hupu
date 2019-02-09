import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import  PostScreen from '../screens/PostScreen';
import TopicScreen from '../screens/TopicScreen';
import NewsScreen from '../screens/NewsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: '主页',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-home'
          : 'md-home'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: '比赛',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-trophy' : 'md-trophy'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: '论坛',
  tabBarIcon: ({ focused, tintColor  }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
    />
  ),
};

const TabNav = createBottomTabNavigator(
  {
  HomeStack,
  LinksStack,
  SettingsStack,
  },
  {
    tabBarOptions: {
      activeTintColor: '#C01E2F',
      inactiveTintColor: 'gray',
    },
  }
  );

const StacksOverTabs = createStackNavigator({
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
  }
});

export default StacksOverTabs;

