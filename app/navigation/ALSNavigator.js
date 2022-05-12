import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import APLSScreen from '../screens/APLSScreen';
import ALSHomepageScreen from '../screens/ALSHomepageScreen';
import NLSScreen from '../screens/NLSScreen';

const Stack = createStackNavigator();

const ALSNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false, presentation: 'card'}}>
    <Stack.Screen name="ALSHomepage" component={ALSHomepageScreen} />
    <Stack.Screen name="APLSScreen" component={APLSScreen} />
    <Stack.Screen name="NLSScreen" component={NLSScreen} />
  </Stack.Navigator>
);

export default ALSNavigator;
