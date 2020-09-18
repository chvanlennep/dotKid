import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import APLSScreen from '../screens/APLSScreen';
import PaedsHomepageScreen from '../screens/PaedsHomepageScreen';
import ReferenceScreen from '../screens/ReferenceScreen'
import SettingsScreen from '../screens/SettingsScreen'
import CalcNavigator from './CalcNavigator';
import colors from '../config/colors';
import ALSNavigator from './ALSNavigator';


const Tab = createBottomTabNavigator();

const AppNavigator = () => (

    <Tab.Navigator tabBarOptions={{ showLabel: false}}>
    <Tab.Screen 
    name="Calculator" 
    component={CalcNavigator}
    options={{
        tabBarIcon: ({ color, size }) => 
        <MaterialCommunityIcons name="calculator" color={color} size={size} />

    }}
     />
    <Tab.Screen name="ALS" component={ALSNavigator} options={{
        tabBarIcon: ({ color, size }) => 
        <MaterialCommunityIcons name="hospital-box" color={color} size={size} />

    }} 
    />
    <Tab.Screen name="References" component={ReferenceScreen} options={{
        tabBarIcon: ({ color, size }) => 
        <MaterialCommunityIcons name="book-open-variant" color={color} size={size}/>
    }} 
    />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarIcon: ({ color, size }) => 
        <MaterialCommunityIcons name="settings" color={color} size={size}/>
    }} 
     />
    </Tab.Navigator>
)

export default AppNavigator;



