import React, { useContext } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import SexInputButton from '../components/buttons/input/SexInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AppForm from '../components/AppForm';
import calculateCentile from '../brains/calculateCentile';
import routes from '../navigation/routes';
import { GlobalStateContext } from '../components/GlobalStateContext';
import ageChecker from '../brains/ageChecker';

const PCentileScreen = () => {
  const navigation = useNavigation();

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const oneMeasurementNeeded = "↑ We'll at least one of these measurements";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const validationSchema = Yup.object().shape(
    {
      height: Yup.number()
        .min(30, wrongUnitsMessage('cm'))
        .max(220, wrongUnitsMessage('cm'))
        .when(['weight', 'hc'], {
          is: (weight, hc) => !weight && !hc,
          then: Yup.number()
            .label('Height')
            .min(30, wrongUnitsMessage('cm'))
            .max(220, wrongUnitsMessage('cm'))
            .required(oneMeasurementNeeded),
        }),
      weight: Yup.number()
        .min(0.1, wrongUnitsMessage('kg'))
        .max(250, wrongUnitsMessage('kg'))
        .when(['height', 'hc'], {
          is: (height, hc) => !height && !hc,
          then: Yup.number()
            .label('Weight')
            .min(0.1, wrongUnitsMessage('kg'))
            .max(250, wrongUnitsMessage('kg'))
            .required(oneMeasurementNeeded),
        }),
      hc: Yup.number()
        .min(10, wrongUnitsMessage('cm'))
        .max(100, wrongUnitsMessage('cm'))
        .when(['height', 'weight'], {
          is: (height, weight) => !height && !weight,
          then: Yup.number()
            .label('Head Circumference')
            .min(10, wrongUnitsMessage('cm'))
            .max(100, wrongUnitsMessage('cm'))
            .required(oneMeasurementNeeded),
        }),
      sex: Yup.string().required('↑ Please select a sex').label('Sex'),
      dob: Yup.date()
        .nullable()
        .required('↑ Please enter a date of Birth')
        .label('Date of Birth'),
    },
    [
      ['height', 'weight'],
      ['height', 'hc'],
      ['weight', 'hc'],
    ]
  );

  const initialValues = {
    height: '',
    weight: '',
    hc: '',
    sex: '',
    gestationInDays: 280,
    dob: null,
    tob: null,
    dom: new Date(new Date().getTime() + 10 * 60000),
    tom: new Date(new Date().getTime() + 10 * 60000),
    domChanged: false,
  };

  const moveDataAcrossGlobal = (movingTo, values) => {
    setGlobalStats((globalStats) => {
      const child = { ...globalStats.child };
      const neonate = { ...globalStats.neonate };
      for (const [key, value] of Object.entries(values)) {
        if (key !== 'dom' || key !== 'domChanged') {
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

  const handleFormikSubmit = (values) => {
    const results = calculateCentile(values);
    const ageCheck = ageChecker(values);
    switch (true) {
      case results.kind === 'child' && results.lessThan14:
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
                  routes.PAEDIATRIC_CENTILE_RESULTS,
                  serialisedObject
                );
              },
            },
          ],
          { cancelable: false }
        );
        break;
      case results.kind === 'child':
        const measurements = values;
        const serialisedObject = JSON.stringify({ measurements, results });
        navigation.navigate(
          routes.PAEDIATRIC_CENTILE_RESULTS,
          serialisedObject
        );
        break;
      case ageCheck === 'Negative age':
        Alert.alert(
          'Time Travelling Patient',
          'Please check the dates entered',
          [{ text: 'OK', onPress: () => null }]
        );
        break;
      case ageCheck === 'Too old':
        Alert.alert(
          'Patient Too Old',
          'This calculator can only be used under 18 years of age',
          [{ text: 'OK', onPress: () => null }]
        );
        break;
      case results.kind === 'birth':
        Alert.alert(
          'Birth Centile Measurements Entered',
          'Do you want to be taken to the correct calculator? Your measurements will be copied across.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                moveDataAcrossGlobal('neonate', values);
                navigation.navigate(routes.BIRTH_CENTILE);
              },
            },
          ],
          { cancelable: false }
        );
        break;
      case results.kind === 'neonate':
        Alert.alert(
          'Preterm Centile Measurements Entered',
          'Do you want to be taken to the correct calculator? Your measurements will be copied across.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                moveDataAcrossGlobal('neonate', values);
                navigation.navigate(routes.NEONATE_CENTILE);
              },
            },
          ],
          { cancelable: false }
        );
        break;
      default:
        console.log(['Error', results]);
    }
  };

  return (
    <PCalcScreen style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}
          >
            <DateTimeInputButton kind="child" type="birth" />
            <GestationInputButton name="gestationInDays" kind="child" />
            <SexInputButton name="sex" kind="child" />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="child"
            />
            <NumberInputButton
              name="height"
              userLabel="Height / Length"
              iconName="arrow-up-down"
              unitsOfMeasurement="cm"
              kind="child"
            />
            <NumberInputButton
              name="hc"
              userLabel="Head Circumference"
              iconName="emoticon-outline"
              unitsOfMeasurement="cm"
              kind="child"
            />
            <DateTimeInputButton kind="child" type="measured" />
            <FormResetButton />
            <FormSubmitButton name="Calculate Child Centiles" kind="child" />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
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
