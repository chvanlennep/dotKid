import React from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";

import colors from "../../config/colors";
import ButtonIcon from "./ButtonIcon";
import AppText from "../AppText";

const InputButton = ({ name, children }) => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;
  return (
    <View>
      <View style={[styles.button, { width: buttonWidth }]}>
        <TouchableOpacity onPress={() => console.log("Boom")}>
          <View style={[styles.textBox, { width: buttonWidth - 55 }]}>
            <ButtonIcon name={name} />
            <AppText style={styles.text}>{children}</AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Boom")}>
          <ButtonIcon name="cancel" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
  },
  text: {
    color: colors.white
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
  },
});
