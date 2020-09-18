import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import PCalcScreen from "../components/PCalcScreen";
import DOBButton from "../components/buttons/DOBButton";
import InputButton from "../components/buttons/InputButton";
import AppText from "../components/AppText";
import colors from "../config/colors";
import SmallButton from "../components/buttons/SmallButton";
import DateInputButton from "../components/buttons/DateInputButton";
import SexInputButton from "../components/buttons/SexInputButton";
import NumberInputButton from "../components/buttons/NumberInputButton";

const PCentileScreen = () => {
  return (
    <PCalcScreen>
      <ScrollView>
        <View style={styles.topContainer}>
          <DateInputButton
            buttonName="Date of Birth"
            iconName="calendar-range"
          />
          <SexInputButton />
          <NumberInputButton
            buttonName="Height"
            iconName="arrow-up-down"
            unitsOfMeasurement="cm"
          />
          <NumberInputButton
            buttonName="Weight"
            iconName="chart-bar"
            unitsOfMeasurement="kg"
          />
          <NumberInputButton
            buttonName="Head Circumference"
            iconName="emoticon-outline"
            unitsOfMeasurement="cm"
          />
          <DateInputButton
            buttonName="Measured on"
            iconName="clock-outline"
            fillInToday={true}
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.title}>
              <AppText style={styles.text}>Height Centile: </AppText>
            </View>
            <View style={styles.buttons}>
              <SmallButton name="information-outline" />
              <SmallButton name="chart-line" />
            </View>
            <View style={styles.output}>
              <AppText style={styles.outputText}>The centile is</AppText>
            </View>
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.title}>
              <AppText style={styles.text}>Weight Centile: </AppText>
            </View>
            <View style={styles.buttons}>
              <SmallButton name="information-outline" />
              <SmallButton name="chart-line" />
            </View>
            <View style={styles.output}>
              <AppText style={styles.outputText}>The centile is </AppText>
            </View>
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.title}>
              <AppText style={styles.text}>BMI Centile: </AppText>
            </View>
            <View style={styles.buttons}>
              <SmallButton name="information-outline" />
              <SmallButton name="chart-line" />
            </View>
            <View style={styles.output}>
              <AppText style={styles.outputText}>The centile is </AppText>
            </View>
          </View>
          <View style={styles.outputContainer}>
            <View style={styles.title}>
              <AppText style={styles.text}>
                Head Circumference Centile:{" "}
              </AppText>
            </View>
            <View style={styles.buttons}>
              <SmallButton name="information-outline" />
              <SmallButton name="chart-line" />
            </View>
            <View style={styles.output}>
              <AppText style={styles.outputText}>The centile is </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </PCalcScreen>
  );
};

export default PCentileScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: "center",
    paddingHorizontal: 50,
    marginTop: 20,
    width: "100%",
    marginBottom: 75,
  },
  buttons: {
    //backgroundColor: "dodgerblue",
    flexDirection: "row",
    width: 96,
    justifyContent: "space-between",
  },
  outputContainer: {
    //backgroundColor: "orangered",
    alignSelf: "center",
    flexDirection: "row",
    flex: 2,
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
    width: "100%",
  },
  outputText: {
    //backgroundColor: "limegreen",
    color: colors.black,
    fontSize: 15,
    marginBottom: 40,
  },
  title: {
    alignContent: "center", //backgroundColor: "goldenrod",
    flexGrow: 2,
    justifyContent: "center",
    width: 150,
  },
  text: {
    color: colors.black,
    fontSize: 17,
  },
  topContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
});
