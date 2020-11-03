import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import AppText from "../components/AppText";
import ReferenceBackgroundScreen from "../components/ReferenceBackgroundScreen";
import colors from "../config/colors";

const ReferenceScreen = () => {
  return (
    <ReferenceBackgroundScreen>
      <View style={styles.headingContainer}>
        <AppText style={styles.heading}>References</AppText>
      </View>
      <ScrollView>
        <View style={styles.outputContainer}>
          <AppText style={styles.subheading}>
            Child Centile / Birth Centile / Preterm Centile Calculators
          </AppText>
          <AppText style={styles.text}>
            - All functions based on RCPCH UK-WHO growth chart data
            {"\n"}- Some statistical methods used to extrapolate inbetween data
            points REF
          </AppText>
          <AppText
            style={styles.hyperlink}
            onPress={() =>
              Linking.openURL(
                "https://www.rcpch.ac.uk/resources/uk-who-growth-charts-guidance-health-professionals"
              )
            }
          >
            -{" "}
            {
              "https://www.rcpch.ac.uk/resources/uk-who-growth-charts-guidance-health-professionals"
            }
          </AppText>
        </View>
        <View style={styles.outputContainer}>
          <AppText style={styles.subheading}>Blood Pressure Calculator</AppText>
          <AppText style={styles.text}>
            - Based on values from European Society of Hypertension guidelines
          </AppText>
          <AppText
            style={styles.hyperlink}
            onPress={() =>
              Linking.openURL(
                "https://journals.lww.com/jhypertension/Fulltext/2016/10000/2016_European_Society_of_Hypertension_guidelines.2.aspx"
              )
            }
          >
            -{" "}
            {
              "https://journals.lww.com/jhypertension/Fulltext/2016/10000/2016_European_Society_of_Hypertension_guidelines.2.aspx"
            }
          </AppText>
        </View>
        <View style={styles.outputContainer}>
          <AppText style={styles.subheading}>
            Body Surface Area Calculator
          </AppText>
          <AppText style={styles.text}>
            - Body surface area calculated using the Mosteller formula {"\n"}-
            BSA = √((height (cm) x weight (kg)/3600))
          </AppText>
          <AppText
            style={styles.hyperlink}
            onPress={() =>
              Linking.openURL(
                "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5493254/"
              )
            }
          >
            - {"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5493254/"}
          </AppText>
        </View>
        <View style={styles.outputContainer}>
          <AppText style={styles.subheading}>ECG Calculator</AppText>
          <AppText style={styles.text}>
            - QTc calculated using the Bazett formula
          </AppText>
          <AppText
            style={styles.hyperlink}
            onPress={() =>
              Linking.openURL(
                "https://www.jpeds.com/article/S0022-3476(14)01206-2/abstract"
              )
            }
          >
            - {"https://www.jpeds.com/article/S0022-3476(14)01206-2/abstract"}
          </AppText>
        </View>
        <View style={styles.outputContainer}>
          <AppText style={styles.subheading}>
            Paediatric / Neonatal Fluid Calculators
          </AppText>
          <AppText style={styles.text}>
            - Fluid requirement calculators based on NICE guidelines for IV
            fluid therapy in children and young people
          </AppText>
          <AppText
            style={styles.hyperlink}
            onPress={() =>
              Linking.openURL(
                "https://www.nice.org.uk/guidance/ng29/chapter/Recommendations#principles-and-protocols-for-intravenous-fluid-therapy"
              )
            }
          >
            -{" "}
            {
              "https://www.nice.org.uk/guidance/ng29/chapter/Recommendations#principles-and-protocols-for-intravenous-fluid-therapy"
            }
          </AppText>
        </View>
        <View style={styles.outputContainer}>
          <AppText style={styles.subheading}>WETFLAG</AppText>
          <AppText style={styles.text}>
            - WETFLAG estimated weight and drug dosages based on Resus Council
            guidelines for estimated paediatric resuscitation values.
            {"\n"}- Default weight is based on 50th centile for patient sex
            according to UK-WHO paediatric growth chart values.
          </AppText>
          <AppText
            style={styles.hyperlink}
            onPress={() =>
              Linking.openURL(
                "https://www.resus.org.uk/sites/default/files/2020-03/PETchart-18-05-16.pdf"
              )
            }
          >
            -{" "}
            {
              "https://www.resus.org.uk/sites/default/files/2020-03/PETchart-18-05-16.pdf"
            }
          </AppText>
        </View>
        <View style={[styles.outputContainer, { marginBottom: 150 }]}>
          <AppText style={styles.subheading}>Jaundice Calculator</AppText>
          <AppText style={styles.text}>
            - Based on NICE jaundice treatment threshold graphs and values
          </AppText>
          <AppText
            style={styles.hyperlink}
            onPress={() =>
              Linking.openURL(
                "https://www.nice.org.uk/guidance/cg98/resources/treatment-threshold-graphs-excel-544300525"
              )
            }
          >
            -{" "}
            {
              "https://www.nice.org.uk/guidance/cg98/resources/treatment-threshold-graphs-excel-544300525"
            }
          </AppText>
        </View>
      </ScrollView>
    </ReferenceBackgroundScreen>
  );
};

export default ReferenceScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 12,
  },
  headingContainer: {
    padding: 10,
  },
  outputContainer: {
    backgroundColor: colors.dark,
    padding: 10,
    paddingBottom: 20,
    borderRadius: 10,
    margin: 5,
  },
  subheading: {
    color: colors.white,
    fontSize: 20,
    marginTop: 10,
    marginLeft: 12,
  },
  hyperlink: {
    color: "lightblue",
    fontSize: 16,
    lineHeight: 23,
    marginLeft: 15,
    marginTop: -15,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    margin: 15,
  },
});
