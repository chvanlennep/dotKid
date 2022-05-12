import React from 'react';
import {StyleSheet, View} from 'react-native';

import AppText from './AppText';

function ErrorMessage({error, visible}) {
  if (!visible || !error) {
    return null;
  }

  let outputError = error;

  if (error.includes('`NaN`')) {
    outputError = "↑ We'll need a valid number to calculate";
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.error}>{outputError}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  error: {color: 'red', textAlign: 'center'},
});

export default ErrorMessage;
