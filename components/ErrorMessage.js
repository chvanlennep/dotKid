import React from 'react';
import { StyleSheet, View } from 'react-native';

import AppText from './AppText';

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;

  return (
    <View style={styles.container}>
      <AppText style={styles.error}>{error}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  error: { color: 'red', textAlign: 'center' },
});

export default ErrorMessage;
