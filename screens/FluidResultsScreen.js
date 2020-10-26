import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import PCalcScreen from "../components/PCalcScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AgeButton from "../components/buttons/AgeButton";
import Button from "../components/buttons/Button";
import MoreCentileInfo from "../components/buttons/MoreCentileInfo";
const FluidResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  const centileResults = parameters.centileObject;

  let fluidTitle = `Calculated Fluid Requirements:`;
  let fluidReference = `...`;

  const [fluid, fluidText] = parameters.results;
  const ageBeforeCorrection = parameters.centileObject.ageBeforeCorrection;
  const ageAfterCorrection = parameters.centileObject.ageAfterCorrection;

  return (
    <PCalcScreen style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="child"
          valueBeforeCorrection={ageBeforeCorrection}
          valueAfterCorrection={ageAfterCorrection}
        />
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
                <AppText style={styles.text}>{fluidTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>
                  {fluid} ml/hour{"\n"}
                </AppText>
                <AppText style={styles.outputText}>{fluidText}</AppText>
              </View>
            </View>
            <MoreCentileInfo exactCentile={fluidReference} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default FluidResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: "center",
    alignItems: "center",
    // backgroundColor: "dodgerblue",
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 75,
    marginTop: 40,
  },
  outputContainer: {
    // backgroundColor: "orangered",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 80,
    width: "100%",
  },
  outputTextBox: {
    paddingLeft: 10,
    paddingRight: 20,
    // backgroundColor: "limegreen",
    textAlign: "left",
    justifyContent: "center",
    height: "100%",
    width: "85%",
  },
  outputText: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "left",
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
