import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useFormikContext } from 'formik';
import { GlobalStateContext } from '../../GlobalStateContext';

import colors from '../../../config/colors';
import defaultStyles from '../../../config/styles';
import ButtonIcon from '../ButtonIcon';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';

// Must be a child of AppForm and GlobalStateContext
// If global is set to false, values are only managed by Formik and not written to global state
const NumberInputButton = ({
  global = true,
  kind,
  iconName,
  name,
  unitsOfMeasurement,
  defaultValue,
  userLabel,
  userValue = '',
}) => {
  let width = defaultStyles.container.width;
  if (unitsOfMeasurement === ' ml/kg/day') {
    width = defaultStyles.container.width * 0.9;
  }

  const firstValue = defaultValue ? defaultValue : '';
  const firstButtonText = firstValue
    ? `${userLabel}: ${firstValue}${unitsOfMeasurement}`
    : `${userLabel}`;
  const deleteIconName = firstValue ? 'refresh' : 'delete-forever';

  const [showTextInput, setShowTextInput] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [buttonText, setButtonText] = useState(firstButtonText);
  const [localNumber, setLocalNumber] = useState(firstValue);
  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const { setFieldValue, errors, touched, values } = useFormikContext();

  const placeHolderText =
    unitsOfMeasurement.charAt(0) === ' '
      ? `Enter here (in${unitsOfMeasurement})`
      : `Enter here (in ${unitsOfMeasurement})`;

  const manageStats = {
    read: function (kind, measurementType) {
      return globalStats[kind][measurementType];
    },
    write: function (kind, measurementType, value) {
      if (kind === 'child') {
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          child[measurementType] = value;
          return { child, neonate };
        });
      } else if (kind === 'neonate')
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          neonate[measurementType] = value;
          return { child, neonate };
        });
    },
  };

  const cancelInput = () => {
    setShowTextInput(false);
    setButtonText(firstButtonText);
    setShowCancel(false);
    setFieldValue(name, defaultValue);
    if (global) {
      manageStats.write(kind, name, defaultValue);
    }
    setLocalNumber(defaultValue);
  };

  const toggleTextInput = () => {
    if (showTextInput) {
      if (localNumber) {
        const convertCommas = localNumber.replace(/,/g, '.');
        const numberToSubmit = convertCommas.replace(/[^0-9.]/g, '');
        setButtonText(`${userLabel}: ${numberToSubmit}${unitsOfMeasurement}`);
        if ((firstValue && firstValue !== localNumber) || !firstValue) {
          setShowCancel(true);
        }
        setFieldValue(name, numberToSubmit);
        if (global) {
          manageStats.write(kind, name, numberToSubmit);
        }
      }
      setShowTextInput(false);
    } else {
      setShowTextInput(true);
    }
  };

  useEffect(() => {
    if (!defaultValue) {
      let globalNumber;
      // button has been filled in by user:
      if (showCancel && localNumber && !showTextInput) {
        // Reset by formik:
        if (!values[name]) {
          setShowTextInput(false);
          setShowCancel(false);
          setButtonText(`${userLabel}`);
          if (global) {
            manageStats.write(kind, name, '');
          }
          setLocalNumber('');
        }
        if (global) {
          globalNumber = manageStats.read(kind, name);
          // Reset via global state:
          if (!globalNumber) {
            setShowCancel(false);
            setButtonText(`${userLabel}`);
            setLocalNumber('');
            setFieldValue(name, '');
          }
          // value changed by global state (must put no show picker / input otherwise value stuck):
          if (globalNumber && globalNumber !== localNumber) {
            setFieldValue(name, globalNumber);
            setLocalNumber(globalNumber);
            setButtonText(`${userLabel}: ${globalNumber}${unitsOfMeasurement}`);
          }
        }
      }
      if (global) {
        globalNumber = manageStats.read(kind, name);
        // button has not been filled in by user:
        if (!showCancel && !localNumber && !showTextInput) {
          // value updated via global state:
          if (globalNumber) {
            setFieldValue(name, globalNumber);
            setLocalNumber(globalNumber);
            setButtonText(`${userLabel}: ${globalNumber}${unitsOfMeasurement}`);
            setShowCancel(true);
          }
        }
      }
    }
  });

  useEffect(() => {
    if (defaultValue) {
      if (userValue && userValue !== defaultValue) {
        setButtonText(`${userLabel}: ${userValue}${unitsOfMeasurement}`);
        setShowCancel(true);
        setLocalNumber(userValue);
      }
    }
  }, []);

  useEffect(() => {
    if (defaultValue === values[name] && !showTextInput) {
      if (localNumber !== defaultValue) {
        setLocalNumber(defaultValue);
        setButtonText(`${userLabel}: ${defaultValue}${unitsOfMeasurement}`);
        setShowCancel(false);
      }
    }
  }, [defaultValue, values[name], localNumber, showTextInput]);

  return (
    <React.Fragment>
      <View>
        <View style={[styles.button, { width: width }]}>
          <TouchableOpacity onPress={toggleTextInput}>
            <View style={[styles.buttonTextBox, { width: width - 55 }]}>
              <ButtonIcon name={iconName} />
              <AppText style={{ color: colors.white }}>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name={deleteIconName} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showTextInput && (
        <View style={[styles.inputBox, { width: width }]}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => {
              setLocalNumber(text);
            }}
            value={localNumber}
            clearTextOnFocus={false}
            keyboardType={'decimal-pad'}
            placeholder={placeHolderText}
            placeholderTextColor={colors.white}
            multiline={false}
            textAlignVertical="top"
            onBlur={toggleTextInput}
            returnKeyType="done"
          />
        </View>
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default NumberInputButton;

const android = Platform.OS === 'android' ? true : false;

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
  },
  buttonTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  textInput: {
    ...defaultStyles.text,
    width: defaultStyles.container.width - 40,
    color: colors.white,
    paddingLeft: 10,
    //backgroundColor: 'orange',
    height: 50,
    paddingTop: android ? 12 : null,
  },
});
