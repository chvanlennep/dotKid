import zeit from "./zeit";

const under38Data = [
  [23, 40, 130, 1.25, 80, 230, 2.083333333],
  [24, 40, 140, 1.388888889, 80, 240, 2.222222222],
  [25, 40, 150, 1.527777778, 80, 250, 2.361111111],
  [26, 40, 160, 1.666666667, 80, 260, 2.5],
  [27, 40, 170, 1.805555556, 80, 270, 2.638888889],
  [28, 40, 180, 1.944444444, 80, 280, 2.777777778],
  [29, 40, 190, 2.083333333, 80, 290, 2.916666667],
  [30, 40, 200, 2.222222222, 80, 300, 3.055555556],
  [31, 40, 210, 2.361111111, 80, 310, 3.194444444],
  [32, 40, 220, 2.5, 80, 320, 3.333333333],
  [33, 40, 230, 2.638888889, 80, 330, 3.472222222],
  [34, 40, 240, 2.777777778, 80, 340, 3.611111111],
  [35, 40, 250, 2.916666667, 80, 350, 3.75],
  [36, 40, 260, 3.055555556, 80, 360, 3.888888889],
  [37, 40, 270, 3.194444444, 80, 370, 4.027777778],
];

const calculateThresholdUnder38 = (
  hours,
  yIntercept,
  plateauThreshold,
  mValue
) => {
  if (hours < 72) {
    return yIntercept + mValue * hours;
  } else {
    return plateauThreshold;
  }
};

const calculateThreshold38Photo = (hours) => {
  if (hours < 24) {
    return 100 + 4.16666667 * hours;
  } else if (hours < 96) {
    return 150 + 2.08333333 * hours;
  } else {
    return 350;
  }
};

const calculateThreshold38Exchange = (hours) => {
  if (hours < 42) {
    return 100 + 8.33333333 * hours;
  } else {
    return 450;
  }
};

const calculateFinalThresholds = (hours, gestationWeeks) => {
  if (gestationWeeks >= 38) {
    return [
      Math.round(calculateThreshold38Photo(hours)),
      Math.round(calculateThreshold38Exchange(hours)),
    ];
  } else {
    let arrayIndex = gestationWeeks - 23;
    let yInterceptPhoto = under38Data[arrayIndex][1];
    let plateauThresholdPhoto = under38Data[arrayIndex][2];
    let mValuePhoto = under38Data[arrayIndex][3];
    let yInterceptExchange = under38Data[arrayIndex][4];
    let plateauThresholdExchange = under38Data[arrayIndex][5];
    let mValueExchange = under38Data[arrayIndex][6];
    return [
      Math.round(
        calculateThresholdUnder38(
          hours,
          yInterceptPhoto,
          plateauThresholdPhoto,
          mValuePhoto
        )
      ),
      Math.round(
        calculateThresholdUnder38(
          hours,
          yInterceptExchange,
          plateauThresholdExchange,
          mValueExchange
        )
      ),
    ];
  }
};

const outputResult = (floatHours, gestationWeeks, sbr) => {
  let thresholds = calculateFinalThresholds(floatHours, gestationWeeks);
  const hours = Math.floor(floatHours);
  const phototherapyThreshold = thresholds[0];
  const exchangeThreshold = thresholds[1];
  function lessThan24HoursWarning(hours) {
    if (hours < 24) {
      return "Warning: This baby is less than 24 hours old \n\n";
    } else {
      return "";
    }
  }
  const lessThan24HoursAlert = lessThan24HoursWarning(hours);
  function giveEasyToReadAge(hours) {
    const daysOld = Math.floor(hours / 24);
    const hoursOld = hours - daysOld * 24;
    function addPluralSuffix() {
      switch (true) {
        case daysOld === 1 && hoursOld === 1:
          return ["", ""];
        case daysOld === 1 && hoursOld != 1:
          return ["", "s"];
        case daysOld != 1 && hoursOld === 1:
          return ["s", ""];
        case daysOld != 1 && hoursOld != 1:
          return ["s", "s"];
      }
    }
    let suffices = addPluralSuffix();
    const [first, second] = suffices;
    return `This baby was ${daysOld} day${first} and ${
      hoursOld % 24
    } hour${second} old at the time of calculation`;
  }
  const easyToReadAge = giveEasyToReadAge(hours);
  switch (true) {
    case sbr >= exchangeThreshold:
      return `Warning: Exchange transfusion threshold reached (${
        sbr - exchangeThreshold
      } above) \n\n Thresholds: \n Phototherapy: ${phototherapyThreshold} \n Exchange transfusion: ${exchangeThreshold} \n\n ${easyToReadAge}`;
    case exchangeThreshold - sbr <
      (exchangeThreshold - phototherapyThreshold) / 4:
      return `Warning: Above phototherapy threshold and close to exchange transfusion threshold (${
        exchangeThreshold - sbr
      } below exchange transfusion threshold) \n\n Thresholds: \n Phototherapy: ${phototherapyThreshold} \n Exchange transfusion: ${exchangeThreshold} \n\n ${easyToReadAge}`;
    case sbr >= phototherapyThreshold:
      return `${lessThan24HoursAlert}Phototherapy threshold reached (${
        sbr - phototherapyThreshold
      } above) \n\n Thresholds: \n Phototherapy: ${phototherapyThreshold} \n Exchange transfusion: ${exchangeThreshold} \n\n ${easyToReadAge}`;
    case phototherapyThreshold - sbr <= 10:
      return `${lessThan24HoursAlert}Close to phototherapy threshold (${
        phototherapyThreshold - sbr
      } below) \n\n Thresholds: \n Phototherapy: ${phototherapyThreshold} \n Exchange transfusion: ${exchangeThreshold} \n\n ${easyToReadAge}`;
    case phototherapyThreshold - sbr < 50:
      return `${lessThan24HoursAlert}Less than 50 below phototherapy threshold (${
        phototherapyThreshold - sbr
      } below) \n\n Thresholds: \n Phototherapy: ${phototherapyThreshold} \n Exchange transfusion: ${exchangeThreshold} \n\n ${easyToReadAge}`;
    default:
      return `50 or more below phototherapy threshold (${
        phototherapyThreshold - sbr
      } below) \n\n Thresholds: \n Phototherapy: ${phototherapyThreshold} \n Exchange transfusion: ${exchangeThreshold} \n\n ${easyToReadAge}`;
  }
};

const calculateJaundice = (object) => {
  const dob = object.dob;
  const dom = object.dom;
  const sbr = object.sbr;
  const gestationWeeks = Math.floor(object.gestationInDays / 7);
  const floatHours = zeit(dob, "hours", dom, false);
  return outputResult(floatHours, gestationWeeks, sbr);
};

export default calculateJaundice;
