import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import AppText from '../AppText';

const ObsButton = ({output}) => {
  return (
    <TouchableOpacity>
      <View style={styles.submitButton}>
        <AppText style={styles.vitalsHeadingText}>
          Normal Observation Ranges:
        </AppText>
        <AppText style={styles.vitalsText}>{output}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default ObsButton;

const styles = StyleSheet.create({
  submitButton: {
    alignItems: 'flex-start',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'column',
    height: 228,
    margin: 5,
    padding: 25,
    paddingBottom: 10,
    justifyContent: 'flex-start',
    width: defaultStyles.container.width,
  },
  vitalsHeadingText: {
    color: colors.white,
  },
  vitalsText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 24,
    marginTop: -20,
  },
});
