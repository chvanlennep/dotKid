import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Stopwatch = () => {

  const [seconds, setSeconds] = useState(0.01);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
      setIsActive(!isActive);

  }

  function reset() {
      setSeconds(0);
      setIsActive(false);
  }
   
  useEffect(() => {
          let interval = null;
          if (isActive) {
              interval = setInterval(() => {
                  setSeconds(seconds => seconds + 0.01);
              }, 1000);
            } else if (!isActive && seconds !== 0) {
                clearInterval(interval);
            }
            return () => clearInterval(interval);
              }, [isActive, seconds]);

          return (
              <Text>{seconds}</Text>
          )
          }
          export default Stopwatch;

          
