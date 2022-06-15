import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import APLSScreen from '../screens/APLSScreen';
import ALSHomepageScreen from '../screens/ALSHomepageScreen';
import NLSScreen from '../screens/NLSScreen';
import {ALSCommentModal} from '../components/ALSCommentModal';

const Stack = createStackNavigator();

const ALSNavigator = () => (
  <Stack.Navigator>
    <Stack.Group screenOptions={{headerShown: false, presentation: 'card'}}>
      <Stack.Screen name="ALSHomepage" component={ALSHomepageScreen} />
      <Stack.Screen name="APLSScreen" component={APLSScreen} />
      <Stack.Screen name="NLSScreen" component={NLSScreen} />
    </Stack.Group>
    <Stack.Screen
      name="CommentModal"
      component={ALSCommentModal}
      options={{headerShown: false, presentation: 'modal'}}
    />
  </Stack.Navigator>
);

export default ALSNavigator;
