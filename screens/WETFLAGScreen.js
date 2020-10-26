import React, { useContext } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";

import PCalcScreen from "../components/PCalcScreen";
import WETFLAG from "../brains/WETFLAG";
import colors from "../config/colors";
import DobInputButton from "../components/buttons/input/DobInputButton";
import SexInputButton from "../components/buttons/input/SexInputButton";
import NumberInputButton from "../components/buttons/input/NumberInputButton";
import FormSubmitButton from "../components/buttons/FormSubmitButton";
import FormResetButton from "../components/buttons/FormResetButton";
import AppForm from "../components/AppForm";
import calculateCentile from "../brains/calculateCentile";
import routes from "../navigation/routes";
import { GlobalStateContext } from "../components/GlobalStateContext";

const WETFLAGScreen = () => {
  const navigation = useNavigation();

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const oneMeasurementNeeded = "↑ We'll need this measurement";
  const wrongUnitsMessage = (units) => {
    return `↑ Are you sure your input is in ${units}?`;
  };

  const validationSchema = Yup.object().shape({
    dob: Yup.date()
      .nullable()
      .required("↑ Please enter a date of Birth")
      .label("Date of Birth"),
    sex: Yup.string().required("↑ Please select a sex").label("Sex"),
  });

  const initialValues = {
    dob: null,
    sex: "",
    weight: Yup.number()
      .min(0.1, wrongUnitsMessage("kg"))
      .max(150, wrongUnitsMessage("kg")),
    dom: new Date(new Date().getTime() + 10 * 60000),
  };

  const handleFormikSubmit = (values) => {
    const centileObject = calculateCentile(values);
    console.log(values);
    let correctDays = 0;
    switch (true) {
      case centileObject === "Negative age":
        Alert.alert(
          "Time Travelling Patient",
          "Please check the dates entered",
          [{ text: "OK" }],
          { cancelable: false }
        );
        break;
      case centileObject === "Over 18":
        Alert.alert(
          "Patient Too Old",
          "This calculator can only be used under 18 years of age",
          { text: "OK" },
          { cancelable: false }
        );
        break;
      default:
        const measurements = values;
        const output = WETFLAG(
          values.dob,
          values.dom,
          values.sex,
          values.weight
        );
        console.log(output);
        const serialisedObject = JSON.stringify({
          output,
          centileObject,
          measurements,
        });

        navigation.navigate(routes.WETFLAG_RESULTS, serialisedObject);
    }
  };
  return (
    <PCalcScreen style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}
          >
            <DobInputButton name="dob" kind="child" />
            <SexInputButton name="sex" kind="child" />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
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

export default WETFLAGScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: "center",
    paddingHorizontal: 50,
    marginTop: 20,
    width: "100%",
    marginBottom: 75,
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
    width: 250,
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
