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

const AssessBabyInput = ({
  global = false,
  name = 'breathing',
  visibleObject,
}) => {
  const [local, setLocal] = useState('');

  const [showInput, setShowInput] = visibleObject;

  const pickerDetails = {
    name: 'breathing',
    pickerContent: [
      { label: 'Apnoeic', value: 'Apnoeic' },
      { label: 'Adequate Breathing', value: 'Adequate Breathing' },
      { label: 'Inadequate Breathing', value: 'Inadequate Breathing' },
    ],
  };

  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();

  const toggleInput = () => {
    if (showInput) {
      setShowInput(false);
      if (local) {
        if (!global) {
          setFieldValue(name, local);
        }
      } else {
      }
    } else {
      if (!local) {
        setLocal('Adequate Breathing');
      }
      setShowInput(true);
    }
  };

  const cancelInput = () => {
    setShowInput(false);
    setLocal('');
    if (!global) {
      setFieldValue(name, '');
    }
  };

  useEffect(() => {
    // button has been filled in by user:
    if (local && !showInput) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowInput(false);

          setLocal('');
        }
      }
    }
  });

  return (
    <React.Fragment>
      {showInput && (
        <React.Fragment>
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
                setLocal(itemValue);
              }}
              selectedValue={local}
            >
              <Picker.Item label="Apnoeic" value="Apnoeic" />
              <Picker.Item
                label="Inadequate Breathing"
                value="Inadequate Breathing"
              />
              <Picker.Item
                label="Adequate Breathing"
                value="Adequate Breathing"
              />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.submitButton}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default AssessBabyInput;

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
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.85,
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
  miniButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: colors.dark,
    borderRadius: 10,
  },
});
