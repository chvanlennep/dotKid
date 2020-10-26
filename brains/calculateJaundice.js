import zeit from './zeit';

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
    return {
      phototherapy: Math.round(calculateThreshold38Photo(hours)),
      exchange: Math.round(calculateThreshold38Exchange(hours)),
    };
  } else {
    let arrayIndex = gestationWeeks - 23;
    let yInterceptPhoto = under38Data[arrayIndex][1];
    let plateauThresholdPhoto = under38Data[arrayIndex][2];
    let mValuePhoto = under38Data[arrayIndex][3];
    let yInterceptExchange = under38Data[arrayIndex][4];
    let plateauThresholdExchange = under38Data[arrayIndex][5];
    let mValueExchange = under38Data[arrayIndex][6];
    return {
      phototherapy: Math.round(
        calculateThresholdUnder38(
          hours,
          yInterceptPhoto,
          plateauThresholdPhoto,
          mValuePhoto
        )
      ),
      exchange: Math.round(
        calculateThresholdUnder38(
          hours,
          yInterceptExchange,
          plateauThresholdExchange,
          mValueExchange
        )
      ),
    };
  }
};

const calculateJaundice = (object) => {
  const justDob = object.dob;
  const justTob = object.tob;
  const justDom = object.dom;
  const justTom = object.tom;
  const dob = new Date(
    justDob.getFullYear(),
    justDob.getMonth(),
    justDob.getDate(),
    justTob.getHours(),
    justTob.getMinutes()
  );
  const dom = new Date(
    justDom.getFullYear(),
    justDom.getMonth(),
    justDom.getDate(),
    justTom.getHours(),
    justTom.getMinutes()
  );
  const sbr = object.sbr;
  const gestationWeeks = Math.floor(object.gestationInDays / 7);
  const floatHours = zeit(dob, 'hours', dom, false);
  const stringAge = zeit(dob, 'string', dom);
  const { phototherapy, exchange } = calculateFinalThresholds(
    floatHours,
    gestationWeeks
  );
  let mainConclusion = '';
  let activateYoungWarning = false;
  let exchangeWarning = false;
  let makeBlue = false;
  switch (true) {
    case phototherapy - sbr < 50 && phototherapy - sbr > 10:
      mainConclusion = 'Below phototherapy threshold, but less than 50 below';
      break;
    case phototherapy - sbr <= 10 && phototherapy - sbr > 0:
      mainConclusion = 'Close to phototherapy threshold';
      activateYoungWarning = true;
      makeBlue = true;
      break;
    case sbr >= phototherapy && sbr < exchange:
      mainConclusion = 'Threshold for phototherapy reached';
      makeBlue = true;
      activateYoungWarning = true;
      if (exchange - sbr < (exchange - phototherapy) / 3) {
        mainConclusion = 'Warning: close to exchange transfusion threshold';
        exchangeWarning = true;
        activateYoungWarning = true;
      }
      break;
    case sbr >= exchange:
      mainConclusion = 'Warning: threshold for exchange transfusion reached';
      activateYoungWarning = true;
      exchangeWarning = true;
      break;
    default:
      mainConclusion = '50 or more below phototherapy threshold';
  }
  let youngWarning = '';
  if (floatHours < 24 && activateYoungWarning)
    youngWarning =
      'Warning: this baby was less than 24 hours old when SBR taken';
  return {
    stringAge: stringAge,
    phototherapy: phototherapy,
    exchange: exchange,
    exchangeWarning: exchangeWarning,
    youngWarning: youngWarning,
    makeBlue: makeBlue,
    mainConclusion: mainConclusion,
    sbr: sbr,
    ageInHours: Math.floor(floatHours),
    gestationWeeks: gestationWeeks,
  };
};

export default calculateJaundice;
