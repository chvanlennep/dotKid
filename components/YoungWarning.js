import React from 'react';
import {StyleSheet, View} from 'react-native';

import colors from '../config/colors';
import AppText from './AppText';

const YoungWarning = ({children}) => {
  if (!children) return null;
  else
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>{children}</AppText>
      </View>
    );
};

export default YoungWarning;

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 8,
    margin: 10,
    width: '75%',
  },
  text: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
    margin: 5,
    flexWrap: 'wrap',
  },
});
