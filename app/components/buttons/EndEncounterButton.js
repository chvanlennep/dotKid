import React from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {nlsStore} from '../../brains/stateManagement/nlsState.store';

import colors from '../../config/colors';
import AppText from '../AppText';

const EndEncounterButton = ({modalState, setLogVisible, style, title}) => {
  const setModal = modalState.setValue;

  const handlePress = () => {
    nlsStore.addTime(title);
    nlsStore.setEndEncounter(true);
    setModal(false);
    nlsStore.stopTimer();
    setLogVisible(true);
  };

  return (
    <TouchableHighlight
      activeOpacity={0.5}
      underlayColor={colors.light}
      onPress={handlePress}
      style={[styles.button, style]}
      title={title}>
      <View style={[styles.button, style]}>
        <AppText style={{color: colors.white}}>{title}</AppText>
      </View>
    </TouchableHighlight>
  );
};

export default EndEncounterButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: '98%',
  },
  buttonPressed: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
