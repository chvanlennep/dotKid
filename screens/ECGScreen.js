import React, {useContext, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
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
import {handleOldValues} from '../brains/oddBits';
import {GlobalStatsContext} from '../components/GlobalStats';
import UnitsSwitcher from '../components/buttons/UnitsSwitcher';

const oneMeasurementNeeded = "↑ We'll need this measurement too";
const wrongUnitsMessage = (units) => {
  return `↑ Are you sure this is in ${units}?`;
};

const initialValues = {
  rrinterval: '',
  qtinterval: '',
  gestationInDays: 280,
  dob: null,
  dom: null,
};

const ECGScreen = () => {
  const navigation = useNavigation();

  const {globalStats, setGlobalStats} = useContext(GlobalStatsContext);

  const [isMilliseconds, setIsMilliseconds] = useState(false);

  const units = isMilliseconds ? 'milliseconds' : 'small squares';

  const validationFactor = isMilliseconds ? 1 : 40;

  const validationSchema = Yup.object().shape({
    dob: Yup.date()
      .nullable()
      .required('↑ Please enter a date of Birth')
      .label('Date of Birth'),
    qtinterval: Yup.number()
      .min(100 / validationFactor, wrongUnitsMessage(units))
      .max(2000 / validationFactor, wrongUnitsMessage(units))
      .label('QT Interval')
      .required(oneMeasurementNeeded),
    rrinterval: Yup.number()
      .min(150 / validationFactor, wrongUnitsMessage(units))
      .max(3000 / validationFactor, wrongUnitsMessage(units))
      .label('R-R Interval')
      .required(oneMeasurementNeeded),
  });

  const handleFormikSubmit = (values) => {
    const dom = values.dom ? values.dom : new Date();
    const age = zeit(values.dob, 'months', dom, true, correctDays);
    const ageCheck = ageChecker(values);
    let correctDays = 0;
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
          [{text: 'OK', onPress: () => null}],
          {cancelable: false},
        );
        break;
      default:
        const submitFunction = () => {
          const qt = values.qtinterval / (isMilliseconds ? 1000 : 25);
          const rr = values.rrinterval / (isMilliseconds ? 1000 : 25);
          const centileObject = calculateCentile(values);
          const measurements = {
            ...values,
            ...{qtinterval: qt.toString(), rrinterval: rr.toString()},
          };
          const QTCOutput = calculateQTC(age, qt, rr);
          const serialisedObject = JSON.stringify({
            QTCOutput,
            centileObject,
            measurements,
          });
          navigation.navigate(routes.ECG_RESULTS, serialisedObject);
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

  return (
    <PCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <DateTimeInputButton kind="child" type="birth" />
            <NumberInputButton
              name="qtinterval"
              userLabel="QT Interval"
              iconName="heart-flash"
              unitsOfMeasurement={` ${units}`}
              kind="child"
            />
            <NumberInputButton
              name="rrinterval"
              userLabel="R-R Interval"
              iconName="heart-pulse"
              unitsOfMeasurement={` ${units}`}
              kind="child"
            />
            <DateTimeInputButton kind="child" type="measured" />
            <UnitsSwitcher
              isUnits={isMilliseconds}
              setIsUnits={setIsMilliseconds}
              falseUnits="Small Squares"
              trueUnits="Milliseconds"
            />
            <FormResetButton
              kind="child"
              initialValues={initialValues}
              setIsValue={setIsMilliseconds}
            />
            <FormSubmitButton name="Calculate QTc" kind="child" />
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
