import weightOn50th from './weightOn50th';
import zeit from './zeit';

export default WETFLAG = (dob, dom, sex, weight) => {
  let ageInDays = zeit(dob, 'days', dom);
  let ageInMonths = zeit(dob, 'months', dom);

  // rounds in 0.5 intervals for ETTube
  function round(value, step) {
    step || (step = 1.0);
    const inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  }

  // allows user to input weight if known
  let finalWeight;
  let weightIsEstimated = false;
  if (!weight) {
    const estWeight = weightOn50th(ageInDays, ageInMonths, sex);
    finalWeight = estWeight < 10 ? estWeight.toFixed(1) : Math.round(estWeight);
    weightIsEstimated = true;
  } else {
    finalWeight = Number(weight).toFixed(2);
  }

  // limits defibrillator energy output based on APLS guidelines https://www.resus.org.uk/sites/default/files/2020-03/PETchart-18-05-16.pdf
  let energy;
  if (ageInMonths >= 168) {
    energy = '120 - 150';
  } else if (finalWeight > 30) {
    energy = 120;
  } else {
    energy = Math.round((4 * finalWeight) / 5) * 5;
  }

  // Max ET Tube = 8, rounds to half measures
  let rawETtube = ageInMonths / 12 / 4 + 4;
  rawETtube > 8 ? (rawETtube = 8) : rawETtube;

  let ETtube = round(rawETtube, 0.5);

  // Max fluid bolus = 500ml
  let fluid = 20 * finalWeight;
  fluid > 500 ? (fluid = 500) : fluid;

  const adrenaline = 0.1 * finalWeight;

  // Max glucose bolus = 50ml
  let glucose = 2 * finalWeight;
  glucose > 50 ? (glucose = 50) : glucose;

  // Max lorazepam dose = 4mg
  let lorazepam;
  if (finalWeight < 40) {
    lorazepam = finalWeight * 0.1;
  } else {
    lorazepam = 4;
  }

  return {
    weight: finalWeight,
    weightIsEstimated: weightIsEstimated,
    energy: energy,
    ETtube: ETtube,
    fluid: fluid.toFixed(0),
    adrenaline: adrenaline.toFixed(2),
    glucose: glucose.toFixed(0),
    lorazepam: lorazepam.toFixed(2),
  };
};
