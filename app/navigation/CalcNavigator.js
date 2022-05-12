import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PaedsCalcNavigator from './PaedsCalcNavigator';
import NCalcNavigator from './NCalcNavigator';

const Stack = createStackNavigator();

const CalcNavigator = () => {
  return (
    <Stack.Navigator
      name="RootCalc"
      screenOptions={{
        headerShown: false,
        presentation: 'card'
      }}>
      <Stack.Screen
        name="RootPaed"
        component={PaedsCalcNavigator}
        screenOptions={{headerShown: false}}
      />
      <Stack.Screen
        name="RootN"
        component={NCalcNavigator}
        screenOptions={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default CalcNavigator;

// ENDOTRACHEAL TUBE LENGTH SCREEN <Stack.Screen name="EndotrachealTube" component={} />
