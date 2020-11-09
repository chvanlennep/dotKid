import React, { useContext } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import PCalcScreen from '../components/PCalcScreen';
import WETFLAG from '../brains/WETFLAG';
import colors from '../config/colors';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import SexInputButton from '../components/buttons/input/SexInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AppForm from '../components/AppForm';
import calculateCentile from '../brains/calculateCentile';
import routes from '../navigation/routes';
import { GlobalStateContext } from '../components/GlobalStateContext';
import ageChecker from '../brains/ageChecker';

const WETFLAGScreen = () => {
  const navigation = useNavigation();

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const oneMeasurementNeeded = "↑ We'll need this measurement";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const validationSchema = Yup.object().shape({
    dob: Yup.date()
      .nullable()
      .required('↑ Please enter a date of Birth')
      .label('Date of Birth'),
    sex: Yup.string().required('↑ Please select a sex').label('Sex'),
  });

  const initialValues = {
    dob: null,
    sex: '',
    weight: '',
    dom: null,
  };

  const handleFormikSubmit = (values) => {
    const checkAge = ageChecker(values);
    const centileObject = calculateCentile(values);
    switch (checkAge) {
      case 'Negative age':
        Alert.alert(
          'Time Travelling Patient',
          'Please check the dates entered',
          [{ text: 'OK', onPress: () => null }],
          { cancelable: false }
        );
        break;
      case 'Too old':
        Alert.alert(
          'Patient Too Old',
          'This calculator can only be used under 18 years of age',
          [{ text: 'OK', onPress: () => null }],
          { cancelable: false }
        );
        break;
      default:
        const centileObject = calculateCentile(values);
        const measurements = values;
        const output = WETFLAG(
          values.dob,
          values.dom,
          values.sex,
          values.weight
        );
        const serialisedObject = JSON.stringify({
          output,
          centileObject,
          measurements,
        });

        navigation.navigate(routes.WETFLAG_RESULTS, serialisedObject);
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
            <SexInputButton name="sex" kind="child" />
            <NumberInputButton
              name="weight"
              userLabel="Weight (optional)"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="child"
            />

            <FormResetButton />
            <FormSubmitButton name="Calculate WETFLAG Values" kind="child" />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default WETFLAGScreen;

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
