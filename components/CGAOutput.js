import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFormikContext } from 'formik';

import colors from '../config/colors';
import defaultStyles from '../config/styles';
import AppText from './AppText';
import zeit from '../brains/zeit';

const CGAOutput = () => {
  const { values } = useFormikContext();

  const initialState = `Corrected Gestational Age: N/A`;

  const [cga, setCga] = useState(initialState);
  const [days, setDays] = useState('N/A days old');

  const addPluralSuffix = (inputNumber) => {
    if (inputNumber === 1) {
      return '';
    } else {
      return 's';
    }
  };

  const addOrdinalSuffix = (inputNumber) => {
    let answerNumber = inputNumber;
    if (Number.isInteger(inputNumber) === false) {
      inputNumber *= 10;
      if (Number.isInteger(inputNumber) === false) {
        return 'Error: only integers or numbers to 1 decimal place are supported';
      }
    }
    let remainder10 = inputNumber % 10;
    let remainder100 = inputNumber % 100;
    if (remainder10 === 1 && remainder100 != 11) {
      return `${answerNumber}st`;
    }
    if (remainder10 === 2 && remainder100 != 12) {
      return `${answerNumber}nd`;
    }
    if (remainder10 === 3 && remainder100 != 13) {
      return `${answerNumber}rd`;
    } else {
      return `${answerNumber}th`;
    }
  };

  useEffect(() => {
    if (values.gestationInDays && values.dob) {
      const daysOld = zeit(values.dob, 'days', values.dom);
      const computedCga = values.gestationInDays + daysOld;
      if (computedCga && daysOld >= 0) {
        if (computedCga > 294) {
          setCga(`Corrected Gestational Age: 42+`);
          setDays(
            `${daysOld} day${addPluralSuffix(daysOld)} old (${addOrdinalSuffix(
              daysOld + 1
            )} day of life)`
          );
        } else {
          const weeks = Math.floor(computedCga / 7);
          const days = computedCga % 7;
          setCga(`Corrected Gestational Age: ${weeks}+${days}`);
          setDays(
            `${daysOld} day${addPluralSuffix(daysOld)} old (${addOrdinalSuffix(
              daysOld + 1
            )} day of life)`
          );
        }
      } else {
        setCga(`Corrected Gestational Age: N/A`);
        setDays('N/A days old');
      }
    }
  }, [values]);

  useEffect(() => {
    if (cga !== initialState && (!values.gestationInDays || !values.dob)) {
      setCga(initialState);
      setDays('N/A days old');
    }
  });

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
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 110,
    width: defaultStyles.container.width,
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
