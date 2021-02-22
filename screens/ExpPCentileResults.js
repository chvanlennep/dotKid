import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import CentileOutputRCPCH from '../components/CentileOutputRCPCH';

const flexDirection = defaultStyles.container.width > 500 ? 'row' : 'column';

const ExpPCentileResults = ({route, navigation}) => {
  const measurements = JSON.parse(route.params);

  const [refresh, setRefresh] = useState('try');

  const refreshState = [refresh, setRefresh];

  return (
    <PCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="child"
          valueBeforeCorrection="Work in progress"
          valueAfterCorrection="Work in progress"
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{backgroundColor: colors.light}}
          textStyle={{color: colors.black}}
        />
        {refresh === 'fail' && (
          <Button
            label="Refresh"
            onPress={() => setRefresh('try')}
            style={{backgroundColor: colors.darkMedium}}
            textStyle={{color: colors.white}}
          />
        )}
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <CentileOutputRCPCH
            kind="child"
            measurementsObject={measurements}
            measurement="weight"
            refreshState={refreshState}
          />
          <CentileOutputRCPCH
            kind="child"
            measurementsObject={measurements}
            measurement="height"
            refreshState={refreshState}
          />
          <CentileOutputRCPCH
            kind="child"
            measurementsObject={measurements}
            measurement="bmi"
            refreshState={refreshState}
          />
          <CentileOutputRCPCH
            kind="child"
            measurementsObject={measurements}
            measurement="hc"
            refreshState={refreshState}
          />
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default ExpPCentileResults;

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
