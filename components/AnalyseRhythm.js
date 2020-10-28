import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

const AnalyseRhythm = ({ rhythmPressedState, rhythmTimeState, resetState }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const repeatTime = 120;
  const secondsPassed = useRef(0);

  const rhythmTime = rhythmTimeState.value;
  const setRhythmTime = rhythmTimeState.setValue;
  const rhythmPressed = rhythmPressedState.value;
  const setRhythmPressed = rhythmPressedState.setValue;
  const reset = resetState.value;
  const setReset = resetState.setValue;

  const start = useRef(new Date());
  let date;
  let secDiff;

  function secondsToHms(seconds) {
    if (!seconds) return '';

    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % 3600;

    let min = parseInt(duration / 60);
    duration = duration % 60;

    let sec = parseInt(duration);

    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }

    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h ${min}m ${sec}s`;
    } else if (min == 0) {
      return `${sec}s`;
    } else {
      return `${min}m ${sec}s`;
    }
  }

  useEffect(() => {
    if (rhythmPressed) {
      start.current = new Date();
      return () => start.current;
    }
  }, []);

  useEffect(() => {
    if (reset) {
      setRhythmPressed(false);
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      date = new Date();
      secDiff = Math.floor((date - start.current) / 1000);
      secondsPassed.current = repeatTime - secDiff;
      setTime(date.toLocaleTimeString());
      if (secondsPassed.current < 1) {
        setRhythmPressed(false);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  useEffect(() => {
    const displayInterval = setRhythmTime(secondsToHms(secondsPassed.current));

    return () => {
      rhythmTime;
    };
  });

  //   useEffect(() => {
  //     if (reset == true){
  //         secondsPassed.current = 0;
  //     };
  // }
  // )

  return <AppText style={styles.text}>{`\n${rhythmTime}`}</AppText>;
};

export default AnalyseRhythm;

// <div>{secondsPassed.current}</div>

const styles = StyleSheet.create({
  text: {
    //textAlign: 'center',
    color: colors.white,
    //textAlignVertical: 'center',
  },
});
