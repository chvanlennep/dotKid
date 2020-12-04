import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import APLSScreen from '../screens/APLSScreen';
import ALSHomepageScreen from '../screens/ALSHomepageScreen';
import NLSScreen from '../screens/NLSScreen';

const Stack = createStackNavigator();

const ALSNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen
      mode="card"
      name="ALSHomepage"
      component={ALSHomepageScreen}
    />
    <Stack.Screen mode="card" name="APLSScreen" component={APLSScreen} />
    <Stack.Screen mode="card" name="NLSScreen" component={NLSScreen} />
  </Stack.Navigator>
);

export default ALSNavigator;
