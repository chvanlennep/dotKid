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
import defaultStyles from "../../config/styles";

const ALSFunctionButton = ({
  encounterState,
  kind = "child",
  logState,
  resetState,
  style,
  backgroundColorPressed = null,
  timerState,
  title,
  type = "function",
}) => {
  const reset = resetState.value;
  const setReset = resetState.setValue;

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const endEncounter = encounterState.value;
  const setEndEncounter = encounterState.setValue;

  const [changeBackground, setChangeBackground] = useState(false);

  const isTimerActive = timerState.value;
  const setIsTimerActive = timerState.setValue;

  const [showUndo, setShowUndo] = useState(false);

  //number of times pressed logic
  const [clicks, setClicks] = useState(0);

  // logs time with event button
  const updateTime = (title, oldState) => {
    if (type === "function" && !endEncounter) {
      setIsTimerActive(true);
      const timeStamp = new Date();
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    } else if (!endEncounter && type === "checklist") {
      const timeStamp = new Date();
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    } else {
      resetLog();
    }
  };
  //reset button logic
  const handleReset = () => {
    setFunctionButtons(resetLogTimes(functionButtons));
    setReset(true);
    !isTimerActive ? setIsTimerActive(true) : setIsTimerActive(false);
    setEndEncounter(false);
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
    if (clicks < 1) {
      setChangeBackground(true);
      updateTime(title, functionButtons);
      setShowUndo(true);
      setClicks(clicks + 1);
    } else {
      Alert.alert(
        "You can only select this once",
        "Please click undo if you need to cancel this log entry.",
        [
          {
            text: "Undo",
            onPress: () => handleUndo(),
            style: "cancel",
          },
          { text: "OK", onPress: () => "OK Pressed" },
        ],
        { cancelable: false }
      );
    }
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

  return (
    <TouchableHighlight
      activeOpacity={0.5}
      underlayColor={colors.light}
      onPress={handlePress}
      pressed={changeBackground}
      title={title}
    >
      <View
        style={[
          styles.button,
          style,
          changeBackground && [
            {
              backgroundColor:
                kind === "child"
                  ? backgroundColorPressed || colors.primary
                  : backgroundColorPressed || colors.secondary,
            },
          ],
        ]}
      >
        <AppText style={styles.text}>{title}</AppText>

        {showUndo && (
          <TouchableOpacity onPress={handleUndo}>
            <ButtonIcon name="refresh" backgroundColor={null} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default ALSFunctionButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    //justifyContent: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    //flex: 1,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
    paddingLeft: 20,
    width: "98%",
  },
  buttonPressed: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  text: {
    textAlignVertical: "center",
    height: 25,
    color: colors.white,
    width: "90%",
    //backgroundColor: 'black',
  },
});
