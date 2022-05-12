import zeit from './zeit';

// note: minimumAgeInDays is in addition to negative age checking
// if no maximumAgeInDays specified, defaults to checking 18 years of age
export default (object, maximumAgeInDays, minimumAgeInDays) => {
  const max = maximumAgeInDays || 6574;
  const ageInDays = zeit(object.dob, 'days', object.dom);
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
