import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BPScreen from '../screens/BPScreen';
import BSAScreen from '../screens/BSAScreen';
import PCentileScreen from '../screens/PCentileScreen';
import ECGScreen from '../screens/ECGScreen';
import FluidCalculatorScreen from '../screens/FluidCalculatorScreen';
import WETFLAGScreen from '../screens/WETFLAGScreen';
import NeonateHomepageScreen from '../screens/NeonateHomepageScreen';
import PaedsHomepageScreen from '../screens/PaedsHomepageScreen';
import PCentileResultsScreen from '../screens/PCentileResultsScreen';

import BirthCentileScreen from '../screens/BirthCentileScreen';
import BirthCentileResultsScreen from '../screens/BirthCentileResultsScreen';
import NCentileScreen from '../screens/NCentileScreen';
import JaundiceScreen from '../screens/JaundiceScreen';
import JaundiceResultsScreen from '../screens/JaundiceResultsScreen';
import NCentileResultsScreen from '../screens/NCentileResultsScreen';
import BPResultsScreen from '../screens/BPResultsScreen';
import ECGResultsScreen from '../screens/ECGResultsScreen';
import NFluidRequirementsScreen from '../screens/NFluidRequirementsScreen';
import NFluidRequirementsResultsScreen from '../screens/NFluidRequirementsResultsScreen';

const Stack = createStackNavigator();

const CalcNavigator = () => {
  return (
    <Stack.Navigator
      mode="card"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PaedsHomepage"
        component={PaedsHomepageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="BloodPressure" component={BPScreen} />
      <Stack.Screen name="BPResults" component={BPResultsScreen} />
      <Stack.Screen name="BSA" component={BSAScreen} />
      <Stack.Screen name="PCentile" component={PCentileScreen} />
      <Stack.Screen
        name="PCentileResultsScreen"
        component={PCentileResultsScreen}
      />
      <Stack.Screen name="ECG" component={ECGScreen} />
      <Stack.Screen name="ECGResults" component={ECGResultsScreen} />
      <Stack.Screen name="FluidCalculator" component={FluidCalculatorScreen} />
      <Stack.Screen name="WETFLAG" component={WETFLAGScreen} />
      <Stack.Screen name="NeonateHomepage" component={NeonateHomepageScreen} />
      <Stack.Screen name="BirthCentile" component={BirthCentileScreen} />
      <Stack.Screen
        name="BirthCentileResults"
        component={BirthCentileResultsScreen}
      />
      <Stack.Screen name="NCentile" component={NCentileScreen} />
      <Stack.Screen name="NCentileResults" component={NCentileResultsScreen} />
      <Stack.Screen
        name="NFluidCalculator"
        component={NFluidRequirementsScreen}
      />
      <Stack.Screen
        name="NFluidCalculatorResults"
        component={NFluidRequirementsResultsScreen}
      />
      <Stack.Screen name="Jaundice" component={JaundiceScreen} />
      <Stack.Screen name="JaundiceResults" component={JaundiceResultsScreen} />
    </Stack.Navigator>
  );
};

export default CalcNavigator;

// ENDOTRACHEAL TUBE LENGTH SCREEN <Stack.Screen name="EndotrachealTube" component={} />
