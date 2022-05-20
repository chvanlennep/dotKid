import React, {useEffect, useRef, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';

import NCalcScreen from '../components/NCalcScreen';
import NLSToolbar from '../components/NLSToolbar';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import ALSDisplayButton from '../components/buttons/ALSDisplayButton';
import {ALSFunctionButton} from '../components/buttons/ALSFunctionButton';
import ALSListHeader from '../components/buttons/ALSListHeader';
import Stopwatch from '../components/Stopwatch';
import GeneralAssessBaby from '../components/GeneralAssessBaby';
import AppText from '../components/AppText';
import {
  afterChestRise,
  flatListOneData,
  functionButtons as initialState,
} from '../brains/nlsObjects';
import LogModal from '../components/LogModal';
import NoChestRiseModal from '../components/NoChestRiseModal';
import InitialAssessmentModal from '../components/InitialAssessmentModal';
import {ALSTertiaryFunctionButton} from '../components/buttons/ALSTertiaryFunctionButton';
import {nlsStore} from '../brains/stateManagement/nlsState.store';
import {useNavigation} from '@react-navigation/native';

const NLSScreen = () => {
  const [reset, setReset] = useState(false);
  const [functionButtons, setFunctionButtons] = useState(initialState);
  const [logVisible, setLogVisible] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [endEncounter, setEndEncounter] = useState(false);
  const [initialAssessmentComplete, setInitialAssessmentComplete] =
    useState(false);
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
  const resetLog = () => {
    Alert.alert(
      'Do you wish to reset your NLS encounter?',
      '',
      [
        {
          text: 'Reset',
          onPress: () => {
            nlsStore.nlsReset();
            scrollMe(0);
          },
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const renderListItem = ({item}) => {
    if (item.type === 'preResusChecklist') {
      return (
        <ALSFunctionButton
          kind="neonate"
          title={item.id}
          type="checklist"
          style={styles.listButton}
        />
      );
    } else if (item.type === 'resusRequired') {
      return (
        <ALSFunctionButton
          kind="neonate"
          title={item.id}
          style={styles.listButton}
        />
      );
    } else if (item.type === 'afterChestRise') {
      return (
        <ALSFunctionButton
          acceptsMultipleClicks={true}
          kind="neonate"
          title={item.id}
          style={styles.listButton}
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
          style={styles.headingButton}
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

  const scrollMe = (coordinate, animated = true) => {
    scrollRef.current?.scrollToOffset({
      offset: coordinate,
      animated: animated ? true : false,
    });
  };

  const handleBackPress = e => {
    Alert.alert(
      'Are you sure you want a different resuscitation screen?',
      'This will reset your current resuscitation encounter',
      [
        {
          text: 'Yes',
          onPress: () => navigation.dispatch(e.data.action),
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (nlsStore.timerIsRunning) {
        e.preventDefault();
        handleBackPress(e);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clears the cache on page unmounting
  useEffect(() => {
    return () => {
      nlsStore.nlsReset();
    };
  }, []);

  return (
    <NCalcScreen isResus={true} style={{flex: 1}}>
      <NLSToolbar reset={resetLog} setLogVisible={setLogVisible} />
      <View style={styles.middleContainer}>
        <View style={styles.verticalButtonContainer}>
          <ALSDisplayButton onPress={nlsStore.startTimer} style={styles.button}>
            <Stopwatch kind="neonate" />
          </ALSDisplayButton>
          <GeneralAssessBaby
            assessmentState={assessmentState}
            assessmentTime={assessmentTime}
            encounterState={encounterState}
            logState={logState}
            resetState={resetState}
            timerState={timerState}
          />
        </View>
        <View style={styles.verticalButtonContainer}>
          <LogModal
            kind="neonate"
            logInput={nlsStore.functionButtons}
            logVisibleState={logVisibleState}
            style={styles.button}
          />

          <NoChestRiseModal
            afterClose={() => scrollMe(1470)}
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
          keyExtractor={flatListOneData => flatListOneData.id.toString()}
          renderItem={renderListItem}
          ref={scrollRef}
          ListHeaderComponent={
            <ALSListHeader
              title="Pre-Resus Checklist:"
              downArrow={true}
              onDownPress={() => scrollMe(600)}
              style={styles.headingButton}
            />
          }
          ListFooterComponent={
            <ALSFunctionButton
              acceptsMultipleClicks={true}
              kind="neonate"
              title={afterChestRise[afterChestRise.length - 1]['id']}
              style={styles.listButton}
            />
          }
        />
      </View>
    </NCalcScreen>
  );
};

export default NLSScreen;

const styles = StyleSheet.create({
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
  listButton: {
    width: defaultStyles.container.width - 10,
    alignSelf: 'center',
  },
  headingButton: {
    width: defaultStyles.container.width - 5,
    alignSelf: 'center',
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
  text: {
    fontSize: defaultStyles.windowWidth < 375 ? 24 : 27,
    marginBottom: defaultStyles.windowHeight <= 812 ? 0 : 5,
    marginTop: defaultStyles.windowHeight <= 812 ? 0 : 5,
  },
  textContainer: {
    marginLeft: 15,
  },
});
