import obsRanges from '../brains/obsRanges';

const normalValues = (inputAge) => {
    let ageRange;
  const accessData = (inputAge) => {
    switch (true) {
      case inputAge < 1:
        return ageRange = '0-1';
        break;
      case inputAge < 2:
        return ageRange = '1-2';
        break;
      case inputAge < 5:
        return ageRange = '2-5';
        break;
      case inputAge < 12:
        return ageRange = '5-12';
        break;
      case inputAge < 16:
        return ageRange = '13-16';
        break;
      default:
        return ageRange = 'nope';
    }
  };
let rangesOutput = obsRanges[normalValues][`${ageRange}`];
console.log(rangesOutput);
};

accessData(5)