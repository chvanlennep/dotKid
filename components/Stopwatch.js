
import React, {useState, useRef, useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import colors from '../config/colors';
import AppText from './AppText';

const Stopwatch = ({ intervalState, logState, resetState }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const secondsPassed = useRef(0);

  const intervalTime = intervalState.value;
  const setIntervalTime = intervalState.setValue;

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const reset = resetState.value

  const [start, setStart] = useState(new Date())
  let date;
  let secDiff;

  function secondsToHms(seconds) {
    if (!seconds) return '';
   
    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % (3600);
   
    let min = parseInt(duration / 60);
    duration = duration % (60);
   
    let sec = parseInt(duration);
   
    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }
   
    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h ${min}m ${sec}s`
    }
    else if (min == 0) {
      return `${sec}s`
    }
    else {
      return `${min}m ${sec}s`
    }
  }

      //Logs start time
  const updateTime = (title, oldState) => {
    const timeStamp = new Date();
    const oldButtonArray = oldState[title];
    const newButtonArray = oldButtonArray.concat(timeStamp);
    setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
    });
}

    //makes start time object accessible to the function
  useEffect(() => {
    updateTime("Start Time", functionButtons)
    const startTime = functionButtons["Start Time"]
   return () => startTime[0]
  }, [])

  //Main timer
  useEffect(() => {

    const timeout = setTimeout(() => {
      date = new Date()
        secDiff = Math.floor( (date - start) / 1000)
      secondsPassed.current = secDiff;
      setTime(date.toLocaleTimeString());
    }, 1000);
    return () => {
      clearTimeout(timeout);
    }
  }, [time]);

  useEffect(() => {
      const displayInterval = setIntervalTime(secondsToHms(secondsPassed.current))
      return () => {intervalTime}
  })

  //Listens for reset
  useEffect(() => {
    if (reset){    
        updateTime("Start Time", functionButtons)
        const startTime = functionButtons["Start Time"]
        setStart(new Date())
    };
}
)

  return (
      <AppText style={styles.text}>{intervalTime}</AppText>

  )
}


export default Stopwatch;

// <div>{secondsPassed.current}</div>

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "column",
        flexWrap: "wrap"
    },
    text: {
        color: colors.white,
    }
})
