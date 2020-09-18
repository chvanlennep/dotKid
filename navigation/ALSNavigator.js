import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import APLSScreen from '../screens/APLSScreen';
import APLSLogScreen from '../screens/APLSLogScreen'
import ALSHomepageScreen from '../screens/ALSHomepageScreen';



const Stack = createStackNavigator();

const ALSNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}} >
    <Stack.Screen mode="card" name="ALSHomepage" component={ALSHomepageScreen} />
    <Stack.Screen mode="card" name="APLSScreen" component={APLSScreen} />
    <Stack.Screen mode="modal" name="APLSLog" component={APLSLogScreen} />
    </Stack.Navigator>
    );

export default ALSNavigator;