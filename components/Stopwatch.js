import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

const secondsToHms = (seconds) => {
  if (!seconds) {
    return '';
  }
  let duration = seconds;
  let hours = duration / 3600;
  duration = duration % 3600;

  let min = parseInt(duration / 60, 10);
  duration = duration % 60;

  let sec = parseInt(duration, 10);

  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }

  if (parseInt(hours, 10) > 0) {
    return `${parseInt(hours, 10)}h ${min}m ${sec}s`;
  } else if (min === '00') {
    return `${sec}s`;
  } else {
    return `${min}m ${sec}s`;
  }
};

const Stopwatch = ({logState}) => {
  const setFunctionButtons = logState.setValue;
  const functionButtons = logState.value;

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [intervalTime, setIntervalTime] = useState('');
  const secondsPassed = useRef(0);
  const start = useRef(functionButtons['Start Time'][0] || new Date());

  //adds start time or sets display time
  useEffect(() => {
    if (functionButtons['Start Time'].length < 1) {
      setFunctionButtons((old) => {
        const updatingState = {...old};
        const timeStamp = new Date();
        const tempArray = [];
        tempArray.push(timeStamp);
        updatingState['Start Time'] = tempArray;
        return updatingState;
      });
    } else {
      setIntervalTime(secondsToHms(secondsPassed.current));
    }
  }, [functionButtons, setFunctionButtons, time]);

  //Main timer
  useEffect(() => {
    const timeout = setTimeout(() => {
      const date = new Date();
      const secDiff = Math.floor((date - start.current) / 1000);
      secondsPassed.current = secDiff;
      setTime(date.toLocaleTimeString());
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [time, start]);

  return <AppText style={styles.text}>{intervalTime}</AppText>;
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  text: {
    color: colors.white,
  },
});
