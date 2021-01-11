import React, {useContext, useLayoutEffect, useState, useRef} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import AppForm from '../components/AppForm';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AgeButton from '../components/buttons/AgeButton';
import PCalcScreen from '../components/PCalcScreen';
import {GlobalStatsContext} from '../components/GlobalStats';
import zeit from '../brains/zeit';
import useAgeEffect from '../brains/useAgeEffect';
import NavigateButton from '../components/buttons/NavigateButton';
import colors from '../config/colors';

const AgeScreen = () => {
  const initialValues = {
    gestationInDays: 280,
    dob: null,
    dom: null,
  };

  const {globalStats} = useContext(GlobalStatsContext);

  const dom = globalStats.child.dom.value;
  const dob = globalStats.child.dob.value;
  const gestationInDays = globalStats.child.gestationInDays.value;

  const [after, setAfter] = useState('not corrected');
  const [before, setBefore] = useState('N/A');
  const [showGestation, setShowGestation] = useState(false);
  const [showThePath, setShowThePath] = useState(false);

  const formikRef = useRef(null);

  useLayoutEffect(() => {
    if (dob) {
      const ageInMonths = zeit(dob, 'months', dom);
      if (ageInMonths >= 0) {
        const beforeString = zeit(dob, 'string', dom);
        const ageInDays = zeit(dob, 'days', dom);
        if (gestationInDays < 259 && gestationInDays + ageInDays < 280) {
          setAfter('Not Calculated');
          setBefore('Not Calculated');
          setShowThePath(true);
        } else if (
          (gestationInDays < 259 &&
            gestationInDays >= 224 &&
            ageInMonths <= 12) ||
          (gestationInDays < 224 && ageInMonths <= 24)
        ) {
          const afterString = zeit(
            dob,
            'string',
            dom,
            true,
            280 - gestationInDays,
          );
          setAfter(afterString);
          setBefore(beforeString);
          setShowThePath(false);
        } else {
          setBefore(beforeString);
          setShowThePath(false);
        }
      } else {
        setAfter('not corrected');
        setBefore('N/A');
        setShowThePath(false);
      }
    } else {
      setAfter('not corrected');
      setBefore('N/A');
      setShowThePath(false);
    }
  }, [dom, dob, gestationInDays]);

  useAgeEffect(dob, dom, formikRef, setShowGestation);

  return (
    <PCalcScreen style={{flex: 1}}>
      <ScrollView>
        <View style={styles.topContainer}>
          <AppForm initialValues={initialValues} innerRef={formikRef}>
            <DateTimeInputButton kind="child" type="birth" />
            {showGestation && <GestationInputButton kind="child" />}
            <DateTimeInputButton kind="child" type="measured" />
            <FormResetButton kind="child" initialValues={initialValues} />
            <AgeButton
              kind="child"
              valueBeforeCorrection={before}
              valueAfterCorrection={after}
            />
            {showThePath && (
              <NavigateButton
                side="RootN"
                directions="CGA"
                initialValues={initialValues}>
                Corrected Gestation Calculator ⟶
              </NavigateButton>
            )}
          </AppForm>
        </View>
      </ScrollView>
    </PCalcScreen>
  );
};

export default AgeScreen;

const styles = StyleSheet.create({
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
