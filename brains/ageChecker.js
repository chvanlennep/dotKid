import Zeit from './Zeit';

// note: minimumAgeInDays is in addition to negative age checking
// if no maximumAgeInDays specified, defaults to checking 18 years of age
export default (object, maximumAgeInDays, minimumAgeInDays) => {
  const max = maximumAgeInDays || 6574;
  const dateObject = new Zeit(object.dob, object.dom);
  const ageInDays = dateObject.calculate('days');
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
