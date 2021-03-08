import Zeit from './Zeit';

export default (measurementValues, referenceValues, gestation) => {
  const {day1, day2, day3, day4, day5} = referenceValues;
  const referenceArray = [day1, day2, day3, day4, day5];
  const {weight, correction, dob, dom} = measurementValues;
  const kgWeight = weight;
  const ageObject = new Zeit(dob, dom);
  const age = ageObject('days');
  const preCorrection24hr =
    age >= 5 ? kgWeight * day5 : kgWeight * referenceArray[age];
  const corrected24Hr = preCorrection24hr * (correction / 100);
  return {
    corrected24Hr: corrected24Hr,
    corrected1Hourly: corrected24Hr / 24,
    corrected2Hourly: corrected24Hr / 12,
    corrected3Hourly: corrected24Hr / 8,
    corrected4Hourly: corrected24Hr / 6,
    correction: correction,
    gestation: gestation,
    weight: weight,
    stringAge: zeit(dob, 'string', dom),
    intAge: age,
    day1: day1,
    day2: day2,
    day3: day3,
    day4: day4,
    day5: day5,
  };
};
