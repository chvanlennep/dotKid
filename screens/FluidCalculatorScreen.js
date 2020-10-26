import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

import PCalcScreen from "../components/PCalcScreen";
import colors from "../config/colors";
import calculateCentile from "../brains/calculateCentile";
import ageChecker from "../brains/ageChecker";
import calculateFluid from "../brains/calculateFluid";
import DobInputButton from "../components/buttons/input/DobInputButton";
import GestationInputButton from "../components/buttons/input/GestationInputButton";
import SexInputButton from "../components/buttons/input/SexInputButton";
import NumberInputButton from "../components/buttons/input/NumberInputButton";
import FormResetButton from "../components/buttons/FormResetButton";
import AppForm from "../components/AppForm";
import routes from "../navigation/routes";
import { GlobalStateContext } from "../components/GlobalStateContext";
import { useNavigation } from "@react-navigation/native";
import FormSubmitButton from "../components/buttons/FormSubmitButton";
import zeit from "../brains/zeit";

const FluidCalculatorScreen = () => {
  const navigation = useNavigation();

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const oneMeasurementNeeded = "↑ We'll need this measurement too";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const validationSchema = Yup.object().shape({
    weight: Yup.number()
      .min(0.1, wrongUnitsMessage("kg"))
      .max(250, wrongUnitsMessage("kg"))
      .required(oneMeasurementNeeded),
    percentage: Yup.number()
      .min(50, "Minimum calculator correction = 50% of normal")
      .max(150, "Maximum calculator correction = 150% of normal")
      .required(oneMeasurementNeeded),
    sex: Yup.string().required("↑ Please select a sex").label("Sex"),
    dob: Yup.date()
      .nullable()
      .required("↑ Please enter a date of Birth")
      .label("Date of Birth"),
  });

  const initialValues = {
    weight: "",
    sex: "",
    gestationInDays: 280,
    dob: null,
    tob: null,
    percentage: "100",
    dom: new Date(new Date().getTime() + 10 * 60000),
  };

  const handleFormikSubmit = (values) => {
    let correctDays = 0;
    const age = zeit(values.dob, "days", values.dom, true, correctDays);
    const centileObject = calculateCentile(values);
    const ageCheck = ageChecker(values);

    switch (true) {
      case ageCheck === "Negative age":
        Alert.alert(
          "Time Travelling Patient",
          "Please check the dates entered",
          [{ text: "OK" }],
          { cancelable: false }
        );
        break;
      case ageCheck === "Over 18":
        Alert.alert(
          "Patient Too Old",
          "This calculator can only be used under 18 years of age",
          { text: "OK" },
          { cancelable: false }
        );
        break;
      default:
        const measurements = values;
        const results = calculateFluid(
          values.dob,
          values.dom,
          values.gestationInDays,
          values.weight,
          values.percentage,
          values.sex
        );
        const serialisedObject = JSON.stringify({
          results,
          centileObject,
          measurements,
        });
        navigation.navigate(routes.FLUID_RESULTS, serialisedObject);
    }
  };

  return (
    <PCalcScreen>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}
          >
            <DobInputButton name="dob" kind="child" />
            <GestationInputButton name="gestationInDays" kind="child" />
            <SexInputButton name="sex" kind="child" />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="child"
            />
            <NumberInputButton
              name="percentage"
              defaultValue="100"
              global={false}
              userLabel="Correction Factor"
              iconName="triangle-outline"
              unitsOfMeasurement="%"
              kind="child"
            />
            <FormResetButton />
            <FormSubmitButton name="Calculate Child Centiles" kind="child" />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default FluidCalculatorScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    paddingLeft: 50,
    marginTop: 20,
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
