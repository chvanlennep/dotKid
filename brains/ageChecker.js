import zeit from "./zeit";

export default ageChecker = (object) => {
  const dob = object.dob;
  const dom = object.dom;
  let ageInDays = zeit(dob, "days", dom);
  let lessThan14;
  let kind;
  if (ageInDays < 0) {
    return "Negative age";
  }
  if (ageInDays > 6574) {
    return "Over 18";
  }
  if (ageInDays < 14) {
    lessThan14 = true;
  }
};
