let correctedFluid;
let textOutput;

// This function outputs IV fluid requirements in ml/hr.

export default (weight, percentage, sex) => {
  const childOutput = `100ml/kg/day for the first 10kg \n+ 50ml/kg/day for 10kg to 20kg \n+ 20ml/kg/day 20kg upwards \n\nPercentage correction applied (in this case: ${percentage}%)`;
  if (weight > 45 && sex === 'Female') {
    correctedFluid = 'Girls do not usually require more than 83.3';
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else if (weight > 70 && sex === 'Male') {
    correctedFluid = 'Boys do not usually require more than 104.2';
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else if (weight > 20) {
    correctedFluid = (
      ((1500 + (weight - 20) * 20) / 24) *
      (percentage / 100)
    ).toFixed(1);
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else if (weight > 10) {
    correctedFluid = (
      ((1000 + (weight - 10) * 50) / 24) *
      (percentage / 100)
    ).toFixed(1);
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else {
    correctedFluid = (((weight * 100) / 24) * (percentage / 100)).toFixed(1);
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  }
};
