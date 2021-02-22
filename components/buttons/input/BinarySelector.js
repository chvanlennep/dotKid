import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useFormikContext} from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../../config/colors';
import {containerWidth} from '../../../config/styles';
import ButtonIcon from '../ButtonIcon';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';
import useCombined from '../../../brains/useCombined';
import UnitsSwitcher from '../UnitsSwitcher';

const BinarySelector = ({
  kind,
  name,
  trueValue,
  falseValue,
  userLabel,
  iconName,
}) => {
  const {combinedSetter, buttonState, initialState} = useCombined(kind, name);

  const {showSwitch, value, isTrueValue} = buttonState;

  const buttonText = value ? `${userLabel}: ${value}` : `${userLabel}`;

  const showCancel = value ? true : false;

  const {errors, touched} = useFormikContext();

  const toggleInput = () => {
    if (showSwitch) {
      combinedSetter({
        showSwitch: false,
        value: isTrueValue ? trueValue : falseValue,
      });
    } else {
      combinedSetter({showSwitch: true});
    }
  };

  const cancelInput = () => {
    if (showSwitch) {
      let tempValue = false;
      if (value === trueValue) {
        tempValue = true;
      }
      combinedSetter({showSwitch: false, isTrueValue: tempValue});
    } else {
      combinedSetter(initialState[kind][name]);
    }
  };

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity onPress={toggleInput}>
          <View style={styles.buttonTextBox}>
            <ButtonIcon name={iconName} />
            <AppText style={{color: colors.white}}>{buttonText}</AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity onPress={cancelInput}>
            <ButtonIcon name="delete-forever" />
          </TouchableOpacity>
        )}
      </View>
      {showSwitch && (
        <UnitsSwitcher
          backgroundColor={colors.medium}
          trueUnits={trueValue}
          falseUnits={falseValue}
          isUnits={isTrueValue}
          setIsUnits={(newValue) => combinedSetter({isTrueValue: newValue})}>
          <View style={styles.acceptCancel}>
            <View style={styles.closeIcon}>
              <TouchableOpacity onPress={cancelInput}>
                <MaterialCommunityIcons
                  name="close-circle"
                  color={colors.black}
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.acceptIcon}>
              <TouchableOpacity onPress={toggleInput}>
                <MaterialCommunityIcons
                  name="check-circle"
                  color={colors.black}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
        </UnitsSwitcher>
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default BinarySelector;

const styles = StyleSheet.create({
  button: {
    width: containerWidth,
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  acceptCancel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
  },
  acceptIcon: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
  },
  buttonTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: containerWidth - 55,
    height: 57,
    //backgroundColor: 'green',
    alignSelf: 'center',
  },
});
