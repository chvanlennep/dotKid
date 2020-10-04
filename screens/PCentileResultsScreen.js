import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import PCalcScreen from "../components/PCalcScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import SmallButton from "../components/buttons/SmallButton";
import AgeButton from "../components/buttons/AgeButton";
import Button from "../components/buttons/Button";
import MoreCentileInfo from "../components/buttons/MoreCentileInfo";

const PCentileResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  const results = parameters.results;

  const { ageAfterCorrection, ageBeforeCorrection, centiles, under2 } = results;

  let heightTitle;
  let heightTitleAddition = "";
  if (measurements.height) {
    heightTitleAddition = ` (${measurements.height}cm)`;
  }
  under2
    ? (heightTitle = `Length${heightTitleAddition}:`)
    : (heightTitle = `Height${heightTitleAddition}:`);
  let weightTitle;
  measurements.weight
    ? (weightTitle = `Weight (${measurements.weight}kg):`)
    : (weightTitle = "Weight:");
  let bmiTitle = "BMI:";
  if (measurements.weight && measurements.height) {
    const rawBmi =
      measurements.weight /
      ((measurements.height / 100) * (measurements.height / 100));
    const bmiString = rawBmi.toFixed(1);
    bmiTitle = `BMI (${bmiString}kg/m²):`;
  }
  let hcTitle = "Head Circumference:";
  if (measurements.hc) {
    hcTitle = `Head Circumference (${measurements.hc}cm):`;
  }

  const [weight, exactWeight] = centiles.weight;
  const [height, exactHeight] = centiles.height;
  const [hc, exactHc] = centiles.hc;
  const [bmi, exactBmi] = centiles.bmi;

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
                <AppText style={styles.text}>{weightTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{weight}</AppText>
              </View>
            </View>
            <MoreCentileInfo exactCentile={exactWeight} />
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{heightTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{height}</AppText>
              </View>
            </View>
            <MoreCentileInfo exactCentile={exactHeight} />
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{bmiTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{bmi}</AppText>
              </View>
            </View>
            <MoreCentileInfo exactCentile={exactBmi} />
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{hcTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{hc}</AppText>
              </View>
            </View>
            <MoreCentileInfo exactCentile={exactHc} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default PCentileResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: "center",
    alignItems: "center",
    // backgroundColor: "dodgerblue",
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 75,
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
    //backgroundColor: "limegreen",
    textAlign: "left",
    justifyContent: "center",
    height: "100%",
    width: "85%",
  },
  outputText: {
    fontSize: 16,
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
