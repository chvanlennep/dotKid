import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { useFormikContext } from 'formik';

import AppText from './AppText';
import colors from '../config/colors';

const AssessBabyTitle = ({ submitObject, resetObject, children }) => {
  const { handleSubmit, handleReset } = useFormikContext();

  const [submit, setSubmit] = submitObject;
  const [reset, setReset] = resetObject;

  useEffect(() => {
    if (submit) {
      handleSubmit();
      setSubmit(false);
    }
  }, [submit]);

  useEffect(() => {
    if (reset) {
      handleReset();
      setReset(false);
    }
  }, [reset]);

  return (
    <View style={styles.pickerTitleContainer}>
      <AppText style={styles.pickerTitle}>{children}</AppText>
    </View>
  );
};

export default AssessBabyTitle;

const styles = StyleSheet.create({
  pickerTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: colors.white,
    fontWeight: '500',
  },
  pickerTitleContainer: {
    backgroundColor: colors.black,
    marginTop: 5,
    marginBottom: 5,
    //width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 8,
    paddingTop: 8,
  },
});
