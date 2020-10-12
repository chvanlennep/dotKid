import regression from "regression";

import centileData from "./centileData";
import zeit from "./zeit";

// kept separate for simplicity
const calculateBMI = (weight, heightInCm) => {
  const height = heightInCm / 100;
  return weight / (height * height);
};

//adds correct ordinal suffix to integers and 1 decimal place numbers
const addOrdinalSuffix = (inputNumber) => {
  let answerNumber = inputNumber;
  if (Number.isInteger(inputNumber) === false) {
    inputNumber *= 10;
    if (Number.isInteger(inputNumber) === false) {
      return "Error: only integers or numbers to 1 decimal place are supported";
    }
  }
  let remainder10 = inputNumber % 10;
  let remainder100 = inputNumber % 100;
  if (remainder10 === 1 && remainder100 != 11) {
    return `${answerNumber}st`;
  }
  if (remainder10 === 2 && remainder100 != 12) {
    return `${answerNumber}nd`;
  }
  if (remainder10 === 3 && remainder100 != 13) {
    return `${answerNumber}rd`;
  } else {
    return `${answerNumber}th`;
  }
};

// Z Scores for RCPCH centile lines: [-2.6521,-2.0537,-1.3408,-0.6745,0,0.6745,1.3408,2.0537,2.6521];

/*
 * If preterm centile cannot be calculated from LMS data directly (as data only given for whole week gestations), this function below
 * calculates relevant measurements for each centile.
 * Example:
 * Preterm baby, corrected gestation 27+3
 * Relevant whole week gestation LMS data extracted (in this case 26, 27 and 28)
 * Converted into measurements using standard formula referenced by WHO and UK data, one measurement for each centile line
 * Measurements used to calculate relevant quadratic equations using regression-js module
 * Equation is in standard form y = ax^2 + bx + c, constants are saved to an array
 * Equation is used to generate measurements for each inputted centile line at inputted gestation
 */
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

const outputCentileFromMeasurementsPreterm = (
  object,
  gestWeeks,
  measurementType
) => {
  const wholeCentileZLimitsPart1 = centileData.neonate.wholeCentileZLimitsPart1;
  const wholeCentileZLimitsPart2 = centileData.neonate.wholeCentileZLimitsPart2;
  const sex = object.sex;
  let measurement = object[measurementType];
  measurementType === "weight" ? (measurement /= 1000) : measurement;

  const lmsArray = centileData.neonate[sex][measurementType];
  const gestWeeksRoundedDown = Math.floor(gestWeeks);
  if (gestWeeksRoundedDown < 25 && measurementType === "length") {
    return "Gestation out of range";
  } else if (
    (gestWeeksRoundedDown >= 23 && gestWeeksRoundedDown <= 42) === false
  ) {
    return "Gestation out of range";
  }
  let startingGestation;
  let workingLMSData = [];
  let dataPoint1;
  let dataPoint2;
  let dataPoint3;
  if (measurementType === "length") {
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
  const extremeThresholdsZ = [
    [-2.43238, "0.7th"],
    [2.43238, "99.2nd"],
  ];
  const lowerTiny = [
    [-4, "-4SD"],
    [-3, "-3SD"],
    [-2.96774, 0.1],
    [-2.80703, 0.2],
    [-2.69684, 0.3],
    [-2.61205, 0.4],
    [-2.5427, 0.5],
    [-2.48377, 0.6],
    [-2.43238, 0.7],
  ];
  const upperTiny = [
    [2.43238, 99.2],
    [2.48377, 99.3],
    [2.5427, 99.4],
    [2.61205, 99.5],
    [2.69684, 99.6],
    [2.80703, 99.7],
    [2.96774, 99.8],
    [3, 99.9],
    [4, "+3SD"],
  ];
  const meanMeasurementArray = outputPretermMeasurements(
    workingLMSData,
    gestWeeks,
    [[0, 50]]
  );
  const meanMeasurement = meanMeasurementArray[1];
  const measurementExtremeThresholds = outputPretermMeasurements(
    workingLMSData,
    gestWeeks,
    extremeThresholdsZ
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
        workingLMSData,
        gestWeeks,
        lowerTiny
      );
      arrayLength = finalThresholds.length;
      for (let i = 1; i < arrayLength; i++) {
        if (measurement < finalThresholds[i]) {
          return lowerTiny[i - 1][1];
        }
      }
      return "Error: Not picked up by loop for low values";
    case belowMean === true && veryLow === false:
      finalThresholds = outputPretermMeasurements(
        workingLMSData,
        gestWeeks,
        wholeCentileZLimitsPart1
      );
      arrayLength = finalThresholds.length;
      for (let i = 1; i < arrayLength; i++) {
        if (measurement < finalThresholds[i]) {
          return i - 1;
        }
      }
      return "Error: Not picked up by main loop for below mean values";
    case aboveMean === true && veryHigh === true:
      finalThresholds = outputPretermMeasurements(
        workingLMSData,
        gestWeeks,
        upperTiny
      );
      if (measurement >= finalThresholds[finalThresholds.length - 1]) {
        return "+4SD";
      } else {
        arrayLength = finalThresholds.length;
        for (let i = 1; i < arrayLength; i++) {
          if (measurement < finalThresholds[i]) {
            return upperTiny[i - 1][1];
          }
        }
      }
      return "Not picked up by loop for high values";
    case aboveMean === true && veryHigh === false:
      finalThresholds = outputPretermMeasurements(
        workingLMSData,
        gestWeeks,
        wholeCentileZLimitsPart2
      );
      arrayLength = finalThresholds.length;
      for (let i = 1; i < arrayLength; i++) {
        if (measurement < finalThresholds[i]) {
          return i + 49;
        }
      }
      return "Not picked up by main loop for above mean values";
    default:
      return "Error: Measurement not picked up by range detectors";
  }
};

const outputCentileRangePreterm = (centile) => {
  if ((typeof centile === "number") === false) {
    switch (true) {
      case centile === "-4SD":
        return ["<0.04th", ">4 SDs below the mean"];
      case centile === "-3SD":
        return ["<0.1st", "3 to 4 SDs below the mean"];
      case centile === "+3SD":
        return [">99.9th", "3 to 4 SDs above the mean"];
      case centile === "+4SD":
        return [">99.96th", "> 4 SDs above the mean"];
      default:
        return centile;
    }
  } else {
    const allCentileLimits = [
      0.3,
      0.4,
      0.8,
      1.6,
      2,
      3.75,
      7.25,
      9,
      13,
      21,
      25,
      31.25,
      43.75,
      50,
      56.25,
      68.75,
      75,
      79,
      87,
      91,
      92.75,
      96.25,
      98,
      98.4,
      99.2,
      99.6,
      99.7,
      99.7,
    ];
    const outputSentences = [
      "Less than the 0.4th Centile",
      "On the 0.4th Centile",
      "On the 0.4th Centile",
      "Between the 0.4th and 2nd Centile",
      "On the 2nd Centile",
      "On the 2nd Centile",
      "Between the 2nd and 9th Centile",
      "On the 9th Centile",
      "On the 9th Centile",
      "Between the 9th and 25th Centile",
      "On the 25th Centile",
      "On the 25th Centile",
      "Between the 25th and 50th Centile",
      "On the 50th Centile",
      "On the 50th Centile",
      "Between the 50th and 75th Centile",
      "On the 75th Centile",
      "On the 75th Centile",
      "Between the 75th and 91st Centile",
      "On the 91st Centile",
      "On the 91st Centile",
      "Between the 91st and 98th Centile",
      "On the 98th Centile",
      "On the 98th Centile",
      "Between the 98th and 99.6th Centile",
      "On the 99.6th Centile",
      "On the 99.6th Centile",
      "Greater than the 99.6th Centile",
    ];
    if (centile >= allCentileLimits[27]) {
      return [outputSentences[27], addOrdinalSuffix(centile)];
    } else if (centile < allCentileLimits[27]) {
      for (let i = 0; i < outputSentences.length; i++) {
        if (centile < allCentileLimits[i]) {
          return [outputSentences[i], addOrdinalSuffix(centile)];
        }
      }
    } else {
      return "Error: answer not picked up by loop in Centile Range";
    }
  }
};

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

const allCentileLimits = [
  0.3,
  0.4,
  0.8,
  1.6,
  2,
  3.75,
  7.25,
  9,
  13,
  21,
  25,
  31.25,
  43.75,
  50,
  56.25,
  68.75,
  75,
  79,
  87,
  91,
  92.75,
  96.25,
  98,
  98.4,
  99.2,
  99.6,
  99.7,
  99.7,
];
const outputSentences = [
  "Less than the 0.4th Centile",
  "On the 0.4th Centile",
  "On the 0.4th Centile",
  "Between the 0.4th and 2nd Centile",
  "On the 2nd Centile",
  "On the 2nd Centile",
  "Between the 2nd and 9th Centile",
  "On the 9th Centile",
  "On the 9th Centile",
  "Between the 9th and 25th Centile",
  "On the 25th Centile",
  "On the 25th Centile",
  "Between the 25th and 50th Centile",
  "On the 50th Centile",
  "On the 50th Centile",
  "Between the 50th and 75th Centile",
  "On the 75th Centile",
  "On the 75th Centile",
  "Between the 75th and 91st Centile",
  "On the 91st Centile",
  "On the 91st Centile",
  "Between the 91st and 98th Centile",
  "On the 98th Centile",
  "On the 98th Centile",
  "Between the 98th and 99.6th Centile",
  "On the 99.6th Centile",
  "On the 99.6th Centile",
  "Greater than the 99.6th Centile",
];

const outputCentile = (z) => {
  if (typeof z === "number") {
    switch (true) {
      case z < -4:
        return [
          "Significantly below 0.4th",
          "<0.04th, more than 4 SDs below the mean",
        ];
      case z >= -4 && z < -3:
        return [
          "Well below 0.4th",
          "<0.1st, between 3 and 4 SDs below the mean",
        ];
      case z > 3 && z <= 4:
        return [
          "Well above 99.6th",
          ">99.9th, between 3 and 4 SDs above the mean",
        ];
      case z > 4:
        return [
          "Significantly above 99.6th",
          ">99.96th, more than 4 SDs above the mean",
        ];
      default:
        let factK = 1;
        let sum = 0;
        let term = 1;
        let k = 0;
        let loopStop = Math.exp(-23);
        while (Math.abs(term) > loopStop) {
          term =
            (((0.3989422804 * Math.pow(-1, k) * Math.pow(z, k)) /
              (2 * k + 1) /
              Math.pow(2, k)) *
              Math.pow(z, k + 1)) /
            factK;
          sum += term;
          k++;
          factK *= k;
        }
        sum += 0.5;
        let rawCentile = sum * 100;
        let integerCentile = Math.round(rawCentile);
        let oneDecimalCentile = Number(rawCentile.toFixed(1));
        let sentence;
        if (rawCentile >= allCentileLimits[27]) {
          sentence = outputSentences[27];
        } else if (rawCentile < allCentileLimits[27]) {
          for (let i = 0; i < outputSentences.length; i++) {
            if (rawCentile < allCentileLimits[i]) {
              sentence = outputSentences[i];
              break;
            }
          }
        } else {
          return "Error: answer not picked up by the loop";
        }
        if (oneDecimalCentile < 0.8 || oneDecimalCentile > 99.2) {
          let ordinalOneDecimalCentile = addOrdinalSuffix(oneDecimalCentile);
          return [sentence, ordinalOneDecimalCentile];
        } else {
          let ordinalCentile = addOrdinalSuffix(integerCentile);
          return [sentence, ordinalCentile];
        }
    }
  } else {
    return z;
  }
};

const outputBMICentile = (z) => {
  if (typeof z === "number") {
    switch (true) {
      case z > 4:
        return ["Morbidly Obese (>99.9th)", "> 4 SDs above the mean"];
      case z > 3.66:
        return ["Morbidly Obese (>99.9th)", "3.66 to 4 SDs above the mean"];
      case z > 3.33:
        return ["Morbidly Obese (>99.9th)", "3.33 to 3.66 SDs above the mean"];
      case z >= 3:
        return ["Severely Obese (>99.9th)", "3 to 3.33 SDs above the mean"];
      case z < -5:
        return ["Very thin (<0.1st)", ">5 SDs below the mean"];
      case z < -4:
        return ["Very thin (<0.1st)", "4 to 5 SDs below the mean"];
      case z < -3:
        return ["Very thin (<0.1st)", "3 to 4 SDs below the mean"];
      default:
        let factK = 1;
        let sum = 0;
        let term = 1;
        let k = 0;
        let loopStop = Math.exp(-23);
        while (Math.abs(term) > loopStop) {
          term =
            (((0.3989422804 * Math.pow(-1, k) * Math.pow(z, k)) /
              (2 * k + 1) /
              Math.pow(2, k)) *
              Math.pow(z, k + 1)) /
            factK;
          sum += term;
          k++;
          factK *= k;
        }
        sum += 0.5;
        let rawCentile = sum * 100;
        let integerCentile = Math.round(rawCentile);
        let oneDecimalCentile = Number(rawCentile.toFixed(1));
        let sentence;
        if (rawCentile >= allCentileLimits[27]) {
          sentence = outputSentences[27];
        } else if (rawCentile < allCentileLimits[27]) {
          for (let i = 0; i < outputSentences.length; i++) {
            if (rawCentile < allCentileLimits[i]) {
              sentence = outputSentences[i];
              break;
            }
          }
        } else {
          return "Error: answer not picked up by the loop";
        }
        let outputExactCentile;
        if (oneDecimalCentile < 0.8 || oneDecimalCentile > 99.2) {
          outputExactCentile = addOrdinalSuffix(oneDecimalCentile);
        } else {
          outputExactCentile = addOrdinalSuffix(integerCentile);
        }
        switch (true) {
          case rawCentile < 0.4:
            return [`Very thin (${sentence})`, outputExactCentile];
          case rawCentile >= 0.4 && rawCentile <= 2:
            return [`Low BMI (${sentence})`, outputExactCentile];
          case rawCentile > 2 && rawCentile < 91:
            return [`Normal BMI (${sentence})`, outputExactCentile];
          case rawCentile >= 91 && rawCentile < 98:
            return [`Overweight (${sentence})`, outputExactCentile];
          case rawCentile >= 98 && rawCentile < 99.6:
            return [`Obese (${sentence})`, outputExactCentile];
          case rawCentile >= 99.6 && z < 3:
            return [`Severely obese (${sentence})`, outputExactCentile];
        }
    }
  } else {
    return z;
  }
};

const centileFromLms = (
  ageInDays,
  ageInMonths,
  birthGestationInDays = 280,
  correctedGestationInDays = 280,
  kind,
  object
) => {
  let array;
  const sex = object.sex;
  let bmi;
  let bmiCentile = ["N/A", "N/A"];
  let hcCentile = ["N/A", "N/A"];
  let heightCentile = ["N/A", "N/A"];
  let lengthCentile = ["N/A", "N/A"];
  let weightCentile = ["N/A", "N/A"];
  let ageBeforeCorrection = zeit(object.dob, "string", object.dom);
  let ageAfterCorrection = "not corrected";
  let z;
  if (kind === "neonate") {
    const gestWeeks = correctedGestationInDays / 7;
    if (object.hc) {
      array = centileData[kind][sex]["hc"][gestWeeks - 23];
      z = calculateZ(object.hc, array);
      hcCentile = outputCentile(z);
    }
    if (object.length) {
      if (correctedGestationInDays >= 175) {
        array = centileData[kind][sex]["length"][gestWeeks - 25];
        z = calculateZ(object.length, array);
        lengthCentile = outputCentile(z);
      } else {
        lengthCentile = ["Cannot plot length when under 25 weeks CGA", "N/A"];
      }
    }
    if (object.weight) {
      array = centileData[kind][sex]["weight"][gestWeeks - 23];
      const newWeight = object.weight / 1000;
      z = calculateZ(newWeight, array);
      weightCentile = outputCentile(z);
    }
    return {
      hc: hcCentile,
      length: lengthCentile,
      weight: weightCentile,
    };
  } else if (kind === "child") {
    let index;
    if (ageInDays <= 1459) {
      if (
        (birthGestationInDays < 259 &&
          birthGestationInDays >= 224 &&
          ageInDays <= 365) ||
        (birthGestationInDays < 224 && ageInDays <= 730)
      ) {
        index = ageInDays - (280 - birthGestationInDays);
        ageAfterCorrection = zeit(
          object.dob,
          "string",
          object.dom,
          true,
          280 - birthGestationInDays
        );
      } else {
        index = ageInDays;
      }
    } else {
      index = ageInMonths + 1412;
    }
    if (object.hc) {
      if (index <= 730) {
        array = centileData[kind][sex]["hc"][index];
        z = calculateZ(object.hc, array);
        hcCentile = outputCentile(z);
      } else {
        hcCentile = [
          "HC can only be plotted until 2 years corrected age",
          "N/A",
        ];
      }
    }
    if (object.height || object.length) {
      array = centileData[kind][sex]["height"][index];
      z = calculateZ(object.height || object.length, array);
      heightCentile = outputCentile(z);
    }
    if (object.weight) {
      let weight;
      ageInDays === 0
        ? (weight = object.weight / 1000)
        : (weight = object.weight);
      array = centileData[kind][sex]["weight"][index];
      z = calculateZ(weight, array);
      weightCentile = outputCentile(z);
      if (object.height && ageInDays !== 0) {
        array = centileData[kind][sex]["bmi"][index];
        bmi = calculateBMI(object.weight, object.height);
        z = calculateZ(bmi, array);
        bmiCentile = outputBMICentile(z);
      }
    }
    return {
      ageAfterCorrection: ageAfterCorrection,
      ageBeforeCorrection: ageBeforeCorrection,
      centiles: {
        bmi: bmiCentile,
        hc: hcCentile,
        height: heightCentile,
        weight: weightCentile,
      },
    };
  }
};

const calculateCentile = (object) => {
  const dob = object.dob;
  const dom = object.dom;
  let ageInDays = zeit(dob, "days", dom);
  let lessThan14;
  let kind;
  if (ageInDays < 0) {
    return "Negative age";
  }
  if (ageInDays > 6574) {
    return "Over 18";
  }
  if (ageInDays < 14) {
    lessThan14 = true;
  }
  const ageInMonths = zeit(dob, "months", dom);
  const birthGestationInDays = object.gestationInDays;
  const correctedGestationInDays = birthGestationInDays + ageInDays;
  // access birth centile data, which is in "child" if 37+:
  if (ageInDays === 0 && birthGestationInDays >= 259) {
    kind = "birth";
    const results = centileFromLms(
      ageInDays,
      ageInMonths,
      birthGestationInDays,
      correctedGestationInDays,
      "child",
      object
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
    ageInDays === 0 ? (kind = "birth") : (kind = "neonate");
    if (correctedGestationInDays % 7 === 0) {
      const calculatedValues = centileFromLms(
        ageInDays,
        ageInMonths,
        birthGestationInDays,
        correctedGestationInDays,
        "neonate",
        object
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
      let hcCentile = ["N/A", "N/A"];
      let lengthCentile = ["N/A", "N/A"];
      let weightCentile = ["N/A", "N/A"];
      if (object.hc) {
        workingCentile = outputCentileFromMeasurementsPreterm(
          object,
          correctedGestationInDays / 7,
          "hc"
        );
        hcCentile = outputCentileRangePreterm(workingCentile);
      }
      if (object.length) {
        if (correctedGestationInDays >= 175) {
          workingCentile = outputCentileFromMeasurementsPreterm(
            object,
            correctedGestationInDays / 7,
            "length"
          );
          lengthCentile = outputCentileRangePreterm(workingCentile);
        } else {
          lengthCentile = ["Cannot plot length when under 25 weeks CGA", "N/A"];
        }
      }
      if (object.weight) {
        workingCentile = outputCentileFromMeasurementsPreterm(
          object,
          correctedGestationInDays / 7,
          "weight"
        );
        weightCentile = outputCentileRangePreterm(workingCentile);
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
    kind = "child";
    const calculatedValues = centileFromLms(
      ageInDays,
      ageInMonths,
      birthGestationInDays,
      correctedGestationInDays,
      kind,
      object
    );
    return {
      centiles: calculatedValues.centiles,
      kind: kind,
      lessThan14: lessThan14,
      ageAfterCorrection: calculatedValues.ageAfterCorrection,
      ageBeforeCorrection: calculatedValues.ageBeforeCorrection,
      under2: ageInDays < 730 ? true : false,
    };
  }
};

export default calculateCentile;
