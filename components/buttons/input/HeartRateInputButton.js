import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { useFormikContext } from 'formik';

import colors from '../../../config/colors';
import defaultStyles from '../../../config/styles';
import ButtonIcon from '../ButtonIcon';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';
import { GlobalStateContext } from '../../GlobalStateContext';

const HeartRateInputButton = ({ global = false, name = 'heartRate' }) => {
  const [showInput, setShowInput] = useState(false);
  const [buttonText, setButtonText] = useState('Heart Rate');
  const [showCancel, setShowCancel] = useState(false);
  const [localHR, setLocalHR] = useState('');

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();

  const toggleInput = () => {
    if (showInput) {
      setShowInput(false);
      if (localHR) {
        setButtonText(`Heart Rate: ${localHR}`);
        setShowCancel(true);
        if (!global) {
          setFieldValue(name, localHR);
        }
      } else {
        setButtonText(`Heart Rate`);
        setShowCancel(false);
      }
    } else {
      if (!localHR) {
        setLocalHR('60-100');
      }
      setShowInput(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setButtonText('Heart Rate');
    setShowInput(false);
    setLocalHR('');
    if (!global) {
      setFieldValue(name, '');
    }
    setShowCancel(false);
  };

  useEffect(() => {
    // button has been filled in by user:
    if (showCancel && localHR && !showInput) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowInput(false);
          setShowCancel(false);
          setButtonText('Heart Rate');
          setLocalHR('');
        }
      }
    }
  });

  return (
    <React.Fragment>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="heart-pulse" />
              <AppText style={{ color: colors.white }}>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="delete-forever" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showInput && (
        <>
          <View
            style={
              scheme === 'dark'
                ? styles.darkPickerContainer
                : styles.lightPickerContainer
            }
          >
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocalHR(itemValue);
              }}
              selectedValue={localHR}
            >
              <Picker.Item label="<60" value="<60" />
              <Picker.Item label="60-100" value="60-100" />
              <Picker.Item label=">100" value=">100" />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.submitButton}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        </>
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default HeartRateInputButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: Dimensions.get('window').width * 0.85,
  },
  buttonTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.72,
  },
  picker: {
    height: 200,
    width: 280,
  },
  lightPickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  darkPickerContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: colors.light,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.85,
  },
});
