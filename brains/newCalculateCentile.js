import {Alert} from 'react-native';
import CubicInterpolation from 'cubic-spline';

import {
  birthCentileData,
  childCentileData,
  majorCentileLines,
  pretermCentileData,
} from './allCentileData';
import zScores from './zScores';
import Zeit from './Zeit';
import {addOrdinalSuffix, calculateBMI} from './oddBits';

const computeChildMeasurementForGraph = (z, lmsObject) => {
  return (
    lmsObject.m * Math.pow(z * lmsObject.l * lmsObject.s + 1, 1 / lmsObject.l)
  );
};

class LinearInterpolation {
  constructor(xArray, yArray) {
    this.xArray = xArray;
    this.yArray = yArray;
  }
  at(x) {
    if (this.xArray.length !== 2 || this.yArray.length !== 2) {
      throw new Error(
        'Array arguments must be contain only 2 numbers each for linear interpolation',
      );
    }
    const [x0, x1] = this.xArray;
    const [y0, y1] = this.yArray;
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
  }
}

//initally this function found index via a loop and code was v simple, but this way is faster:
const findNearestIndexChild = (relevantData, ageInDays) => {
  const decimalYear = ageInDays / 365.25;
  const lengthOfArray = relevantData.length;
  if (decimalYear <= 0.25) {
    for (let i = 14; i >= 0; i--) {
      if (decimalYear >= relevantData[i].years) {
        return i;
      }
    }
    throw new Error('Nearest index not found in dataset for findIndexChild');
  }
  const intAgeInMonths = Math.floor(ageInDays / (365.25 / 12));
  switch (lengthOfArray) {
    case 219:
      //bmi:
      if (decimalYear < 4) {
        return intAgeInMonths - 24;
      } else {
        return intAgeInMonths - 22;
      }
    case 256:
      //height:
      if (decimalYear < 2) {
        return intAgeInMonths + 11;
      } else if (decimalYear >= 2 && decimalYear < 4) {
        return intAgeInMonths + 13;
      } else {
        return intAgeInMonths + 15;
      }
    default:
      //weight and hc:
      if (decimalYear < 4) {
        return intAgeInMonths + 11;
      } else {
        return intAgeInMonths + 13;
      }
  }
};

const computeLMS = (xValueToPredict, nearestIndex, relevantData) => {
  let dataPointsOutFromMeasurement = 3;
  let nearTop = false;
  let nearBottom = false;
  // an object to keep track of relationship between nearest index and various data points out, for interpolation
  const indices = [
    {number: -3, index: nearestIndex - 3},
    {number: -2, index: nearestIndex - 2},
    {number: -1, index: nearestIndex - 1},
    {number: 0, index: nearestIndex},
    {number: 1, index: nearestIndex + 1},
    {number: 2, index: nearestIndex + 2},
    {number: 3, index: nearestIndex + 3},
  ];
  // loop over indicies to work out which data points are most suitable for interpolation:
  for (const {number, index} of indices) {
    //only interested in indicies 2 above and 2 below:
    if (number > -3 && number < 3) {
      // catches either start and end of data:
      if (relevantData[index] === undefined) {
        if (number < 0) {
          nearBottom = true;
          if (relevantData[index + 1] === undefined) {
            dataPointsOutFromMeasurement = 1;
          } else {
            dataPointsOutFromMeasurement = 2;
          }
        } else if (number > 0) {
          nearTop = true;
          dataPointsOutFromMeasurement = number;
        }
        break;
      } else if (relevantData[index].m === null) {
        //Catches break in the data (object inserted with null values of LMS to signify break)
        dataPointsOutFromMeasurement = Math.abs(number);
        nearTop = number > 0 ? true : false;
        nearBottom = number < 0 ? true : false;
        break;
      }
    }
  }
  if (dataPointsOutFromMeasurement > 1) {
    let xForPoly = [];
    //function for mapping over data to extract arrays for interpolation:
    const polyMapping = (number, index, key) => {
      if (dataPointsOutFromMeasurement === 3 && number > -3 && number < 3) {
        return relevantData[index][key];
      } else if (dataPointsOutFromMeasurement === 2) {
        if ((nearBottom && number > -2) || (nearTop && number < 2)) {
          return relevantData[index][key];
        }
      }
    };
    for (const {number, index} of indices) {
      const result = polyMapping(number, index, 'years');
      if (result) {
        xForPoly.push(result);
      }
    }
    let computedL = relevantData[nearestIndex].l;
    if (computedL !== 1) {
      const yForL = [];
      for (const {number, index} of indices) {
        const result = polyMapping(number, index, 'l');
        if (result) {
          yForL.push(result);
        }
      }
      const polyL = new CubicInterpolation(xForPoly, yForL);
      computedL = polyL.at(xValueToPredict);
    }
    const yForM = [];
    const yForS = [];
    for (const {number, index} of indices) {
      const resultM = polyMapping(number, index, 'm');
      const resultS = polyMapping(number, index, 's');
      if (resultM) {
        yForM.push(resultM);
      }
      if (resultS) {
        yForS.push(resultS);
      }
    }
    const polyM = new CubicInterpolation(xForPoly, yForM);
    const polyS = new CubicInterpolation(xForPoly, yForS);
    const computedM = polyM.at(xValueToPredict);
    const computedS = polyS.at(xValueToPredict);
    return {
      years: xValueToPredict,
      l: computedL,
      m: computedM,
      s: computedS,
    };
  } else if (dataPointsOutFromMeasurement === 1) {
    const linearMapping = (number, index, key) => {
      if (nearTop) {
        if (number > -2 && number < 1) {
          return relevantData[index][key];
        }
      } else if (nearBottom) {
        if (number > -1 && number < 2) {
          return relevantData[index][key];
        }
      }
    };
    let computedL = relevantData[nearestIndex][1];
    const xForLinear = [];
    for (const {number, index} of indices) {
      const result = linearMapping(number, index, 'years');
      if (result) {
        xForLinear.push(result);
      }
    }
    if (computedL !== 1) {
      const yForL = [];
      for (const {number, index} of indices) {
        const resultL = linearMapping(number, index, 'l');
        if (resultL) {
          yForL.push(resultL);
        }
      }
      const linL = new LinearInterpolation(xForLinear, yForL);
      computedL = linL.at(xValueToPredict);
    }
    const yForM = [];
    const yForS = [];
    for (const {number, index} of indices) {
      const resultM = linearMapping(number, index, 'm');
      const resultS = linearMapping(number, index, 's');
      if (resultM) {
        yForM.push(resultM);
      }
      if (resultM) {
        yForS.push(resultS);
      }
    }
    const linM = new LinearInterpolation(xForLinear, yForM);
    const computedM = linM.at(xValueToPredict);
    const linS = new LinearInterpolation(xForLinear, yForS);
    const computedS = linS.at(xValueToPredict);
    return {years: xValueToPredict, l: computedL, m: computedM, s: computedS};
  }
};

const generateLMSPreterm = (measurementType, sex, gestationInDays) => {
  const relevantData = pretermCentileData[sex.toLowerCase()][measurementType];
  const weeks = gestationInDays / 7;
  const decimalYear = (gestationInDays - 280) / 365.25;
  const correctionIndex = relevantData.length === 20 ? 23 : 25;
  const nearestIndex = Math.floor(weeks) - correctionIndex;
  if (Number.isInteger(weeks)) {
    return relevantData[nearestIndex];
  } else {
    return computeLMS(decimalYear, nearestIndex, relevantData);
  }
};

const generateLMSChild = (measurementType, sex, ageInDays) => {
  const relevantData = childCentileData[sex.toLowerCase()][measurementType];
  const decimalYear = ageInDays / 365.25;
  const nearestDataIndex = findNearestIndexChild(relevantData, ageInDays);
  if (relevantData[nearestDataIndex].years === decimalYear) {
    return relevantData[nearestDataIndex];
  } else {
    return computeLMS(decimalYear, nearestDataIndex, relevantData);
  }
};

const calculateZ = (childMeasurement, inputObject) => {
  return (
    (Math.pow(childMeasurement / inputObject.m, inputObject.l) - 1) /
    (inputObject.s * inputObject.l)
  );
};

const zToRawCentile = (z) => {
  if (typeof z !== 'number') {
    throw new Error('Z to raw centile only accepts number arguments');
  } else if (z < -3 || z > 3) {
    throw new Error('Z to raw centile only accepts z scores between -3 and +3');
  } else {
    const lookUpIndex = Math.round(z * 100) + 300;
    return zScores[lookUpIndex][1];
  }
};

const giveRange = (z) => {
  const zFor03 = -2.69684;
  const zFor997 = 2.69684;
  const arrayForOrdering = [];
  for (let i = 0; i < majorCentileLines.length; i++) {
    arrayForOrdering.push(majorCentileLines[i]);
  }
  arrayForOrdering.push([z, 'childZ']);
  arrayForOrdering.sort((a, b) => a[0] - b[0]);
  const isChildZ = (element) => element[0] === z;
  const measurementPosition = arrayForOrdering.findIndex(isChildZ);
  if (measurementPosition === 0) {
    if (z < zFor03) {
      return 'Less than the 0.4th centile';
    } else {
      return 'On or near the 0.4th centile';
    }
  } else if (measurementPosition === 9) {
    if (z > zFor997) {
      return 'Greater than the 99.6th centile';
    } else {
      return 'On or near the 99.6th centile';
    }
  } else if (measurementPosition === undefined) {
    throw new Error('Error with giveRange array search');
  } else {
    const lower = arrayForOrdering[measurementPosition - 1][0];
    const upper = arrayForOrdering[measurementPosition + 1][0];
    if (z - lower <= (upper - lower) / 4) {
      return `On or near the ${
        arrayForOrdering[measurementPosition - 1][1]
      } centile`;
    }
    if (upper - z <= (upper - lower) / 4) {
      return `On or near the ${
        arrayForOrdering[measurementPosition + 1][1]
      } centile`;
    } else {
      return `Between the ${
        arrayForOrdering[measurementPosition - 1][1]
      } and the ${arrayForOrdering[measurementPosition + 1][1]} centiles`;
    }
  }
};

const outputCentile = (z) => {
  if (typeof z === 'number') {
    switch (true) {
      case z < -4:
        return [
          'Significantly below the 0.4th Centile',
          '<0.04th, more than 4 SDs below the mean',
          z,
        ];
      case z >= -4 && z < -3:
        return [
          'Well below the 0.4th Centile',
          '<0.2nd, between 3 and 4 SDs below the mean',
          z,
        ];
      case z > 3 && z <= 4:
        return [
          'Well above the 99.6th Centile',
          '>99.8th, between 3 and 4 SDs above the mean',
          z,
        ];
      case z > 4:
        return [
          'Significantly above the 99.6th Centile',
          '>99.96th, more than 4 SDs above the mean',
          z,
        ];
      default:
        const rawCentile = zToRawCentile(z);
        const oneDecimalCentile = Number(rawCentile.toFixed(1));
        const integerCentile = Math.floor(oneDecimalCentile);
        const range = giveRange(z);
        if (oneDecimalCentile < 1 || oneDecimalCentile > 99) {
          const ordinalOneDecimalCentile = addOrdinalSuffix(oneDecimalCentile);
          return [range, ordinalOneDecimalCentile, z];
        } else {
          const ordinalCentile = addOrdinalSuffix(integerCentile);
          return [range, ordinalCentile, z];
        }
    }
  } else {
    throw new Error('Output centile only accepts number arguments');
  }
};

const outputBMICentile = (z) => {
  if (typeof z === 'number') {
    switch (true) {
      case z > 4:
        return ['Morbidly Obese (>99.9th)', '> 4 SDs above the mean', z];
      case z > 3.66:
        return ['Morbidly Obese (>99.9th)', '3.66 to 4 SDs above the mean', z];
      case z > 3.33:
        return [
          'Morbidly Obese (>99.9th)',
          '3.33 to 3.66 SDs above the mean',
          z,
        ];
      case z > 3:
        return ['Severely Obese (>99.8th)', '3 to 3.33 SDs above the mean', z];
      case z < -5:
        return ['Very thin (<0.1st)', '>5 SDs below the mean', z];
      case z < -4:
        return ['Very thin (<0.1st)', '4 to 5 SDs below the mean', z];
      case z < -3:
        return ['Very thin (<0.2nd)', '3 to 4 SDs below the mean', z];
      default:
        const rawCentile = zToRawCentile(z);
        const oneDecimalCentile = Number(rawCentile.toFixed(1));
        const integerCentile = Math.floor(oneDecimalCentile);
        let outputExactCentile;
        if (oneDecimalCentile < 1 || oneDecimalCentile > 99) {
          outputExactCentile = addOrdinalSuffix(oneDecimalCentile);
        } else {
          outputExactCentile = addOrdinalSuffix(integerCentile);
        }
        const range = giveRange(z);
        switch (true) {
          case rawCentile < 0.4:
            return [`Very thin (${range})`, outputExactCentile, z];
          case rawCentile >= 0.4 && rawCentile <= 2:
            return [`Low BMI (${range})`, outputExactCentile, z];
          case rawCentile > 2 && rawCentile < 91:
            return [`Normal BMI (${range})`, outputExactCentile, z];
          case rawCentile >= 91 && rawCentile < 98:
            return [`Overweight (${range})`, outputExactCentile, z];
          case rawCentile >= 98 && rawCentile < 99.6:
            return [`Obese (${range})`, outputExactCentile, z];
          case rawCentile >= 99.6 && z < 3:
            return [`Severely obese (${range})`, outputExactCentile, z];
        }
    }
  } else {
    throw new Error('Output centile only accepts number arguments');
  }
};

const generateAnswers = (
  inputObject,
  kind,
  ageObject,
  birthGestationInDays,
  correctedGestationInDays,
) => {
  let weight = ['N/A', 'N/A', ''];
  let length = ['N/A', 'N/A', ''];
  let height = ['N/A', 'N/A', ''];
  let hc = ['N/A', 'N/A', ''];
  let bmi = ['N/A', 'N/A', ''];
  if (kind === 'birth' && birthGestationInDays >= 259) {
    if (inputObject.length) {
      const lms = birthCentileData[inputObject.sex.toLowerCase()].length;
      const z = calculateZ(inputObject.length, lms);
      length = outputCentile(z);
    }
    if (inputObject.weight) {
      const lms = birthCentileData[inputObject.sex.toLowerCase()].weight;
      const z = calculateZ(inputObject.weight, lms);
      weight = outputCentile(z);
    }
    if (inputObject.hc) {
      const lms = birthCentileData[inputObject.sex.toLowerCase()].hc;
      const z = calculateZ(inputObject.hc, lms);
      hc = outputCentile(z);
    }
    return {length, weight, hc};
  } else if (kind === 'child') {
    const ageInDays = ageObject.calculate('days');
    if (inputObject.height) {
      const lms = generateLMSChild('height', inputObject.sex, ageInDays);
      const z = calculateZ(inputObject.height, lms);
      height = outputCentile(z);
    }
    if (inputObject.weight) {
      const lms = generateLMSChild('weight', inputObject.sex, ageInDays);
      const z = calculateZ(inputObject.weight, lms);
      weight = outputCentile(z);
    }
    if (inputObject.hc) {
      if (
        (ageObject.calculate('years') < 17 && inputObject.sex === 'Female') ||
        (ageObject.calculate('years') < 18 && inputObject.sex === 'Male')
      ) {
        const lms = generateLMSChild('hc', inputObject.sex, ageInDays);
        const z = calculateZ(inputObject.hc, lms);
        hc = outputCentile(z);
      } else {
        hc = [
          'HC can only be plotted until 17 years of age in girls and 18 years of age in boys',
          'N/A',
        ];
      }
    }
    if (
      inputObject.height &&
      inputObject.weight &&
      ageObject.calculate('days') > 730
    ) {
      const lms = generateLMSChild('bmi', inputObject.sex, ageInDays);
      const rawBmi = calculateBMI(inputObject.weight, inputObject.height);
      const z = calculateZ(rawBmi, lms);
      bmi = outputBMICentile(z);
    }
    return {bmi, height, weight, hc};
  } else {
    if (inputObject.length) {
      if (correctedGestationInDays < 175) {
        length = ['Cannot plot length when under 25 weeks', 'N/A', ''];
      } else {
        const lms = generateLMSPreterm(
          'length',
          inputObject.sex,
          correctedGestationInDays,
        );
        const z = calculateZ(inputObject.length, lms);
        length = outputCentile(z);
      }
    }
    if (inputObject.weight) {
      const lms = generateLMSPreterm(
        'weight',
        inputObject.sex,
        correctedGestationInDays,
      );
      const z = calculateZ(inputObject.weight, lms);
      weight = outputCentile(z);
    }
    if (inputObject.hc) {
      const lms = generateLMSPreterm(
        'hc',
        inputObject.sex,
        correctedGestationInDays,
      );
      const z = calculateZ(inputObject.hc, lms);
      hc = outputCentile(z);
    }
    return {length, weight, hc};
  }
};

const calculateCentile = (inputObject) => {
  try {
    const ageObject = new Zeit(
      inputObject.dob,
      inputObject.dom,
      inputObject.gestationInDays,
    );
    const ageInDaysUncorrected = ageObject.calculate('days', false);
    let lessThan14;
    let kind;
    if (ageInDaysUncorrected < 14) {
      lessThan14 = true;
    }
    const birthGestationInDays = inputObject.gestationInDays;
    const correctedGestationInDays =
      birthGestationInDays + ageInDaysUncorrected;
    if (ageInDaysUncorrected === 0) {
      kind = 'birth';
      const answers = generateAnswers(
        inputObject,
        kind,
        ageObject,
        birthGestationInDays,
        correctedGestationInDays,
      );
      return {
        centiles: answers,
        kind: kind,
        birthGestationInDays: birthGestationInDays,
      };
    } else if (correctedGestationInDays <= 294 && birthGestationInDays < 259) {
      kind = 'neonate';
      const answers = generateAnswers(
        inputObject,
        kind,
        ageObject,
        birthGestationInDays,
        correctedGestationInDays,
      );
      return {
        centiles: answers,
        kind: kind,
        lessThan14: lessThan14,
        birthGestationInDays: birthGestationInDays,
        correctedGestationInDays: correctedGestationInDays,
        ageInDays: ageInDaysUncorrected,
      };
    } else {
      kind = 'child';
      const ageBeforeCorrection = ageObject.calculate('string', false);
      let ageAfterCorrection = 'not corrected';
      if (ageObject.calculate('days') !== ageObject.calculate('days', false)) {
        ageAfterCorrection = ageObject.calculate('string');
      }
      const dayAgeForChart = ageObject.calculate('days');
      const monthAgeForChart = ageObject.calculate('months');
      const answers = generateAnswers(
        inputObject,
        kind,
        ageObject,
        birthGestationInDays,
        correctedGestationInDays,
      );
      return {
        centiles: answers,
        kind: kind,
        lessThan14: lessThan14,
        ageAfterCorrection: ageAfterCorrection,
        ageBeforeCorrection: ageBeforeCorrection,
        monthAgeForChart: dayAgeForChart > 1459 ? monthAgeForChart : null,
        dayAgeForChart: dayAgeForChart > 1459 ? null : dayAgeForChart,
        under2: dayAgeForChart < 731 ? true : false,
      };
    }
  } catch (error) {
    Alert.alert(
      'Whoops! Centile calculator encountered an error.\nIf this keeps happening, please contact the dotKid creators.',
      `Error details: ${error.message}`,
      [
        {
          text: 'OK',
          onPress: () => null,
        },
      ],
      {cancelable: false},
    );
  }
};

export default calculateCentile;
export {
  computeChildMeasurementForGraph,
  generateLMSChild,
  generateLMSPreterm,
  majorCentileLines,
};
