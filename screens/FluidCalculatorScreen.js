import React, {useContext, useRef, useState, useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
import calculateCentile from '../brains/calculateCentile';
import ageChecker from '../brains/ageChecker';
import calculateFluid from '../brains/calculateFluid';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import SexInputButton from '../components/buttons/input/SexInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AppForm from '../components/AppForm';
import routes from '../navigation/routes';
import {GlobalStateContext} from '../components/GlobalStateContext';

import FormSubmitButton from '../components/buttons/FormSubmitButton';
import zeit from '../brains/zeit';

const FluidCalculatorScreen = () => {
  const navigation = useNavigation();

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const [showGestation, setShowGestation] = useState(false);

  const formikRef = useRef(null);

  const moveDataAcrossGlobal = (movingTo, values) => {
    setGlobalStats((globalStats) => {
      const child = {...globalStats.child};
      const neonate = {...globalStats.neonate};
      for (const [key, value] of Object.entries(values)) {
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
      return {child, neonate};
    });
  };

  const oneMeasurementNeeded = "↑ We'll need this measurement too";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const validationSchema = Yup.object().shape({
    weight: Yup.number()
      .min(0.1, wrongUnitsMessage('kg'))
      .max(250, wrongUnitsMessage('kg'))
      .required(oneMeasurementNeeded),
    percentage: Yup.number()
      .min(50, 'Minimum calculator correction = 50% of normal')
      .max(150, 'Maximum calculator correction = 150% of normal')
      .required(oneMeasurementNeeded),
    sex: Yup.string().required('↑ Please select a sex').label('Sex'),
    dob: Yup.date()
      .nullable()
      .required('↑ Please enter a date of Birth')
      .label('Date of Birth'),
  });

  const initialValues = {
    weight: '',
    sex: '',
    gestationInDays: 280,
    dob: null,
    tob: null,
    percentage: '100',
    dom: null,
  };

  const handleFormikSubmit = (values) => {
    const {gestationInDays} = values;
    const correctedGestation =
      gestationInDays + zeit(values.dob, 'days', values.dom);
    const centileObject = calculateCentile(values);
    const ageCheck = ageChecker(values, 6575, 28);
    switch (true) {
      case ageCheck === 'Negative age':
        Alert.alert(
          'Time Travelling Patient',
          'Please check the dates entered',
          [{text: 'OK', onPress: () => null}],
          {cancelable: false},
        );
        break;
      case ageCheck === 'Over 18':
        Alert.alert(
          'Patient Too Old',
          'This calculator can only be used under 18 years of age',
          {text: 'OK', onPress: () => null},
          {cancelable: false},
        );
        break;
      case (gestationInDays < 259 && correctedGestation < 295) ||
        ageCheck === 'Too young':
        Alert.alert(
          'Neonatal Patient',
          'This calculator can only be used for non-neonatal fluid calculations. Do you want to be taken to the correct calculator?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                moveDataAcrossGlobal('neonate', values);
                navigation.navigate('RootN', {screen: routes.NEONATE_FLUID});
              },
            },
          ],
        );
        break;
      default:
        const measurements = values;
        const results = calculateFluid(
          values.weight,
          values.percentage,
          values.sex,
        );
        const serialisedObject = JSON.stringify({
          results,
          centileObject,
          measurements,
        });
        navigation.navigate(routes.FLUID_RESULTS, serialisedObject);
    }
  };

  const dob = globalStats.child.dob;
  const dom = formikRef.current ? formikRef.current.values.dom : null;
  let resetValues = true;
  if (formikRef.current) {
    if (formikRef.current.values !== formikRef.current.initialValues) {
      resetValues = false;
    }
  }

  useEffect(() => {
    if (dob) {
      const ageInDays = zeit(dob, 'days', dom);
      if (ageInDays >= 0 && ageInDays < 848) {
        setShowGestation(true);
      } else {
        setShowGestation(false);
      }
    } else if (resetValues || !dob) {
      setShowGestation(false);
    }
  }, [dob, dom, resetValues]);

  return (
    <PCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            innerRef={formikRef}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <DateTimeInputButton kind="child" type="birth" />
            {showGestation && (
              <GestationInputButton name="gestationInDays" kind="child" />
            )}
            <SexInputButton name="sex" kind="child" />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="child"
            />
            <NumberInputButton
              name="percentage"
              defaultValue="100"
              global={false}
              userLabel="Correction Factor"
              iconName="triangle-outline"
              unitsOfMeasurement="%"
              kind="child"
            />
            <FormResetButton />
            <FormSubmitButton name="Calculate IV fluid rate" kind="child" />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default FluidCalculatorScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    paddingLeft: 50,
    marginTop: 20,
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
