import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import AppText from '../AppText';

const ALSDisplayButton = ({ children, style, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, style]}>
        <AppText style={styles.text}>{children}</AppText>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ALSDisplayButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    // color: colors.white,
    height: 57,
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 3,
    width: defaultStyles.container.width * 0.48,
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
