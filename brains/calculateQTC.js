const calculateQTc = (age, inputQT, inputRR) => {
  // bazett formula
  const outputQTc = (inputQT / Math.sqrt(inputRR)) * 1000;
  // Reference value output based on age
  const truncOutputQTC = Math.round(outputQTc);
  let reference;
  const under6Ref =
    '<6 months of age: Normal QTc is less than or equal to 490 milliseconds';
  const over6Ref =
    '>6 months of age: Normal QTc is less than or equal to 440 milliseconds';
  if (age <= 6) {
    if (outputQTc <= 490) {
      reference = under6Ref;
      return [
        `${truncOutputQTC} milliseconds - no QTc prolongation`,
        reference,
      ];
    } else if (outputQTc > 490) {
      reference = under6Ref;
      return [`${truncOutputQTC} milliseconds - prolonged QTc`, reference];
    }
  } else {
    if (outputQTc <= 440) {
      reference = over6Ref;
      return [
        `${truncOutputQTC} milliseconds - no QTc prolongation`,
        reference,
      ];
    } else if (outputQTc > 440) {
      reference = over6Ref;
      return [`${truncOutputQTC} milliseconds - prolonged QTc`, reference];
    }
  }
};

export default calculateQTc;
