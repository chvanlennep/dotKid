import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppForm from '../components/AppForm';
import NCalcScreen from '../components/NCalcScreen';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import CGAOutput from '../components/CGAOutput';

const CGAScreen = () => {
  const navigation = useNavigation();

  const initialValues = {
    gestationInDays: 0,
    dob: null,
    tob: null,
    dom: null,
    tom: null,
  };

  return (
    <NCalcScreen style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.topContainer}>
          <AppForm initialValues={initialValues}>
            <DateTimeInputButton kind="neonate" type="birth" />
            <GestationInputButton kind="neonate" />
            <DateTimeInputButton kind="neonate" type="measured" />
            <CGAOutput />
          </AppForm>
        </View>
      </ScrollView>
    </NCalcScreen>
  );
};

export default CGAScreen;

const styles = StyleSheet.create({
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
