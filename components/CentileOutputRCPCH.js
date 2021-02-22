import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {addOrdinalSuffix, calculateBMI} from '../brains/oddBits';

import useApi from '../brains/useApi';
import colors from '../config/colors';
import {containerWidth} from '../config/styles';
import AppText from './AppText';
import MoreCentileInfo from './buttons/MoreCentileInfo';
import CentileChartModal from './CentileChartModal';

const errorsObject = {
  422: 'The server was unable to process the measurements. This is probably a bug in dotKid.',
  500: 'The server encountered a problem.',
  'Network request failed':
    'The request to the server failed. Please check your internet connection.',
  'Timeout exceeded': 'Request to the server timed out.',
};

const makeErrorPretty = (error) =>
  errorsObject[error.message] || `Other error: ${error.message}`;

const parseExactCentile = (exact) => {
  if (!exact) {
    return exact;
  } else if (exact > 99.9) {
    return '>99.9th';
  } else if (exact < 0.1) {
    return '<0.1st';
  } else {
    return addOrdinalSuffix(exact);
  }
};

const userLabelNames = {
  height: 'Height',
  weight: 'Weight',
  bmi: 'BMI',
  hc: 'Head Circumference',
};

const CentileOutputRCPCH = ({
  measurementsObject,
  measurement,
  refreshState,
}) => {
  let measurementValue = measurementsObject[measurement];
  if (!measurementValue) {
    if (
      measurement === 'bmi' &&
      measurementsObject.weight &&
      measurementsObject.height
    ) {
      measurementValue = calculateBMI(
        measurementsObject.weight,
        measurementsObject.height,
      );
    } else {
      measurementValue = null;
    }
  }

  const [defaultOutput, setDefaultOutput] = useState(
    measurementValue ? '' : 'No measurement given',
  );
  const [fullAnswer, setFullAnswer] = useState({});
  const [refresh, setRefresh] = refreshState;

  const {getSingleCentileData} = useApi();

  let titleText = `${userLabelNames[measurement]}: N/A`;
  if (measurementValue) {
    switch (measurement) {
      case 'weight':
        titleText = `Weight: ${measurementValue}kg`;
        break;
      case 'hc':
        titleText = `Head Circumference: ${measurementValue}cm`;
        break;
      case 'bmi':
        titleText = `BMI: ${measurementValue.toFixed(1)}kg/m²`;
        break;
      default:
        titleText = `Height: ${measurementValue}cm`;
    }
  }

  let sds;
  let centile = '';
  if (fullAnswer.measurement_calculated_values !== undefined) {
    sds = fullAnswer.measurement_calculated_values.sds;
    centile = fullAnswer.measurement_calculated_values.centile;
  }

  useEffect(() => {
    if (measurementValue && refresh === 'try') {
      getSingleCentileData(
        measurementsObject.dob,
        measurementsObject.dom,
        measurementsObject.gestationInDays,
        measurement,
        measurementValue,
        measurementsObject.sex,
      )
        .then((result) => {
          setDefaultOutput(result.measurement_calculated_values.centile_band);
          setFullAnswer(result);
          setRefresh('success');
        })
        .catch((error) => {
          setDefaultOutput(`Error: ${makeErrorPretty(error)}`);
          setRefresh('fail');
        });
    }
  }, [refresh]);

  return (
    <View style={styles.outputContainer}>
      <View style={styles.outputTextBox}>
        <View style={styles.title}>
          <AppText style={styles.text}>{titleText}</AppText>
        </View>
        <View>
          <AppText style={styles.outputText}>{defaultOutput}</AppText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <MoreCentileInfo exactCentile={parseExactCentile(centile)} sds={sds} />
        <CentileChartModal
          measurementType="weight"
          measurement={null}
          kind="child"
          ageInDays={2}
          ageInMonths={0}
          sex="Female"
        />
      </View>
    </View>
  );
};

export default CentileOutputRCPCH;

const styles = StyleSheet.create({
  outputContainer: {
    backgroundColor: colors.medium,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    width: containerWidth,
    overflow: 'hidden',
  },
  outputTextBox: {
    margin: 20,
    textAlign: 'left',
    justifyContent: 'center',
    width: containerWidth - 105,
  },
  text: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
  },
  outputText: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.white,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 4,
    justifyContent: 'center',
  },
});
