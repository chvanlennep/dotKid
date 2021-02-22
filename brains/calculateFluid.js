// This function outputs IV fluid requirements in ml/hr.

const calculateFluid = (weight, sex, mode, percentage, ageInYears) => {
  const percentageForMaint = mode === 'deficit' ? 100 : percentage;
  const bigKidFormula = () =>
    ((1500 + (weight - 20) * 20) / 24) * (percentageForMaint / 100);
  const mediumKidFormula = () =>
    ((1000 + (weight - 10) * 50) / 24) * (percentageForMaint / 100);
  const smallKidFormula = () =>
    ((weight * 100) / 24) * (percentageForMaint / 100);
  const correctionFormula = () => (weight * percentage * 10) / 48;
  const warningAsterix = ageInYears >= 5 && mode === 'deficit' ? '***' : '';
  const warningMessage =
    ageInYears >= 5 && mode === 'deficit'
      ? 'Note: fluid deficit calculations are principally aimed at children under 5 years of age. Proceed with caution.\n\n'
      : '';
  let answer;
  const correct = correctionFormula();
  switch (true) {
    case weight > 45 && sex === 'Female':
      if (mode === 'percentage') {
        answer = `Girls do not usually require more than 83.3ml/hr (calculation on full body weight is ${bigKidFormula().toFixed(
          1,
        )}ml/hr)`;
      } else {
        const maint = 83.3333333;
        const total = maint + correct;
        answer = `${total.toFixed(1)}ml/hr over 48 hours${warningAsterix}`;
      }
      break;
    case weight > 70 && sex === 'Male':
      if (mode === 'percentage') {
        answer = `Boys do not usually require more than 104.2ml/hr (calculation on full body weight is ${bigKidFormula().toFixed(
          1,
        )}ml/hr)`;
      } else {
        const maint = 104.1666667;
        const total = maint + correct;
        answer = `${total.toFixed(1)}ml/hr over 48 hours${warningAsterix}`;
      }

      break;
    case weight > 20:
      if (mode === 'percentage') {
        answer = `${bigKidFormula().toFixed(1)}ml/hr`;
      } else {
        const maint = bigKidFormula();

        const total = maint + correct;
        answer = `${total.toFixed(1)}ml/hr over 48 hours${warningAsterix}`;
      }
      break;
    case weight > 10:
      if (mode === 'percentage') {
        answer = `${mediumKidFormula().toFixed(1)}ml/hr`;
      } else {
        const maint = mediumKidFormula();
        const total = maint + correct;
        answer = `${total.toFixed(1)}ml/hr over 48 hours${warningAsterix}`;
      }
      break;
    default:
      if (mode === 'percentage') {
        answer = `${smallKidFormula().toFixed(1)}ml/hr`;
      } else {
        const maint = smallKidFormula();
        const total = maint + correct;
        answer = `${total.toFixed(1)}ml/hr over 48 hours`;
      }
  }
  const percentageExpl =
    '100ml/kg/day for the first 10kg \n+ 50ml/kg/day for 10kg to 20kg \n+ 20ml/kg/day 20kg upwards.\n\nFor girls, the usual maximum is 2000ml/day (83.3ml/hr) and for boys it is 2500ml/day (104.2ml/hr)\n\nThe total is then divided by 24 for the hourly amount.';
  const explanations = {
    percentage:
      percentageExpl +
      `\n\nPercentage correction is then applied (in this case: ${percentage}%)`,
    deficit: `${warningMessage}Maintenance requirements are first calculated:\n\n${percentageExpl}\n\nDeficit correction is then calculated:\n\nPercentage dehydration is 5% for moderate and 10% for severe dehydration.\n\nThe total correction amount is calculated as percentage x 10 x weight. As this should be corrected over 48 hours, this amount is then divided by 48 for the hourly rate.\n\nFinally, the maintenance rate per hour is added to the correction rate per hour to create a final rate.\n `,
  };
  return {
    fluid: answer,
    fluidText: explanations[mode],
    mode: mode === 'deficit' ? 'with deficit' : 'maintenance',
    warningAsterix: warningAsterix,
  };
};

export default calculateFluid;
