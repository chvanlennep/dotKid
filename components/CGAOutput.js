import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useFormikContext} from 'formik';

import colors from '../config/colors';
import {containerWidth} from '../config/styles';
import AppText from './AppText';
import Zeit from '../brains/Zeit';
import {addOrdinalSuffix, decidePluralSuffix} from '../brains/oddBits';

const CGAOutput = () => {
  const {values} = useFormikContext();

  const initialState = `Corrected Gestational Age: N/A`;

  const [cga, setCga] = useState(initialState);
  const [days, setDays] = useState('N/A days old');

  useEffect(() => {
    if (values.gestationInDays && values.dob) {
      const dateObject = new Zeit(values.dob, values.dom);
      const daysOld = dateObject.calculate('days');
      const computedCga = values.gestationInDays + daysOld;
      if (computedCga && daysOld >= 0) {
        if (computedCga > 294) {
          setCga('Corrected Gestational Age: 42+');
          setDays(
            `${daysOld} day${decidePluralSuffix(
              daysOld,
            )} old (${addOrdinalSuffix(daysOld + 1)} day of life)`,
          );
        } else {
          const gestWeeks = Math.floor(computedCga / 7);
          const gestDays = computedCga % 7;
          setCga(`Corrected Gestational Age: ${gestWeeks}+${gestDays}`);
          setDays(
            `${daysOld} day${decidePluralSuffix(
              daysOld,
            )} old (${addOrdinalSuffix(daysOld + 1)} day of life)`,
          );
        }
      } else {
        setCga('Corrected Gestational Age: N/A');
        setDays('N/A days old');
      }
    }
  }, [values]);

  useEffect(() => {
    if (cga !== initialState && (!values.gestationInDays || !values.dob)) {
      setCga(initialState);
      setDays('N/A days old');
    }
  }, [cga, initialState, values]);

  return (
    <View style={styles.outputContainer}>
      <View style={styles.outputTextBox}>
        <AppText style={styles.title}>{cga}</AppText>
        <AppText style={styles.outputText}>{days}</AppText>
      </View>
    </View>
  );
};

export default CGAOutput;

const styles = StyleSheet.create({
  outputContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 110,
    width: containerWidth,
  },
  outputTextBox: {
    //backgroundColor: 'limegreen',
    justifyContent: 'center',
  },
  outputText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.white,
    flexWrap: 'wrap',
  },
  title: {
    alignContent: 'center',
    justifyContent: 'center',
    color: colors.white,
    marginBottom: 10,
  },
});
