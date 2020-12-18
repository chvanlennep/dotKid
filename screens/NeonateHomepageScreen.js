import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import NCalcScreen from '../components/NCalcScreen';
import AppText from '../components/AppText';
import routes from '../navigation/routes';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import SexInputButton from '../components/buttons/input/SexInputButton';
import NavigateButton from '../components/buttons/NavigateButton';
import AppForm from '../components/AppForm';

import defaultStyles from '../config/styles';

const NeonateHomepageScreen = () => {
  const initialValues = {
    length: '',
    weight: '',
    hc: '',
    sex: '',
    gestationInDays: 0,
    dob: null,
    dom: null,
    correction: '100',
    sbr: '',
  };

  return (
    <NCalcScreen isHomePage={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AppForm
          // dummy AppForm so useFormikContext line in components doesn't throw error here:
          initialValues={initialValues}>
          <DateTimeInputButton kind="neonate" type="birth" />
          <GestationInputButton kind="neonate" />
          <SexInputButton kind="neonate" />
        </AppForm>
      </View>
      <AppText style={styles.text}>Neonatal Calculators</AppText>
      <View style={styles.bottomContainer}>
        <ScrollView>
          <NavigateButton directions={routes.CGA}>
            Corrected Gestation Calculator
          </NavigateButton>
          <NavigateButton directions={routes.BIRTH_CENTILE}>
            Birth Centile Calculator
          </NavigateButton>
          <NavigateButton directions={routes.NEONATE_CENTILE}>
            Preterm Centile Calculator
          </NavigateButton>
          <NavigateButton directions={routes.NEONATE_FLUID}>
            Fluid Requirement Calculator
          </NavigateButton>
          <NavigateButton directions={routes.JAUNDICE}>
            Jaundice Calculator
          </NavigateButton>
        </ScrollView>
      </View>
    </NCalcScreen>
  );
};

export default NeonateHomepageScreen;

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
