import React from 'react';
import {StyleSheet} from 'react-native';

import AppText from './AppText';
import NCalcScreen from './NCalcScreen';
import {colors} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

const NRefScreen = () => {
  return (
    <NCalcScreen>
      <ScrollView style={styles.container}>
        <AppText style={styles.title}>References</AppText>
        <AppText style={styles.text}>
          These APLS Guidelines were written in line with the Resus Council
          Advanced Life Support Algorithm{' '}
        </AppText>
      </ScrollView>
    </NCalcScreen>
  );
};

export default NRefScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  text: {
    color: colors.black,
    fontSize: 17,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    color: colors.black,
  },
});
