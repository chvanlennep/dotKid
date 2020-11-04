import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import ALSToolButton from './buttons/ALSToolButton';
import EndEncounterModal from './EndEncounterModal';
import colors from '../config/colors';

const NLSToolbar = ({
  reset,
  logState,
  encounterState,
  resetState,
  timerState,
}) => {
  return (
    <View style={[styles.container]}>
      <ALSToolButton
        name="Reset"
        onPress={reset}
        style={{ width: useWindowDimensions().width / 2 }}
      />
      <EndEncounterModal
        logState={logState}
        encounterState={encounterState}
        resetState={resetState}
        timerState={timerState}
      />
    </View>
  );
};

export default NLSToolbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
  },
});
