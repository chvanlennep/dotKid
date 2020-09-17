import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import APLSScreen from '../screens/APLSScreen';
import PaedsHomepageScreen from '../screens/PaedsHomepageScreen';
import ReferenceScreen from '../screens/ReferenceScreen'
import SettingsScreen from '../screens/SettingsScreen'

const Tab = createBottomTabNavigator();

const AppNavigator = () => (

    <Tab.Navigator>
    <Tab.Screen name="Calculator" component={PaedsHomepageScreen} />
    <Tab.Screen name="ALS" component={APLSScreen} />
    <Tab.Screen name="References" component={ReferenceScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
)

export default AppNavigator;