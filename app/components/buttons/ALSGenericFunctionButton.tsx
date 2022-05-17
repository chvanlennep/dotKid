import React, {FC} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import colors from '../../config/colors';
import AppText from '../AppText';
import defaultStyles from '../../config/styles';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type GenericALSFunctionButtonProps = {
  changeBackground: boolean;
  handlePress: () => void;
  handleRemovePress: () => void;
  pressedColor: string;
  style?: StyleProp<ViewStyle> | null;
  title: string;
};

export const ALSGenericFunctionButton: FC<GenericALSFunctionButtonProps> = ({
  changeBackground,
  handlePress,
  handleRemovePress,
  pressedColor,
  title,
}) => (
  <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
    <View
      style={[
        styles.button,
        changeBackground && {
          backgroundColor: pressedColor,
        },
      ]}>
      <AppText style={styles.text}>{title}</AppText>
      {changeBackground && (
        <>
          <TouchableOpacity style={styles.undo} onPress={handleRemovePress}>
            <MaterialCommunityIcons
              name="refresh"
              color={colors.white}
              size={20}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  text: {
    textAlignVertical: 'center',
    height: 25,
    color: colors.white,
    width: defaultStyles.container.width / 1.3,
  },
  undo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
});
