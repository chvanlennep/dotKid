let reference;

let under6Ref = `<6 months of age: Normal QTc is less than or equal to 490 milliseconds`;
let over6Ref = `>6 months of age: Normal QTc is less than or equal to 440 milliseconds`;

export default calculateQTc = (age, inputQT, inputRR) => {
  // bazett formula
  const QTcCalculator = (inputQT, inputRR) => {
    let outputQTc = inputQT / Math.sqrt(inputRR);
    return outputQTc;
  };

  // Reference value output based on age
  function ageCorrection(age, outputQTc) {
    if (age <= 6) {
      if (outputQTc <= 0.49) {
        let truncOutputQTC = outputQTc.toFixed(3);
        reference = under6Ref;
        return [
          `${truncOutputQTC} milliseconds - no QTc prolongation`,
          reference,
        ];
      } else if (outputQTc > 0.49) {
        let truncOutputQTC = outputQTc.toFixed(3);
        reference = under6Ref;
        return [`${truncOutputQTC} milliseconds - prolonged QTc`, reference];
      }
    } else {
      if (outputQTc <= 0.44) {
        let truncOutputQTC = outputQTc.toFixed(3);
        reference = over6Ref;
        return [
          `${truncOutputQTC} milliseconds - no QTc prolongation`,
          reference,
        ];
      } else if (outputQTc > 0.44) {
        let truncOutputQTC = outputQTc.toFixed(3);
        reference = over6Ref;
        return [`${truncOutputQTC} milliseconds - prolonged QTc`, reference];
      }
    }
  }
  let outputQTc = QTcCalculator(inputQT, inputRR);
  let correctedQTC = ageCorrection(age, outputQTc);

  return correctedQTC;
};
