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

  return (
    <ReferenceBackgroundScreen>
      <ScrollView>
        <View style={styles.headingContainer}>
          <AppText style={styles.heading}>References</AppText>
        </View>
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
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
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://www.rcpch.ac.uk/resources/uk-who-growth-charts-guidance-health-professionals',
              )
            }>
            {'UK-WHO Growth Charts'}
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL('https://www.who.int/growthref/computation.pdf')
            }>
            {'WHO: Computation of Centiles'}
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
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
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://journals.lww.com/jhypertension/Fulltext/2016/10000/2016_European_Society_of_Hypertension_guidelines.2.aspx',
              )
            }>
            {'European Society of Hypertension Guidelines'}
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
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
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
          <Text
            style={[
              defaultStyles.text,
              styles.subheading,
              {color: dark ? colors.lightSecondary : colors.darkSecondary},
            ]}>
            ECG Calculator
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
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
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
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
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
            - Fluid requirement calculators based on NICE guidelines for IV
            fluid therapy in children and young people
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://www.nice.org.uk/guidance/ng29/chapter/Recommendations#principles-and-protocols-for-intravenous-fluid-therapy',
              )
            }>
            {'NICE: Principles & Protocols for IV Fluid Therapy'}
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
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
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://www.resus.org.uk/sites/default/files/2020-03/PETchart-18-05-16.pdf',
              )
            }>
            {'Resus Council: Paediatric Emergency Drug Chart'}
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
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
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://www.nice.org.uk/guidance/cg98/resources/treatment-threshold-graphs-excel-544300525',
              )
            }>
            {'NICE: Jaundice Treatment Threshold Graphs'}
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
          ]}>
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
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://www.resus.org.uk/library/2015-resuscitation-guidelines/paediatric-advanced-life-support',
              )
            }>
            {'Resus Council: Advanced Paediatric Life Support'}
          </Text>
        </View>
        <View
          style={[
            styles.outputContainer,
            {backgroundColor: dark ? colors.dark : '#EBEBEB'},
            {marginBottom: 100},
          ]}>
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
            style={[
              defaultStyles.text,
              styles.hyperlink,
              {color: dark ? colors.lightPrimary : colors.darkPrimary},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://www.resus.org.uk/training-courses/newborn-life-support/nls-newborn-life-support',
              )
            }>
            {'Resus Council: Newborn Life Support'}
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
    backgroundColor: '#EBEBEB',
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
