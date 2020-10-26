import specificCentile from "./specificCentile";
import zeit from "./zeit";

export default WETFLAG = (dob, dom, sex, weight) => {
  let ageInDays = zeit(dob, "days", dom, true);
  let ageInMonths = zeit(dob, "months", dom, true);

  // rounds in 0.5 intervals for ETTube
  function round(value, step) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  }

  // allows user to input weight if known
  let finalWeight;
  isNaN(weight)
    ? (finalWeight = specificCentile(
        ageInDays,
        ageInMonths,
        280,
        280,
        "child",
        sex
      ))
    : (finalWeight = weight);

  // limits defibrillator energy output based on APLS guidelines https://www.resus.org.uk/sites/default/files/2020-03/PETchart-18-05-16.pdf
  let energy;
  if (ageInMonths >= 168) {
    energy = "120 - 150";
  } else if (finalWeight > 30) {
    energy = 120;
  } else {
    energy = 4 * finalWeight;
  }

  // Max ET Tube = 8, rounds to half measures
  let rawETtube = ageInMonths / 12 / 4 + 4;
  rawETtube > 8 ? (rawETtube = 8) : rawETtube;

  let ETtube = round(rawETtube, 0.5);

  // Max fluid bolus = 500ml
  let fluid = 20 * finalWeight;
  fluid > 500 ? (fluid = 500) : fluid;

  let adrenaline = 0.1 * finalWeight;

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
    energy: Math.round(energy / 10) * 10,
    ETtube: ETtube,
    fluid: fluid.toFixed(0),
    adrenaline: adrenaline.toFixed(2),
    glucose: glucose.toFixed(0),
    lorazepam: lorazepam.toFixed(2),
  };
};
