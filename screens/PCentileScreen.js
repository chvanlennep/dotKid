import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import PCalcScreen from "../components/PCalcScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import SmallButton from "../components/buttons/SmallButton";
import DateInputButton from "../components/buttons/input/DateInputButton";
import SexInputButton from "../components/buttons/input/SexInputButton";
import NumberInputButton from "../components/buttons/input/NumberInputButton";
import GestationInputButton from "../components/buttons/input/GestationInputButton";
import SubmitButton from "../components/buttons/SubmitButton";

const PCentileScreen = () => {
  const [sex, setSex] = useState(null);
  const [dob, setDob] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [hc, setHc] = useState(null);
  const [dom, setDom] = useState(new Date());
  const [gestationWeeks, setGestationWeeks] = useState(40);
  const [gestationDays, setGestationDays] = useState(0);
  const weeksState = {
    value: gestationWeeks,
    setValue: setGestationWeeks,
  };
  const daysState = {
    value: gestationDays,
    setValue: setGestationDays,
  };

  const collateMeasurements = () => {
    return {
      sex: sex,
      dob: dob,
      height: height,
      weight: weight,
      hc: hc,
      dom: dom,
      gestationInDays: gestationWeeks * 7 + gestationDays,
    };
  };

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
