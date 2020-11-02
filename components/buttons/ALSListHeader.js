import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import colors from '../../config/colors';
import AppText from '../AppText';
import ButtonIcon from '../../components/buttons/ButtonIcon';

let showList;
let setShowList;

const ALSListHeader = ({
  downArrow = false,
  iconColor,
  isModal = false,
  onDownPress,
  onUpPress,
  upArrow = false,
  title,
  style,
  onPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, style]}>
        {isModal && (
          <TouchableOpacity onPress={onUpPress}>
            <ButtonIcon
              iconColor={iconColor}
              name="arrow-up-circle"
              backgroundColor={null}
            />
          </TouchableOpacity>
        )}

        {!isModal && (
          <TouchableOpacity onPress={onUpPress}>
            <ButtonIcon
              iconColor={upArrow ? colors.white : colors.dark}
              name="arrow-up-circle"
              backgroundColor={null}
            />
          </TouchableOpacity>
        )}

        <AppText style={styles.text}>{title}</AppText>

        {!isModal && (
          <TouchableOpacity onPress={onDownPress}>
            <ButtonIcon
              iconColor={downArrow ? colors.white : colors.dark}
              name="arrow-down-circle"
              backgroundColor={null}
            />
          </TouchableOpacity>
        )}
        {isModal && <ButtonIcon name="open-in-new" backgroundColor={null} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ALSListHeader;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    justifyContent: 'space-between',
    margin: 5,
    padding: 10,
    width: '100%',
    backgroundColor: colors.dark,
    alignSelf: 'center',
  },
  text: {
    color: colors.white,
    fontWeight: '500',
  },
});
