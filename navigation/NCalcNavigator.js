import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import NeonateHomepageScreen from '../screens/NeonateHomepageScreen';
import BirthCentileScreen from '../screens/BirthCentileScreen';
import BirthCentileResultsScreen from '../screens/BirthCentileResultsScreen';
import NCentileScreen from '../screens/NCentileScreen';
import JaundiceScreen from '../screens/JaundiceScreen';
import JaundiceResultsScreen from '../screens/JaundiceResultsScreen';
import NCentileResultsScreen from '../screens/NCentileResultsScreen';
import NFluidRequirementsScreen from '../screens/NFluidRequirementsScreen';
import NFluidRequirementsResultsScreen from '../screens/NFluidRequirementsResultsScreen';
import CGAScreen from '../screens/CGAScreen';
import APGARScreen from '../screens/APGARScreen';

const Stack = createStackNavigator();

const NCalcNavigator = () => {
  return (
    <Stack.Navigator
      mode="card"
      name="RootN"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="NeonateHomepage" component={NeonateHomepageScreen} />
      <Stack.Screen name="APGAR" component={APGARScreen} />
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
      <Stack.Screen name="CGA" component={CGAScreen} />
    </Stack.Navigator>
  );
};

export default NCalcNavigator;
