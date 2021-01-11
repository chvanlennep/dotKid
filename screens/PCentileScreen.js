import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
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
import {GlobalStatsContext} from '../components/GlobalStats';
import ageChecker from '../brains/ageChecker';
import useAgeEffect from '../brains/useAgeEffect';
import {handleOldValues} from '../brains/oddBits';

const PCentileScreen = () => {
  const navigation = useNavigation();

  const {globalStats, setGlobalStats, moveDataAcrossGlobal} = useContext(
    GlobalStatsContext,
  );

  const formikRef = useRef(null);

  const oneMeasurementNeeded =
    "↑ We'll need at least one of these measurements";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const [showGestation, setShowGestation] = useState(false);

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
        .required('↑ Please enter a date of birth')
        .label('Date of Birth'),
    },
    [
      ['height', 'weight'],
      ['height', 'hc'],
      ['weight', 'hc'],
    ],
  );

  const initialValues = {
    height: '',
    weight: '',
    hc: '',
    sex: '',
    gestationInDays: 280,
    dob: null,
    dom: null,
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
      const submitFunction = () => {
        const measurements = values;
        const serialisedObject = JSON.stringify({
          measurements,
          results,
        });
        navigation.navigate(
          routes.PAEDIATRIC_CENTILE_RESULTS,
          serialisedObject,
        );
      };
      switch (true) {
        case results.kind === 'birth':
          Alert.alert(
            'Birth Centile Measurements Entered',
            'Do you want to be taken to the correct calculator? Your measurements will be copied across.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => null,
              },
              {
                text: 'OK',
                onPress: () => {
                  moveDataAcrossGlobal('neonate', initialValues);
                  navigation.navigate('RootN', {screen: 'BirthCentile'});
                },
              },
            ],
            {cancelable: false},
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
                  moveDataAcrossGlobal('neonate', initialValues);
                  navigation.navigate('RootN', {screen: 'NCentile'});
                },
              },
            ],
            {cancelable: false},
          );
          break;
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
                  handleOldValues(
                    submitFunction,
                    'child',
                    setGlobalStats,
                    globalStats.child,
                    initialValues,
                  );
                },
              },
            ],
            {cancelable: false},
          );
          break;
        default:
          handleOldValues(
            submitFunction,
            'child',
            setGlobalStats,
            globalStats.child,
            initialValues,
          );
      }
    }
  };

  const dob = globalStats.child.dob;
  const dom = globalStats.child.dom;
  useAgeEffect(dob, dom, formikRef, setShowGestation);

  //console.log(globalStats.child.dom.value);

  return (
    <PCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            innerRef={formikRef}
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
            <FormResetButton kind="child" initialValues={initialValues} />
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
