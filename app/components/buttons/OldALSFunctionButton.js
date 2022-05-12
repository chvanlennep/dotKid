import React from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';

import colors from '../../config/colors';
import AppText from '../AppText';
import defaultStyles from '../../config/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ALSFunctionButton = ({
  encounterState,
  kind = 'child',
  logState,
  style,
  backgroundColorPressed = null,
  timerState,
  title,
  type = 'function',
}) => {
  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const endEncounter = encounterState.value;

  const specificArray = functionButtons[title];

  const changeBackground = specificArray.length > 0 ? true : false;

  const setIsTimerActive = timerState.setValue;
  const isTimerActive = timerState.value;

  const movingChest = title === 'Chest is now moving' ? true : false;

  // logs time with event button
  const updateTime = () => {
    //*need to work out what this does!!
    if (type === 'function' && !endEncounter) {
      if (!isTimerActive) {
        setIsTimerActive(true);
      }
      setFunctionButtons(oldState => {
        const timeStamp = new Date();
        const oldButtonArray = oldState[title];
        const newButtonArray = oldButtonArray.concat(timeStamp);
        const updatingState = {...oldState};
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    } else if (type === 'checklist' && !endEncounter) {
      setFunctionButtons(oldState => {
        const timeStamp = new Date();
        const oldButtonArray = oldState[title];
        const newButtonArray = oldButtonArray.concat(timeStamp);
        const updatingState = {...oldState};
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    }
  };

  const handlePress = () => {
    if (specificArray.length < 1) {
      updateTime();
    } else {
      Alert.alert(
        'You can only select this once',
        'Please click undo if you need to cancel this log entry.',
        [
          {
            text: 'Undo',
            onPress: () => removeTime(),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => null},
        ],
        {cancelable: false},
      );
    }
  };

  // handles undo click - changes background if appropriate and removes last added time
  const removeTime = () => {
    const oldButtonArray = functionButtons[title];
    if (oldButtonArray.length < 2) {
      setFunctionButtons(oldState => {
        const updatingState = {...oldState};
        updatingState[title] = [];
        return updatingState;
      });
    } else {
      const newButtonArray = oldButtonArray.slice(0, -1);
      setFunctionButtons(oldState => {
        const updatingState = {...oldState};
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    }
  };

  const pressedColor = kind === 'child' ? colors.primary : colors.secondary;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      underlayColor={colors.light}
      onPress={handlePress}
      pressed={changeBackground}
      title={title}>
      <View
        style={[
          styles.button,
          style,
          changeBackground && [
            {
              backgroundColor: backgroundColorPressed || pressedColor,
            },
          ],
        ]}>
        <AppText style={styles.text}>{title}</AppText>
        {changeBackground && !movingChest && (
          <React.Fragment>
            <TouchableOpacity style={styles.undo} onPress={removeTime}>
              <MaterialCommunityIcons
                name="refresh"
                color={colors.white}
                size={20}
              />
            </TouchableOpacity>
          </React.Fragment>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ALSFunctionButton;

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
    width: defaultStyles.container.width - 55,
  },
  undo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
});
