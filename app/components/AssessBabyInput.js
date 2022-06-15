import React, {useState, useEffect, useContext} from 'react';

import {
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import colors from '../../../config/colors';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';

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
      {label: 'Apnoeic', value: 'Apnoeic'},
      {label: 'Adequate Breathing', value: 'Adequate Breathing'},
      {label: 'Inadequate Breathing', value: 'Inadequate Breathing'},
    ],
  };

  const {
    field: {isTouched, onChange, onBlur, value, ref},
    fieldState: {error},
  } = useController({control, name: fieldName});

  const scheme = useColorScheme();

  const toggleInput = () => {
    if (showInput) {
      setShowInput(false);
      if (local) {
        if (!global) {
          onChange(name, local);
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
      onChange(name, '');
    }
  };

  useEffect(() => {
    // button has been filled in by user:
    if (local && !showInput) {
      if (!global) {
        // Reset by formik:
        if (!value[name]) {
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
            }>
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocal(itemValue);
              }}
              selectedValue={local}>
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
              <AppText style={{color: colors.white}}>Submit</AppText>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}
      <ErrorMessage error={error[name]} visible={isTouched[name]} />
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
