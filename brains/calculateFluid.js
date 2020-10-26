import zeit from "./zeit";

let correctedFluid;
let textOutput;

// This function outputs IV fluid requirements in ml/hr.

export default WETFLAG = (
  dob,
  dom,
  gestationInDays,
  weight,
  percentage,
  sex
) => {
  let correctDays = 0;
  const age = zeit(dob, "days", dom, true, correctDays);
  const correctedGestation = age + gestationInDays;
  const neonateOutput =
    "Fluid requirements in the neonatal period: 150ml/kg/day.";
  const childOutput = `Fluid requirements for children: \n\n100ml/kg/day for the first 10kgs; \n50ml/kg/day for weight >10kg \n20ml/kg/day for weight >20kg. \n\nPercentage correction is then applied.`;

  if (gestationInDays < 259 && correctedGestation < 280) {
    correctedFluid = (150 * weight).toFixed(1);
    textOutput = neonateOutput;
    return [correctedFluid, textOutput];
  } else if (gestationInDays < 308) {
    correctedFluid = (150 * weight).toFixed(1);
    textOutput = neonateOutput;
    return [correctedFluid, textOutput];
  } else if (weight > 45 && sex == "Female") {
    correctedFluid = "Girls do not usually require more than 83.3";
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else if (weight > 70 && sex == "Male") {
    correctedFluid = "Boys do not usually require more than 104.2";
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else if (weight > 20) {
    correctedFluid = (
      ((1500 + (weight - 20) * 20) / 24) *
      (percentage / 100)
    ).toFixed(3);
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else if (weight > 10) {
    correctedFluid = (
      ((1000 + (weight - 10) * 50) / 24) *
      (percentage / 100)
    ).toFixed(3);
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  } else {
    correctedFluid = (((weight * 100) / 24) * (percentage / 100)).toFixed(3);
    textOutput = childOutput;
    return [correctedFluid, textOutput];
  }
};
