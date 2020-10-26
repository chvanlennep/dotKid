import zeit from './zeit';

// note: minimumAgeInDays is in addition to negative age checking
// if no maximumAgeInDays specified, defaults to checking 18 years of age
export default ageChecker = (object, maximumAgeInDays, minimumAgeInDays) => {
  let dob = object.dob;
  if (object.tob) {
    dob = new Date(
      object.dob.getFullYear(),
      object.dob.getMonth(),
      object.dob.getDate(),
      object.tob.getHours(),
      object.tob.getMinutes()
    );
  }
  let dom = object.dom;
  if (object.tom) {
    dob = new Date(
      object.dom.getFullYear(),
      object.dom.getMonth(),
      object.dom.getDate(),
      object.tom.getHours(),
      object.tom.getMinutes()
    );
  }
  const max = maximumAgeInDays ? maximumAgeInDays : 6574;
  const ageInDays = zeit(dob, 'days', dom);
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
