import React from 'react';
import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';

import AppText from '../AppText';
import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import useCombined from '../../brains/useCombined';

const FormResetButton = ({
  kind,
  name = 'Reset...',
  additionalMessage = '',
  initialValues,
  style,
}) => {
  const {combinedReset} = useCombined(kind, 'weight');

  const handleResetAlert = () => {
    Alert.alert('Are you sure you want to reset?', `${additionalMessage}`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => combinedReset(initialValues),
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleResetAlert}>
      <View style={[styles.FormResetButton, style]}>
        <AppText style={{color: colors.white}}>{name}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default FormResetButton;

const styles = StyleSheet.create({
  FormResetButton: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.medium,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: 'center',
    ...defaultStyles.container,
  },
});
