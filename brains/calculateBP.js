import bpData from './bpData';

let adjustedSystolic90 = 0;
let adjustedSystolic95 = 0;
let adjustedSystolic99 = 0;
let adjustedDiastolic90 = 0;
let adjustedDiastolic95 = 0;
let adjustedDiastolic99 = 0;
let intervalHeight;

let adjustedValues = {
  adjustedSystolic90: adjustedSystolic90,
  adjustedSystolic95: adjustedSystolic95,
  adjustedSystolic99: adjustedSystolic99,
  adjustedDiastolic90: adjustedDiastolic90,
  adjustedDiastolic95: adjustedDiastolic95,
  adjustedDiastolic99: adjustedDiastolic99,
};

const calculateBP = (heightCentile, inputAge, systolic, diastolic, sex) => {
  const heightConverter = (heightCentile) => {
    switch (true) {
      case heightCentile <= 7:
        return (intervalHeight = '5th');

      case heightCentile > 7 && heightCentile <= 17:
        return (intervalHeight = '10th');

      case heightCentile > 17 && heightCentile <= 37:
        return (intervalHeight = '25th');

      case heightCentile > 37 && heightCentile <= 62:
        return (intervalHeight = '50th');

      case heightCentile > 62 && heightCentile <= 82:
        return (intervalHeight = '75th');

      case heightCentile > 82 && heightCentile <= 92:
        return (intervalHeight = '90th');

      case heightCentile > 93 && heightCentile <= 100:
        return (intervalHeight = '95th');

      default:
        return 'nope';
    }
  };

  const GetBPValues = (inputAge, intervalHeight, sex) => {
    adjustedValues.adjustedSystolic90 =
      bpData['child'][sex]['systolic'][`age${inputAge}Centile90`][
        intervalHeight
      ];

    adjustedValues.adjustedSystolic95 =
      bpData['child'][sex]['systolic'][`age${inputAge}Centile95`][
        intervalHeight
      ];

    adjustedValues.adjustedSystolic99 =
      bpData['child'][sex]['systolic'][`age${inputAge}Centile99`][
        intervalHeight
      ];

    adjustedValues.adjustedDiastolic90 =
      bpData['child'][sex]['diastolic'][`age${inputAge}Centile90`][
        intervalHeight
      ];

    adjustedValues.adjustedDiastolic95 =
      bpData['child'][sex]['diastolic'][`age${inputAge}Centile95`][
        intervalHeight
      ];

    adjustedValues.adjustedDiastolic99 =
      bpData['child'][sex]['diastolic'][`age${inputAge}Centile99`][
        intervalHeight
      ];
    return adjustedValues;
  };

  const compareSystolic = (systolic, adjustedValues) => {
    switch (true) {
      case systolic >= adjustedValues.adjustedSystolic99:
        return 'Systolic BP >99th centile';
        break;
      case systolic >= adjustedValues.adjustedSystolic95:
        return 'Systolic BP between 95th and 99th centile';
        break;
      case systolic >= adjustedValues.adjustedSystolic90:
        return 'Systolic BP between 90th and 95th centile.';
        break;
      case systolic < adjustedValues.adjustedSystolic90:
        return 'Systolic BP <90th centile \nNot hypertensive';
        break;
      default:
        return 'error';
    }
  };

  const compareDiastolic = (diastolic, adjustedValues) => {
    switch (true) {
      case !diastolic:
        return 'No measurement recorded';
        break;
      case diastolic >= adjustedValues.adjustedDiastolic99:
        return 'Diastolic BP >99th centile';
        break;
      case diastolic >= adjustedValues.adjustedDiastolic95:
        return 'Diastolic BP between 95th and 99th centile';
        break;
      case diastolic >= adjustedValues.adjustedDiastolic90:
        return 'Diastolic BP between 90th and 95th centile.';
        break;
      case diastolic < adjustedValues.adjustedDiastolic90:
        return 'Diastolic BP <90th centile \nNot hypertensive';
        break;
      default:
        return 'error';
    }
  };

  const systolicReferenceValues = (adjustedValues) => {
    return `Systolic 90th centile: ${adjustedValues.adjustedSystolic90}mmHg\n\nSystolic 95th centile: ${adjustedValues.adjustedSystolic95}mmHg\n\nSystolic 99th centile: ${adjustedValues.adjustedSystolic99}mmHg`;
  };
  const diastolicReferenceValues = (adjustedValues) => {
    return `Diastolic 90th centile: ${adjustedValues.adjustedDiastolic90}mmHg\n\nDiastolic 95th centile: ${adjustedValues.adjustedDiastolic95}mmHg\n\nDiastolic 99th centile: ${adjustedValues.adjustedDiastolic99}mmHg`;
  };

  const heightOutput = heightConverter(heightCentile);
  const BPValues = GetBPValues(inputAge, heightOutput, sex);
  const systolicOutput = compareSystolic(systolic, BPValues);
  const diastolicOutput = compareDiastolic(diastolic, BPValues);
  const systolicRef = systolicReferenceValues(BPValues);
  const diastolicRef = diastolicReferenceValues(BPValues);

  const BPOutput = {
    systolicOutput: systolicOutput,
    diastolicOutput: diastolicOutput,
    systolicReferenceValues: systolicRef,
    diastolicReferenceValues: diastolicRef,
  };

  return BPOutput;
};

export default calculateBP;
