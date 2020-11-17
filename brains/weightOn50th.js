import centileData from './centileData';

export default (ageInDays, ageInMonths, sex) => {
  const index = ageInDays < 1460 ? ageInDays : ageInMonths + 1412;
  const array = centileData['child'][sex]['weight'][index];

  function computeChildMeasurementForGraph(z, lConstant, mConstant, sConstant) {
    return mConstant * Math.pow(z * lConstant * sConstant + 1, 1 / lConstant);
  }

  const output = computeChildMeasurementForGraph(
    0,
    array[1],
    array[2],
    array[3]
  );
  return output;
};
