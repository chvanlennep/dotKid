import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AppForm from '../components/AppForm';
import routes from '../navigation/routes';
import BodySurfaceArea from '../brains/BodySurfaceArea';
import {handleOldValues} from '../brains/oddBits';
import {GlobalStatsContext} from '../components/GlobalStats';

const BSAScreen = () => {
  const navigation = useNavigation();

  const oneMeasurementNeeded = "↑ We'll need this measurement too";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const {globalStats, setGlobalStats} = useContext(GlobalStatsContext);

  const validationSchema = Yup.object().shape({
    height: Yup.number()
      .min(30, wrongUnitsMessage('cm'))
      .max(220, wrongUnitsMessage('cm'))
      .required(oneMeasurementNeeded),
    weight: Yup.number()
      .min(0.1, wrongUnitsMessage('kg'))
      .max(250, wrongUnitsMessage('kg'))
      .required(oneMeasurementNeeded),
  });

  const initialValues = {
    height: '',
    weight: '',
  };

  const handleFormikSubmit = (values) => {
    const submitFunction = () => {
      const measurements = values;
      const output = BodySurfaceArea(values.height, values.weight);
      const serialisedObject = JSON.stringify({
        output,
        measurements,
      });
      navigation.navigate(routes.BSA_RESULTS, serialisedObject);
    };
    handleOldValues(
      submitFunction,
      'child',
      setGlobalStats,
      globalStats.child,
      initialValues,
    );
  };

  return (
    <PCalcScreen style={{flex: 1}}>
      <ScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <NumberInputButton
              name="height"
              userLabel="Height / Length"
              iconName="arrow-up-down"
              unitsOfMeasurement="cm"
              kind="child"
            />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="child"
            />
            <FormResetButton kind="child" initialValues={initialValues} />
            <FormSubmitButton name="Calculate Body Surface Area" kind="child" />
          </AppForm>
        </View>
      </ScrollView>
    </PCalcScreen>
  );
};

export default BSAScreen;

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
