import React, {useContext, useLayoutEffect, useState, useRef} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

import AppForm from '../components/AppForm';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AgeButton from '../components/buttons/AgeButton';
import PCalcScreen from '../components/PCalcScreen';
import {GlobalStatsContext} from '../components/GlobalStats';
import zeit from '../brains/zeit';
import obsRanges from '../brains/obsRanges';
import ObsButton from '../components/buttons/ObsButton';

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
  const [output, setOutput] = useState('\n\nPlease enter a date of birth');

  const formikRef = useRef(null);

  const inputAge = zeit(dob, 'years', dom);

  useLayoutEffect(() => {
    const valueFinder = () => {
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
    };
    if (dob) {
      const ageInMonths = zeit(dob, 'months', dom);
      if (ageInMonths >= 0) {
        valueFinder();
        const beforeString = zeit(dob, 'string', dom);
        setBefore(beforeString);
      } else if (ageInMonths < 217) {
        setBefore('N/A');
        setAfter('not corrected');
        setOutput(
          '\n\nThis calculator is only designed for use in those under 18 years of age.',
        );
      } else {
        setBefore('N/A');
        setAfter('not corrected');
        setOutput(
          '\n\nPlease enter a valid date of birth and date of measurement.',
        );
      }
    } else {
      setBefore('N/A');
      setAfter('not corrected');
    }
    if (dob === null) {
      setOutput('\n\nPlease enter a date of birth');
    }
  }, [dom, dob]);

  return (
    <PCalcScreen style={{flex: 1}}>
      <ScrollView>
        <View style={styles.topContainer}>
          <AppForm initialValues={initialValues} innerRef={formikRef}>
            <DateTimeInputButton kind="child" type="birth" />
            <DateTimeInputButton kind="child" type="measured" />
            <FormResetButton kind="child" initialValues={initialValues} />
            <AgeButton
              kind="child"
              valueBeforeCorrection={before}
              valueAfterCorrection={after}
            />
            <ObsButton output={output} />
          </AppForm>
        </View>
      </ScrollView>
    </PCalcScreen>
  );
};

export default NormalRangesScreen;

const styles = StyleSheet.create({
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
