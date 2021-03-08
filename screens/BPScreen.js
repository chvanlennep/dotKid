import React, {useContext, useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import SexInputButton from '../components/buttons/input/SexInputButton';
import AppForm from '../components/AppForm';
import calculateCentile from '../brains/newCalculateCentile';
import calculateBP from '../brains/calculateBP';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormResetButton from '../components/buttons/FormResetButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import routes from '../navigation/routes';
import Zeit from '../brains/Zeit';
import ageChecker from '../brains/ageChecker';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import {GlobalStatsContext} from '../components/GlobalStats';
import useAgeEffect from '../brains/useAgeEffect';
import {handleOldValues} from '../brains/oddBits';

const oneMeasurementNeeded = "↑ We'll need this measurement too";

const wrongUnitsMessage = (units) => {
  return `↑ Are you sure your input is in ${units}?`;
};

const validationSchema = Yup.object().shape({
  height: Yup.number()
    .min(30, wrongUnitsMessage('cm'))
    .max(220, wrongUnitsMessage('cm'))
    .required(oneMeasurementNeeded),
  systolic: Yup.number()
    .min(30, wrongUnitsMessage('mmHg'))
    .max(250, wrongUnitsMessage('mmHg'))
    .required(oneMeasurementNeeded),
  diastolic: Yup.number()
    .min(10, wrongUnitsMessage('mmHg'))
    .max(180, wrongUnitsMessage('mmHg'))
    .when('systolic', {
      is: (systolic) => !systolic,
      then: Yup.number()
        .label('Diastolic')
        .min(10, wrongUnitsMessage('mmHg'))
        .max(180, wrongUnitsMessage('mmHg'))
        .required(oneMeasurementNeeded),
    }),
  sex: Yup.string().required('↑ Please select a sex').label('Sex'),
  dob: Yup.date()
    .nullable()
    .required('↑ Please enter a date of Birth')
    .label('Date of Birth'),
});

const initialValues = {
  height: '',
  sex: '',
  gestationInDays: 280,
  dob: null,
  systolic: '',
  diastolic: '',
  dom: null,
};

const BPScreen = () => {
  const navigation = useNavigation();
  const {globalStats, setGlobalStats} = useContext(GlobalStatsContext);

  const formikRef = useRef(null);

  const [showGestation, setShowGestation] = useState(false);

  const handleFormikSubmit = (values) => {
    const correctDays =
      values.gestationInDays < 224 ? 280 - values.gestationInDays : 0;
    const ageCheck = ageChecker(values, 6574, 365 - correctDays);
    switch (true) {
      case ageCheck === 'Negative age':
        Alert.alert(
          'Time Travelling Patient',
          'Please check the dates entered',
          [{text: 'OK', onPress: () => null}],
          {cancelable: false},
        );
        break;
      case ageCheck === 'Too old':
        Alert.alert(
          'Patient Too Old',
          'This calculator can only be used under 18 years of age',
          {text: 'OK', onPress: () => null},

          {cancelable: false},
        );
        break;
      case ageCheck === 'Too young':
        Alert.alert(
          'This calculator only supports children from 1 year of age',
          '',
          [
            {
              text: 'OK',
              onPress: () => null,
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
        break;
      default:
        const submitFunction = () => {
          const centileObject = calculateCentile(values);
          let centileString = centileObject.centiles.height[1];
          if (centileString.length > 10) {
            centileString = centileObject.centiles.height[0];
          }
          const ageObject = new Zeit(
            values.dob,
            values.dom,
            values.gestationInDays,
          );
          const age = ageObject.calculate('years');
          const measurements = values;
          const heightCentile = Math.round(
            centileString.replace(/[^0-9.]/g, ''),
          );
          const BPOutput = calculateBP(
            heightCentile,
            age,
            values.systolic,
            values.diastolic,
            values.sex,
          );
          const serialisedObject = JSON.stringify({
            BPOutput,
            centileObject,
            measurements,
          });
          navigation.navigate(routes.BLOOD_PRESSURE_RESULTS, serialisedObject);
        };
        handleOldValues(
          submitFunction,
          'child',
          setGlobalStats,
          globalStats.child,
          initialValues,
        );
    }
  };

  const dob = globalStats.child.dob;
  const dom = globalStats.child.dom;
  useAgeEffect(dob, dom, formikRef, setShowGestation);

  return (
    <PCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            innerRef={formikRef}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <DateTimeInputButton kind="child" type="birth" renderTime={false} />
            {showGestation && (
              <GestationInputButton name="gestationInDays" kind="child" />
            )}
            <SexInputButton name="sex" kind="child" />
            <NumberInputButton
              name="height"
              userLabel="Height / Length"
              iconName="arrow-up-down"
              unitsOfMeasurement="cm"
              kind="child"
            />
            <NumberInputButton
              name="systolic"
              userLabel="Systolic"
              iconName="chevron-double-up"
              unitsOfMeasurement="mmHg"
              kind="child"
            />
            <NumberInputButton
              name="diastolic"
              userLabel="Diastolic"
              iconName="chevron-double-down"
              unitsOfMeasurement="mmHg"
              kind="child"
            />
            <DateTimeInputButton kind="child" type="measured" />
            <FormResetButton kind="child" initialValues={initialValues} />
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

export default BPScreen;

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
    color: colors.white,
    fontSize: 17,
  },
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
