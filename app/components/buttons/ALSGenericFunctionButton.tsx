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
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ALSCommentModal} from '../ALSCommentModal';
import {CommentButton} from './CommentButton';

type GenericALSFunctionButtonProps = {
  acceptsMultipleClicks?: boolean;
  changeBackground: boolean;
  clicks?: number;
  handlePress: () => void;
  handleRemovePress: () => void;
  kind: 'child' | 'neonate';
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
  kind,
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
        {Boolean(changeBackground) && (
          <CommentButton kind={kind} title={title} />
        )}
        <AppText style={[styles.text, changeBackground && {marginLeft: 0}]}>
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
    justifyContent: 'space-between',
    margin: 5,
    padding: 10,
    paddingLeft: 5,
    width: defaultStyles.container.width,
  },
  text: {
    color: colors.white,
    height: 25,
    marginLeft: 38,
    textAlignVertical: 'center',
    width: defaultStyles.container.width / 1.4,
  },
  undo: {
    alignItems: 'center',
    // backgroundColor: 'orange',
    justifyContent: 'center',
    height: 35,
    margin: 5,
    marginLeft: 15,
    width: 35,
  },
});
