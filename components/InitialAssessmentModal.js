import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

import Button from "../components/buttons/Button";
import colors from "../../app/config/colors";
import defaultStyles from "../../app/config/styles";
import ALSDisplayButton from "./buttons/ALSDisplayButton";
import AppText from "./AppText";
import ALSFunctionButton from "./buttons/ALSFunctionButton";
import ALSListHeader from "./buttons/ALSListHeader";
import FormSubmitButton from "../components/buttons/FormSubmitButton";
import FormResetButton from "../components/buttons/FormResetButton";
import AppForm from "../components/AppForm";
import HeartRateInputButton from "../components/buttons/input/HeartRateInputButton";
import ChestMovementInputButton from "../components/buttons/input/ChestMovementInputButton";
import BreathingInputButton from "../components/buttons/input/BreathingInputButton";
import SaturationsInputButton from "../components/buttons/input/SaturationsInputButton";
import ToneInputButton from "../components/buttons/input/ToneInputButton";
import FiO2Slider from "./buttons/input/FiO2Slider";

const AssessBabyModal = ({
  encounterState,
  initialAssessmentState,
  logState,
  resetState,
  timerState,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const reset = resetState.value;
  const setReset = resetState.setValue;

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const initialAssessmentComplete = initialAssessmentState.value;
  const setInitialAssessmentComplete = initialAssessmentState.setValue;

  const isTimerActive = timerState.value;
  const setIsTimerActive = timerState.setValue;

  const oneMeasurementNeeded = "↑ We'll need this measurement too";

  const validationSchema = Yup.object().shape({
    heartRate: Yup.string()
      .required("↑ Please select a heart rate")
      .label("Heart Rate"),
    breathing: Yup.string()
      .required("↑ Please select a breathing assessment")
      .label("Breathing"),

    tone: Yup.string()
      .required("↑ Please select a tone assessment")
      .label("Tone"),
  });

  const initialValues = {
    heartRate: "",
    breathing: "",
    tone: "",
  };

  // logs time with event button
  const updateTime = (title, oldState) => {
    const timeStamp = new Date();
    const oldButtonArray = oldState[title];
    const newButtonArray = oldButtonArray.concat(timeStamp);
    setFunctionButtons((oldState) => {
      const updatingState = oldState;
      updatingState[title] = newButtonArray;
      return updatingState;
    });
  };

  const handleFormikSubmit = (values) => {
    updateTime(values.heartRate, functionButtons);
    updateTime(values.breathing, functionButtons);
    updateTime(values.tone, functionButtons);
    setModalVisible(false);
    setInitialAssessmentComplete(true);
    console.log(initialAssessmentComplete);
  };

  const handlePress = () => {
    if (initialAssessmentComplete) {
      Alert.alert(
        'One initial assessment per encounter. Please press "Assess Baby" if you wish to complete a further assessment',
        "",
        [
          {
            text: "Ok",
            onPress: () => "Cancel",
            style: "cancel",
          },
        ]
      );
    } else {
      setIsTimerActive(true);
      setModalVisible(true);
    }
  };

  // reset button logic

  useEffect(() => {
    if (reset == true) {
      setInitialAssessmentComplete(false);
    }
  });

  return (
    <React.Fragment>
      <ALSListHeader
        iconColor={initialAssessmentComplete ? colors.secondary : colors.dark}
        isModal={true}
        initialAssessmentState={initialAssessmentState}
        onPress={handlePress}
        style={[initialAssessmentComplete && styles.buttonPressed]}
        title="Initial Assessment"
      ></ALSListHeader>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Window has been closed.");
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
              <AppText style={styles.heading}>Initial Assessment</AppText>
              <KeyboardAwareScrollView>
                <View style={styles.assessment}>
                  <ALSFunctionButton
                    kind="neonate"
                    title={"Dry and wrap baby"}
                    timerState={timerState}
                    logState={logState}
                    encounterState={encounterState}
                    resetState={resetState}
                    style={styles.button}
                  />
                  <ALSFunctionButton
                    kind="neonate"
                    title={"Hat on"}
                    timerState={timerState}
                    logState={logState}
                    encounterState={encounterState}
                    resetState={resetState}
                    style={styles.button}
                  />
                  <AppForm
                    initialValues={initialValues}
                    onSubmit={handleFormikSubmit}
                    validationSchema={validationSchema}
                  >
                    <HeartRateInputButton />
                    <BreathingInputButton />
                    <ToneInputButton />

                    <FormResetButton
                      style={{ width: Dimensions.get("window").width * 0.85 }}
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
    alignContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 5,
    flexDirection: "column",
    flexWrap: "nowrap",
    margin: 10,
    padding: 7,
    paddingBottom: 15,
  },
  button: {
    backgroundColor: colors.dark,
  },
  buttonPressed: {
    backgroundColor: colors.secondary,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    height: 50,
    width: 50,
    //backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    alignSelf: "center",
    color: colors.white,
    fontSize: 20,
    marginTop: -30,
    marginBottom: 5,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    paddingBottom: 10,
    elevation: 5,
    flex: 0.7,
    width: defaultStyles.container.width - 10,
    backgroundColor: "#096534",
  },
  options: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  sats: {
    justifyContent: "center",
    backgroundColor: colors.dark,
    borderRadius: 5,
    height: 95,
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 5,
    padding: 10,
  },
  satsText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    margin: 4,
    color: colors.white,
  },
  slider: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  submit: {
    backgroundColor: colors.secondary,
    width: Dimensions.get("window").width * 0.85,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    margin: 3,
    color: colors.white,
  },
  touchable: {
    alignSelf: "flex-start",
    //backgroundColor: "blue",
  },
});
