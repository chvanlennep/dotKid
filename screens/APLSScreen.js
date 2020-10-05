import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

import PCalcScreen from "../components/PCalcScreen";
import ALSToolbar from "../components/ALSToolbar";
import colors from "../config/colors";
import AppText from "../components/AppText";
import ALSDisplayButton from "../components/buttons/ALSDisplayButton";
import ALSFunctionButton from "../components/buttons/ALSFunctionButton";
import ALSListHeader from "../components/buttons/ALSListHeader";
import Stopwatch from "../components/Stopwatch";

import ALSTertiaryFunctionButton from "../components/buttons/ALSTertiaryFunctionButton";
import AdrenalineTimer from "../components/AdrenalineTimer";
import AnalyseRhythm from "../components/AnalyseRhythm";
import {
  flatListData,
  functionButtons,
  primaryButtons,
  tertiaryButtons,
} from "../brains/aplsObjects";
import parseLog from "../brains/parseLog";

const APLSScreen = () => {
  const [reset, setReset] = useState(false);

  const [fButtons, setFunctionButtons] = useState(functionButtons);
  const [intervalTime, setIntervalTime] = useState(0);
  const [adrenalineTime, setAdrenalineTime] = useState(0);
  const [rhythmTime, setRhythmTime] = useState(0);
  const [adrenalinePressed, setAdrenalinePressed] = useState(false);
  const [rhythmPressed, setRhythmPressed] = useState(false);

  const rhythmTimeState = {
    value: rhythmTime,
    setValue: setRhythmTime,
  };

  const rhythmPressedState = {
    value: rhythmPressed,
    setValue: setRhythmPressed,
  };

  const adrenalineTimeState = {
    value: adrenalineTime,
    setValue: setAdrenalineTime,
  };

  const adrenalinePressedState = {
    value: adrenalinePressed,
    setValue: setAdrenalinePressed,
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

  //clears functionButtons object
  const resetLogTimes = (functionButtons) => {
    for (let value in functionButtons) {
      functionButtons[value] = [];
    }
    return functionButtons;
  };

  //Adrenaline logic
  const adrenaline = () => {
    if (!adrenalinePressed) {
      setAdrenalinePressed(true);
      handleLogEvent(functionButtons, "Adrenaline Administered");
    } else if (adrenalinePressed) {
      Alert.alert(
        "You can only log this every 3 minutes",
        "Please click undo if you need to cancel this log entry.",
        [
          {
            text: "Undo",
            onPress: () => {
              removeTime("Adrenaline Administered", functionButtons);
              setAdrenalinePressed(false);
            },
            style: "cancel",
          },
          { text: "OK", onPress: () => "OK" },
        ],
        { cancelable: false }
      );
    }
  };

  //analyse rhythm logic
  const analyse = () => {
    if (!rhythmPressed) {
      setRhythmPressed(true);
      handleLogEvent(functionButtons, "Rhythm Analysed");
    } else if (rhythmPressed) {
      Alert.alert(
        "You can only log this every 2 minutes",
        "Please click undo if you need to cancel this log entry.",
        [
          {
            text: "Undo",
            onPress: () => {
              removeTime("Rhythm Analysed", functionButtons);
              setRhythmPressed(false);
            },
            style: "cancel",
          },
          { text: "OK", onPress: () => "OK" },
        ],
        { cancelable: false }
      );
    }
  };

  //reset button logic
  const handleReset = () => {
    setFunctionButtons(resetLogTimes(functionButtons));
    setReset(true);
    Alert.alert(
      "Your APLS Log has been reset.",
      "",
      [
        {
          text: "OK",
          onPress: () => "OK",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
    setReset(false);
  };

  //reset button alert
  const resetLog = () => {
    Alert.alert(
      "Do you wish to reset your APLS Log?",
      "",
      [
        { text: "Reset", onPress: () => handleReset() },
        {
          text: "Cancel",
          onPress: () => "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  // RIP Alert window
  const RIPAPLS = () => {
    Alert.alert(
      "Do you wish to terminate this APLS encounter?",
      "",
      [
        {
          text: "Yes - confirm patient as RIP",
          onPress: () => handleLogEvent(functionButtons, "RIP"),
        },
        {
          text: "Cancel",
          onPress: () => "Cancel",
        },
      ],
      { cancelable: false }
    );
  };
  // ROSC alert window
  const ROSCAPLS = () => {
    Alert.alert(
      "Do you wish to terminate this APLS encounter?",
      "",
      [
        {
          text: "Yes - confirm patient as ROSC",
          onPress: () => handleLogEvent(functionButtons, "ROSC"),
        },
        {
          text: "Cancel",
          onPress: () => "Cancel",
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
    if (item.type === "primaryButton" || item.type === "secondaryButton") {
      return (
        <ALSFunctionButton
          title={item.id}
          logState={logState}
          intervalState={intervalState}
          resetState={resetState}
        />
      );
    }
    if (item.type === "listHeader") {
      return <ALSListHeader title={item.id} />;
    } else {
      return (
        <ALSTertiaryFunctionButton
          title={item.id}
          intervalState={intervalState}
          logState={logState}
          resetState={resetState}
        />
      );
    }
  };

  return (
    <PCalcScreen style={{ flex: 1 }}>
      <ALSToolbar reset={resetLog} rip={RIPAPLS} rosc={ROSCAPLS} />
      <View style={styles.middleContainer}>
        <ALSDisplayButton style={styles.button}>
          {" "}
          <Stopwatch
            intervalState={intervalState}
            logState={logState}
            resetState={resetState}
          />
        </ALSDisplayButton>
        <ALSDisplayButton
          style={styles.button}
          onPress={() => {
            console.log(parseLog(functionButtons));
            Alert.alert(
              "View the log in the console",
              "",
              [
                {
                  text: "OK",
                  onPress: () => "OK",
                  style: "cancel",
                },
              ],
              { cancelable: true }
            );
          }}
        >
          Log
        </ALSDisplayButton>
        <ALSDisplayButton
          onPress={() => adrenaline()}
          style={[styles.button, adrenalinePressed && styles.buttonPressed]}
        >
          Adrenaline {"\n"}
          {adrenalinePressed && (
            <AdrenalineTimer
              adrenalinePressedState={adrenalinePressedState}
              adrenalineTimeState={adrenalineTimeState}
              resetState={resetState}
            />
          )}
        </ALSDisplayButton>
        <ALSDisplayButton
          onPress={() => analyse()}
          style={[styles.button, rhythmPressed && styles.buttonPressed]}
        >
          Analyse Rhythm {"\n"}
          {rhythmPressed && (
            <AnalyseRhythm
              rhythmPressedState={rhythmPressedState}
              rhythmTimeState={rhythmTimeState}
              resetState={resetState}
            />
          )}
        </ALSDisplayButton>
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
              title={primaryButtons[0]["id"]}
              logState={logState}
              intervalState={intervalState}
              resetState={resetState}
            />
          }
          ListFooterComponent={
            <ALSTertiaryFunctionButton
              title={tertiaryButtons[tertiaryButtons.length - 1]["id"]}
              intervalState={intervalState}
              logState={logState}
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
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: colors.dark,
    justifyContent: "center",
    width: "44%",
  },
  buttonPressed: {
    backgroundColor: colors.primary,
    flexWrap: "nowrap",
    height: 90,
    justifyContent: "center",
    textAlign: "center",
  },
  middleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: 10,
    width: "100%",
  },
  darkButton: {
    backgroundColor: colors.dark,
    alignSelf: "center",
  },
  mediumButton: {
    backgroundColor: colors.medium,
  },
  text: {
    fontSize: 28,
    marginBottom: 5,
  },
  textContainer: {
    marginLeft: 15,
    marginTop: 5,
  },
});
