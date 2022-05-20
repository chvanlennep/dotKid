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
  acceptsMultipleClicks?: boolean;
  changeBackground: boolean;
  handlePress: () => void;
  handleRemovePress: () => void;
  clicks?: number;
  pressedColor: string;
  style?: StyleProp<ViewStyle> | null;
  title: string;
};

export const ALSGenericFunctionButton: FC<GenericALSFunctionButtonProps> = ({
  acceptsMultipleClicks = false,
  changeBackground,
  handlePress,
  clicks,
  handleRemovePress,
  pressedColor,
  title,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
      <View
        style={[
          styles.button,
          changeBackground && {
            backgroundColor: pressedColor,
          },
        ]}>
        <AppText style={styles.text}>
          {title}
          {acceptsMultipleClicks && (clicks ? ' x' + clicks : '')}
        </AppText>

        {Boolean(changeBackground) && (
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
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: defaultStyles.container.width,
  },
  text: {
    textAlignVertical: 'center',
    height: 25,
    color: colors.white,
    width: defaultStyles.container.width / 1.2,
  },
  undo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
});
