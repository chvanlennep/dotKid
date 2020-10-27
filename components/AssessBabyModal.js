import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import Button from '../components/buttons/Button';
import colors from '../../app/config/colors';
import defaultStyles from '../../app/config/styles';
import ALSDisplayButton from './buttons/ALSDisplayButton';
import AppText from './AppText';
import ALSFunctionButton from './buttons/ALSFunctionButton';
import ALSListHeader from './buttons/ALSListHeader';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AppForm from '../components/AppForm';
import HeartRateInputButton from '../components/buttons/input/HeartRateInputButton';
import ChestMovementInputButton from '../components/buttons/input/ChestMovementInputButton';
import BreathingInputButton from '../components/buttons/input/BreathingInputButton';
import SaturationsInputButton from '../components/buttons/input/SaturationsInputButton';
import ToneInputButton from '../components/buttons/input/ToneInputButton';
import FiO2Slider from './buttons/input/FiO2Slider';
import AssessBabyTimer from './AssessBabyTimer';

const AssessBabyModal = ({
  assessmentState,
  assessmentTime,
  encounterState,
  logState,
  resetState,
  timerState,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const assessBaby = assessmentState.value;
  const setAssessBaby = assessmentState.setValue;

  const isTimerActive = timerState.value;
  const setIsTimerActive = timerState.setValue;

  const reset = resetState.value;

  const oneMeasurementNeeded = "↑ We'll need this measurement too";

  const validationSchema = Yup.object().shape({
    heartRate: Yup.string()
      .required('↑ Please select a heart rate')
      .label('Heart Rate'),
    chestMovement: Yup.string()
      .required('↑ Please select chest movement status')
      .label('Chest Movement'),
    breathing: Yup.string()
      .required('↑ Please select a breathing assessment')
      .label('Breathing'),
    saturations: Yup.string()
      .required('↑ Please select a saturations/colour assessment')
      .label('Sats/Colour'),
    tone: Yup.string()
      .required('↑ Please select a tone assessment')
      .label('Tone'),
    FiO2: Yup.number().required('↑ Please select an FiO2 value').label('FiO2'),
  });

  const initialValues = {
    heartRate: '',
    chestMovement: '',
    breathing: '',
    saturations: '',
    FiO2: '',
    tone: '',
  };

  // logs time with event button
  const updateTime = (title, oldState, FiO2) => {
    const timeStamp = new Date();
    if (title == 'FiO2') {
      oldState[`FiO2: ${FiO2}%`] = [];
      const oldButtonArray = oldState[`FiO2: ${FiO2}%`];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[`FiO2: ${FiO2}%`] = newButtonArray;
        return updatingState;
      });
    } else {
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    }
  };

  //form submission
  const handleFormikSubmit = (values) => {
    console.log(values);
    updateTime('FiO2', functionButtons, values.FiO2);
    updateTime(values.heartRate, functionButtons);
    updateTime(values.chestMovement, functionButtons);
    updateTime(values.breathing, functionButtons);
    updateTime(values.saturations, functionButtons);
    updateTime(values.tone, functionButtons);
    setAssessBaby(true);
    setModalVisible(false);
  };

  //starts timer and opens modal
  const handlePress = () => {
    setModalVisible(true);
    setIsTimerActive(true);
  };

  return (
    <React.Fragment>
      <ALSDisplayButton
        onPress={handlePress}
        style={[style, assessBaby && styles.buttonPressed]}
      >
        Assess Baby
        {assessBaby && (
          <AssessBabyTimer
            assessmentState={assessmentState}
            assessmentTime={assessmentTime}
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
            Alert.alert('Window has been closed.');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.closeIcon}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={colors.white}
                    size={30}
                  />
                </View>
              </TouchableOpacity>
              <AppText style={styles.heading}>Assess Baby</AppText>
              <View style={styles.sats}>
                <AppText style={styles.text}>
                  Acceptable pre-ductal Sp02
                </AppText>
                <AppText style={styles.satsText}>
                  2 min: 60% | 3 min: 70% | 4 min: 80% {'\n'}5 min: 85% | 10
                  min: 90%
                </AppText>
              </View>
              <KeyboardAwareScrollView>
                <View style={styles.assessment}>
                  <AppForm
                    initialValues={initialValues}
                    onSubmit={handleFormikSubmit}
                    validationSchema={validationSchema}
                  >
                    <HeartRateInputButton />
                    <ChestMovementInputButton />
                    <BreathingInputButton />
                    <SaturationsInputButton />
                    <FiO2Slider />
                    <ToneInputButton />

                    <FormResetButton
                      style={{ width: Dimensions.get('window').width * 0.85 }}
                    />
                    <FormSubmitButton
                      name="Complete Assessment"
                      style={styles.submit}
                    />
                  </AppForm>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default AssessBabyModal;
const styles = StyleSheet.create({
  assessment: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    margin: 10,
    padding: 7,
    paddingBottom: 15,
  },
  button: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: colors.dark,
    justifyContent: 'center',
    padding: 2,
    //width: "50%",
  },
  buttonPressed: {
    backgroundColor: colors.secondary,
    flexWrap: 'nowrap',
    height: 90,
    padding: 20,
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
    flex: 0.8,
    width: defaultStyles.container.width - 10,
    backgroundColor: colors.darkSecondary,
  },
  options: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  sats: {
    justifyContent: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    height: 95,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 5,
    padding: 10,
  },
  satsText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    margin: 4,
    color: colors.white,
  },
  slider: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  submit: {
    backgroundColor: colors.secondary,
    width: Dimensions.get('window').width * 0.85,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    margin: 3,
    color: colors.white,
  },
  timerText: {
    textAlign: 'center',
    color: colors.white,
  },
  touchable: {
    alignSelf: 'flex-start',
    //backgroundColor: "blue",
  },
});
