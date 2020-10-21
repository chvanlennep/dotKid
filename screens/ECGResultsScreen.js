import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import PCalcScreen from "../components/PCalcScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import SmallButton from "../components/buttons/SmallButton";
import AgeButton from "../components/buttons/AgeButton";
import Button from "../components/buttons/Button";
import MoreBPInfo from "../components/buttons/MoreBPInfo";
import MoreCentileInfo from "../components/buttons/MoreCentileInfo";

const BPResultsScreen = ({ route, navigation }) => {
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;
  console.log(parameters.QTCOutput);

  let QTcTitle = `QT (${parameters.measurements.qtinterval} seconds)`;
  let referenceTitle;
  const ageBeforeCorrection = parameters.centileObject.ageBeforeCorrection;
  const ageAfterCorrection = parameters.centileObject.ageAfterCorrection;
  const [QTc, reference] = parameters.QTCOutput;

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
                <AppText style={styles.text}>{QTcTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>
                  {QTc}
                  {"\n"}
                  {"\n"}
                </AppText>
                <AppText style={styles.reference}>
                  Reference values:
                  {"\n"}
                </AppText>
                <AppText style={styles.outputText}>{reference}</AppText>
              </View>
            </View>
            <MoreCentileInfo exactCentile={reference} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default BPResultsScreen;

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
  outputText: {
    fontSize: 16,
    textAlign: "left",
  },
  reference: {},
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
