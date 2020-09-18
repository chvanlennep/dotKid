import React, { useState } from "react";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import colors from "../../config/colors";

import globalStyles from "../../config/styles";

const TextInputBox = () => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const [value, onChangeText] = useState("");

  return (
    <View style={[styles.container, { width: buttonWidth }]}>
      <TextInput
        style={[
          globalStyles.text,
          { color: colors.white },
          { width: buttonWidth - 10 },
        ]}
        onChangeText={(text) => onChangeText(text)}
        value={value}
        clearTextOnFocus={true}
        keyboardType={"decimal-pad"}
        multiline={false}
        textAlignVertical="top"
      />
    </View>
  );
};

export default TextInputBox;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.dark,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
  },
});
