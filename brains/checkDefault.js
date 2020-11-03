// returns true if neonatal values for fluids match defaults, false if not

export default (values) => {
  if (
    values.day1 === '60' &&
    values.day2 === '80' &&
    values.day3 === '100' &&
    values.day4 === '120' &&
    values.day5 === '150'
  ) {
    return true;
  } else {
    return false;
  }
};
