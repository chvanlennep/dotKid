import React, {useContext} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import AppForm from '../components/AppForm';
import colors from '../config/colors';
import NCalcScreen from '../components/NCalcScreen';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import SexInputButton from '../components/buttons/input/SexInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import routes from '../navigation/routes';
import {GlobalStateContext} from '../components/GlobalStateContext';
import calculateCentile from '../brains/calculateCentile';
import ageChecker from '../brains/ageChecker';

const PCentileScreen = () => {
  const navigation = useNavigation();
  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const oneMeasurementNeeded =
    "↑ We'll need at least one of these measurements";
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
        .min(100, wrongUnitsMessage('g'))
        .max(8000, wrongUnitsMessage('g'))
        .when(['length', 'hc'], {
          is: (length, hc) => !length && !hc,
          then: Yup.number()
            .label('Weight')
            .min(100, wrongUnitsMessage('g'))
            .max(8000, wrongUnitsMessage('g'))
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
      dob: Yup.date()
        .nullable()
        .required('↑ Please enter a date of birth')
        .label('Date of Birth'),
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
    dob: null,
    tob: null,
    dom: null,
    tom: null,
  };

  const moveDataAcrossGlobal = (movingTo, values) => {
    setGlobalStats((globalStats) => {
      const child = {...globalStats.child};
      const neonate = {...globalStats.neonate};
      for (const [key, value] of Object.entries(values)) {
        if (key !== 'domChanged') {
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
      return {child, neonate};
    });
  };

  const handleFormikSubmit = (values) => {
    const ageCheck = ageChecker(values);
    if (ageCheck === 'Negative age') {
      Alert.alert('Time Travelling Patient', 'Please check the dates entered', [
        {text: 'OK', onPress: () => null},
      ]);
    } else if (ageCheck === 'Too old') {
      Alert.alert(
        'Patient Too Old',
        'This calculator can only be used under 18 years of age',
        [{text: 'OK', onPress: () => null}],
      );
    } else {
      const results = calculateCentile(values);
      if (results.kind === 'birth') {
        Alert.alert(
          'Birth Centile Measurements Entered',
          'Do you want to be taken to the correct calculator?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate(routes.BIRTH_CENTILE);
              },
            },
          ],
          {cancelable: false},
        );
      } else if (results.kind === 'child') {
        Alert.alert(
          'Child Measurements Entered',
          'This calculator is for premature infants until 42 weeks corrected gestation.\n Do you want to be taken to the correct calculator with your current measurements?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                moveDataAcrossGlobal('child', values);
                navigation.navigate('RootPaed', {screen: 'PCentile'});
              },
            },
          ],
          {cancelable: false},
        );
      } else if (results.kind === 'neonate' && results.lessThan14) {
        Alert.alert(
          'Infant Less Than 2 Weeks Old',
          'Centile measurements in infants less than 2 weeks of age can be difficult to interpret. Are you sure you want to continue?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                const measurements = values;
                const serialisedObject = JSON.stringify({
                  measurements,
                  results,
                });
                navigation.navigate(
                  routes.NEONATE_CENTILE_RESULTS,
                  serialisedObject,
                );
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        const measurements = values;
        const serialisedObject = JSON.stringify({measurements, results});
        navigation.navigate(routes.NEONATE_CENTILE_RESULTS, serialisedObject);
      }
    }
  };

  return (
    <NCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <DateTimeInputButton kind="neonate" type="birth" />
            <GestationInputButton kind="neonate" />
            <SexInputButton kind="neonate" />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="g"
              kind="neonate"
            />
            <NumberInputButton
              name="length"
              userLabel="Length"
              iconName="arrow-up-down"
              unitsOfMeasurement="cm"
              kind="neonate"
            />
            <NumberInputButton
              name="hc"
              userLabel="Head Circumference"
              iconName="emoticon-outline"
              unitsOfMeasurement="cm"
              kind="neonate"
            />
            <DateTimeInputButton kind="neonate" type="measured" />
            <FormResetButton />
            <FormSubmitButton
              name="Calculate Preterm Centiles"
              kind="neonate"
            />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default PCentileScreen;

const styles = StyleSheet.create({
  buttons: {
    //backgroundColor: "dodgerblue",
    flexDirection: 'row',
    width: 96,
    justifyContent: 'space-between',
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
