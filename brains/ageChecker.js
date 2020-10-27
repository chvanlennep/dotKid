import zeit from './zeit';

// note: minimumAgeInDays is in addition to negative age checking
// if no maximumAgeInDays specified, defaults to checking 18 years of age
export default ageChecker = (object, maximumAgeInDays, minimumAgeInDays) => {
  const tempDob = object.dob;
  const tempDom = object.dom ? object.dom : new Date();
  const tempTob = object.tob ? object.tob : new Date();
  const tempTom = object.tom ? object.tom : new Date();
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
  const max = maximumAgeInDays ? maximumAgeInDays : 6574;
  const ageInDays = zeit(finalDob, 'days', finalDom);
  if (ageInDays < 0) {
    return 'Negative age';
  } else if (minimumAgeInDays) {
    if (ageInDays < minimumAgeInDays) {
      return 'Too young';
    }
  } else if (ageInDays > max) {
    return 'Too old';
  } else {
    return null;
  }
};
