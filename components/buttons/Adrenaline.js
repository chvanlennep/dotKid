import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import colors from '../../config/colors';
import AdrenalineTimer from '../AdrenalineTimer';
import ALSDisplayButton from './ALSDisplayButton';

const Adrenaline = ({ resetState, timerState, logState, removeTime }) => {
  const [adrenalinePressed, setAdrenalinePressed] = useState(false);
  const [adrenalineTime, setAdrenalineTime] = useState(0);
  const [blink, setBlink] = useState(false);
  const [pressedBefore, setPressedBefore] = useState(false);

  const adrenalineTimeState = {
    value: adrenalineTime,
    setValue: setAdrenalineTime,
  };

  const adrenalinePressedState = {
    value: adrenalinePressed,
    setValue: setAdrenalinePressed,
  };

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const setIsTimerActive = timerState.setValue;

  const reset = resetState.value;

  const handleLogEvent = (newState, title) => {
    setIsTimerActive(true);
    const newTime = new Date();
    const oldLogArray = newState[title];
    const newLogArray = oldLogArray.concat(newTime);
    setFunctionButtons((newState) => {
      const updateState = newState;
      updateState[title] = newLogArray;
      return updateState;
    });
  };

  const adrenaline = () => {
    setIsTimerActive(true);
    if (!adrenalinePressed) {
      setAdrenalinePressed(true);
      handleLogEvent(functionButtons, 'Adrenaline Administered');
    } else if (adrenalinePressed) {
      Alert.alert(
        'You can only log this every 3 minutes',
        'Please click undo if you need to cancel this log entry.',
        [
          {
            text: 'Undo',
            onPress: () => {
              removeTime('Adrenaline Administered', functionButtons);
              setAdrenalinePressed(false);
            },
            style: 'cancel',
          },
          { text: 'OK', onPress: () => 'OK' },
        ],
        { cancelable: false }
      );
    }
  };

  useEffect(() => {
    if (adrenalinePressed) {
      setPressedBefore(true);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((blink) => !blink);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (reset) {
      setPressedBefore(false);
    }
  }, [reset]);

  return (
    <ALSDisplayButton
      onPress={() => adrenaline()}
      style={[
        styles.button,
        (adrenalinePressed && styles.buttonPressed) ||
          (pressedBefore && blink && styles.buttonBlink),
      ]}
    >
      {!adrenalinePressed && 'Adrenaline'}
      {adrenalinePressed && (
        <AdrenalineTimer
          adrenalinePressedState={adrenalinePressedState}
          adrenalineTimeState={adrenalineTimeState}
          resetState={resetState}
        />
      )}
    </ALSDisplayButton>
  );
};

export default Adrenaline;

const styles = StyleSheet.create({
  button: {
    alignContent: 'center',
    backgroundColor: colors.dark,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.primary,
    flexWrap: 'nowrap',
    height: 90,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonBlink: {
    alignContent: 'center',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    textAlign: 'center',
  },
});
