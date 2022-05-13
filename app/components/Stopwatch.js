import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {aplsStore} from '../brains/stateManagement/aplsState.store';
import {nlsStore} from '../brains/stateManagement/nlsState.store';
import colors from '../config/colors';
import AppText from './AppText';

const Stopwatch = observer(kind => {
  const store = kind === 'child' ? aplsStore : nlsStore;

  if (store.timerIsRunning) {
    return <AppText style={styles.text}>{store.stopwatchDisplay}</AppText>;
  } else {
    return <AppText style={styles.text}>Start Timer</AppText>;
  }
});

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  text: {
    color: colors.white,
  },
});
