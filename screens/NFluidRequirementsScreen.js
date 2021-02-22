import React, {useContext, useState, useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import AppForm from '../components/AppForm';
import colors from '../config/colors';
import NCalcScreen from '../components/NCalcScreen';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import routes from '../navigation/routes';
import NFluidInputButton from '../components/buttons/NFluidInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import ageChecker from '../brains/ageChecker';
import nFluidCalculator from '../brains/nFluidCalculator';
import {GlobalStatsContext} from '../components/GlobalStats';
import zeit from '../brains/zeit';
import {readItemFromStorage} from '../brains/storage';
import {handleOldValues} from '../brains/oddBits';

const checkCorrection = '↑ Please check this value';
const measurementNeeded = "↑ We'll need a weight to calculate";
const wrongUnitsMessage = (units) => {
  return `↑ Are you sure this is a neonatal measurement (in ${units})?`;
};

const validationSchema = Yup.object().shape({
  correction: Yup.number().min(30, checkCorrection).max(200, checkCorrection),
  dob: Yup.date()
    .nullable()
    .required('↑ Please enter a date and time of birth')
    .label('Date of Birth'),
  weight: Yup.number()
    .min(0.1, wrongUnitsMessage('kg'))
    .max(8, wrongUnitsMessage('kg'))
    .required(measurementNeeded),
  gestationInDays: Yup.number()
    .min(161, '↑ Please select a birth gestation')
    .required()
    .label('Birth Gestation'),
});

const initialValues = {
  correction: '100',
  weight: '',
  gestationInDays: 0,
  dob: null,
  dom: null,
};

const defaults = {
  day1: '60',
  day2: '80',
  day3: '100',
  day4: '120',
  day5: '150',
};

const NFluidRequirementsScreen = () => {
  const navigation = useNavigation();

  const [termValues, setTermValues] = useState(defaults);
  const [pretermValues, setPretermValues] = useState(defaults);

  const {globalStats, moveDataAcrossGlobal, setGlobalStats} = useContext(
    GlobalStatsContext,
  );

  const handleFormikSubmit = (values) => {
    const {gestationInDays} = values;
    const correctedGestation =
      gestationInDays + zeit(values.dob, 'days', values.dom);
    const termEtc =
      correctedGestation < 280 && gestationInDays < 259 ? 'Preterm' : 'Term';
    const workingValues = termEtc === 'Term' ? termValues : pretermValues;
    const checkAge = ageChecker(values, 29);
    if (checkAge === 'Negative age') {
      Alert.alert('Time Travelling Patient', 'Please check the dates entered', [
        {text: 'OK', onPress: () => null},
      ]);
    } else if (
      (gestationInDays >= 259 && checkAge === 'Too old') ||
      (gestationInDays < 259 && correctedGestation > 294)
    ) {
      Alert.alert(
        'Patient Too Old',
        'This calculator can only be used in preterm infants or term infants until 28 days of age. Do you want to be taken to the correct calculator?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              moveDataAcrossGlobal('child', initialValues);
              navigation.navigate('RootPaed', {screen: 'FluidCalculator'});
            },
          },
        ],
      );
    } else {
      const submitFunction = () => {
        const results = nFluidCalculator(values, workingValues, termEtc);
        const serialisedObject = JSON.stringify(results);
        navigation.navigate(routes.NEONATE_FLUID_RESULTS, serialisedObject);
      };
      handleOldValues(
        submitFunction,
        'neonate',
        setGlobalStats,
        globalStats.neonate,
        initialValues,
      );
    }
  };

  useEffect(() => {
    readItemFromStorage('term_fluid_requirements', setTermValues, defaults);
    readItemFromStorage(
      'preterm_fluid_requirements',
      setPretermValues,
      defaults,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <DateTimeInputButton
              kind="neonate"
              type="birth"
              renderTime={true}
            />
            <GestationInputButton kind="neonate" />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="neonate"
            />
            <NumberInputButton
              name="correction"
              userLabel="Percentage of Normal"
              iconName="triangle-outline"
              unitsOfMeasurement="%"
              kind="neonate"
              defaultValue="100"
            />
            <NFluidInputButton
              termObject={[termValues, setTermValues]}
              pretermObject={[pretermValues, setPretermValues]}
            />
            <DateTimeInputButton
              kind="neonate"
              type="measured"
              renderTime={true}
            />
            <FormResetButton
              kind="neonate"
              initialValues={initialValues}
              additionalMessage="This will not reset any custom fluid requirements"
            />
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
