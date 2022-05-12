import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ReferenceScreen from '../screens/ReferenceScreen';
import CalcNavigator from './CalcNavigator';
import ALSNavigator from './ALSNavigator';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Calculator"
        component={CalcNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="calculator"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ALS"
        component={ALSNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="hospital-box"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="References"
        component={ReferenceScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="information-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
