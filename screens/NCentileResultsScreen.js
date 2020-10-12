import React from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import NCalcScreen from "../components/NCalcScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AgeButton from "../components/buttons/AgeButton";
import Button from "../components/buttons/Button";
import MoreCentileInfo from "../components/buttons/MoreCentileInfo";

const NCentileResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  const results = parameters.results;

  const birthGestationInDays = results.birthGestationInDays;
  const correctedGestationInDays = results.correctedGestationInDays;

  const [weight, exactWeight] = results.centiles.weight;
  const [length, exactLength] = results.centiles.length;
  const [hc, exactHc] = results.centiles.hc;

  let weightTitle = "Weight:";
  if (measurements.weight) weightTitle = `Weight (${measurements.weight}g):`;
  let lengthTitle = "Length:";
  if (measurements.length) lengthTitle = `Length (${measurements.length}cm):`;
  let hcTitle = "Head Circumference:";
  if (measurements.hc) hcTitle = `Head Circumference (${measurements.hc}cm):`;

  return (
    <NCalcScreen style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="neonate"
          valueBeforeCorrection={birthGestationInDays}
          valueAfterCorrection={correctedGestationInDays}
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
                <AppText style={styles.text}>{lengthTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{length}</AppText>
              </View>
            </View>
            <MoreCentileInfo exactCentile={exactLength} />
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
    </NCalcScreen>
  );
};

export default NCentileResultsScreen;

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
