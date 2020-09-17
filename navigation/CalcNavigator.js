import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StackActions } from '@react-navigation/native';

import BPScreen from '../screens/BPScreen'
import BSAScreen from '../screens/BSAScreen'
import PCentileScreen from '../screens/PCentileScreen'
import ECGScreen from '../screens/ECGScreen'
import FluidCalculatorScreen from '../screens/FluidCalculatorScreen'
import WETFLAGScreen from '../screens/WETFLAGScreen'
import NeonateHomepageScreen from '../screens/NeonateHomepageScreen'
import PaedsHomepageScreen from '../screens/PaedsHomepageScreen';

const Stack = createStackNavigator();

const CalcNavigator = () => (
    <Stack.Navigator mode="card" >
    <Stack.Screen name="PaedsHomepage" component={PaedsHomepageScreen} options={{headerShown: false}} />
    <Stack.Screen name="BloodPressure" component={BPScreen} />
    <Stack.Screen name="BSA" component={BSAScreen} />
    <Stack.Screen name="PCentile" component={PCentileScreen} />
    <Stack.Screen name="ECG" component={ECGScreen} />
    <Stack.Screen name="FluidCalculator" component={FluidCalculatorScreen} />
    <Stack.Screen name="WETFLAG" component={WETFLAGScreen} />
    <Stack.Screen name="NeonateHomepage" component={NeonateHomepageScreen} />
    </Stack.Navigator>
);

export default CalcNavigator;