import React, {FC} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

import colors from '../../config/colors';
import AppText from '../AppText';
import defaultStyles from '../../config/styles';

type InputButtonType = {
  label: string;
  style: ViewStyle;
  onPress: () => void;
  textStyle?: TextStyle;
};

const InputButton: FC<InputButtonType> = ({
  label,
  style,
  textStyle = {color: colors.white},
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, style]}>
        <AppText style={textStyle}>{label}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default InputButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 57,
    margin: 5,
    padding: 10,
    ...defaultStyles.container,
  },
});
