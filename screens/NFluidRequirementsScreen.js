import React, { useContext } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import AppForm from '../components/AppForm';
import colors from '../config/colors';
import NCalcScreen from '../components/NCalcScreen';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import routes from '../navigation/routes';
import NFluidInputButton from '../components/buttons/NFluidInputButton';
import FluidGestationInputButton from '../components/buttons/input/FluidGestationInputButton';
import ageChecker from '../brains/ageChecker';
import nFluidCalculator from '../brains/nFluidCalculator';
import { GlobalStateContext } from '../components/GlobalStateContext';

const NFluidRequirementsScreen = () => {
  const navigation = useNavigation();

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const moveDataAcrossGlobal = (movingTo, values) => {
    setGlobalStats((globalStats) => {
      const child = { ...globalStats.child };
      const neonate = { ...globalStats.neonate };
      for (const [key, value] of Object.entries(values)) {
        if (key !== 'gestation') {
          let newKey = key;
          let newValue = value;
          if (movingTo === 'neonate') {
            if (key === 'height') {
              newKey = 'length';
            }
            if (key === 'weight') {
              newValue = value * 1000;
            }
            neonate[newKey] = newValue;
          } else {
            if (key === 'length') {
              newKey = 'height';
            }
            if (key === 'weight') {
              newValue = value / 1000;
            }
            child[newKey] = newValue;
          }
        }
      }
      return { child, neonate };
    });
  };

  const checkCorrection = '↑ Please check this value';
  const measurementNeeded = "↑ We'll need a weight to calculate";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure this is a neonatal measurement (in ${units})?`;
  };

  const validationSchema = Yup.object().shape({
    correction: Yup.number().min(30, checkCorrection).max(200, checkCorrection),
    dob: Yup.date()
      .nullable()
      .required('↑ Please enter a date of birth')
      .label('Date of Birth'),
    weight: Yup.number()
      .min(100, wrongUnitsMessage('g'))
      .max(8000, wrongUnitsMessage('g'))
      .required(measurementNeeded),
  });

  const initialValues = {
    correction: '100',
    weight: '',
    gestation: 'Term',
    dob: null,
    tob: null,
    dom: null,
    tom: null,
  };

  const handleFormikSubmit = async (values) => {
    let referenceValues;
    let parsedReferenceValues;
    try {
      referenceValues = await AsyncStorage.getItem(
        `${values.gestation.toLowerCase()}_fluid_requirements`
      );
    } catch (error) {
      console.log(`Error reading item: ${error}`);
    }
    const checkAge = ageChecker(values, 29);
    if (checkAge === 'Negative age') {
      Alert.alert('Time Travelling Patient', 'Please check the dates entered', [
        { text: 'OK', onPress: () => null },
      ]);
    } else if (checkAge === 'Too old') {
      Alert.alert(
        'Patient Too Old',
        'This calculator can only be used until 28 days of age. Do you want to be taken to the correct calculator?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              moveDataAcrossGlobal('child', values);
              navigation.navigate(routes.FLUID_CALCULATOR);
            },
          },
        ]
      );
    } else {
      parsedReferenceValues = JSON.parse(referenceValues);
      const results = nFluidCalculator(values, parsedReferenceValues);
      const serialisedObject = JSON.stringify(results);
      navigation.navigate(routes.NEONATE_FLUID_RESULTS, serialisedObject);
    }
  };

  return (
    <NCalcScreen style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}
          >
            <DateTimeInputButton
              kind="neonate"
              type="birth"
              renderTime={true}
            />
            <FluidGestationInputButton />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="g"
              kind="neonate"
            />
            <NumberInputButton
              name="correction"
              userLabel="Correction Factor"
              iconName="triangle-outline"
              unitsOfMeasurement="%"
              kind="neonate"
              defaultValue="100"
              global={false}
            />
            <NFluidInputButton />
            <DateTimeInputButton
              kind="neonate"
              type="measured"
              renderTime={true}
            />
            <FormResetButton />
            <FormSubmitButton
              name="Calculate Fluid Requirement"
              kind="neonate"
            />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default NFluidRequirementsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    paddingHorizontal: 50,
    marginTop: 20,
    width: '100%',
    marginBottom: 75,
  },
  buttons: {
    //backgroundColor: "dodgerblue",
    flexDirection: 'row',
    width: 96,
    justifyContent: 'space-between',
  },
  outputContainer: {
    //backgroundColor: "orangered",
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 2,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
    width: '100%',
  },
  outputText: {
    //backgroundColor: "limegreen",
    color: colors.black,
    fontSize: 15,
    marginBottom: 40,
  },
  title: {
    alignContent: 'center', //backgroundColor: "goldenrod",
    flexGrow: 2,
    justifyContent: 'center',
    width: 150,
  },
  text: {
    color: colors.black,
    fontSize: 17,
  },
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
