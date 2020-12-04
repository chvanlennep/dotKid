import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import BPScreen from '../screens/BPScreen';
import BSAScreen from '../screens/BSAScreen';
import BSAResultsScreen from '../screens/BSAResultsScreen';
import PCentileScreen from '../screens/PCentileScreen';
import ECGScreen from '../screens/ECGScreen';
import FluidCalculatorScreen from '../screens/FluidCalculatorScreen';
import FluidResultsScreen from '../screens/FluidResultsScreen';
import WETFLAGScreen from '../screens/WETFLAGScreen';
import WETFLAGResultsScreen from '../screens/WETFLAGResultsScreen';
import PaedsHomepageScreen from '../screens/PaedsHomepageScreen';
import PCentileResultsScreen from '../screens/PCentileResultsScreen';
import BPResultsScreen from '../screens/BPResultsScreen';
import ECGResultsScreen from '../screens/ECGResultsScreen';

const Stack = createStackNavigator();

const PaedsCalcNavigator = () => {
  return (
    <Stack.Navigator
      mode="card"
      name="RootPaed"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PaedsHomepage" component={PaedsHomepageScreen} />
      <Stack.Screen name="BloodPressure" component={BPScreen} />
      <Stack.Screen name="BPResults" component={BPResultsScreen} />
      <Stack.Screen name="BSA" component={BSAScreen} />
      <Stack.Screen name="BSAResults" component={BSAResultsScreen} />
      <Stack.Screen name="PCentile" component={PCentileScreen} />
      <Stack.Screen
        name="PCentileResultsScreen"
        component={PCentileResultsScreen}
      />
      <Stack.Screen name="FluidResults" component={FluidResultsScreen} />
      <Stack.Screen name="ECG" component={ECGScreen} />
      <Stack.Screen name="ECGResults" component={ECGResultsScreen} />
      <Stack.Screen name="FluidCalculator" component={FluidCalculatorScreen} />
      <Stack.Screen name="WETFLAGScreen" component={WETFLAGScreen} />
      <Stack.Screen name="WETFLAGResults" component={WETFLAGResultsScreen} />
    </Stack.Navigator>
  );
};

export default PaedsCalcNavigator;
