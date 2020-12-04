import React from 'react';
import {StyleSheet, View} from 'react-native';

import NCalcScreen from '../components/NCalcScreen';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import AppForm from '../components/AppForm';
import FluidIntervalSelector from '../components/buttons/FluidIntervalSelector';
import NFluidOutput from '../components/NFluidOutput';

const flexDirection = defaultStyles.container.width > 500 ? 'row' : 'column';

const NFluidRequirementsResultsScreen = ({route, navigation}) => {
  const results = JSON.parse(route.params);

  const initialValues = {
    interval: '3 hourly',
  };

  return (
    <NCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="nFluid"
          valueBeforeCorrection={results.stringAge}
          valueAfterCorrection={results.intAge}
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{backgroundColor: colors.light}}
          textStyle={{color: colors.black}}
        />
        <View>
          <AppForm initialValues={initialValues}>
            <NFluidOutput results={results} />
            <FluidIntervalSelector />
          </AppForm>
        </View>
      </View>
    </NCalcScreen>
  );
};

export default NFluidRequirementsResultsScreen;

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
