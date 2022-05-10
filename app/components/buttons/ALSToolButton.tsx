import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import AppText from '../AppText';
import colors from '../../config/colors';

type ALSToolButtonStyle = {
  name: string;
  onPress: () => void;
  style: ViewStyle;
};

const ALSToolButton: FC<ALSToolButtonStyle> = ({name, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, style]}>
        <AppText style={{color: colors.white}}>{name}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default ALSToolButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.medium,
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
