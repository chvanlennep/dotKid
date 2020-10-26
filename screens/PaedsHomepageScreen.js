import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

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
  return (
    <PCalcScreen isHomePage={true} style={{ flex: 2 }}>
      <View style={styles.topContainer}>
        <AppForm
          // dummy AppForm so useFormikContext line in components doesn't throw error here:
          initialValues={{
            dob: null,
            tob: null,
            gestationInDays: null,
            sex: null,
          }}
        >
          <DateTimeInputButton global={true} kind="child" type="birth" />
          <GestationInputButton global={true} kind="child" />
          <SexInputButton global={true} kind="child" />
        </AppForm>
      </View>
      <AppText style={styles.text}> Paediatric </AppText>
      <View style={styles.bottomContainer}>
        <ScrollView>
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
            ECG Calculator
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
    fontSize: 28,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 12,
  },
});
