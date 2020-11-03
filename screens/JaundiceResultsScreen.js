import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import NCalcScreen from '../components/NCalcScreen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import defaultStyle from '../config/styles';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import YoungWarning from '../components/YoungWarning';
import JaundiceChart from '../components/JaundiceChart';

const NCentileResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const {
    stringAge,
    phototherapy,
    exchange,
    exchangeWarning,
    youngWarning,
    makeBlue,
    mainConclusion,
    sbr,
    ageInHours,
    gestationWeeks,
  } = parameters;

  let backgroundColor = colors.dark;
  if (makeBlue) backgroundColor = 'dodgerblue';
  if (exchangeWarning) backgroundColor = 'red';

  return (
    <NCalcScreen style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <AgeButton
          gestationWeeks={gestationWeeks}
          kind="jaundice"
          valueBeforeCorrection={stringAge}
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: colors.light }}
          textStyle={{ color: colors.black }}
        />
      </View>
      <ScrollView>
        <View style={styles.outputView}>
          <YoungWarning>{youngWarning}</YoungWarning>
          <View
            style={[
              styles.answerTextHeadingWrapper,
              { backgroundColor: backgroundColor },
            ]}
          >
            <AppText
              style={styles.answerTextHeadings}
            >{`${mainConclusion} (SBR: ${sbr})`}</AppText>
          </View>
          <View>
            <AppText
              style={styles.thresholdsText}
            >{`Phototherapy threshold: ${phototherapy}`}</AppText>
            <AppText
              style={styles.thresholdsText}
            >{`Exchange transfusion threshold: ${exchange}`}</AppText>
          </View>
        </View>
        <JaundiceChart
          ageInHours={ageInHours}
          gestationWeeks={gestationWeeks}
          sbr={sbr}
        />
      </ScrollView>
    </NCalcScreen>
  );
};

export default NCentileResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 75,
  },
  outputTextBox: {
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: 'limegreen',
    textAlign: 'left',
    justifyContent: 'center',
  },
  outputView: {
    margin: 20,
    borderRadius: 10,
    width: defaultStyle.container.width - 10,
    backgroundColor: colors.medium,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingTop: 30,
  },
  answerTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 18,
    fontWeight: '500',
    color: colors.white,
    marginTop: 10,
    margin: 5,
  },
  answerTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    padding: 8,
    margin: 10,
    width: '75%',
  },
  thresholdsText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 5,
    color: colors.white,
    fontWeight: '500',
  },
  topContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 5,
  },
  textWarning: {
    color: colors.white,
    fontWeight: '500',
  },
  textWarningWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 8,
    margin: 10,
  },
});
