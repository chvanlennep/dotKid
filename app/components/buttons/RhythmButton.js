import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AppText from '../AppText';
import colors from '../../config/colors';
import ButtonIcon from '../buttons/ButtonIcon';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';

const RhythmButton = ({modalState, style, title}) => {
  const modalVisible = modalState.value;
  const setModalVisible = modalState.setValue;

  const handlePress = () => {
    aplsStore.addTimeHandler('Rhythm Analysed');
    if (title === 'Ventricular Fibrillation' || title === 'Pulseless VT') {
      Alert.alert(
        'Shock Advised',
        '',
        [
          {
            text: 'Deliver Shock',
            onPress: () => {
              aplsStore.addTime(title);
              setModalVisible(false);
              aplsStore.addTime('Shock Delivered');
            },
          },
          {
            text: 'No Shock',
            onPress: () => {
              aplsStore.addTime(title);
              setModalVisible(false);
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              setModalVisible(false);
            },
          },
        ],
        {cancelable: false},
      );
    } else if (title === 'Asystole' || title === 'PEA') {
      Alert.alert(
        'Consider Adrenaline',
        '',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              aplsStore.addTime(title);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        style,
        aplsStore.getFunctionButtonTime('Rhythm Analysed') &&
          styles.buttonPressed,
      ]}>
      <AppText style={styles.text}>{`${title} ${
        aplsStore.getFunctionButtonTime(title).length
          ? 'x' + aplsStore.getFunctionButtonTime(title).length
          : ''
      }`}</AppText>
      {aplsStore.getFunctionButtonTime(title).length > 0 && (
        <View style={styles.icon}>
          <TouchableOpacity onPress={() => aplsStore.removeTime(title)}>
            <ButtonIcon
              name="refresh"
              backgroundColor={colors.dark}
              marginBottom={0}
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RhythmButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    textAlign: 'center',
  },
  buttonPressed: {
    flexWrap: 'nowrap',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'auto',
  },
  text: {
    color: colors.white,
    margin: 5,
    textAlign: 'center',
  },
});
