import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";
import ButtonIcon from "../buttons/ButtonIcon";

const ALSTeriaryFunctionButton = ({
  encounterState,
  intervalState,
  logState,
  resetState,
  style,
  timerState,
  title,
}) => {
  const reset = resetState.value;
  const setReset = resetState.setValue;
  
  const endEncounter = encounterState.value;
  const setEndEncounter = encounterState.setValue;

  const isTimerActive = timerState.value;
  const setIsTimerActive = timerState.setValue;

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const intervalTime = intervalState.value;

  const [changeBackground, setChangeBackground] = useState(false);

  const [showUndo, setShowUndo] = useState(false);

  //number of times pressed logic
  const [clicks, setClicks] = useState(0);

  // logs time with event button
  const updateTime = (title, oldState) => {
    if (!endEncounter) {
      setIsTimerActive(true);
      const timeStamp = new Date();
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    } else {resetLog()}
  };

  //uses state to change background button color after selected
  const handleChangeBackground = (changeBackground, oldState, title) => {
    const oldButtonArray = oldState[title];
    if (oldButtonArray.length < 2) {
      setChangeBackground(false);
      return changeBackground;
    } else {
      return changeBackground;
    }
  };

  const handlePress = () => {
    //some logic to prevent double pressing may need to go here
    setClicks(clicks + 1);
    setChangeBackground(true);
    updateTime(title, functionButtons);
    setShowUndo(true);
  };

  // handles undo click - changes background if appropriate and removes last added time
  const removeTime = (title, oldState) => {
    const oldButtonArray = oldState[title];
    if (oldButtonArray.length < 2) {
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = [];
        setShowUndo(false);
        return updatingState;
      });
    } else {
      const newButtonArray = oldButtonArray.slice(0, -1);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        setShowUndo(true);
        return updatingState;
      });
    }
  };

  // global undo click handling
  const handleUndo = () => {
    handleChangeBackground(changeBackground, functionButtons, title);
    removeTime(title, functionButtons);
    console.log(functionButtons);
    setClicks(clicks - 1);
  };

  // reset button logic

  useEffect(() => {
    if (reset == true) {
      setChangeBackground(false);
      setClicks(0);
      setShowUndo(false);
    }
  });

  //reset button logic
  const handleReset = () => {
    setFunctionButtons(resetLogTimes(functionButtons));
    setReset(true);
    !isTimerActive ? setIsTimerActive(true) : setIsTimerActive(false);
    setEndEncounter(false)
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

  const resetLogTimes = (functionButtons) => {
    for (let value in functionButtons) {
    functionButtons[value] = [];
    }
    return functionButtons;
};

  return (
    <TouchableHighlight
      activeOpacity={0.5}
      underlayColor={colors.light}
      onPress={handlePress}
      style={[styles.button, style, changeBackground && styles.buttonPressed]}
      pressed={changeBackground}
      title={title}
    >
      <View style={styles.content}>
        <AppText style={{ color: colors.white }}>{`${title} ${
          clicks ? "x" + clicks : ""
        }`}</AppText>

        {showUndo && (
          <React.Fragment>
            <TouchableOpacity onPress={handleUndo}>
              <ButtonIcon name="refresh" backgroundColor={null} />
            </TouchableOpacity>
          </React.Fragment>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default ALSTeriaryFunctionButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
    width: "98%",
  },
  buttonPressed: {
    backgroundColor: colors.primary,
    flexWrap: "nowrap",
  },
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
