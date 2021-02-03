import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import colors from '../config/colors';
import ALSToolButton from './buttons/ALSToolButton';

const ALSToolbar = ({reset, rip, rosc}) => {
  return (
    <View style={styles.container}>
      <ALSToolButton
        name="RIP"
        onPress={rip}
        style={{width: useWindowDimensions().width / 3}}
      />
      <ALSToolButton
        name="Reset"
        onPress={reset}
        style={{width: useWindowDimensions().width / 3}}
      />
      <ALSToolButton
        name="ROSC"
        onPress={rosc}
        style={{width: useWindowDimensions().width / 3}}
      />
    </View>
  );
};

export default ALSToolbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
});
