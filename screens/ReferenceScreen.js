import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AppText from '../components/AppText';
import ReferenceBackgroundScreen from '../components/ReferenceBackgroundScreen';
import colors from '../config/colors';
import defaultStyles from '../config/styles';

const ReferenceScreen = () => {
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;

  const outputBackgroundColor = {
    backgroundColor: scheme === 'dark' ? colors.dark : '#EBEBEB',
  };
  const linkTextColor = {
    color: scheme === 'dark' ? colors.lightPrimary : colors.darkPrimary,
  };

  return (
    <ReferenceBackgroundScreen style={{flex: 1}}>
      <ScrollView>
        <View style={styles.headingContainer}>
          <AppText style={styles.heading}>References</AppText>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            APGAR
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Standardised scoring system used worldwide
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://patient.info/doctor/neonatal-examination#nav-1',
              )
            }>
            {'Patient UK: Newborn Examination'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            APLS
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Based on Resus Council APLS guidelines
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.resus.org.uk/library/2015-resuscitation-guidelines/paediatric-advanced-life-support',
              )
            }>
            {'Resus Council: Advanced Paediatric Life Support'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            Blood Pressure Calculator
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Based on values from European Society of Hypertension guidelines
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://journals.lww.com/jhypertension/Fulltext/2016/10000/2016_European_Society_of_Hypertension_guidelines.2.aspx',
              )
            }>
            {'European Society of Hypertension Guidelines'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            Body Surface Area Calculator
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Body surface area calculated using the Mosteller formula {'\n'}-
            BSA = √((height (cm) x weight (kg)/3600))
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL('https://pubmed.ncbi.nlm.nih.gov/3657876/')
            }>
            {'The Mosteller Equation'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            Child Centile / Birth Centile / Preterm Centile Calculators
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - All calculations based on RCPCH UK-WHO growth chart data (under
            licence from LifeArc)
            {'\n'}- LMS statistical functions, as described in the link below,
            used to calculate centiles
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.rcpch.ac.uk/resources/uk-who-growth-charts-guidance-health-professionals',
              )
            }>
            {'UK-WHO Growth Charts'}
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL('https://www.who.int/growthref/computation.pdf')
            }>
            {'WHO: Computation of Centiles'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            Jaundice Calculator
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Based on NICE jaundice treatment threshold graphs and values
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.nice.org.uk/guidance/cg98/resources/treatment-threshold-graphs-excel-544300525',
              )
            }>
            {'NICE: Jaundice Treatment Threshold Graphs'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            NLS
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Based on Resus Council NLS guidelines
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.resus.org.uk/training-courses/newborn-life-support/nls-newborn-life-support',
              )
            }>
            {'Resus Council: Newborn Life Support'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            Normal observation ranges
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Normal ranges taken from POPS (Paediatric Observation Priority
            Score), a triaging tool used in A&Es across the UK.
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL('https://adc.bmj.com/content/99/Suppl_2/A24.2')
            }>
            {'The Paediatric Observation Priority Score (pops)'}
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            Paediatric / Neonatal Fluid Calculators
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - Fluid requirement calculators (maintenance) based on NICE
            guidelines for IV fluid therapy in children and young people{'\n'}-
            Deficit correction calculator is based on NICE guidelines for
            treatment of dehydration in under 5 year olds
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.nice.org.uk/guidance/ng29/chapter/Recommendations#principles-and-protocols-for-intravenous-fluid-therapy',
              )
            }>
            {'NICE: Principles & Protocols for IV Fluid Therapy'}
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.nice.org.uk/guidance/cg84/chapter/1-Guidance#fluid-management',
              )
            }>
            {
              'NICE: Diarrhoea and vomiting caused by gastroenteritis in under 5s: diagnosis and management'
            }
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            QTc Calculator
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - QTc calculated using the Bazett formula
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.jpeds.com/article/S0022-3476(14)01206-2/abstract',
              )
            }>
            {
              'Comparison of Formulas for Calculation of the Corrected QT Interval'
            }
          </Text>
        </View>
        <View style={[styles.outputContainer, outputBackgroundColor]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            WETFLAG
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            - WETFLAG estimated weight and drug dosages based on Resus Council
            guidelines for estimated paediatric resuscitation values.
            {'\n'}- Default weight is based on 50th centile for patient sex
            according to UK-WHO paediatric growth chart values.
          </Text>
          <Text
            style={[defaultStyles.text, styles.hyperlink, linkTextColor]}
            onPress={() =>
              Linking.openURL(
                'https://www.resus.org.uk/sites/default/files/2020-03/PETchart-18-05-16.pdf',
              )
            }>
            {'Resus Council: Paediatric Emergency Drug Chart'}
          </Text>
        </View>
      </ScrollView>
    </ReferenceBackgroundScreen>
  );
};

export default ReferenceScreen;

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
    //marginTop: -12,
    textDecorationLine: 'underline',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 5,
    margin: 15,
  },
});
