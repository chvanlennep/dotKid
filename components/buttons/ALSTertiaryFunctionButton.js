import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../config/colors';
import AppText from '../AppText';
import defaultStyles from '../../config/styles';

const ALSTertiaryFunctionButton = ({
  kind = 'child',
  logState,
  backgroundColorPressed = null,
  style,
  timerState,
  title,
  inModal = false,
}) => {
  const isTimerActive = timerState.value;
  const setIsTimerActive = timerState.setValue;

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const specificArray = functionButtons[title];

  const clicks = specificArray.length;

  const changeBackground = clicks > 0 ? true : false;

  // logs time with event button
  const updateTime = () => {
    if (!isTimerActive) {
      setIsTimerActive(true);
    }
    setFunctionButtons((oldState) => {
      const timeStamp = new Date();
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      const updatingState = {...oldState};
      updatingState[title] = newButtonArray;
      return updatingState;
    });
  };

  // handles undo click - changes background if appropriate and removes last added time
  const removeTime = () => {
    const oldButtonArray = functionButtons[title];
    if (oldButtonArray.length === 1) {
      setFunctionButtons((oldState) => {
        const updatingState = {...oldState};
        updatingState[title] = [];
        return updatingState;
      });
    } else {
      const newButtonArray = oldButtonArray.slice(0, -1);
      setFunctionButtons((oldState) => {
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
      onPress={updateTime}
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
        <View
          style={[
            styles.textContainer,
            {width: defaultStyles.container.width - (inModal ? 85 : 55)},
          ]}>
          <AppText style={styles.text}>{`${title} ${
            clicks ? 'x' + clicks : ''
          }`}</AppText>
        </View>
        {changeBackground && (
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

export default ALSTertiaryFunctionButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  text: {
    color: colors.white,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  undo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
});
