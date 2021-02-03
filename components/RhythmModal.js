import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../app/config/colors';
import defaultStyles from '../../app/config/styles';
import AppText from './AppText';

import RhythmButton from './buttons/RhythmButton';
import ALSDisplayButton from './buttons/ALSDisplayButton';
import AnalyseRhythm from './AnalyseRhythm';

const RhythmModal = ({logState, resetState, style, timerState}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [rhythmPressed, setRhythmPressed] = useState(false);
  const [rhythmTime, setRhythmTime] = useState(0);
  const [blink, setBlink] = useState(false);
  const [pressedBefore, setPressedBefore] = useState(false);

  const isTimerActive = timerState.value;
  const setIsTimerActive = timerState.setValue;

  const functionButtons = logState.value;

  const modalState = {
    value: modalVisible,
    setValue: setModalVisible,
  };

  const rhythmPressedState = {
    value: rhythmPressed,
    setValue: setRhythmPressed,
  };

  const rhythmTimeState = {
    value: rhythmTime,
    setValue: setRhythmTime,
  };

  const reset = resetState.value;

  //analyse rhythm logic
  const analyse = () => {
    if (!rhythmPressed) {
      setModalVisible(true);
    } else if (rhythmPressed) {
      Alert.alert(
        'You can only log this every 2 minutes',
        'Please click undo if you need to cancel this log entry.',
        [
          {
            text: 'Undo',
            onPress: () => {
              setModalVisible(true);
            },
            style: 'cancel',
          },
          {text: 'OK', onPress: () => 'OK Pressed'},
        ],
        {cancelable: false},
      );
    }
  };

  useEffect(() => {
    if (
      reset ||
      functionButtons.ROSC.length > 0 ||
      functionButtons.RIP.length > 0
    ) {
      setPressedBefore(false);
      setRhythmPressed(false);
      if (isTimerActive) {
        setIsTimerActive(false);
      }
    }
  }, [reset, functionButtons, isTimerActive, setIsTimerActive]);

  useEffect(() => {
    if (rhythmPressed) {
      setPressedBefore(true);
      if (!isTimerActive) {
        setIsTimerActive(true);
      }
    }
  }, [rhythmPressed, isTimerActive, setIsTimerActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((oldBlink) => !oldBlink);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <React.Fragment>
      <ALSDisplayButton
        onPress={() => analyse()}
        style={[
          style,
          (rhythmPressed && styles.buttonPressed) ||
            (pressedBefore && blink && styles.buttonBlink),
        ]}>
        Analyse Rhythm
        {rhythmPressed && (
          <AnalyseRhythm
            rhythmPressedState={rhythmPressedState}
            rhythmTimeState={rhythmTimeState}
            resetState={resetState}
          />
        )}
      </ALSDisplayButton>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.closeIcon}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={colors.white}
                    size={30}
                  />
                </View>
              </TouchableOpacity>
              <AppText style={styles.heading}>Rhythm Analysis</AppText>
              <View style={styles.shocks}>
                <AppText style={styles.text}>Shockable:</AppText>
                <View style={styles.options}>
                  <RhythmButton
                    logState={logState}
                    modalState={modalState}
                    resetState={resetState}
                    rhythmPressedState={rhythmPressedState}
                    title={'Ventricular Fibrillation'}
                  />
                  <RhythmButton
                    logState={logState}
                    modalState={modalState}
                    resetState={resetState}
                    rhythmPressedState={rhythmPressedState}
                    title={'Pulseless VT'}
                  />
                </View>
              </View>
              <View style={styles.shocks}>
                <AppText style={styles.text}>Non-Shockable:</AppText>
                <View style={styles.options}>
                  <RhythmButton
                    logState={logState}
                    modalState={modalState}
                    resetState={resetState}
                    rhythmPressedState={rhythmPressedState}
                    title={'Asystole'}
                  />
                  <RhythmButton
                    logState={logState}
                    modalState={modalState}
                    resetState={resetState}
                    rhythmPressedState={rhythmPressedState}
                    title={'PEA'}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default RhythmModal;

const styles = StyleSheet.create({
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
  buttonBlink: {
    alignContent: 'center',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    //backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 20,
    marginTop: -30,
    marginBottom: 5,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    paddingBottom: 10,
    elevation: 5,
    height: defaultStyles.container.width + 20,
    width: defaultStyles.container.width - 10,
    backgroundColor: '#B32425',
  },
  options: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  shocks: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    margin: 10,
    padding: 5,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    margin: 10,
    color: colors.white,
  },
  touchable: {
    alignSelf: 'flex-start',
    //backgroundColor: "blue",
  },
});
