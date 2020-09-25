import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import colors from "../config/colors";
import PCalcScreen from "../components/PCalcScreen";
import AppText from "../components/AppText";
import InputButton from "../components/buttons/InputButton";
import Button from "../components/buttons/Button";
import routes from "../navigation/routes";
import DateInputButton from "../components/buttons/input/DateInputButton";
import SexInputButton from "../components/buttons/input/SexInputButton";

const PaedsHomepageScreen = ({ navigation }) => {
  const [dob, setDob] = useState(null);
  const [sex, setSex] = useState(null);
  return (
    <PCalcScreen>
    <View style={styles.topContainer}>
    <DateInputButton
    userLabel="Date of Birth"
    iconName="calendar-range"
    dateValue={dob}
    setDateValue={setDob}
    />
    <SexInputButton value={sex} setValue={setSex} />
    </View>
    <View style={styles.bottomContainer}>
    <AppText style={styles.text}> Paediatric </AppText>
    <ScrollView>
          <Button onPress={() => navigation.navigate(routes.BLOOD_PRESSURE)}>
            {" "}
            Blood Pressure Calculator{" "}
          </Button>
          <Button onPress={() => navigation.navigate(routes.BODY_SURFACE_AREA)}>
            {" "}
            Body Surface Area Calculator{" "}
          </Button>
          <Button
            onPress={() => navigation.navigate(routes.PAEDIATRIC_CENTILE)}
          >
            {" "}
            Centile Calculator{" "}
          </Button>
          <Button onPress={() => navigation.navigate(routes.ECG)}>
            {" "}
            ECG Calculator{" "}
          </Button>
          <Button onPress={() => navigation.navigate(routes.FLUID_CALCULATOR)}>
            {" "}
            IV Fluid Calculator{" "}
          </Button>
          <Button onPress={() => navigation.navigate(routes.WETFLAG)}>
            {" "}
            WETFLAG{" "}
          </Button>
          </ScrollView>
        </View>
      </PCalcScreen>
  );
};

export default PaedsHomepageScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    padding: 20,
    marginTop: 20,
  },
  topContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    color: colors.black,
    marginBottom: 5,
  },
});
