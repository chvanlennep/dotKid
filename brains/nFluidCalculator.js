import zeit from './zeit';

export default (measurementValues, referenceValues) => {
  const { day1, day2, day3, day4, day5 } = referenceValues;
  const referenceArray = [day1, day2, day3, day4, day5];
  const {
    weight,
    correction,
    gestation,
    dob,
    tob,
    dom,
    tom,
  } = measurementValues;
  const kgWeight = weight / 1000;
  const tempDob = dob;
  const tempDom = dom || new Date();
  const tempTob = tob || new Date();
  const tempTom = tom || new Date();
  const finalDob = new Date(
    tempDob.getFullYear(),
    tempDob.getMonth(),
    tempDob.getDate(),
    tempTob.getHours(),
    tempTob.getMinutes()
  );
  const finalDom = new Date(
    tempDom.getFullYear(),
    tempDom.getMonth(),
    tempDom.getDate(),
    tempTom.getHours(),
    tempTom.getMinutes()
  );
  const age = zeit(finalDob, 'days', finalDom);
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
    stringAge: zeit(finalDob, 'string', finalDom),
    intAge: age,
    day1: day1,
    day2: day2,
    day3: day3,
    day4: day4,
    day5: day5,
  };
};
