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

const NCentileResultsScreen = ({route, navigation}) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  const results = parameters.results;

  const birthGestationInDays = results.birthGestationInDays;
  const correctedGestationInDays = results.correctedGestationInDays;

  const [weight, exactWeight, sdsWeight] = results.centiles.weight;
  const [length, exactLength, sdsLength] = results.centiles.length;
  const [hc, exactHc, sdsHc] = results.centiles.hc;

  let weightTitle = 'Weight:';
  if (measurements.weight) {
    weightTitle = `Weight (${measurements.weight}kg):`;
  }
  let lengthTitle = 'Length:';
  if (measurements.length) {
    lengthTitle = `Length (${measurements.length}cm):`;
  }
  let hcTitle = 'Head Circumference:';
  if (measurements.hc) {
    hcTitle = `Head Circumference (${measurements.hc}cm):`;
  }

  return (
    <NCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="neonate"
          valueBeforeCorrection={birthGestationInDays}
          valueAfterCorrection={correctedGestationInDays}
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
              <MoreCentileInfo exactCentile={exactWeight} sds={sdsWeight} />
              <CentileChartModal
                measurementType="weight"
                measurement={parameters.measurements.weight}
                kind="neonate"
                gestationInDays={correctedGestationInDays}
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
              <MoreCentileInfo exactCentile={exactLength} sds={sdsLength} />
              <CentileChartModal
                measurementType="length"
                measurement={parameters.measurements.length}
                kind="neonate"
                gestationInDays={correctedGestationInDays}
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
              <MoreCentileInfo exactCentile={exactHc} sds={sdsHc} />
              <CentileChartModal
                measurementType="hc"
                measurement={parameters.measurements.hc}
                kind="neonate"
                gestationInDays={correctedGestationInDays}
                sex={parameters.measurements.sex}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default NCentileResultsScreen;

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
