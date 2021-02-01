import regression from 'regression';

import centileData from './centileData';
import zScores from './zScores';
import zeit from './zeit';
import {addOrdinalSuffix, calculateBMI} from './oddBits';

/*
 * If preterm centile cannot be calculated from LMS data directly (as data only given for whole week gestations), this function
 * below calculates relevant measurements for each centile.
 * Example:
 * Preterm baby, corrected gestation 27+3
 * Relevant whole week gestation LMS data extracted (in this case 26, 27 and 28)
 * Converted into measurements using standard formula referenced by WHO and UK data, one measurement for each centile line
 * Measurements used to calculate relevant quadratic equations using regression-js module
 * Equation is in standard form y = ax^2 + bx + c, constants are saved to an array
 * Equation is used to generate measurements for each inputted centile line at inputted gestation
 */
const outputPretermMeasurements = (
  object,
  measurementType,
  floatWeeks,
  zArray,
) => {
  const sex = object.sex;
  const lmsArray = centileData.neonate[sex][measurementType];
  const gestWeeksRoundedDown = Math.floor(floatWeeks);
  let startingGestation;
  let workingLMSData = [];
  let dataPoint1;
  let dataPoint2;
  let dataPoint3;
  if (measurementType === 'length') {
    startingGestation = 25;
  } else {
    startingGestation = 23;
  }
  if (gestWeeksRoundedDown === startingGestation) {
    dataPoint1 = gestWeeksRoundedDown;
    dataPoint2 = gestWeeksRoundedDown + 1;
    dataPoint3 = gestWeeksRoundedDown + 2;
  } else {
    dataPoint1 = gestWeeksRoundedDown - 1;
    dataPoint2 = gestWeeksRoundedDown;
    dataPoint3 = gestWeeksRoundedDown + 1;
  }
  workingLMSData.push(lmsArray[dataPoint1 - startingGestation]);
  workingLMSData.push(lmsArray[dataPoint2 - startingGestation]);
  workingLMSData.push(lmsArray[dataPoint3 - startingGestation]);
  let measurementArray = [];
  let measurementSubArray = [];
  let arrayLength = zArray.length;
  for (let i = 0; i < arrayLength; i++) {
    for (let j = 0; j < 3; j++) {
      let tempMeasurement =
        workingLMSData[j][2] *
        Math.pow(
          zArray[i][0] * workingLMSData[j][1] * workingLMSData[j][3] + 1,
          1 / workingLMSData[j][1],
        );
      measurementSubArray.push(tempMeasurement);
    }
    measurementArray.push(measurementSubArray);
    measurementSubArray = [];
  }
  let measurementLimitsEquations = [];
  dataPoint1 = workingLMSData[0][0];
  dataPoint2 = workingLMSData[1][0];
  dataPoint3 = workingLMSData[2][0];
  arrayLength = measurementArray.length;
  for (let i = 0; i < arrayLength; i++) {
    let dataset = [
      [dataPoint1, measurementArray[i][0]],
      [dataPoint2, measurementArray[i][1]],
      [dataPoint3, measurementArray[i][2]],
    ];
    let equationAsObject = regression.polynomial(dataset, {
      order: 2,
      precision: 6,
    });
    measurementLimitsEquations.push(equationAsObject.equation);
  }
  let finalMeasurementLimitsArray = [];
  arrayLength = measurementLimitsEquations.length;
  finalMeasurementLimitsArray.push(Math.round(floatWeeks * 7));
  for (let i = 0; i < arrayLength; i++) {
    finalMeasurementLimitsArray.push(
      measurementLimitsEquations[i][0] * Math.pow(floatWeeks, 2) +
        measurementLimitsEquations[i][1] * floatWeeks +
        measurementLimitsEquations[i][2],
    );
  }
  return finalMeasurementLimitsArray;
};

// regression route
const outputCentileFromMeasurementsPreterm = (
  object,
  floatWeeks,
  measurementType,
) => {
  const wholeCentileZLimitsPart1 = centileData.neonate.wholeCentileZLimitsPart1;
  const wholeCentileZLimitsPart2 = centileData.neonate.wholeCentileZLimitsPart2;

  let measurement = object[measurementType];
  const extremeThresholdsZ = [
    [-2.432379059, '0.7th'],
    [2.432379059, '99.2nd'],
  ];
  const lowerTiny = [
    [-4, '-4SD'],
    [-3, '-3SD'],
    [-2.967737925, 0.1],
    [-2.807033768, 0.2],
    [-2.696844261, 0.3],
    [-2.612054141, 0.4],
    [-2.542698819, 0.5],
    [-2.483769293, 0.6],
    [-2.432379059, 0.7],
  ];
  const upperTiny = [
    [2.432379059, 99.2],
    [2.483769293, 99.3],
    [2.542698819, 99.4],
    [2.612054141, 99.5],
    [2.696844261, 99.6],
    [2.807033768, 99.7],
    [2.967737925, 99.8],
    [3, 99.9],
    [4, '+3SD'],
  ];
  const meanMeasurementArray = outputPretermMeasurements(
    object,
    measurementType,
    floatWeeks,
    [[0, 50]],
  );
  const meanMeasurement = meanMeasurementArray[1];
  const measurementExtremeThresholds = outputPretermMeasurements(
    object,
    measurementType,
    floatWeeks,
    extremeThresholdsZ,
  );
  let finalThresholds = [];
  let belowMean = false;
  let aboveMean = false;
  let veryHigh = false;
  let veryLow = false;
  if (measurement < meanMeasurement) {
    if (measurement < measurementExtremeThresholds[1]) {
      veryLow = true;
      belowMean = true;
    } else {
      belowMean = true;
    }
  } else if (measurement >= meanMeasurement) {
    if (measurement >= measurementExtremeThresholds[2]) {
      veryHigh = true;
      aboveMean = true;
    } else {
      aboveMean = true;
    }
  }
  let arrayLength;
  switch (true) {
    case belowMean === true && veryLow === true:
      finalThresholds = outputPretermMeasurements(
        object,
        measurementType,
        floatWeeks,
        lowerTiny,
      );
      arrayLength = finalThresholds.length;
      for (let i = 1; i < arrayLength; i++) {
        if (measurement < finalThresholds[i]) {
          return lowerTiny[i - 1][1];
        }
      }
      return 'Error: Not picked up by loop for low values';
    case belowMean === true && veryLow === false:
      finalThresholds = outputPretermMeasurements(
        object,
        measurementType,
        floatWeeks,
        wholeCentileZLimitsPart1,
      );
      arrayLength = finalThresholds.length;
      for (let i = 1; i < arrayLength; i++) {
        if (measurement < finalThresholds[i]) {
          return i - 1;
        }
      }
      return 'Error: Not picked up by main loop for below mean values';
    case aboveMean === true && veryHigh === true:
      finalThresholds = outputPretermMeasurements(
        object,
        measurementType,
        floatWeeks,
        upperTiny,
      );
      if (measurement >= finalThresholds[finalThresholds.length - 1]) {
        return '+4SD';
      } else {
        arrayLength = finalThresholds.length;
        for (let i = 1; i < arrayLength; i++) {
          if (measurement < finalThresholds[i]) {
            return upperTiny[i - 1][1];
          }
        }
      }
      return 'Not picked up by loop for high values';
    case aboveMean === true && veryHigh === false:
      finalThresholds = outputPretermMeasurements(
        object,
        measurementType,
        floatWeeks,
        wholeCentileZLimitsPart2,
      );
      arrayLength = finalThresholds.length;
      for (let i = 1; i < arrayLength; i++) {
        if (measurement < finalThresholds[i]) {
          return i + 49;
        }
      }
      return 'Not picked up by main loop for above mean values';
    default:
      return 'Error: Measurement not picked up by range detectors';
  }
};

// LMS route
const computeChildMeasurement = (zScore, workingLMSData) => {
  return (
    workingLMSData[2] *
    Math.pow(
      zScore * workingLMSData[1] * workingLMSData[3] + 1,
      1 / workingLMSData[1],
    )
  );
};

// Gives range according to RCPCH major centile lines, both LMS and regression route
const giveRange = (
  workingLMSData, // only for LMS centile route
  object,
  measurementType,
  floatWeeks, // only for regression route
) => {
  let childMeasurement;
  if (measurementType === 'bmi') {
    childMeasurement = calculateBMI(object.weight, object.height);
  } else {
    if (!object[measurementType]) {
      childMeasurement = object.length || object.height;
    } else {
      childMeasurement = object[measurementType];
    }
  }
  const majorCentileLines = [
    [-2.652069808, '0.4th'],
    [-2.053748911, '2nd'],
    [-1.340755034, '9th'],
    [-0.67448975, '25th'],
    [0, '50th'],
    [0.67448975, '75th'],
    [1.340755034, '91st'],
    [2.053748911, '98th'],
    [2.652069808, '99.6th'],
  ];
  const zFor03 = -2.69684;
  const zFor997 = 2.69684;
  const measurementArray = [];
  for (let i = 0; i < majorCentileLines.length; i++) {
    let miniArray;
    if (floatWeeks) {
      let zArray = [majorCentileLines[i]];
      const [discard, tempMeasurement] = outputPretermMeasurements(
        object,
        measurementType,
        floatWeeks,
        zArray,
      );
      miniArray = [tempMeasurement, majorCentileLines[i][1]];
    } else {
      const tempMeasurement = computeChildMeasurement(
        majorCentileLines[i][0],
        workingLMSData,
      );
      miniArray = [tempMeasurement, majorCentileLines[i][1]];
    }
    measurementArray.push(miniArray);
  }
  measurementArray.push([childMeasurement, 'childMeasurement']);
  measurementArray.sort((a, b) => a[0] - b[0]);
  const isChildMeasurement = (element) => element[0] === childMeasurement;
  const measurementPosition = measurementArray.findIndex(isChildMeasurement);
  if (measurementPosition === 0) {
    let measurementFor03;
    if (floatWeeks) {
      const [discard, tempMeasurementFor03] = outputPretermMeasurements(
        object,
        measurementType,
        floatWeeks,
        [[zFor03, '0.03']],
      );
      measurementFor03 = tempMeasurementFor03;
    } else {
      const tempMeasurementFor03 = computeChildMeasurement(
        zFor03,
        workingLMSData,
      );
      measurementFor03 = tempMeasurementFor03;
    }
    if (childMeasurement < measurementFor03) {
      return 'Less than the 0.4th Centile';
    } else {
      return 'On the 0.4th Centile';
    }
  } else if (measurementPosition === 9) {
    let measurementFor997;
    if (floatWeeks) {
      const [discard, tempMeasurementFor997] = outputPretermMeasurements(
        object,
        measurementType,
        floatWeeks,
        [[zFor997, '99.7']],
      );
      measurementFor997 = tempMeasurementFor997;
    } else {
      const tempMeasurementFor997 = computeChildMeasurement(
        zFor997,
        workingLMSData,
      );
      measurementFor997 = tempMeasurementFor997;
    }
    if (childMeasurement > measurementFor997) {
      return 'Greater than the 99.6th Centile';
    } else {
      return 'On the 99.6th Centile';
    }
  } else if (measurementPosition === undefined) {
    return 'Error with array search';
  } else {
    const lower = measurementArray[measurementPosition - 1][0];
    const upper = measurementArray[measurementPosition + 1][0];
    if (childMeasurement - lower < (upper - lower) / 4) {
      return `On the ${measurementArray[measurementPosition - 1][1]} Centile`;
    }
    if (upper - childMeasurement < (upper - lower) / 4) {
      return `On the ${measurementArray[measurementPosition + 1][1]} Centile`;
    } else {
      return `Between the ${
        measurementArray[measurementPosition - 1][1]
      } and the ${measurementArray[measurementPosition + 1][1]} Centile`;
    }
  }
};

// regression route
const outputCentileFloatGest = (
  centile,
  measurementType,
  floatWeeks,
  object,
) => {
  if ((typeof centile === 'number') === false) {
    switch (true) {
      case centile === '-4SD':
        return [
          'Significantly below the 0.4th Centile',
          '<0.04th, More than 4 SDs below the mean',
        ];
      case centile === '-3SD':
        return [
          'Well below the 0.4th Centile',
          '<0.1st, Between 3 and 4 SDs below the mean',
        ];
      case centile === '+3SD':
        return [
          'Well above the 99.6th Centile',
          '>99.9th, between 3 and 4 SDs above the mean',
        ];
      case centile === '+4SD':
        return [
          'Significantly above the 99.6th Centile',
          '>99.96th, more than 4 SDs above the mean',
        ];
      default:
        return [centile, 'N/A'];
    }
  } else {
    const range = giveRange(null, object, measurementType, floatWeeks);
    return [range, addOrdinalSuffix(centile)];
  }
};

//using lookup table (excel generated). Only valid for z scores between -3 and 3
const zToRawCentile = (z) => {
  if (typeof z !== 'number') {
    return 'Invalid input';
  }
  if (z < -3 || z > 3) {
    return 'Invalid input';
  }
  const lookUpIndex = Math.round(z * 100) + 300;
  return zScores[lookUpIndex][1];
};

// LMS route
const calculateZ = (childMeasurement, array) => {
  if (Array.isArray(array)) {
    const constantL = array[1];
    const constantM = array[2];
    const constantS = array[3];
    return (
      (Math.pow(childMeasurement / constantM, constantL) - 1) /
      (constantS * constantL)
    );
  } else {
    return array;
  }
};

const outputCentile = (z, object, measurementType, workingLMSData) => {
  if (typeof z === 'number') {
    switch (true) {
      case z < -4:
        return [
          'Significantly below the 0.4th Centile',
          '<0.04th, more than 4 SDs below the mean',
        ];
      case z >= -4 && z < -3:
        return [
          'Well below the 0.4th Centile',
          '<0.1st, between 3 and 4 SDs below the mean',
        ];
      case z > 3 && z <= 4:
        return [
          'Well above the 99.6th Centile',
          '>99.9th, between 3 and 4 SDs above the mean',
        ];
      case z > 4:
        return [
          'Significantly above the 99.6th Centile',
          '>99.96th, more than 4 SDs above the mean',
        ];
      default:
        const rawCentile = zToRawCentile(z);
        const integerCentile = Math.round(rawCentile);
        let oneDecimalCentile = Number(rawCentile.toFixed(1));
        const range = giveRange(workingLMSData, object, measurementType);
        if (oneDecimalCentile < 0.8 || oneDecimalCentile > 99.2) {
          const ordinalOneDecimalCentile = addOrdinalSuffix(oneDecimalCentile);
          return [range, ordinalOneDecimalCentile];
        } else {
          const ordinalCentile = addOrdinalSuffix(integerCentile);
          return [range, ordinalCentile];
        }
    }
  } else {
    return z;
  }
};

const outputBMICentile = (z, object, workingLMSData) => {
  if (typeof z === 'number') {
    switch (true) {
      case z > 4:
        return ['Morbidly Obese (>99.9th)', '> 4 SDs above the mean'];
      case z > 3.66:
        return ['Morbidly Obese (>99.9th)', '3.66 to 4 SDs above the mean'];
      case z > 3.33:
        return ['Morbidly Obese (>99.9th)', '3.33 to 3.66 SDs above the mean'];
      case z >= 3:
        return ['Severely Obese (>99.9th)', '3 to 3.33 SDs above the mean'];
      case z < -5:
        return ['Very thin (<0.1st)', '>5 SDs below the mean'];
      case z < -4:
        return ['Very thin (<0.1st)', '4 to 5 SDs below the mean'];
      case z < -3:
        return ['Very thin (<0.1st)', '3 to 4 SDs below the mean'];
      default:
        const rawCentile = zToRawCentile(z);
        const integerCentile = Math.round(rawCentile);
        const oneDecimalCentile = Number(rawCentile.toFixed(1));
        let outputExactCentile;
        if (oneDecimalCentile < 0.8 || oneDecimalCentile > 99.2) {
          outputExactCentile = addOrdinalSuffix(oneDecimalCentile);
        } else {
          outputExactCentile = addOrdinalSuffix(integerCentile);
        }
        const range = giveRange(workingLMSData, object, 'bmi');
        switch (true) {
          case rawCentile < 0.4:
            return [`Very thin (${range})`, outputExactCentile];
          case rawCentile >= 0.4 && rawCentile <= 2:
            return [`Low BMI (${range})`, outputExactCentile];
          case rawCentile > 2 && rawCentile < 91:
            return [`Normal BMI (${range})`, outputExactCentile];
          case rawCentile >= 91 && rawCentile < 98:
            return [`Overweight (${range})`, outputExactCentile];
          case rawCentile >= 98 && rawCentile < 99.6:
            return [`Obese (${range})`, outputExactCentile];
          case rawCentile >= 99.6 && z < 3:
            return [`Severely obese (${range})`, outputExactCentile];
        }
    }
  } else {
    return z;
  }
};

const centileFromLms = (
  ageInDays,
  ageInMonths,
  kind,
  object,
  birthGestationInDays = 280,
  correctedGestationInDays = 280,
) => {
  let array;
  const sex = object.sex;
  let bmi;
  let bmiCentile = ['N/A', 'N/A'];
  let hcCentile = ['N/A', 'N/A'];
  let heightCentile = ['N/A', 'N/A'];
  let lengthCentile = ['N/A', 'N/A'];
  let weightCentile = ['N/A', 'N/A'];
  let ageBeforeCorrection = zeit(object.dob, 'string', object.dom);
  let ageAfterCorrection = 'not corrected';
  let z;
  if (kind === 'neonate') {
    const gestWeeks = correctedGestationInDays / 7;
    if (object.hc) {
      array = centileData[kind][sex]['hc'][gestWeeks - 23];
      z = calculateZ(object.hc, array);
      hcCentile = outputCentile(z, object, 'hc', array);
    }
    if (object.length) {
      if (correctedGestationInDays >= 175) {
        array = centileData[kind][sex]['length'][gestWeeks - 25];
        z = calculateZ(object.length, array);
        lengthCentile = outputCentile(z, object, 'length', array);
      } else {
        lengthCentile = ['Cannot plot length when under 25 weeks', 'N/A'];
      }
    }
    if (object.weight) {
      array = centileData[kind][sex]['weight'][gestWeeks - 23];
      z = calculateZ(object.weight, array);
      weightCentile = outputCentile(z, object, 'weight', array);
    }
    return {
      hc: hcCentile,
      length: lengthCentile,
      weight: weightCentile,
    };
  } else {
    let index;
    const monthAgeForChart = ageInMonths;
    let dayAgeForChart = ageInDays;
    if (ageInDays <= 1459) {
      if (
        (birthGestationInDays < 259 &&
          birthGestationInDays >= 224 &&
          ageInMonths <= 12) ||
        (birthGestationInDays < 224 && ageInMonths <= 24)
      ) {
        index = ageInDays - (280 - birthGestationInDays);
        ageAfterCorrection = zeit(
          object.dob,
          'string',
          object.dom,
          true,
          280 - birthGestationInDays,
        );
        dayAgeForChart = zeit(
          object.dob,
          'days',
          object.dom,
          true,
          280 - birthGestationInDays,
        );
      } else {
        index = ageInDays;
      }
    } else {
      index = ageInMonths + 1412;
    }
    if (object.hc) {
      if (index <= 730) {
        array = centileData[kind][sex]['hc'][index];
        z = calculateZ(object.hc, array);
        hcCentile = outputCentile(z, object, 'hc', array);
      } else {
        hcCentile = [
          'HC can only be plotted until 2 years corrected age',
          'N/A',
        ];
      }
    }
    if (object.height || object.length) {
      const measurementLabel = object.height ? 'height' : 'length';
      array = centileData[kind][sex][measurementLabel][index];
      z = calculateZ(object.height || object.length, array);
      heightCentile = outputCentile(z, object, measurementLabel, array);
    }
    if (object.weight) {
      const weight = object.weight;
      array = centileData[kind][sex]['weight'][index];
      z = calculateZ(weight, array);
      weightCentile = outputCentile(z, object, 'weight', array);
      if (object.height && ageInDays > 730) {
        array = centileData[kind][sex]['bmi'][index];
        bmi = calculateBMI(object.weight, object.height);
        z = calculateZ(bmi, array);
        bmiCentile = outputBMICentile(z, object, array);
      }
    }
    return {
      ageAfterCorrection: ageAfterCorrection,
      ageBeforeCorrection: ageBeforeCorrection,
      monthAgeForChart: dayAgeForChart > 1459 ? monthAgeForChart : null,
      dayAgeForChart: dayAgeForChart > 1459 ? null : dayAgeForChart,
      centiles: {
        bmi: bmiCentile,
        hc: hcCentile,
        height: heightCentile,
        weight: weightCentile,
      },
    };
  }
};

// object param being javascript object containing all measurements / dob / dom etc
const calculateCentile = (object) => {
  const dob = object.dob;
  const dom = object.dom || new Date();
  let ageInDays = zeit(dob, 'days', dom);
  let lessThan14;
  let kind;
  if (ageInDays < 14) {
    lessThan14 = true;
  }
  const ageInMonths = zeit(dob, 'months', dom);
  const birthGestationInDays = object.gestationInDays;
  const correctedGestationInDays = birthGestationInDays + ageInDays;
  // access birth centile data, which is in "child" if 37+:
  if (ageInDays === 0 && birthGestationInDays >= 259) {
    kind = 'birth';
    const results = centileFromLms(
      ageInDays,
      ageInMonths,
      kind,
      object,
      birthGestationInDays,
      correctedGestationInDays,
    );
    return {
      centiles: {
        weight: results.centiles.weight,
        length: results.centiles.height,
        hc: results.centiles.hc,
      },
      kind: kind,
      birthGestationInDays: birthGestationInDays,
    };
  }
  if (correctedGestationInDays <= 294 && birthGestationInDays < 259) {
    ageInDays === 0 ? (kind = 'birth') : (kind = 'neonate');
    if (correctedGestationInDays % 7 === 0) {
      const calculatedValues = centileFromLms(
        ageInDays,
        ageInMonths,
        'neonate',
        object,
        birthGestationInDays,
        correctedGestationInDays,
      );
      return {
        centiles: calculatedValues,
        kind: kind,
        lessThan14: lessThan14,
        correctedGestationInDays: correctedGestationInDays,
        birthGestationInDays: birthGestationInDays,
        ageInDays: ageInDays,
      };
    } else {
      let workingCentile;
      let hcCentile = ['N/A', 'N/A'];
      let lengthCentile = ['N/A', 'N/A'];
      let weightCentile = ['N/A', 'N/A'];
      let floatWeeks = correctedGestationInDays / 7;
      if (object.hc) {
        workingCentile = outputCentileFromMeasurementsPreterm(
          object,
          floatWeeks,
          'hc',
        );

        hcCentile = outputCentileFloatGest(
          workingCentile,
          'hc',
          floatWeeks,
          object,
        );
      }
      if (object.length) {
        if (correctedGestationInDays >= 175) {
          workingCentile = outputCentileFromMeasurementsPreterm(
            object,
            floatWeeks,
            'length',
          );
          lengthCentile = outputCentileFloatGest(
            workingCentile,
            'length',
            floatWeeks,
            object,
          );
        } else {
          lengthCentile = ['Cannot plot length when under 25 weeks', 'N/A'];
        }
      }
      if (object.weight) {
        workingCentile = outputCentileFromMeasurementsPreterm(
          object,
          floatWeeks,
          'weight',
        );
        weightCentile = outputCentileFloatGest(
          workingCentile,
          'weight',
          floatWeeks,
          object,
        );
      }
      return {
        centiles: {
          hc: hcCentile,
          length: lengthCentile,
          weight: weightCentile,
        },
        kind: kind,
        lessThan14: lessThan14,
        birthGestationInDays: birthGestationInDays,
        correctedGestationInDays: correctedGestationInDays,
        ageInDays: ageInDays,
      };
    }
  } else {
    kind = 'child';
    const calculatedValues = centileFromLms(
      ageInDays,
      ageInMonths,
      kind,
      object,
      birthGestationInDays,
      correctedGestationInDays,
    );
    return {
      centiles: calculatedValues.centiles,
      kind: kind,
      lessThan14: lessThan14,
      ageAfterCorrection: calculatedValues.ageAfterCorrection,
      ageBeforeCorrection: calculatedValues.ageBeforeCorrection,
      monthAgeForChart: calculatedValues.monthAgeForChart,
      dayAgeForChart: calculatedValues.dayAgeForChart,
      under2: ageInDays < 730 ? true : false,
    };
  }
};

export default calculateCentile;
