import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import AppText from '../AppText';

const NavigateButton = ({children, style, directions}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(directions);
      }}>
      <View style={[styles.button, style]}>
        <AppText style={{color: colors.white}}>{children}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default NavigateButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: defaultStyles.container.width - 25,
  },
});
