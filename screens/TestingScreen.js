import React from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import PCalcScreen from "../components/PCalcScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import SmallButton from "../components/buttons/SmallButton";
import DateInputButton from "../components/buttons/input/DateInputButton";
import SexInputButton from "../components/buttons/input/SexInputButton";
import NumberInputButton from "../components/buttons/input/NumberInputButton";
import GestationInputButton from "../components/buttons/input/GestationInputButton";
import SubmitButton from "../components/buttons/SubmitButton";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PCentileScreen from "./PCentileScreen";

const validationSchema = Yup.object().shape({
  dob: Yup.date().required().label("Date of Birth"),
  dom: Yup.date().required().label("Measured on"),
  gestationInDays: Yup.number().required().label("Birth Gestation"),
  sex: Yup.string().required().label("Sex"),
  height: Yup.number().min(10).max(250).label("Height"),
  weight: Yup.number().min(0.1).max(200).label("Weight"),
  hc: Yup.number().min(10).max(100).label("Head Circumference"),
});

function PCentileScreen() {
  return (
    <PCalcScreen>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <DateInputButton
            userLabel="Date of Birth"
            iconName="calendar-range"
            dateValue={dob}
            setDateValue={setDob}
          />
          <GestationInputButton weeksState={weeksState} daysState={daysState} />
          <SexInputButton value={sex} setValue={setSex} />
          <NumberInputButton
            userLabel="Height"
            iconName="arrow-up-down"
            unitsOfMeasurement="cm"
            value={height}
            setValue={setHeight}
          />
          <NumberInputButton
            userLabel="Weight"
            iconName="chart-bar"
            unitsOfMeasurement="kg"
            value={weight}
            setValue={setWeight}
          />
          <NumberInputButton
            userLabel="Head Circumference"
            iconName="emoticon-outline"
            unitsOfMeasurement="cm"
            value={hc}
            setValue={setHc}
          />
          <DateInputButton
            userLabel="Measured on"
            iconName="clock-outline"
            renderFilledIn={true}
            dateValue={dom}
            setDateValue={setDom}
          />
          <SubmitButton name="Reset" onPress={() => console.log("Reset")} />
          <SubmitButton
            name="Calculate Centiles"
            backgroundColor={colors.dark}
            onPress={() => console.log(collateMeasurements())}
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
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
}

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

export default PCentileScreen;
