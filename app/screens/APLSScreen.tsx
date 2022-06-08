import React, {useState, useRef, useEffect} from 'react';
import {Alert, FlatList, ListRenderItem, StyleSheet, View} from 'react-native';

import PCalcScreen from '../components/PCalcScreen';
import ALSToolbar from '../components/ALSToolbar';
import defaultStyles from '../config/styles';
import colors from '../config/colors';
import AppText from '../components/AppText';
import ALSDisplayButton from '../components/buttons/ALSDisplayButton';
import {ALSFunctionButton} from '../components/buttons/ALSFunctionButton';
import ALSListHeader from '../components/buttons/ALSListHeader';
import Stopwatch from '../components/Stopwatch';
import {aplsStore} from '../brains/stateManagement/aplsState.store';

import {flatListData, tertiaryButtons} from '../brains/aplsObjects';
import RhythmModal from '../components/RhythmModal';
import LogModal from '../components/LogModal';
import Adrenaline from '../components/buttons/Adrenaline';
import {useNavigation} from '@react-navigation/native';

const APLSScreen = () => {
  const [logVisible, setLogVisible] = useState(false);

  const logVisibleState = {
    value: logVisible,
    setValue: setLogVisible,
  };

  //reset button alert
  const resetLog = (confirm = true) => {
    if (confirm) {
      Alert.alert(
        'Do you wish to reset your APLS encounter?',
        '',
        [
          {text: 'Reset', onPress: () => aplsStore.aplsReset()},
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      null;
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
            aplsStore.addTime('RIP');
            aplsStore.setEndEncounter(true);
            aplsStore.stopTimer();
            setLogVisible(true);
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
            aplsStore.addTime('ROSC');
            aplsStore.setEndEncounter(true);
            aplsStore.stopTimer();
            setLogVisible(true);
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

  const renderListItem: ListRenderItem<any> = ({item}) => {
    if (item.type === 'primaryButton' || item.type === 'secondaryButton') {
      return (
        <ALSFunctionButton
          kind="child"
          type="function"
          title={item.id}
          style={styles.listButton}
        />
      );
    }
    if (item.type === 'listHeader') {
      return (
        <ALSListHeader
          title={item.id}
          downArrow={item.downArrow}
          onDownPress={() => scrollMe(item.downPressLocation)}
          upArrow={item.upArrow}
          onUpPress={() => scrollMe(item.upPressLocation)}
          style={styles.headingButton}
        />
      );
    } else {
      return (
        <ALSFunctionButton
          acceptsMultipleClicks={true}
          kind="child"
          title={item.id}
          type={'function'}
          style={styles.listButton}
        />
      );
    }
  };

  const scrollRef = useRef();

  const scrollMe = (coordinate: string, animated = true) => {
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

  const manualStartTimer = () => {
    aplsStore.addTime('Start Time');
    aplsStore.startTimer();
  };

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (aplsStore.timerIsRunning) {
        e.preventDefault();
        handleBackPress(e);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clears the cache on page unmounting
  useEffect(() => {
    return () => {
      aplsStore.aplsReset();
    };
  }, []);

  return (
    <PCalcScreen isResus={true} style={{flex: 1}}>
      <ALSToolbar reset={resetLog} rip={RIPAPLS} rosc={ROSCAPLS} />
      <View style={styles.middleContainer}>
        <View style={[styles.verticalButtonContainer]}>
          <ALSDisplayButton onPress={manualStartTimer} style={styles.button}>
            <Stopwatch kind="child" />
          </ALSDisplayButton>
          <Adrenaline />
        </View>
        <View style={[styles.verticalButtonContainer]}>
          <LogModal
            logInput={aplsStore.functionButtons}
            logVisibleState={logVisibleState}
            style={styles.button}
            kind="child"
          />
          <RhythmModal style={styles.button} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <AppText style={styles.text}>APLS</AppText>
      </View>
      <View style={styles.bottomContainer}>
        <FlatList
          data={flatListData}
          keyExtractor={flatListData => flatListData.id.toString()}
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
            <ALSFunctionButton
              acceptsMultipleClicks={true}
              kind="child"
              title={tertiaryButtons[tertiaryButtons.length - 1]['id']}
              style={styles.listButton}
              type={'function'}
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

    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: 3,
  },
  verticalButtonContainer: {
    alignItems: 'center',
    flex: 1,
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

  StopwatchText: {
    color: colors.white,
  },
});
