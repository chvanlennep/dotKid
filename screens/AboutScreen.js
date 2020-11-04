import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import AppText from "../components/AppText";
import ReferenceBackgroundScreen from "../components/ReferenceBackgroundScreen";
import colors from "../config/colors";
import defaultStyles from "../config/styles";

const AboutScreen = () => {
  const scheme = useColorScheme();
  const dark = scheme === "dark" ? true : false;

  return (
    <ReferenceBackgroundScreen>
      <ScrollView>
        <View style={styles.headingContainer}>
          <AppText style={styles.heading}>Important Information</AppText>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              { color: dark ? colors.white : colors.dark },
              { marginBottom: 0 },
            ]}
          >
            Please read and acknowledge the following information before using
            this app:
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            { backgroundColor: dark ? colors.dark : "#EBEBEB" },
          ]}
        >
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              { color: dark ? colors.lightSecondary : colors.darkSecondary },
            ]}
          >
            dotKid
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              { color: dark ? colors.white : colors.dark },
            ]}
          >
            dotKid is an app to aid qualified paediatric and neonatal staff in
            the functions of their professional role. Guidance is based on
            clinical guidelines as detailed in the References section.
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            { backgroundColor: dark ? colors.dark : "#EBEBEB" },
          ]}
        >
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              { color: dark ? colors.lightSecondary : colors.darkSecondary },
            ]}
          >
            Legal Disclaimer
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              { color: dark ? colors.white : colors.dark },
            ]}
          >
            ...
          </Text>
        </View>
      </ScrollView>
    </ReferenceBackgroundScreen>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    marginTop: 10,
    marginLeft: 12,
  },
  headingContainer: {
    padding: 10,
  },
  outputContainer: {
    backgroundColor: "#EBEBEB",
    padding: 10,
    paddingBottom: 20,
    borderRadius: 5,
    margin: 10,
    marginHorizontal: 10,
  },
  subheading: {
    color: colors.darkSecondary,
    fontSize: 20,
    marginTop: 10,
    marginLeft: 12,
  },
  hyperlink: {
    color: colors.darkPrimary,
    fontSize: 16,
    lineHeight: 23,
    marginLeft: 15,
    marginTop: -15,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    margin: 15,
  },
});
