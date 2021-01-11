import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import PCalcScreen from '../components/PCalcScreen';
import AppText from '../components/AppText';
import routes from '../navigation/routes';
import SexInputButton from '../components/buttons/input/SexInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import NavigateButton from '../components/buttons/NavigateButton';
import AppForm from '../components/AppForm';

import defaultStyles from '../config/styles';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';

const PaedsHomepageScreen = () => {
  const initialValues = {
    sex: '',
    gestationInDays: 280,
    dob: null,
  };
  return (
    <PCalcScreen isHomePage={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AppForm
          // dummy AppForm so useFormikContext line in components doesn't throw error here:
          initialValues={initialValues}>
          <DateTimeInputButton kind="child" type="birth" />
          <GestationInputButton kind="child" />
          <SexInputButton kind="child" />
        </AppForm>
      </View>
      <AppText style={styles.text}>Paediatric Calculators</AppText>
      <View style={styles.bottomContainer}>
        <ScrollView>
          <NavigateButton directions={routes.AGE}>
            Age Calculator
          </NavigateButton>
          <NavigateButton directions={routes.BLOOD_PRESSURE}>
            Blood Pressure Calculator
          </NavigateButton>
          <NavigateButton directions={routes.BODY_SURFACE_AREA}>
            Body Surface Area Calculator
          </NavigateButton>
          <NavigateButton directions={routes.PAEDIATRIC_CENTILE}>
            Child Centile Calculator
          </NavigateButton>
          <NavigateButton directions={routes.ECG}>
            QTc Calculator
          </NavigateButton>
          <NavigateButton directions={routes.FLUID_CALCULATOR}>
            IV Fluid Calculator
          </NavigateButton>
          <NavigateButton directions={routes.WETFLAG}> WETFLAG </NavigateButton>
        </ScrollView>
      </View>
    </PCalcScreen>
  );
};

export default PaedsHomepageScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    flex: 1,
  },
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    ...defaultStyles.container,
  },
  text: {
    fontSize: defaultStyles.windowWidth < 375 ? 24 : 27,
    marginBottom: defaultStyles.windowHeight <= 812 ? 3 : 8,
    marginTop: defaultStyles.windowHeight <= 812 ? 0 : 5,
    marginLeft: 18,
  },
});
