import centileData from "./centileData";

export default specificCentile = (
  ageInDays,
  ageInMonths,
  birthGestationInDays = 280,
  correctedGestationInDays = 280,
  kind = "child",
  sex
) => {
  let array;
  let weightCentile = ["N/A", "N/A"];
  let z;
  let index;
  if (ageInDays <= 1459) {
    if (
      (birthGestationInDays < 259 &&
        birthGestationInDays >= 224 &&
        ageInDays <= 365) ||
      (birthGestationInDays < 224 && ageInDays <= 730)
    ) {
      index = ageInDays - (280 - birthGestationInDays);
    } else {
      index = ageInDays;
    }
  } else {
    index = ageInMonths + 1412;
  }

  array = centileData[kind][sex]["weight"][index];

  function computeChildMeasurementForGraph(z, lConstant, mConstant, sConstant) {
    return mConstant * Math.pow(z * lConstant * sConstant + 1, 1 / lConstant);
  }

  let output = computeChildMeasurementForGraph(0, array[1], array[2], array[3]);
  return output;
};
