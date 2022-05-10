import React from 'react';
import {StyleSheet, View, Switch, TouchableOpacity} from 'react-native';

import colors from '../../config/colors';
import {containerWidth} from '../../config/styles';
import AppText from '../AppText';

const UnitsSwitcher = ({
  children,
  isUnits,
  setIsUnits,
  falseUnits,
  trueUnits,
  backgroundColor,
}) => {
  const handleToggle = (parameter) => {
    if (parameter === 'middle') {
      setIsUnits(!isUnits);
    } else if (parameter === 'falseUnits') {
      setIsUnits(false);
    } else if (parameter === 'trueUnits') {
      setIsUnits(true);
    }
  };

  const background = backgroundColor
    ? {backgroundColor: backgroundColor}
    : null;

  return (
    <View style={[styles.container, background]}>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => handleToggle('falseUnits')}>
          <AppText style={[styles.textLeft, !isUnits && selectedText]}>
            {falseUnits}
          </AppText>
        </TouchableOpacity>
        <Switch
          value={isUnits}
          onValueChange={() => handleToggle('middle')}
          thumbColor="black"
          trackColor={{false: colors.light, true: colors.light}}
          ios_backgroundColor={colors.light}
        />
        <TouchableOpacity onPress={() => handleToggle('trueUnits')}>
          <AppText style={[styles.textRight, isUnits && selectedText]}>
            {trueUnits}
          </AppText>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

export default UnitsSwitcher;

const selectedText = {
  color: 'white',
};

const styles = StyleSheet.create({
  container: {
    width: containerWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 57,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.dark,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkest,
    padding: 6,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 22,
  },
  textLeft: {
    color: colors.darkMedium,
    paddingRight: 10,
  },
  textRight: {
    color: colors.darkMedium,
    paddingLeft: 10,
  },
});
