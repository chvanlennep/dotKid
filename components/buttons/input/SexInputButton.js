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

const SexInputButton = ({kind}) => {
  const {combinedSetter, buttonState, initialState} = useCombined(kind, 'sex');

  const {showSwitch, value, isMale} = buttonState;

  const buttonText = value ? `Sex: ${value}` : 'Sex';

  const showCancel = value ? true : false;

  const {errors, touched} = useFormikContext();

  const toggleSexInput = () => {
    if (showSwitch) {
      combinedSetter({
        showSwitch: false,
        value: isMale ? 'Male' : 'Female',
      });
    } else {
      combinedSetter({showSwitch: true});
    }
  };

  const cancelInput = () => {
    if (showSwitch) {
      let tempValue = false;
      if (value === 'Male') {
        tempValue = true;
      }
      combinedSetter({showSwitch: false, isMale: tempValue});
    } else {
      combinedSetter(initialState[kind].sex);
    }
  };

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity onPress={toggleSexInput}>
          <View style={styles.buttonTextBox}>
            <ButtonIcon name="all-inclusive" />
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
          trueUnits="Male"
          falseUnits="Female"
          isUnits={isMale}
          setIsUnits={(newValue) => combinedSetter({isMale: newValue})}>
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
              <TouchableOpacity onPress={toggleSexInput}>
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
      <ErrorMessage error={errors.sex} visible={touched.sex} />
    </React.Fragment>
  );
};

export default SexInputButton;

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
