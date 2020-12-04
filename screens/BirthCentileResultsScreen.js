import React from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import NCalcScreen from '../components/NCalcScreen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import MoreCentileInfo from '../components/buttons/MoreCentileInfo';
import CentileChartModal from '../components/CentileChartModal';

const flexDirection = defaultStyles.container.width > 500 ? 'row' : 'column';

const BirthCentileResultsScreen = ({route, navigation}) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  const results = parameters.results;

  const birthGestationInDays = results.birthGestationInDays;

  const [weight, exactWeight] = results.centiles.weight;
  const [length, exactLength] = results.centiles.length;
  const [hc, exactHc] = results.centiles.hc;

  let weightTitle = 'Weight:';
  if (measurements.weight) weightTitle = `Weight (${measurements.weight}g):`;
  let lengthTitle = 'Length:';
  if (measurements.length) lengthTitle = `Length (${measurements.length}cm):`;
  let hcTitle = 'Head Circumference:';
  if (measurements.hc) hcTitle = `Head Circumference (${measurements.hc}cm):`;

  return (
    <NCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton kind="birth" valueBeforeCorrection={birthGestationInDays} />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{backgroundColor: colors.light}}
          textStyle={{color: colors.black}}
        />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{weightTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{weight}</AppText>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <MoreCentileInfo exactCentile={exactWeight} />
              <CentileChartModal
                measurementType="weight"
                measurement={parameters.measurements.weight / 1000}
                kind="birth"
                gestationInDays={birthGestationInDays}
                sex={parameters.measurements.sex}
              />
            </View>
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{lengthTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{length}</AppText>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <MoreCentileInfo exactCentile={exactLength} />
              <CentileChartModal
                measurementType="length"
                measurement={parameters.measurements.length}
                kind="birth"
                gestationInDays={birthGestationInDays}
                sex={parameters.measurements.sex}
              />
            </View>
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{hcTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{hc}</AppText>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <MoreCentileInfo exactCentile={exactHc} />
              <CentileChartModal
                measurementType="hc"
                measurement={parameters.measurements.hc}
                kind="birth"
                gestationInDays={birthGestationInDays}
                sex={parameters.measurements.sex}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default BirthCentileResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    //backgroundColor: 'dodgerblue',
    paddingHorizontal: 10,
    width: '100%',
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    //backgroundColor: 'white',
    flexDirection: flexDirection,
    flex: 2,
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
  text: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
  },
});
