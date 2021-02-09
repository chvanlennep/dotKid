import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import AppForm from '../components/AppForm';
import colors from '../config/colors';
import NCalcScreen from '../components/NCalcScreen';
import SexInputButton from '../components/buttons/input/SexInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import routes from '../navigation/routes';
import calculateCentile from '../brains/calculateCentile';
import {handleOldValues} from '../brains/oddBits';
import {GlobalStatsContext} from '../components/GlobalStats';

const oneMeasurementNeeded = "↑ We'll at least one of these measurements";
const wrongUnitsMessage = (units) => {
  return `↑ Are you sure this is a neonatal measurement (in ${units})?`;
};

const validationSchema = Yup.object().shape(
  {
    length: Yup.number()
      .min(30, wrongUnitsMessage('cm'))
      .max(70, wrongUnitsMessage('cm'))
      .when(['weight', 'hc'], {
        is: (weight, hc) => !weight && !hc,
        then: Yup.number()
          .label('length')
          .min(30, wrongUnitsMessage('cm'))
          .max(70, wrongUnitsMessage('cm'))
          .required(oneMeasurementNeeded),
      }),
    weight: Yup.number()
      .min(0.1, wrongUnitsMessage('kg'))
      .max(8, wrongUnitsMessage('kg'))
      .when(['length', 'hc'], {
        is: (length, hc) => !length && !hc,
        then: Yup.number()
          .label('Weight')
          .min(0.1, wrongUnitsMessage('kg'))
          .max(8, wrongUnitsMessage('kg'))
          .required(oneMeasurementNeeded),
      }),
    hc: Yup.number()
      .min(10, wrongUnitsMessage('cm'))
      .max(100, wrongUnitsMessage('cm'))
      .when(['length', 'weight'], {
        is: (length, weight) => !length && !weight,
        then: Yup.number()
          .label('Head Circumference')
          .min(10, wrongUnitsMessage('cm'))
          .max(100, wrongUnitsMessage('cm'))
          .required(oneMeasurementNeeded),
      }),
    sex: Yup.string().required('↑ Please select a sex').label('Sex'),
    gestationInDays: Yup.number()
      .min(161, '↑ Please select a birth gestation')
      .required()
      .label('Birth Gestation'),
  },
  [
    ['length', 'weight'],
    ['length', 'hc'],
    ['weight', 'hc'],
  ],
);

const initialValues = {
  length: '',
  weight: '',
  hc: '',
  sex: '',
  gestationInDays: 0,
  dob: new Date(1989, 0, 16),
  dom: new Date(1989, 0, 16),
};

const valuesForTimeStamp = {
  length: null,
  weight: null,
  hc: null,
  sex: null,
  gestationInDays: null,
};

const BirthCentileScreen = () => {
  const navigation = useNavigation();

  const {globalStats, setGlobalStats} = useContext(GlobalStatsContext);

  const handleFormikSubmit = (values) => {
    const submitFunction = () => {
      const results = calculateCentile(values);
      const measurements = values;
      const serialisedObject = JSON.stringify({measurements, results});
      navigation.navigate(routes.BIRTH_CENTILE_RESULTS, serialisedObject);
    };
    handleOldValues(
      submitFunction,
      'neonate',
      setGlobalStats,
      globalStats.neonate,
      valuesForTimeStamp,
    );
  };

  return (
    <NCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <GestationInputButton name="gestationInDays" kind="neonate" />
            <SexInputButton name="sex" kind="neonate" />
            <NumberInputButton
              name="weight"
              userLabel="Birth Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="neonate"
            />
            <NumberInputButton
              name="length"
              userLabel="Birth Length"
              iconName="arrow-up-down"
              unitsOfMeasurement="cm"
              kind="neonate"
            />
            <NumberInputButton
              name="hc"
              userLabel="Birth Head Circumference"
              iconName="emoticon-outline"
              unitsOfMeasurement="cm"
              kind="neonate"
            />
            <FormResetButton
              kind="neonate"
              initialValues={valuesForTimeStamp}
            />
            <FormSubmitButton name="Calculate Birth Centiles" kind="neonate" />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default BirthCentileScreen;

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
