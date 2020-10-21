import centileData from './centileData';
import regression from 'regression';

export default (
  ageInDays,
  ageInMonths,
  gestationInDays,
  kind,
  measurement,
  measurementType,
  sex
) => {
  const majorZScores = [
    -2.6521,
    -2.0537,
    -1.3408,
    -0.6745,
    0,
    0.6745,
    1.3408,
    2.0537,
    2.6521,
  ];

  const chartColors = [
    '#E55040',
    '#D93863',
    '#C247E6',
    '#7C50EB',
    '#5E78EB',
    '#41948A',
    '#D3DD59',
    '#FDEA5F',
    '#F29E39',
  ];

  /*Copied from calculateCentile. I haven't imported this directly as currently calculateCentile only has a 
  default export and it would break other bits to change to named exports*/
  const outputPretermMeasurements = (workingLMSData, gestWeeks, zArray) => {
    let measurementArray = [];
    let measurementSubArray = [];
    let arrayLength = zArray.length;
    for (let i = 0; i < arrayLength; i++) {
      for (let j = 0; j < 3; j++) {
        let tempMeasurement =
          workingLMSData[j][2] *
          Math.pow(
            zArray[i][0] * workingLMSData[j][1] * workingLMSData[j][3] + 1,
            1 / workingLMSData[j][1]
          );
        measurementSubArray.push(tempMeasurement);
      }
      measurementArray.push(measurementSubArray);
      measurementSubArray = [];
    }
    let measurementLimitsEquations = [];
    let dataPoint1 = workingLMSData[0][0];
    let dataPoint2 = workingLMSData[1][0];
    let dataPoint3 = workingLMSData[2][0];
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
    finalMeasurementLimitsArray.push(Math.round(gestWeeks * 7));
    for (let i = 0; i < arrayLength; i++) {
      finalMeasurementLimitsArray.push(
        measurementLimitsEquations[i][0] * Math.pow(gestWeeks, 2) +
          measurementLimitsEquations[i][1] * gestWeeks +
          measurementLimitsEquations[i][2]
      );
    }
    return finalMeasurementLimitsArray;
  };

  let startValue = 0; // start index in the array
  let endValue = 0; // end index in the array
  let workingIndex = 3; //working index for patient measurement dot on graph
  let endOfArray; // self explanatory
  let indexFrameMod = 0; // so number index matches data index in the data array (eg if >48 months need to skip past first lot of data)
  let modifiedAge; // so number index matches data index in the data array (same as above)
  let changeIndex; // number added and subtracted from index to create range for loop
  let xLabelDivisor = 1; // corrects to unit needed on x axis label
  let xLabelUnits = 'weeks'; // units for x axis label
  let xLoopChopper = 1; // for trimming down number of labels on x axis
  let roundDigits = 1; // for xLabel
  let bottomValueForY; // for Y axis
  let topValueForY; // for Y axis
  let data = []; // main data object for graph
  let finalXLabels = []; // final labels for X axis
  let object = {}; // internal working object for loops
  let miniArray = []; // internal working array for loops
  let computedValue; // internal computed value for loops

  if (kind === 'birth') {
    for (let i = 0; i <= 9; i++) {
      if (i === 9) {
        for (let j = 0; j < 7; j++) {
          // Less than 7 because we're adding 1 on after the loops
          miniArray.push(measurement);
        }
      } else {
        if (gestationInDays < 259 && gestationInDays % 7 !== 0) {
          /*Modified from calculateCentile, not used directly for compatibility reasons*/
          const tempLmsData = centileData.neonate[sex][measurementType];
          let tempInt = Math.floor(gestationInDays / 7);
          let tempFloat = gestationInDays / 7;
          let startingGestationBirth;
          let lmsForRegressionBirth = [];
          let dataPoint1Birth;
          let dataPoint2Birth;
          let dataPoint3Birth;
          if (measurementType === 'length') {
            startingGestationBirth = 25;
          } else {
            startingGestationBirth = 23;
          }
          if (tempInt === startingGestationBirth) {
            dataPoint1Birth = tempInt;
            dataPoint2Birth = tempInt + 1;
            dataPoint3Birth = tempInt + 2;
          } else {
            dataPoint1Birth = tempInt - 1;
            dataPoint2Birth = tempInt;
            dataPoint3Birth = tempInt + 1;
          }
          lmsForRegressionBirth.push(
            tempLmsData[dataPoint1Birth - startingGestationBirth]
          );
          lmsForRegressionBirth.push(
            tempLmsData[dataPoint2Birth - startingGestationBirth]
          );
          lmsForRegressionBirth.push(
            tempLmsData[dataPoint3Birth - startingGestationBirth]
          );

          const zArray = [[majorZScores[i], 'ignoreThis']];

          const regressionCalcOutput = outputPretermMeasurements(
            lmsForRegressionBirth,
            tempFloat,
            zArray
          );
          computedValue = regressionCalcOutput[1];
          for (let k = 0; k < 8; k++) {
            miniArray.push(computedValue);
          }
        } else {
          let internalKind = 'child';
          let internalIndex = 0;
          if (gestationInDays < 259) {
            internalKind = 'neonate';
            const internalGestWeeks = gestationInDays / 7;
            internalIndex =
              measurementType === 'length'
                ? internalGestWeeks - 25
                : internalGestWeeks - 23;
          }
          const birthLMSData =
            centileData[internalKind][sex][measurementType][internalIndex];
          computedValue =
            birthLMSData[2] *
            Math.pow(
              majorZScores[i] * birthLMSData[1] * birthLMSData[3] + 1,
              1 / birthLMSData[1]
            );
          for (let l = 0; l < 8; l++) {
            miniArray.push(computedValue);
          }
        }
      }

      object = {
        data: miniArray,
        svg: { stroke: chartColors[i] },
      };
      data.push(object);
      miniArray = [];
      object = {};
    }
    const largestValue = data[8]['data'][data[8]['data'].length - 1];
    const addALittle = largestValue * 0.01;
    let tempArray = data[9]['data'];
    tempArray.push(largestValue + addALittle);
    data[9]['data'] = tempArray; // adding a little to the dot array y value so the top label isn't cut off
  } else {
    if (kind === 'neonate') {
      xLabelDivisor = 7;
      xLoopChopper = 7;
      xLabelUnits = 'weeks';
      measurementType === 'length'
        ? (indexFrameMod = 175)
        : (indexFrameMod = 161);
      measurementType === 'length' ? (endOfArray = 119) : (endOfArray = 133);
      modifiedAge = gestationInDays - indexFrameMod;
      changeIndex = 14;
      startValue = modifiedAge - changeIndex;
      endValue = modifiedAge + changeIndex;
      if (startValue < 0) {
        startValue = 0;
        endValue = changeIndex * 2;
      }
      if (endValue > endOfArray) {
        endValue = endOfArray;
        startValue = endOfArray - 2 * changeIndex;
      }
      workingIndex = gestationInDays - indexFrameMod;
      if (
        workingIndex > changeIndex &&
        workingIndex <= endOfArray - changeIndex
      ) {
        workingIndex = changeIndex;
      } else if (workingIndex > endOfArray - changeIndex) {
        const tempIndex = workingIndex;
        workingIndex = 2 * changeIndex + tempIndex - endOfArray;
      }
    }
    if (kind === 'child') {
      if (ageInDays) {
        endOfArray = 1459;
        if (ageInDays < 90) {
          xLabelDivisor = 7;
          xLabelUnits = 'weeks';
          xLoopChopper = 14;
          changeIndex = 42;
          roundDigits = 0;
        } else if (ageInDays < 730) {
          xLabelDivisor = 365 / 12;
          xLoopChopper = 35;
          changeIndex = 70;
          xLabelUnits = 'months';
        } else {
          xLabelDivisor = 365;
          xLoopChopper = 42;
          xLabelUnits = 'years';
          changeIndex = 91;
        }
        if (measurementType === 'hc') endOfArray = 730;
        startValue = ageInDays - changeIndex;
        endValue = ageInDays + changeIndex;
        if (startValue < 0) {
          startValue = 0;
          endValue = ageInDays + changeIndex + (changeIndex - ageInDays);
        }
        if (endValue > endOfArray) {
          endValue = endOfArray;
          startValue =
            ageInDays - changeIndex - (ageInDays + changeIndex - endOfArray);
        }
        workingIndex = ageInDays;
        if (ageInDays > changeIndex && ageInDays <= endOfArray - changeIndex) {
          workingIndex = changeIndex;
        } else if (ageInDays > endOfArray - changeIndex) {
          workingIndex = changeIndex + (changeIndex - (endOfArray - ageInDays));
        }
      } else {
        indexFrameMod = 1412;
        endOfArray = 1628;
        modifiedAge = ageInMonths + indexFrameMod;
        xLabelDivisor = 12;
        xLabelUnits = 'years';
        if (ageInMonths >= 48 && ageInMonths <= 96) {
          xLoopChopper = 3;
          changeIndex = 6;
        } else {
          xLoopChopper = 6;
          changeIndex = 12;
        }
        startValue = modifiedAge - changeIndex;
        endValue = modifiedAge + changeIndex;
        if (startValue < 1460) {
          //start of the array
          startValue = 1460;
          endValue = modifiedAge + 2 * changeIndex;
        }
        if (endValue > endOfArray) {
          endValue = endOfArray;
          startValue =
            modifiedAge -
            changeIndex -
            (modifiedAge + changeIndex - endOfArray);
        }

        workingIndex = ageInMonths - 48;
        if (workingIndex > changeIndex && ageInMonths <= 216 - changeIndex) {
          workingIndex = changeIndex;
        } else if (ageInMonths > 216 - changeIndex) {
          workingIndex = changeIndex + (changeIndex - (216 - ageInMonths));
        }
      }
    }

    let xLabels = [];

    for (let i = 0; i <= 9; i++) {
      if (i === 9) {
        for (let j = startValue; j <= endValue; j++) {
          miniArray.push(measurement);
          let sensibleNumber; // get rid of correction so number is real age again
          if (kind === 'neonate') {
            sensibleNumber = j + indexFrameMod;
            xLabels.push(Math.floor(sensibleNumber / xLabelDivisor));
          } else {
            sensibleNumber = j - indexFrameMod;
            xLabels.push(
              Number(sensibleNumber / xLabelDivisor).toFixed(roundDigits)
            );
          }
        }
        object = {
          data: miniArray,
          svg: { stroke: null },
        };
        data.push(object);
      } else {
        for (let k = startValue; k <= endValue; k++) {
          const workingLMSData = centileData[kind][sex][measurementType];
          if (kind === 'child' || (kind === 'neonate' && k % 7 === 0)) {
            let tempLoopIndex;
            kind === 'child' ? (tempLoopIndex = k) : (tempLoopIndex = k / 7);
            computedValue =
              workingLMSData[tempLoopIndex][2] *
              Math.pow(
                majorZScores[i] *
                  workingLMSData[tempLoopIndex][1] *
                  workingLMSData[tempLoopIndex][3] +
                  1,
                1 / workingLMSData[tempLoopIndex][1]
              );
          } else {
            /*
      As logic below is modified from calculateCentile, I didn't want to mess with it too much,
      hence this piece of logic:
      */
            let convertIndexBackToGestation = k + 161;
            if (measurementType === 'length')
              convertIndexBackToGestation = k + 175;
            const loopWeekIntGestation = Math.floor(
              convertIndexBackToGestation / 7
            );
            const loopWeekFloatGestation = convertIndexBackToGestation / 7;
            let startingGestation;
            let lmsForRegression = [];
            let dataPoint1;
            let dataPoint2;
            let dataPoint3;
            if (measurementType === 'length') {
              startingGestation = 25;
            } else {
              startingGestation = 23;
            }
            if (loopWeekIntGestation === startingGestation) {
              dataPoint1 = loopWeekIntGestation;
              dataPoint2 = loopWeekIntGestation + 1;
              dataPoint3 = loopWeekIntGestation + 2;
            } else {
              dataPoint1 = loopWeekIntGestation - 1;
              dataPoint2 = loopWeekIntGestation;
              dataPoint3 = loopWeekIntGestation + 1;
            }
            lmsForRegression.push(
              workingLMSData[dataPoint1 - startingGestation]
            );
            lmsForRegression.push(
              workingLMSData[dataPoint2 - startingGestation]
            );
            lmsForRegression.push(
              workingLMSData[dataPoint3 - startingGestation]
            );

            const zArray = [[majorZScores[i], 'ignoreThis']];

            const regressionCalcOutput = outputPretermMeasurements(
              lmsForRegression,
              loopWeekFloatGestation,
              zArray
            );
            computedValue = regressionCalcOutput[1];
          }
          miniArray.push(computedValue);
        }
        object = {
          data: miniArray,
          svg: { stroke: chartColors[i] },
        };
        data.push(object);
      }
      miniArray = [];
      object = {};
    }

    for (let t = 0; t < xLabels.length; t++) {
      if (t % xLoopChopper === 0) {
        finalXLabels.push(xLabels[t]);
      }
    }
  }
  // make ranges of y axis:
  bottomValueForY = data[0]['data'][0];
  if (measurement < bottomValueForY) bottomValueForY = measurement;
  const lastArray = data[8]['data'];
  topValueForY = data[8]['data'][lastArray.length - 1];
  if (measurement > topValueForY) topValueForY = measurement;

  //work out how many indicies to skip left to make sure centile labels aren't chopped off:
  const centileLabelStrings = [
    '0.4th',
    '2nd',
    '9th',
    '25th',
    '50th',
    '75th',
    '91st',
    '98th',
    '99.6th',
  ];
  let takeOffIndex;
  if (kind === 'birth') {
    takeOffIndex = 2;
  } else {
    if (ageInDays) {
      ageInDays < 90 ? (takeOffIndex = 5) : (takeOffIndex = 10);
    } else {
      if (kind === 'neonate') {
        takeOffIndex = 5;
      }
      takeOffIndex = 4;
    }
  }

  let centileLabelArray = [];
  let centileLabelData = {};

  // make data for centile labels:
  if (workingIndex / data[0]['data'].length > 0.82) {
    for (let x = 0; x < data.length - 1; x++) {
      const tempObject = {
        label: centileLabelStrings[x],
        coords: data[x]['data'][Math.round(data[x]['data'].length * 0.75)],
      };
      centileLabelArray.push(tempObject);
    }
    centileLabelData = {
      x: Math.round(data[0]['data'].length * 0.75),
      y: centileLabelArray,
    };
  } else {
    for (let x = 0; x < data.length - 1; x++) {
      const tempObject = {
        label: centileLabelStrings[x],
        coords: data[x]['data'][data[x]['data'].length - takeOffIndex],
      };
      centileLabelArray.push(tempObject);
    }
    centileLabelData = {
      x: data[0]['data'].length - takeOffIndex,
      y: centileLabelArray,
    };
  }

  return {
    centileLabelData: centileLabelData,
    data: data,
    index: workingIndex,
    finalXLabels: finalXLabels,
    xLabelUnits: xLabelUnits,
    bottomValueForY: bottomValueForY,
    topValueForY: topValueForY,
  };
};
