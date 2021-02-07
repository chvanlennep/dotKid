import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppText from '../components/AppText';
import ReferenceBackgroundScreen from '../components/ReferenceBackgroundScreen';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import {version} from '../../package.json';

const LegalText = ({style, modal}) => {
  return (
    <React.Fragment>
      <Text style={style}>
        By downloading and/or using dotKid {`(`}"this app"{`)`} you acknowledge
        that you have read and agree to be bound by the terms of the disclaimer
        outlined below. If you do not wish to be bound by these terms please
        close and discontinue usage of this app.
        {'\n'}
        {'\n'}This app is for use by professional paediatric / neonatal staff in
        the United Kingdom only and is intended as a guide / tool in the
        teaching and training of delivery of clinical care. This app is written
        according to evidence based clinical guidelines and is designed with
        safety functions to eliminate or reduce error as far as possible.
        Neither this app nor its contents or output should be used directly in
        clinical care, nor as a replacement for clinical expertise, experience
        or judgement. This app, its contents and output should be handled in
        such a way that maintains patient confidentialty and in accordance with
        Caldicott Principles.
        {'\n'}
        {'\n'}
        This app, its content and output should not be used as a replacement for
        local or organisational guidelines.
        {'\n'}
        {'\n'}The creators of dotKid will endeavour to keep dotKid accurate,
        up-to-date and free from errors. However, no responsibility can be taken
        by the creators of dotKid should this not be the case.
        {'\n'}
        {'\n'}The use of dotKid is at the users discretion and no responsibility
        nor liability shall be taken by the creators of dotKid for the use or
        misuse of this app, nor its contents or outputs.
        {'\n'}
        {'\n'}You agree to hold the creators of this app harmless and free from
        fault for any claim, demand, cost, expense or legal pursuit where this
        app is used not in accordance with the instructions for use and/or the
        purposes intended and/or the actions you take as a result of this app,
        its contents or output as outlined on this page.
        {'\n'}
        {'\n'}This disclaimer shall be governed by the laws of England and Wales
        and any dispute shall be submitted to the English courts.
      </Text>
      {modal && (
        <Text style={style}>
          This disclaimer can be viewed any time in the Info tab in this app.
        </Text>
      )}
    </React.Fragment>
  );
};

const AboutScreen = () => {
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;

  return (
    <ReferenceBackgroundScreen>
      <ScrollView>
        <View style={styles.headingContainer}>
          <AppText style={styles.heading}>Important Information</AppText>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
              {marginBottom: 0},
            ]}>
            Please read and acknowledge the following information before using
            this app:
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
            {`dotKid (${version})`}
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            dotKid is an app to aid qualified paediatric and neonatal staff for
            the purposes of teaching and training qualified staff and healthcare
            students. Guidance is based on clinical guidelines as detailed in
            the references section.
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
            About
          </Text>
          <Text
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}>
            dotKid was created by Dr Charles van Lennep{' '}
            {
              <Text
                style={[
                  defaultStyles.text,
                  styles.hyperlink,
                  {color: dark ? colors.lightPrimary : colors.darkPrimary},
                ]}
                onPress={() =>
                  Linking.openURL('mailto:charles@vanlennep.co.uk')
                }>
                {'email here'}
              </Text>
            }{' '}
            or{' '}
            {
              <React.Fragment>
                <MaterialCommunityIcons
                  name="twitter"
                  color={'#1DA1F2'}
                  size={16}
                />{' '}
                <Text
                  style={[
                    defaultStyles.text,
                    styles.hyperlink,
                    {color: dark ? colors.lightPrimary : colors.darkPrimary},
                  ]}
                  onPress={() =>
                    Linking.openURL('https://twitter.com/charleshvl?lang=en')
                  }>
                  {'@charleshvl '}
                </Text>
              </React.Fragment>
            }
            and Dr Ryan Samuels{' '}
            {
              <Text
                style={[
                  defaultStyles.text,
                  styles.hyperlink,
                  {color: dark ? colors.lightPrimary : colors.darkPrimary},
                ]}
                onPress={() => Linking.openURL('mailto:ryuasamuels@gmail.com')}>
                {'email here'}
              </Text>
            }{' '}
            or{' '}
            {
              <React.Fragment>
                <MaterialCommunityIcons
                  name="twitter"
                  color={'#1DA1F2'}
                  size={16}
                />{' '}
                <Text
                  style={[
                    defaultStyles.text,
                    styles.hyperlink,
                    {color: dark ? colors.lightPrimary : colors.darkPrimary},
                  ]}
                  onPress={() =>
                    Linking.openURL('https://twitter.com/drryantalks?lang=en')
                  }>
                  {'@DrRyanTalks'}
                </Text>
              </React.Fragment>
            }
            .{'\n'}
            {'\n'}If you have any feedback or suggestions for dotKid then please
            get in touch!
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
            Legal Disclaimer
          </Text>
          <LegalText
            style={[
              defaultStyles.text,
              styles.text,
              {color: dark ? colors.white : colors.dark},
            ]}
          />
        </View>
      </ScrollView>
    </ReferenceBackgroundScreen>
  );
};

export default AboutScreen;
export {LegalText};

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    marginTop: 10,
    marginLeft: 12,
  },
  headingContainer: {
    padding: 10,
  },
  hyperlink: {
    color: colors.darkPrimary,
    fontSize: 16,
    lineHeight: 23,
    marginLeft: 16,
    textDecorationLine: 'underline',
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
  text: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 5,
    margin: 15,
  },
});
