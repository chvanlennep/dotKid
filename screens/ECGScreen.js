import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
import DobInputButton from '../components/buttons/input/DobInputButton';
import AppForm from '../components/AppForm';
import zeit from '../brains/zeit';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormResetButton from '../components/buttons/FormResetButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import routes from '../navigation/routes';
import calculateQTC from '../brains/calculateQTC';
import ageChecker from '../brains/ageChecker';
import calculateCentile from '../brains/calculateCentile';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';

const ECGScreen = () => {
  const navigation = useNavigation();

  const oneMeasurementNeeded = "↑ We'll need this measurement too";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const validationSchema = Yup.object().shape({
    dob: Yup.date()
      .nullable()
      .required('↑ Please enter a date of Birth')
      .label('Date of Birth'),
    qtinterval: Yup.number()
      .min(0.6, wrongUnitsMessage('seconds'))
      .max(20, wrongUnitsMessage('seconds'))
      .label('QT Interval')
      .required(oneMeasurementNeeded),
    rrinterval: Yup.number()
      .min(0.01, wrongUnitsMessage('seconds'))
      .max(3, wrongUnitsMessage('seconds'))
      .label('R-R Interval')
      .required(oneMeasurementNeeded),
  });

  const initialValues = {
    rrinterval: '',
    qtinterval: '',
    gestationInDays: 280,
    dob: null,
    tob: null,
    dom: new Date(new Date().getTime() + 10 * 60000),
    domChanged: false,
  };

  const handleFormikSubmit = (values) => {
    const age = zeit(values.dob, 'months', values.dom, true, correctDays);
    const ageCheck = ageChecker(values);
    const centileObject = calculateCentile(values);

    let correctDays = 0;
    switch (true) {
      case ageCheck === 'Negative age':
        Alert.alert(
          'Time Travelling Patient',
          'Please check the dates entered',
          [{ text: 'OK' }],
          { cancelable: false }
        );
        break;
      case ageCheck === 'Too old':
        Alert.alert(
          'Patient Too Old',
          'This calculator can only be used under 18 years of age',
          { text: 'OK' },
          { cancelable: false }
        );
        break;
      default:
        const measurements = values;
        const QTCOutput = calculateQTC(
          age,
          values.qtinterval,
          values.rrinterval
        );
        const serialisedObject = JSON.stringify({
          QTCOutput,
          centileObject,
          measurements,
        });
        navigation.navigate(routes.ECG_RESULTS, serialisedObject);
    }
  };

  return (
    <PCalcScreen>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}
          >
            <DateTimeInputButton kind="child" type="birth" />
            <DobInputButton name="dob" kind="child" />
            <NumberInputButton
              name="qtinterval"
              userLabel="QT Interval"
              iconName="heart-flash"
              unitsOfMeasurement=" seconds"
              kind="child"
            />
            <NumberInputButton
              name="rrinterval"
              userLabel="R-R Interval"
              iconName="heart-pulse"
              unitsOfMeasurement=" seconds"
              kind="child"
            />
            <DateTimeInputButton kind="child" type="measured" />
            <FormResetButton />
            <FormSubmitButton
              name="Calculate Blood Pressure Centiles"
              kind="child"
            />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default ECGScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    paddingHorizontal: 50,
    marginTop: 20,
    width: '100%',
    marginBottom: 75,
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
    width: 250,
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
