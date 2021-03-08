import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import NCalcScreen from '../components/NCalcScreen';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import CentileOutputRCPCH from '../components/CentileOutputRCPCH';

const flexDirection = defaultStyles.container.width > 500 ? 'row' : 'column';

class Refresh {
  constructor() {
    this.weight = 'try';
    this.height = 'try';
    this.bmi = 'try';
    this.hc = 'try';
  }
}

const NCentileResultsScreen = ({route, navigation}) => {
  const all = JSON.parse(route.params);
  const {measurements, results} = all;

  const {birthGestationInDays, correctedGestationInDays} = results;

  const [refresh, setRefresh] = useState(new Refresh());

  const refreshState = [refresh, setRefresh];

  const reset = () =>
    setRefresh((old) => {
      const mutable = {...old};
      for (const [key, value] of Object.entries(old)) {
        if (value === 'fail') {
          mutable[key] = 'try';
        }
      }
      return mutable;
    });

  let showRefresh = false;
  for (const value of Object.values(refresh)) {
    if (value === 'fail') {
      showRefresh = true;
      break;
    }
  }

  return (
    <NCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="neonate"
          valueBeforeCorrection={birthGestationInDays}
          valueAfterCorrection={correctedGestationInDays}
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{backgroundColor: colors.light}}
          textStyle={{color: colors.black}}
        />
        {showRefresh && (
          <Button
            label="Refresh"
            onPress={reset}
            style={{backgroundColor: colors.darkMedium}}
            textStyle={{color: colors.white}}
          />
        )}
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <CentileOutputRCPCH
            kind="neonate"
            measurementsObject={measurements}
            measurement="weight"
            refreshState={refreshState}
            correctedGestationInDays={correctedGestationInDays}
          />
          <CentileOutputRCPCH
            kind="neonate"
            measurementsObject={measurements}
            measurement="height"
            refreshState={refreshState}
            correctedGestationInDays={correctedGestationInDays}
          />
          <CentileOutputRCPCH
            kind="neonate"
            measurementsObject={measurements}
            measurement="hc"
            refreshState={refreshState}
            correctedGestationInDays={correctedGestationInDays}
          />
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default NCentileResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    //backgroundColor: 'dodgerblue',
    paddingHorizontal: 10,
    width: '100%',
  },
  outputContainer: {
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 110,
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    //backgroundColor: 'white',
    flexDirection: flexDirection,
    flex: 2,
  },
  outputTextBox: {
    paddingLeft: 20,
    paddingRight: 10,
    //backgroundColor: 'limegreen',
    textAlign: 'left',
    justifyContent: 'center',
    flex: 8,
  },
  outputText: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.white,
    flexWrap: 'wrap',
  },
  topContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
  },
});
