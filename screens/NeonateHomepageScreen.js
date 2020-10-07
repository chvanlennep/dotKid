import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import NCalcScreen from "../components/NCalcScreen";
import AppText from "../components/AppText";
import routes from "../navigation/routes";
import DobInputButton from "../components/buttons/input/DobInputButton";
import GestationInputButton from "../components/buttons/input/GestationInputButton";
import SexInputButton from "../components/buttons/input/SexInputButton";
import NavigateButton from "../components/buttons/NavigateButton";
import AppForm from "../components/AppForm";

const NeonateHomepageScreen = () => {
  return (
    <NCalcScreen isHomePage={true} style={{ flex: 2 }}>
      <View style={styles.topContainer}>
        <AppForm
          // dummy AppForm so useFormikContext line in components doesn't throw error here:
          initialValues={{
            dob: null,
            tob: null,
            gestationInDays: null,
            sex: null,
          }}
        >
          <DobInputButton global={true} kind="neonate" />
          <GestationInputButton global={true} kind="neonate" />
          <SexInputButton global={true} kind="neonate" />
        </AppForm>
      </View>
      <AppText style={styles.text}> Neonatal </AppText>
      <View style={styles.bottomContainer}>
        <ScrollView>
          <NavigateButton directions={routes.BIRTH_CENTILE}>
            Birth Centile Calculator
          </NavigateButton>
          <NavigateButton directions={routes.NEONATE_CENTILE}>
            Preterm Centile Calculator
          </NavigateButton>
          <NavigateButton directions={routes.ENDOTRACHEAL_TUBE_LENGTH}>
            Endotracheal Tube Length Calculator
          </NavigateButton>
          <NavigateButton directions={routes.ENTERAL_FEED}>
            Enteral Feed Calculator
          </NavigateButton>
          <NavigateButton directions={routes.JAUNDICE}>
            Jaundice Calculator
          </NavigateButton>
        </ScrollView>
      </View>
    </NCalcScreen>
  );
};

export default NeonateHomepageScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: "center",
    flex: 1,
  },
  topContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 3,
  },
});
