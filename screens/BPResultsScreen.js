import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import PCalcScreen from '../components/PCalcScreen';
import AppText from '../components/AppText';
import defaultStyles from '../config/styles';
import colors from '../config/colors';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import MoreBPInfo from '../components/buttons/MoreBPInfo';
import MoreCentileInfo from '../components/buttons/MoreCentileInfo';
import CentileChartModal from '../components/CentileChartModal';

const flexDirection = defaultStyles.container.width > 500 ? 'row' : 'column';

const BPResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  const centileResults = parameters.centileObject;
  const BPResults = parameters.BPOutput;

  let systolicTitle;
  let diastolicTitle;

  const [height, exactHeight] = parameters.centileObject.centiles.height;
  const systolic = parameters.measurements.systolic;
  const exactSystolic = parameters.BPOutput.systolicOutput;
  const diastolic = parameters.measurements.diastolic;
  const exactDiastolic = parameters.BPOutput.diastolicOutput;
  const ageBeforeCorrection = parameters.centileObject.ageBeforeCorrection;
  const ageAfterCorrection = parameters.centileObject.ageAfterCorrection;
  const under2 = parameters.centileObject.under2;
  const systolicRef = parameters.BPOutput.systolicReferenceValues;
  const diastolicRef = parameters.BPOutput.diastolicReferenceValues;
  const monthAgeForChart = parameters.centileObject.monthAgeForChart;
  const dayAgeForChart = parameters.centileObject.dayAgeForChart;

  let heightTitle;
  let heightTitleAddition = '';
  if (measurements.height) {
    heightTitleAddition = ` (${measurements.height}cm)`;
  }
  under2
    ? (heightTitle = `Length${heightTitleAddition}:`)
    : (heightTitle = `Height${heightTitleAddition}:`);

  systolicTitle = `Systolic (${systolic}mmHg):`;
  !diastolic
    ? (diastolicTitle = 'Diastolic (n/a):')
    : (diastolicTitle = `Diastolic (${diastolic}mmHg):`);

  return (
    <PCalcScreen style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="child"
          valueBeforeCorrection={ageBeforeCorrection}
          valueAfterCorrection={ageAfterCorrection}
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: colors.light }}
          textStyle={{ color: colors.black }}
        />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{heightTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{height}</AppText>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <MoreCentileInfo exactCentile={exactHeight} />
              <CentileChartModal
                measurementType="height"
                measurement={parameters.measurements.height}
                kind="child"
                ageInDays={dayAgeForChart}
                ageInMonths={monthAgeForChart}
                sex={parameters.measurements.sex}
              />
            </View>
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{systolicTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{exactSystolic}</AppText>
              </View>
            </View>
            <View style={styles.oneButtonContainer}>
              <MoreBPInfo exactCentile={systolicRef} />
            </View>
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{diastolicTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{exactDiastolic}</AppText>
              </View>
            </View>
            <View style={styles.oneButtonContainer}>
              <MoreBPInfo exactCentile={diastolicRef} />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default BPResultsScreen;

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
    //backgroundColor: 'green',
    flexDirection: flexDirection,
    flex: 2,
  },
  oneButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    //backgroundColor: 'yellow',
    flex: 2,
    paddingTop: 35,
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
