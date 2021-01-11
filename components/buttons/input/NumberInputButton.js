import React, {useLayoutEffect} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useFormikContext} from 'formik';

import colors from '../../../config/colors';
import defaultStyles from '../../../config/styles';
import ButtonIcon from '../ButtonIcon';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';
import useCombined from '../../../brains/useCombined';

// Must be a child of AppForm and GlobalStatsContext

const NumberInputButton = ({
  global = true,
  kind,
  iconName,
  name,
  unitsOfMeasurement,
  defaultValue = '',
  userLabel,
  userValue = '',
}) => {
  let width = defaultStyles.container.width;
  if (!global) {
    width = defaultStyles.container.width * 0.9;
  }

  const {combinedSetter, buttonState, initialState} = useCombined(kind, name);
  const {showCancel, showTextInput, text, value} = buttonState;
  const original = initialState[kind][name].value;

  const deleteIconName = original ? 'refresh' : 'delete-forever';

  const {errors, touched} = useFormikContext();

  const placeHolderText =
    unitsOfMeasurement.charAt(0) === ' '
      ? `Enter here (in${unitsOfMeasurement})`
      : `Enter here (in ${unitsOfMeasurement})`;

  let localButtonText = userLabel;

  if (value && (!defaultValue || (defaultValue && defaultValue !== value))) {
    localButtonText = `${userLabel}: ${value}${unitsOfMeasurement}`;
  }

  const localName = !global ? 'day' + name.charAt(1) : name;

  const cancelInput = () => {
    combinedSetter(initialState[kind][name]);
  };

  const toggleTextInput = () => {
    if (showTextInput) {
      if (text) {
        const valueChanged =
          (defaultValue && defaultValue !== text) || !defaultValue
            ? true
            : false;
        combinedSetter({
          showCancel: valueChanged,
          showTextInput: false,
          value: text,
        });
      } else {
        combinedSetter({showTextInput: false});
      }
    } else {
      combinedSetter({showTextInput: true});
    }
  };

  // use in fluid req modal, if value from storage is different
  useLayoutEffect(() => {
    if (!global) {
      if (userValue !== defaultValue) {
        combinedSetter({
          showCancel: true,
          value: userValue,
          text: userValue,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <View>
        <View style={[styles.button, {width: width}]}>
          <TouchableOpacity onPress={toggleTextInput}>
            <View style={[styles.buttonTextBox, {width: width - 55}]}>
              <ButtonIcon name={iconName} />
              <AppText style={{color: colors.white}}>{localButtonText}</AppText>
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
        <View style={[styles.inputBox, {width: width}]}>
          <TextInput
            style={styles.textInput}
            onChangeText={(inputText) => {
              combinedSetter({text: inputText});
            }}
            value={text}
            autoFocus={true}
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
      <ErrorMessage error={errors[localName]} visible={touched[localName]} />
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
    width: defaultStyles.container.width - 55,
    height: 57,
    //backgroundColor: 'green',
    alignSelf: 'center',
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
