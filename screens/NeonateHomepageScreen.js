import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import NCalcScreen from "../components/NCalcScreen";
import colors from "../config/colors";
import Button from "../components/buttons/Button";
import AppText from "../components/AppText";
import routes from "../navigation/routes";
import DateInputButton from "../components/buttons/input/DateInputButton";
import SexInputButton from "../components/buttons/input/SexInputButton";

const NeonateHomepageScreen = ({ navigation }) => {
  const [dob, setDob] = useState(null);
  const [sex, setSex] = useState(null);
  return (
    <NCalcScreen>
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
    <AppText style={styles.text}> Neonate </AppText>
    <ScrollView>
          <Button onPress={() => navigation.navigate(routes.BIRTH_CENTILE)}>
            {" "}
            Birth Centile Calculator{" "}
          </Button>
          <Button onPress={() => navigation.navigate(routes.NEONATE_CENTILE)}>
            {" "}
            Centile Calculator{" "}
          </Button>
          <Button
            onPress={() => navigation.navigate(routes.ENDOTRACHEAL_TUBE_LENGTH)}
          >
            {" "}
            Endotracheal Tube Length Calculator{" "}
          </Button>
          <Button onPress={() => navigation.navigate(routes.ENTERAL_FEED)}>
            {" "}
            Enteral Feed Calculator{" "}
          </Button>
          <Button onPress={() => navigation.navigate(routes.JAUNDICE)}>
            {" "}
            Jaundice Calculator{" "}
          </Button>
          </ScrollView>
        </View>
      </NCalcScreen>
  );
};

export default NeonateHomepageScreen;

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
