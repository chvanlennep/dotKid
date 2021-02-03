import React, {useEffect, useState, useRef} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';

import PCalcScreen from '../components/PCalcScreen';
import ALSToolbar from '../components/ALSToolbar';
import defaultStyles from '../config/styles';
import colors from '../config/colors';
import AppText from '../components/AppText';
import ALSDisplayButton from '../components/buttons/ALSDisplayButton';
import ALSFunctionButton from '../components/buttons/ALSFunctionButton';
import ALSListHeader from '../components/buttons/ALSListHeader';
import Stopwatch from '../components/Stopwatch';
import ALSTertiaryFunctionButton from '../components/buttons/ALSTertiaryFunctionButton';

import {
  flatListData,
  functionButtons as initialFunctionButtons,
  tertiaryButtons,
} from '../brains/aplsObjects';
import RhythmModal from '../components/RhythmModal';
import LogModal from '../components/LogModal';
import Adrenaline from '../components/buttons/Adrenaline';

const APLSScreen = () => {
  const [reset, setReset] = useState(false);
  const [functionButtons, setFunctionButtons] = useState(
    initialFunctionButtons,
  );
  const [logVisible, setLogVisible] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [endEncounter, setEndEncounter] = useState(false);

  const encounterState = {
    value: endEncounter,
    setValue: setEndEncounter,
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

  //reset button alert
  const resetLog = (confirm = true) => {
    if (confirm) {
      Alert.alert(
        'Do you wish to reset your APLS encounter?',
        '',
        [
          {text: 'Reset', onPress: () => setReset(true)},
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      setReset(true);
    }
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
            setEndEncounter(true);
            setIsTimerActive(false);
          },
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
        },
      ],
      {cancelable: false},
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
            setEndEncounter(true);
            setIsTimerActive(false);
          },
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
        },
      ],
      {cancelable: false},
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

  const renderListItem = ({item}) => {
    if (item.type === 'primaryButton' || item.type === 'secondaryButton') {
      return (
        <ALSFunctionButton
          title={item.id}
          logState={logState}
          encounterState={encounterState}
          resetState={resetState}
          timerState={timerState}
          style={styles.listButton}
        />
      );
    }
    if (item.type === 'listHeader') {
      return (
        <ALSListHeader
          title={item.id}
          downArrow={item.downArrow}
          onDownPress={() => scrollMe(item.onDownPress)}
          upArrow={item.upArrow}
          onUpPress={() => scrollMe(item.onUpPress)}
          style={styles.headingButton}
        />
      );
    } else {
      return (
        <ALSTertiaryFunctionButton
          title={item.id}
          encounterState={encounterState}
          logState={logState}
          timerState={timerState}
          resetState={resetState}
          style={styles.listButton}
        />
      );
    }
  };

  const scrollRef = useRef();

  const scrollMe = (coordinate, animated = true) => {
    scrollRef.current?.scrollToOffset({
      offset: coordinate,
      animated: animated ? true : false,
    });
  };

  useEffect(() => {
    if (reset) {
      setFunctionButtons((old) => {
        const newFunctionButtons = {...old};
        for (let value in newFunctionButtons) {
          newFunctionButtons[value] = [];
        }
        return newFunctionButtons;
      });
      setIsTimerActive(false);
      setEndEncounter(false);
      setReset(false);
      scrollMe(0, false);
    }
  }, [reset]);

  return (
    <PCalcScreen isResus={true} style={{flex: 1}}>
      <ALSToolbar reset={resetLog} rip={RIPAPLS} rosc={ROSCAPLS} />
      <View style={styles.middleContainer}>
        <View style={styles.verticalButtonContainer}>
          <ALSDisplayButton
            onPress={() => setIsTimerActive(true)}
            style={styles.button}>
            {!isTimerActive && 'Start Timer'}
            {isTimerActive && <Stopwatch logState={logState} />}
          </ALSDisplayButton>
          <Adrenaline
            removeTime={removeTime}
            resetState={resetState}
            timerState={timerState}
            logState={logState}
          />
        </View>
        <View style={styles.verticalButtonContainer}>
          <LogModal
            encounterState={encounterState}
            resetState={resetState}
            logInput={functionButtons}
            logVisibleState={logVisibleState}
            style={styles.button}
            kind="child"
          />
          <RhythmModal
            logState={logState}
            resetState={resetState}
            style={styles.button}
            timerState={timerState}
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
          ref={scrollRef}
          ListHeaderComponent={
            <ALSListHeader
              title="Resuscitation Required:"
              downArrow={true}
              onDownPress={() => scrollMe(600)}
              style={styles.headingButton}
            />
          }
          ListFooterComponent={
            <ALSTertiaryFunctionButton
              title={tertiaryButtons[tertiaryButtons.length - 1]['id']}
              logState={logState}
              encounterState={encounterState}
              timerState={timerState}
              resetState={resetState}
              style={styles.listButton}
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
    flexDirection: 'column',
    paddingTop: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
    fontSize: defaultStyles.windowWidth < 375 ? 24 : 27,
    marginBottom: defaultStyles.windowHeight <= 812 ? 0 : 5,
    marginTop: defaultStyles.windowHeight <= 812 ? 0 : 5,
  },
  textContainer: {
    marginLeft: 15,
  },
  listButton: {
    width: defaultStyles.container.width - 10,
    alignSelf: 'center',
  },
  headingButton: {
    width: defaultStyles.container.width - 5,
    alignSelf: 'center',
  },
});
