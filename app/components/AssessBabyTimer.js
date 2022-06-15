import React from 'react';
import {StyleSheet} from 'react-native';
import {nlsStore} from '../brains/stateManagement/nlsState.store';
import colors from '../config/colors';
import AppText from './AppText';

const AssessBabyTimer = () => {
  const getAssessBabyTime = nlsStore.assessBabyTimer();

  return <AppText style={styles.text}>{`\n${getAssessBabyTime}`}</AppText>;
};

export default AssessBabyTimer;

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    alignSelf: 'center',
  },
});
