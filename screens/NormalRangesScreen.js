import React, {useContext, useLayoutEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import AppForm from '../components/AppForm';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AgeButton from '../components/buttons/AgeButton';
import PCalcScreen from '../components/PCalcScreen';
import {GlobalStatsContext} from '../components/GlobalStats';
import Zeit from '../brains/Zeit';
import obsRanges from '../brains/obsRanges';
import ObsButton from '../components/buttons/ObsButton';
import AppText from '../components/AppText';
import defaultStyles from '../config/styles';
import colors from '../config/colors';

const initialValues = {
  gestationInDays: 280,
  dob: null,
  dom: null,
};

const NormalRangesScreen = () => {
  const {globalStats} = useContext(GlobalStatsContext);
  const dom = globalStats.child.dom.value;
  const dob = globalStats.child.dob.value;

  const [after, setAfter] = useState('not corrected');
  const [before, setBefore] = useState('N/A');
  const [output, setOutput] = useState('');

  useLayoutEffect(() => {
    if (dob) {
      const ageObject = new Zeit(dob, dom);
      const inputAge = ageObject.calculate('years');
      const beforeString = ageObject.calculate('string');
      if (inputAge >= 0 && inputAge < 18) {
        let targetValues;
        for (let i = 0; i < obsRanges.length; i++) {
          const refData = obsRanges[i];
          if (inputAge < refData.age) {
            targetValues = refData.data;
            setOutput(
              `\n\nHeart Rate: ${targetValues.HR} bpm \nRespiratory Rate: ${targetValues.RR} breaths per minute \nSats: ≥95%\nTemperature: 36 - 37.9°C`,
            );
            break;
          }
        }
        setBefore(beforeString);
      } else if (inputAge < 0) {
        setBefore('N/A');
        setAfter('not corrected');
        setOutput("\n\nIt looks like you've added a date in the future!");
      } else if (inputAge >= 18) {
        setBefore(beforeString);
        setAfter('not corrected');
        setOutput(
          '\n\nThis calculator is designed for patients under 18 years of age.',
        );
      }
    } else {
      setAfter('not corrected');
      setBefore('N/A');
      setOutput('');
    }
  }, [dom, dob]);

  return (
    <PCalcScreen style={{flex: 1}}>
      <ScrollView>
        <View style={styles.topContainer}>
          <AppForm initialValues={initialValues}>
            <DateTimeInputButton kind="child" type="birth" />
            <DateTimeInputButton kind="child" type="measured" />
            <FormResetButton kind="child" initialValues={initialValues} />
            <AgeButton
              kind="child"
              valueBeforeCorrection={before}
              valueAfterCorrection={after}
            />
            {dob === null ? (
              <View style={styles.button}>
                <AppText style={styles.outputText}>
                  ↑ Please enter a date of birth above
                </AppText>
              </View>
            ) : (
              <ObsButton output={output} />
            )}
          </AppForm>
        </View>
      </ScrollView>
    </PCalcScreen>
  );
};

export default NormalRangesScreen;

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.container,
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 15,
    justifyContent: 'center',
  },
  outputText: {
    color: colors.white,
  },
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
