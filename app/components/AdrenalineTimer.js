import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

const AdrenalineTimer = ({
  adrenalinePressedState,
  adrenalineTimeState,
  resetState,
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const repeatTime = 180;
  const secondsPassed = useRef(0);

  const adrenalineTime = adrenalineTimeState.value;
  const setAdrenalineTime = adrenalineTimeState.setValue;
  const adrenalinePressed = adrenalinePressedState.value;
  const setAdrenalinePressed = adrenalinePressedState.setValue;
  const reset = resetState.value;
  const setReset = resetState.setValue;

  const start = useRef(new Date());
  let date;
  let secDiff;

  //NOW DEFUNCT

  useEffect(() => {
    if (adrenalinePressed) {
      start.current = new Date();
      return () => start.current;
    }
  }, []);

  useEffect(() => {
    if (reset) {
      setAdrenalinePressed(false);
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      date = new Date();
      secDiff = Math.floor((date - start.current) / 1000);
      secondsPassed.current = repeatTime - secDiff;
      setTime(date.toLocaleTimeString());
      if (secondsPassed.current < 1) {
        setAdrenalinePressed(false);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  useEffect(() => {
    const displayInterval = setAdrenalineTime(
      secondsToHms(secondsPassed.current),
    );

    return () => {
      adrenalineTime;
    };
  });

  return (
    <AppText style={styles.text}>
      Adrenaline {'\n'}
      {adrenalineTime}
    </AppText>
  );
};

export default AdrenalineTimer;

// <div>{secondsPassed.current}</div>

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: colors.white,
  },
});
