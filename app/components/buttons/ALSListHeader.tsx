import React, {FC} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import colors from '../../config/colors';
import AppText from '../AppText';
import ButtonIcon from './ButtonIcon';
import {headerType} from '../../brains/aplsObjects';
import {ViewStyle} from 'react-native';

interface ALSListHeaderType extends headerType {
  title: string;
  onPress?: () => void;
  isModal?: boolean;
  iconColor?: string;
  onUpPress?: () => void;
  onDownPress?: () => void;
  style: ViewStyle;
}

const ALSListHeader: FC<ALSListHeaderType> = ({
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
            <ButtonIcon iconColor={iconColor} name="arrow-up-circle" />
          </TouchableOpacity>
        )}

        {!isModal && (
          <TouchableOpacity onPress={onUpPress}>
            <ButtonIcon
              iconColor={upArrow ? colors.white : colors.dark}
              name="arrow-up-circle"
            />
          </TouchableOpacity>
        )}
        <AppText style={styles.text}>{title}</AppText>
        {!isModal && (
          <TouchableOpacity onPress={onDownPress}>
            <ButtonIcon
              iconColor={downArrow ? colors.white : colors.dark}
              name="arrow-down-circle"
            />
          </TouchableOpacity>
        )}
        {isModal && (
          <ButtonIcon name="open-in-new" backgroundColor="transparent" />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ALSListHeader;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    backgroundColor: colors.dark,
  },
  text: {
    color: colors.white,
    fontWeight: '500',
  },
});
