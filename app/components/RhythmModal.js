import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../app/config/colors';
import defaultStyles from '../../app/config/styles';
import AppText from './AppText';

import RhythmButton from './buttons/RhythmButton';
import {aplsStore} from '../brains/stateManagement/aplsState.store';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const RhythmModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [blink, setBlink] = useState(false);

  const modalState = {
    value: modalVisible,
    setValue: setModalVisible,
  };

  let getRhythmTime = aplsStore.rhythmTimer();

  //analyse rhythm logic
  const analyse = () => {
    if (getRhythmTime === '') {
      setModalVisible(true);
    } else {
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
    const interval = setInterval(() => {
      setBlink(oldBlink => !oldBlink);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pressedStyle =
    aplsStore.getFunctionButtonTime('Rhythm Analysed').length > 0 &&
    getRhythmTime &&
    styles.buttonPressed;

  const blinkingStyle =
    aplsStore.getFunctionButtonTime('Rhythm Analysed').length > 0 &&
    getRhythmTime === '' &&
    blink &&
    styles.buttonBlink;

  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={() => analyse()}>
        <View style={[styles.button, pressedStyle || blinkingStyle]}>
          <AppText style={styles.holderText}>Analyse Rhythm</AppText>
          {getRhythmTime !== '' ? (
            <AppText style={styles.holderText}> {getRhythmTime} </AppText>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
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
                    modalState={modalState}
                    title={'Ventricular Fibrillation'}
                  />
                  <RhythmButton
                    modalState={modalState}
                    title={'Pulseless VT'}
                  />
                </View>
              </View>
              <View style={styles.shocks}>
                <AppText style={styles.text}>Non-Shockable:</AppText>
                <View style={styles.options}>
                  <RhythmButton modalState={modalState} title={'Asystole'} />
                  <RhythmButton modalState={modalState} title={'PEA'} />
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
    alignItems: 'center',
    borderRadius: 5,
    alignContent: 'center',
    backgroundColor: colors.dark,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    height: 57,
    marginVertical: 5,
    marginHorizontal: 3,
    width: defaultStyles.container.width / 2.075,
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
  holderText: {
    color: colors.white,
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
