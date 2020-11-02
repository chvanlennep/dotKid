import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import PCalcScreen from '../components/PCalcScreen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import Button from '../components/buttons/Button';

const BSAResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;

  const BSA = parameters.output;

  return (
    <PCalcScreen style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: colors.light }}
          textStyle={{ color: colors.black }}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.outputContainer}>
          <View style={styles.outputTextBox}>
            <View style={styles.title}>
              <AppText style={styles.text}>Body Surface Area:</AppText>
            </View>
            <View style={styles.output}>
              <AppText style={styles.outputText}>{output}m²</AppText>
            </View>
          </View>
        </View>
        <View style={styles.reference}>
          <AppText style={styles.referenceTitle}>
            Body surface area calculated according to the Mosteller formula:
          </AppText>
          <AppText style={styles.referenceOutput}>
            BSA = √((height (cm) x weight (kg)/3600))
          </AppText>
        </View>
      </View>
    </PCalcScreen>
  );
};
export default BSAResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    //backgroundColor: "dodgerblue",
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 75,
    height: '100%',
  },
  outputContainer: {
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 110,
    width: '100%',
  },
  outputTextBox: {
    paddingLeft: 20,
    paddingRight: 10,
    //backgroundColor: 'limegreen',
    textAlign: 'left',
    justifyContent: 'center',
    flex: 8,
  },
  outputText: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.white,
    flexWrap: 'wrap',
  },
  topContainer: {
    marginTop: 5,
  },
  reference: {
    marginBottom: 10,
    marginTop: 10,
    paddingTop: 0,
    paddingBottom: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.medium,
    width: '90%',
  },
  referenceTitle: {
    paddingTop: 15,
    paddingBottom: 5,
    color: colors.white,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
  referenceOutput: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 15,
    padding: 5,
  },
  text: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
  },
});
