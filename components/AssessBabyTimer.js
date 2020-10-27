import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

const AssessBabyTimer = ({ assessmentState, assessmentTime, resetState }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const repeatTime = 30;
  const secondsPassed = useRef(0);

  const assessBaby = assessmentState.value;
  const setAssessBaby = assessmentState.setValue;

  const assessTime = assessmentTime.value;
  const setAssessTime = assessmentTime.setValue;

  const reset = resetState.value;
  const setReset = resetState.setValue;

  //timer logic
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
    if (assessBaby) {
      start.current = new Date();
      return () => start.current;
    }
  }, []);

  useEffect(() => {
    if (reset) {
      setAssessBaby(false);
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      date = new Date();
      secDiff = Math.floor((date - start.current) / 1000);
      secondsPassed.current = repeatTime - secDiff;
      setTime(date.toLocaleTimeString());
      if (secondsPassed.current < 1) {
        setAssessBaby(false);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  useEffect(() => {
    const displayInterval = setAssessTime(secondsToHms(secondsPassed.current));

    return () => {
      assessTime;
    };
  });

  return <AppText style={styles.text}>{`\n${assessTime}`}</AppText>;
};

export default AssessBabyTimer;

// <div>{secondsPassed.current}</div>

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    alignSelf: 'center',
  },
});
