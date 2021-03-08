import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {addOrdinalSuffix, calculateBMI} from '../brains/oddBits';

import useApi from '../brains/useApi';
import colors from '../config/colors';
import {containerWidth} from '../config/styles';
import AppText from './AppText';
import MoreCentileInfo from './buttons/MoreCentileInfo';
import CentileChartModal from './CentileChartModal';

const devAddress = 'local';

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
  monthAgeForChart,
  dayAgeForChart,
  correctedGestationInDays,
  kind = 'child',
}) => {
  let measurementValue = measurementsObject[measurement];
  let defaultOutput = 'No measurement given';
  if (!measurementValue) {
    if (
      measurement === 'bmi' &&
      measurementsObject.weight &&
      measurementsObject.height &&
      kind === 'child'
    ) {
      measurementValue = calculateBMI(
        measurementsObject.weight,
        measurementsObject.height,
      );
    } else if (measurementsObject.length && measurement === 'height') {
      measurementValue = measurementsObject.length;
    } else {
      measurementValue = null;
    }
  }
  if (
    correctedGestationInDays < 175 &&
    measurementsObject.length &&
    measurement === 'height'
  ) {
    measurementValue = null;
    defaultOutput =
      'UK-WHO length data does not exist in infants below 25 weeks gestation';
  }

  class InternalState {
    constructor() {
      this.defaultOutput = measurementValue ? '' : defaultOutput;
      this.fullAnswer = {};
      this.isLoading = true;
    }
  }

  const [refresh, setRefresh] = refreshState;

  const [internalState, setInternalState] = useState(new InternalState());

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
        titleText = `${userLabelNames[measurement]}: ${measurementValue}cm`;
    }
  }

  const sds = internalState.fullAnswer.measurement_calculated_values?.sds || '';
  const centile =
    internalState.fullAnswer.measurement_calculated_values?.centile || '';

  const specificRefreshState = refresh[measurement];
  const isLoading = internalState.isLoading;

  useEffect(() => {
    let ignore = false;
    if (measurementValue && specificRefreshState === 'try') {
      if (!isLoading) {
        setInternalState((old) => {
          return {...old, ...{isLoading: true}};
        });
      }
      getSingleCentileData(
        measurementsObject,
        measurement,
        __DEV__ ? devAddress : 'real',
      )
        .then((result) => {
          if (!ignore) {
            setInternalState({
              defaultOutput: result.measurement_calculated_values.centile_band,
              isLoading: false,
              fullAnswer: result,
            });
            setRefresh((old) => {
              return {...old, ...{[measurement]: 'success'}};
            });
          }
        })
        .catch((error) => {
          if (!ignore) {
            setInternalState((old) => {
              return {
                ...old,
                ...{defaultOutput: error.message, isLoading: false},
              };
            });
            setRefresh((old) => {
              return {...old, ...{[measurement]: 'fail'}};
            });
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [specificRefreshState]);

  return (
    <View style={styles.outputContainer}>
      <View style={styles.outputTextBox}>
        <View style={styles.title}>
          <AppText style={styles.text}>{titleText}</AppText>
        </View>
        <View>
          <AppText style={styles.outputText}>
            {isLoading && measurementValue
              ? 'Loading answer...'
              : internalState.defaultOutput}
          </AppText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <MoreCentileInfo exactCentile={parseExactCentile(centile)} sds={sds} />
        <CentileChartModal
          measurementType={
            measurement === 'height' && kind === 'neonate'
              ? 'length'
              : measurement
          }
          measurement={measurementValue}
          kind={kind}
          ageInDays={dayAgeForChart}
          ageInMonths={monthAgeForChart}
          sex={measurementsObject.sex}
          gestationInDays={correctedGestationInDays}
        />
      </View>
    </View>
  );
};

export default CentileOutputRCPCH;

const styles = StyleSheet.create({
  outputContainer: {
    backgroundColor: colors.darkest,
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
