import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import NCalcScreen from '../components/NCalcScreen';
import NLSToolbar from '../components/NLSToolbar';
import colors from '../config/colors';
import ALSDisplayButton from '../components/buttons/ALSDisplayButton';
import ALSFunctionButton from '../components/buttons/ALSFunctionButton';
import ALSListHeader from '../components/buttons/ALSListHeader';
import Stopwatch from '../components/Stopwatch';
import GeneralAssessBaby from '../components/GeneralAssessBaby';
import AppText from '../components/AppText';
import {
  afterChestRise,
  flatListOneData,
  functionButtons,
} from '../brains/nlsObjects';
import LogModal from '../components/LogModal';
import NoChestRiseModal from '../components/NoChestRiseModal';
import InitialAssessmentModal from '../components/InitialAssessmentModal';
import ALSTeriaryFunctionButton from '../components/buttons/ALSTertiaryFunctionButton';

const NLSScreen = () => {
  const [reset, setReset] = useState(false);
  const [fButtons, setFunctionButtons] = useState(functionButtons);
  const [intervalTime, setIntervalTime] = useState(0);
  const [logVisible, setLogVisible] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [endEncounter, setEndEncounter] = useState(false);
  const [resuscitationRequired, setResuscitationRequired] = useState(false);
  const [initialAssessmentComplete, setInitialAssessmentComplete] = useState(
    false
  );
  const [assessBaby, setAssessBaby] = useState(false);
  const [assessTime, setAssessTime] = useState(0);

  const assessmentState = {
    value: assessBaby,
    setValue: setAssessBaby,
  };

  const assessmentTime = {
    value: assessTime,
    setValue: setAssessTime,
  };

  const initialAssessmentState = {
    value: initialAssessmentComplete,
    setValue: setInitialAssessmentComplete,
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

  const resusState = {
    value: resuscitationRequired,
    setValue: setResuscitationRequired,
  };

  //clears functionButtons object
  const resetLogTimes = (functionButtons) => {
    for (let value in functionButtons) {
      functionButtons[value] = [];
    }
    return functionButtons;
  };

  //reset button logic
  const handleReset = () => {
    if (reset == true) {
      setLogVisible(false);
      setFunctionButtons(resetLogTimes(functionButtons));
      setIsTimerActive(false);
      setEndEncounter(false);
      setReset(false);
      Alert.alert(
        'Your NLS encounter has been reset.',
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
    }
  };

  useEffect(() => {
    if (reset == true && logVisible == false) {
      setEndEncounter(false);
      handleReset();
    }
  });

  //reset button alert
  const resetLog = () => {
    Alert.alert(
      'Do you wish to reset your NLS encounter?',
      '',
      [
        {
          text: 'Reset',
          onPress: () => {
            setReset(true);
            handleReset();
          },
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
          style: 'cancel',
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

  useEffect(() => {
    if (endEncounter === true) {
      setLogVisible(true);
      setIsTimerActive(false);
    }
  });

  const renderListItem = ({ item }) => {
    if (item.type === 'preResusChecklist') {
      return (
        <ALSFunctionButton
          kind="neonate"
          title={item.id}
          logState={logState}
          encounterState={encounterState}
          resetState={resetState}
          timerState={timerState}
          type="checklist"
        />
      );
    } else if (item.type === 'resusRequired') {
      return (
        <ALSFunctionButton
          kind="neonate"
          title={item.id}
          logState={logState}
          encounterState={encounterState}
          resetState={resetState}
          timerState={timerState}
        />
      );
    } else if (item.type === 'afterChestRise') {
      return (
        <ALSTeriaryFunctionButton
          kind="neonate"
          title={item.id}
          logState={logState}
          encounterState={encounterState}
          resetState={resetState}
          timerState={timerState}
        />
      );
    } else if (item.type === 'listHeader') {
      return (
        <ALSListHeader
          title={item.id}
          downArrow={item.downArrow}
          onDownPress={() => scrollMe(item.onDownPress)}
          upArrow={item.upArrow}
          onUpPress={() => scrollMe(item.onUpPress)}
        />
      );
    } else if (item.type === 'modal') {
      return (
        <InitialAssessmentModal
          encounterState={encounterState}
          assessmentState={assessmentState}
          initialAssessmentState={initialAssessmentState}
          logState={logState}
          resetState={resetState}
          timerState={timerState}
        />
      );
    }
  };

  const scrollRef = useRef();

  const scrollMe = (coordinate) => {
    scrollRef.current?.scrollToOffset({
      offset: coordinate,
      animated: true,
    });
  };

  return (
    <NCalcScreen isResus={true} style={{ flex: 1 }}>
      <NLSToolbar
        reset={resetLog}
        logState={logState}
        encounterState={encounterState}
        resetState={resetState}
        timerState={timerState}
      />
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
          <GeneralAssessBaby
            assessmentState={assessmentState}
            assessmentTime={assessmentTime}
            encounterState={encounterState}
            logState={logState}
            resetState={resetState}
            timerState={timerState}
            style={styles.button}
          />
        </View>
        <View style={styles.verticalButtonContainer}>
          <LogModal
            kind="neonate"
            encounterState={encounterState}
            logInput={functionButtons}
            logVisibleState={logVisibleState}
            resetState={resetState}
            style={styles.button}
          />

          <NoChestRiseModal
            afterClose={() => scrollMe(1540)}
            encounterState={encounterState}
            logState={logState}
            resetState={resetState}
            timerState={timerState}
            style={styles.button}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <AppText style={styles.text}>NLS</AppText>
      </View>
      <View style={styles.bottomContainer}>
        <FlatList
          data={flatListOneData}
          keyExtractor={(flatListOneData) => flatListOneData.id.toString()}
          renderItem={renderListItem}
          ref={scrollRef}
          ListHeaderComponent={
            <ALSListHeader
              onDownPress={() => scrollMe(1000)}
              downArrow={true}
              title={'Pre-Resus Checklist:'}
            />
          }
          ListFooterComponent={
            <ALSFunctionButton
              kind="neonate"
              title={afterChestRise[afterChestRise.length - 1]['id']}
              logState={logState}
              encounterState={encounterState}
              timerState={timerState}
              resetState={resetState}
            />
          }
        />
      </View>
    </NCalcScreen>
  );
};

export default NLSScreen;

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: colors.medium,
    marginBottom: 200,
  },
  bottomContainer: {
    flexDirection: 'column',
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
    flexWrap: 'nowrap',
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
