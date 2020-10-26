import React, { useState, useEffect, useContext } from "react";
import {
  Platform,
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useFormikContext } from "formik";

import colors from "../../../config/colors";
import defaultStyles from "../../../config/styles";
import ButtonIcon from "../ButtonIcon";
import AppText from "../../AppText";
import ErrorMessage from "../../ErrorMessage";

const FiO2Slider = ({ name = "FiO2" }) => {
  const [showInput, setShowInput] = useState(false);
  const [buttonText, setButtonText] = useState("FiO2");
  const [showCancel, setShowCancel] = useState(false);
  const [FiO2, setFiO2] = useState(21);

  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();

  const stepArray = [21, 30, 40, 50, 60, 70, 80, 90, 100];

  const toggleInput = () => {
    if (showInput) {
      setShowInput(false);
      if (FiO2) {
        setButtonText(`FiO2: ${FiO2}%`);
        setShowCancel(true);
        setFieldValue(name, FiO2);
      } else {
        setButtonText(`FiO2`);
        setShowCancel(false);
      }
    } else {
      setShowInput(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setButtonText("FiO2");
    setShowInput(false);
    setFiO2("");
    if (!global) {
      setFieldValue(name, "");
    }
    setShowCancel(false);
  };

  useEffect(() => {
    // button has been filled in by user:
    if (showCancel && FiO2 && !showInput) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowInput(false);
          setShowCancel(false);
          setButtonText("FiO2");
          setFiO2("");
        }
      }
    }
  });

  return (
    <View>
      <View style={styles.button}>
        <TouchableOpacity onPress={toggleInput}>
          <View style={styles.buttonTextBox}>
            <ButtonIcon name="gas-cylinder" />
            <AppText style={{ color: colors.white }}>{buttonText}</AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity onPress={cancelInput}>
            <ButtonIcon name="refresh" />
          </TouchableOpacity>
        )}
      </View>
      {showInput && (
        <React.Fragment>
          <View style={styles.inputBox}>
            <Slider
              style={{
                width: Dimensions.get("window").width * 0.55,
                height: 40,
              }}
              minimumValue={21}
              maximumValue={100}
              step={10}
              value={FiO2}
              onValueChange={(value) => setFiO2(value)}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <AppText style={styles.output}>{FiO2}%</AppText>
          </View>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.submitButton}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}
    </View>
  );
};

export default FiO2Slider;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 57,
    margin: 5,
    padding: 10,
    paddingLeft: 10,
    width: Dimensions.get("window").width * 0.85,
  },
  buttonTextBox: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.72,
  },
  inputBox: {
    alignItems: "center",
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.dark,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 57,
    margin: 5,
    padding: 10,
    paddingHorizontal: 30,
    width: Dimensions.get("window").width * 0.85,
  },
  output: {
    color: colors.white,
    marginRight: 10,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: "center",
    width: Dimensions.get("window").width * 0.85,
  },
});
