import React from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';

import colors from '../../config/colors';
import AppText from '../AppText';

const EndEncounterButton = ({
  logState,
  modalState,
  setLogVisible,
  style,
  title,
}) => {
  const setFunctionButtons = logState.setValue;
  const setModal = modalState.setValue;

  // logs time with event button
  const updateTime = () => {
    setFunctionButtons(oldState => {
      const timeStamp = new Date();
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      const updatingState = oldState;
      updatingState[title] = newButtonArray;
      return updatingState;
    });
  };

  const handlePress = () => {
    updateTime();
    aplsStore.setEndEncounter(true);
    setModal(false);
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
