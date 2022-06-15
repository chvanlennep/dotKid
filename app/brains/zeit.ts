// Replacing moment.js

export default (
  from, // furthest away date / time in the interval
  units, // units to output, can be outputted as a string
  until, // closest date / time in the interval
  integer = true, // if returning as a number, defaults to an integer
  correctDays = 0, // number of days to take off interval
  resus = false, // if set to true, units must be "string". This outputs string interval for purposes of resus logs
) => {
  const untilObject = until || new Date();
  if (!from) {
    return null;
  }
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const fromObject = correctDays ? addDays(from, correctDays) : from;
  const millisecondDifference = untilObject.getTime() - fromObject.getTime();
  const milliseconds = 1000;
  const seconds = 60;
  const minutes = 60;
  const hours = 24;
  const days = 7;
  const months = 365 / 12;
  const exactYears = 365.25;
  const rawSeconds = millisecondDifference / milliseconds;
  const rawMinutes = millisecondDifference / (milliseconds * seconds);
  const rawHours = millisecondDifference / (milliseconds * seconds * minutes);
  const rawDays =
    millisecondDifference / (milliseconds * seconds * minutes * hours);
  const rawWeeks =
    millisecondDifference / (milliseconds * seconds * minutes * hours * days);
  const rawMonths =
    millisecondDifference / (milliseconds * seconds * minutes * hours * months);
  const rawYears =
    millisecondDifference /
    (milliseconds * seconds * minutes * hours * exactYears);
  const yearBitLeft = rawYears - Math.floor(rawYears);
  const remainderMonths = Math.floor(yearBitLeft * 12);
  const monthBitLeft = rawMonths - Math.floor(rawMonths);
  const remainderWeeks = Math.floor(monthBitLeft * 4);
  let birthday = false;
  if (
    `${fromObject.getDate()}${fromObject.getMonth()}` ===
    `${untilObject.getDate()}${untilObject.getMonth()}`
  ) {
    birthday = true;
  }
  let rawAnswer;
  switch (true) {
    case units === 'minutes':
      rawAnswer = rawMinutes;
      break;
    case units === 'hours':
      rawAnswer = rawHours;
      break;
    case units === 'days':
      // fudge to catch 3 year 11 month old plotting at 4 years old on chart
      if (Math.round(rawDays) === 1460 && remainderMonths === 11) {
        rawAnswer = 1459;
      } else {
        rawAnswer = rawDays;
      }
      break;
    case units === 'weeks':
      rawAnswer = rawWeeks;
      break;
    case units === 'months':
      birthday ? (rawAnswer = Math.round(rawMonths)) : (rawAnswer = rawMonths);
      break;
    case units === 'years':
      birthday ? (rawAnswer = Math.round(rawYears)) : (rawAnswer = rawYears);
      break;
    case units === 'string':
      const intAges = {
        seconds: Math.floor(rawSeconds),
        remainderSeconds: Math.floor(rawSeconds) % 60,
        minutes: Math.floor(rawMinutes),
        remainderMinutes: Math.floor(rawMinutes) % 60,
        hours: Math.floor(rawHours),
        remainderHours: Math.floor(rawHours) % 24,
        days: Math.floor(rawDays),
        remainderDays: Math.floor(rawDays) % 7,
        weeks: Math.floor(rawWeeks),
        remainderWeeks: remainderWeeks,
        months: Math.floor(rawMonths),
        remainderMonths: remainderMonths,
        years: Math.floor(rawYears),
      };
      if (resus) {
        let outputHours = '';
        let outputMinutes = '';
        let outputSeconds = '';
        intAges.hours < 10
          ? (outputHours = `0${intAges.hours}`)
          : (outputHours = `${intAges.hours}`);
        intAges.remainderMinutes < 10
          ? (outputMinutes = `0${intAges.remainderMinutes}`)
          : (outputMinutes = `${intAges.remainderMinutes}`);
        intAges.remainderSeconds < 10
          ? (outputSeconds = `0${intAges.remainderSeconds}`)
          : (outputSeconds = `${intAges.remainderSeconds}`);
        return `${outputHours}:${outputMinutes}:${outputSeconds}`;
      }
      const plurals = {
        seconds: '',
        remainderSeconds: '',
        minutes: '',
        remainderMinutes: '',
        hours: '',
        remainderHours: '',
        days: '',
        remainderDays: '',
        weeks: '',
        remainderWeeks: '',
        months: '',
        remainderMonths: '',
        years: '',
      };
      for (const [key, value] of Object.entries(intAges)) {
        if (value === 1) {
          plurals[key] = '';
        } else {
          plurals[key] = 's';
        }
      }
      const wholeWeeks = Math.floor(rawWeeks);
      switch (true) {
        case rawDays < 1:
          return `${intAges.remainderHours} hour${plurals.remainderHours}`;
        case wholeWeeks <= 2:
          return `${intAges.days} day${plurals.days} and ${intAges.remainderHours} hour${plurals.remainderHours}`;
        case wholeWeeks > 2 && wholeWeeks <= 8:
          return `${intAges.weeks} week${plurals.weeks} and ${intAges.remainderDays} day${plurals.remainderDays}`;
        case wholeWeeks > 8 && rawYears < 1:
          // if a leap day adds 1 day, could appear 1 year old when they aren't
          if (rawYears > 0.9993) {
            return '11 months and 3 weeks';
          } else {
            return `${intAges.months} month${plurals.months} and ${intAges.remainderWeeks} week${plurals.remainderWeeks}`;
          }
        default:
          if (birthday) {
            return `${Math.round(rawYears)} year${plurals.years} and 0 months`;
          } else {
            return `${intAges.years} year${plurals.years} and ${intAges.remainderMonths} month${plurals.remainderMonths}`;
          }
      }
    case units === undefined:
      return 'Error: please specify units for output';
    default:
      return 'Error: invalid parameter for units';
  }
  if (integer === true) {
    return Math.floor(rawAnswer);
  } else {
    return rawAnswer;
  }
};