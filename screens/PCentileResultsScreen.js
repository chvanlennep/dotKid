import React from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import PCalcScreen from '../components/PCalcScreen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import MoreCentileInfo from '../components/buttons/MoreCentileInfo';
import CentileChartModal from '../components/CentileChartModal';
import {calculateBMI} from '../brains/oddBits';

const flexDirection = defaultStyles.container.width > 500 ? 'row' : 'column';

const PCentileResultsScreen = ({route, navigation}) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  const results = parameters.results;

  const {
    monthAgeForChart,
    dayAgeForChart,
    ageAfterCorrection,
    ageBeforeCorrection,
    centiles,
  } = results;

  let rawBmi;

  let heightTitle;
  let heightTitleAddition = '';
  if (measurements.height) {
    heightTitleAddition = ` (${measurements.height}cm)`;
  }
  dayAgeForChart > 730 || dayAgeForChart === null
    ? (heightTitle = `Height${heightTitleAddition}:`)
    : (heightTitle = `Length${heightTitleAddition}:`);
  let weightTitle;
  measurements.weight
    ? (weightTitle = `Weight (${measurements.weight}kg):`)
    : (weightTitle = 'Weight:');
  let bmiTitle = 'BMI:';
  if (measurements.weight && measurements.height) {
    if (dayAgeForChart > 730 || monthAgeForChart >= 48) {
      rawBmi = calculateBMI(measurements.weight, measurements.height);
      const niceLookingBmi = Number(rawBmi.toFixed(1));
      bmiTitle = `BMI (${niceLookingBmi}kg/m²):`;
    } else {
      bmiTitle = 'BMI (N/A under 2 years):';
    }
  }
  let hcTitle = 'Head Circumference:';
  if (measurements.hc) {
    hcTitle = `Head Circumference (${measurements.hc}cm):`;
  }

  const [weight, exactWeight] = centiles.weight;
  const [height, exactHeight] = centiles.height;
  const [hc, exactHc] = centiles.hc;
  const [bmi, exactBmi] = centiles.bmi;

  return (
    <PCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="child"
          valueBeforeCorrection={ageBeforeCorrection}
          valueAfterCorrection={ageAfterCorrection}
        />
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
                measurement={parameters.measurements.weight}
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
                <AppText style={styles.text}>{bmiTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{bmi}</AppText>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <MoreCentileInfo exactCentile={exactBmi} />
              <CentileChartModal
                measurementType="bmi"
                measurement={rawBmi}
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
                kind="child"
                ageInDays={dayAgeForChart}
                ageInMonths={monthAgeForChart}
                sex={parameters.measurements.sex}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default PCentileResultsScreen;

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
