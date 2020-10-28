import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import PCalcScreen from '../components/PCalcScreen';
import ALSToolbar from '../components/ALSToolbar';
import colors from '../config/colors';
import AppText from '../components/AppText';
import ALSDisplayButton from '../components/buttons/ALSDisplayButton';
import ALSFunctionButton from '../components/buttons/ALSFunctionButton';
import ALSListHeader from '../components/buttons/ALSListHeader';
import Stopwatch from '../components/Stopwatch';

import ALSTertiaryFunctionButton from '../components/buttons/ALSTertiaryFunctionButton';
import AdrenalineTimer from '../components/AdrenalineTimer';
import AnalyseRhythm from '../components/AnalyseRhythm';
import {
  flatListData,
  functionButtons,
  primaryButtons,
  tertiaryButtons,
} from '../brains/aplsObjects';
import RhythmModal from '../components/RhythmModal';
import LogModal from '../components/LogModal';

const APLSScreen = () => {
  const [reset, setReset] = useState(false);
  const [fButtons, setFunctionButtons] = useState(functionButtons);
  const [intervalTime, setIntervalTime] = useState(0);
  const [adrenalineTime, setAdrenalineTime] = useState(0);
  const [adrenalinePressed, setAdrenalinePressed] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [endEncounter, setEndEncounter] = useState(false);

  const adrenalineTimeState = {
    value: adrenalineTime,
    setValue: setAdrenalineTime,
  };

  const adrenalinePressedState = {
    value: adrenalinePressed,
    setValue: setAdrenalinePressed,
  };

  const encounterState = {
    value: endEncounter,
    setValue: setEndEncounter,
  };

  const intervalState = {
    value: intervalTime,
    setValue: setIntervalTime,
  };

  const logState = {
    value: functionButtons,
    setValue: setFunctionButtons,
  };

  const resetState = {
    value: reset,
    setValue: setReset,
  };

  const logVisibleState = {
    value: logVisible,
    setValue: setLogVisible,
  };

  const timerState = {
    value: isTimerActive,
    setValue: setIsTimerActive,
  };

  //clears functionButtons object
  const resetLogTimes = (functionButtons) => {
    for (let value in functionButtons) {
      functionButtons[value] = [];
    }
    return functionButtons;
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

  //analyse rhythm logic
  const analyse = () => {
    setIsTimerActive(true);
    if (!rhythmPressed) {
      setRhythmPressed(true);
      handleLogEvent(functionButtons, 'Rhythm Analysed');
    } else if (rhythmPressed) {
      Alert.alert(
        'You can only log this every 2 minutes',
        'Please click undo if you need to cancel this log entry.',
        [
          {
            text: 'Undo',
            onPress: () => {
              removeTime('Rhythm Analysed', functionButtons);
              setRhythmPressed(false);
            },
            style: 'cancel',
          },
          { text: 'OK', onPress: () => 'OK' },
        ],
        { cancelable: false }
      );
    }
  };

  //reset button logic
  const handleReset = () => {
    setFunctionButtons(resetLogTimes(functionButtons));
    setReset(true);
    setIsTimerActive(false);
    setEndEncounter(false);
    Alert.alert(
      'Your APLS encounter has been reset.',
      '',
      [
        {
          text: 'OK',
          onPress: () => 'OK',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
    setReset(false);
  };

  //reset button alert
  const resetLog = () => {
    Alert.alert(
      'Do you wish to reset your APLS encounter?',
      '',
      [
        { text: 'Reset', onPress: () => handleReset() },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  // RIP Alert window
  const RIPAPLS = () => {
    Alert.alert(
      'Do you wish to terminate this APLS encounter?',
      '',
      [
        {
          text: 'Yes - confirm patient as RIP',
          onPress: () => {
            handleLogEvent(functionButtons, 'RIP');
            setLogVisible(true);
            setIsTimerActive(false);
            setEndEncounter(true);
          },
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
        },
      ],
      { cancelable: false }
    );
  };
  // ROSC alert window
  const ROSCAPLS = () => {
    Alert.alert(
      'Do you wish to terminate this APLS encounter?',
      '',
      [
        {
          text: 'Yes - confirm patient as ROSC',
          onPress: () => {
            handleLogEvent(functionButtons, 'ROSC');
            setLogVisible(true);
            setIsTimerActive(false);
            setEndEncounter(true);
          },
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
        },
      ],
      { cancelable: false }
    );
  };

  //removes time from log object
  const removeTime = (title, oldState) => {
    const oldButtonArray = oldState[title];
    if (oldButtonArray.length < 2) {
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = [];
        return updatingState;
      });
    } else {
      const newButtonArray = oldButtonArray.slice(0, -1);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    }
  };

  // adds time to log object
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

  const renderListItem = ({ item }) => {
    if (item.type === 'primaryButton' || item.type === 'secondaryButton') {
      return (
        <ALSFunctionButton
          title={item.id}
          logState={logState}
          encounterState={encounterState}
          resetState={resetState}
          timerState={timerState}
        />
      );
    }
    if (item.type === 'listHeader') {
      return <ALSListHeader isList={false} title={item.id} />;
    } else {
      return (
        <ALSTertiaryFunctionButton
          title={item.id}
          encounterState={encounterState}
          logState={logState}
          timerState={timerState}
          resetState={resetState}
        />
      );
    }
  };

  return (
    <PCalcScreen isResus={true} style={{ flex: 1 }}>
      <ALSToolbar reset={resetLog} rip={RIPAPLS} rosc={ROSCAPLS} />
      <View style={styles.middleContainer}>
        <View style={styles.verticalButtonContainer}>
          <ALSDisplayButton
            onPress={() => setIsTimerActive(true)}
            style={styles.button}
          >
            {!isTimerActive && 'Start Timer'}
            {isTimerActive && (
              <Stopwatch
                intervalState={intervalState}
                logState={logState}
                resetState={resetState}
                timerState={timerState}
              />
            )}
          </ALSDisplayButton>
          <ALSDisplayButton
            onPress={() => adrenaline()}
            style={[styles.button, adrenalinePressed && styles.buttonPressed]}
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
        </View>
        <View style={styles.verticalButtonContainer}>
          <LogModal
            encounterState={encounterState}
            logInput={functionButtons}
            logVisibleState={logVisibleState}
            style={styles.button}
            kind="child"
          />
          <RhythmModal
            logState={logState}
            resetState={resetState}
            style={styles.button}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <AppText style={styles.text}>APLS</AppText>
      </View>
      <View style={styles.bottomContainer}>
        <FlatList
          data={flatListData}
          keyExtractor={(flatListData) => flatListData.id.toString()}
          renderItem={renderListItem}
          ListHeaderComponent={
            <ALSFunctionButton
              title={primaryButtons[0]['id']}
              timerState={timerState}
              logState={logState}
              encounterState={encounterState}
              resetState={resetState}
            />
          }
          ListFooterComponent={
            <ALSTertiaryFunctionButton
              title={tertiaryButtons[tertiaryButtons.length - 1]['id']}
              logState={logState}
              encounterState={encounterState}
              timerState={timerState}
              resetState={resetState}
            />
          }
        />
      </View>
    </PCalcScreen>
  );
};

export default APLSScreen;

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: colors.medium,
    marginBottom: 200,
  },
  bottomContainer: {
    padding: 15,
    paddingTop: 5,
    flex: 1,
  },
  button: {
    alignContent: 'center',
    backgroundColor: colors.dark,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.primary,
    //flexWrap: 'nowrap',
    height: 90,
    justifyContent: 'center',
    textAlign: 'center',
  },
  middleContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    //backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: 3,
  },
  verticalButtonContainer: {
    alignItems: 'center',
    flex: 1,
    //backgroundColor: 'yellow',
  },
  darkButton: {
    backgroundColor: colors.dark,
    alignSelf: 'center',
  },
  mediumButton: {
    backgroundColor: colors.medium,
  },
  text: {
    fontSize: 28,
  },
  textContainer: {
    marginLeft: 15,
  },
});
