import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import PCalcScreen from "../components/PCalcScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import Button from "../components/buttons/Button";

const BSAResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;

  const BSA = parameters.output;

  return (
    <PCalcScreen style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: colors.light }}
          textStyle={{ color: colors.black }}
        />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>Body Surface Area:</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{output}m</AppText>
                <AppText style={{ fontSize: 12, lineHeight: 14 }}>2</AppText>
              </View>
              <View style={styles.referenceOutput}>
                <AppText style={styles.reference}>
                  Body surface area calculated according to the Mosteller
                  formula: {"\n"}BSA = sqrt ((height (cm) x weight (kg)/3600))
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};
export default BSAResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: "center",
    alignItems: "center",
    //backgroundColor: "dodgerblue",
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 75,
    height: "100%",
  },
  outputContainer: {
    //backgroundColor: "orangered",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: "100%",
    width: "100%",
  },
  outputTextBox: {
    padding: 10,
    paddingLeft: 10,
    paddingRight: 20,
    //backgroundColor: "limegreen",
    height: "100%",
    textAlign: "left",
    width: "85%",
  },
  output: {
    flexDirection: "row",
  },
  outputText: {
    fontSize: 16,
    textAlign: "left",
  },
  reference: {
    fontSize: 16,
  },
  referenceOutput: {
    marginTop: 10,
  },
  topContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 18,
    textAlign: "left",
    fontWeight: "500",
    paddingBottom: 5,
  },
});
