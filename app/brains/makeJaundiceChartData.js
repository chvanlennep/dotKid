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
  mValue,
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

const generatePhototherapyData = (hours, gestationWeeks) => {
  if (gestationWeeks >= 38) {
    return calculateThreshold38Photo(hours);
  } else {
    const arrayIndex = gestationWeeks - 23;
    const yInterceptPhoto = under38Data[arrayIndex][1];
    const plateauThresholdPhoto = under38Data[arrayIndex][2];
    const mValuePhoto = under38Data[arrayIndex][3];
    return calculateThresholdUnder38(
      hours,
      yInterceptPhoto,
      plateauThresholdPhoto,
      mValuePhoto,
    );
  }
};

const generateExchangeData = (hours, gestationWeeks) => {
  if (gestationWeeks >= 38) {
    return calculateThreshold38Exchange(hours);
  } else {
    const arrayIndex = gestationWeeks - 23;
    const yInterceptExchange = under38Data[arrayIndex][4];
    const plateauThresholdExchange = under38Data[arrayIndex][5];
    const mValueExchange = under38Data[arrayIndex][6];
    return calculateThresholdUnder38(
      hours,
      yInterceptExchange,
      plateauThresholdExchange,
      mValueExchange,
    );
  }
};

const makeDataObject = (gestationWeeks, ageInHours, sbr) => {
  let bottomValue = ageInHours - 36;
  let topValue = ageInHours + 36;
  if (bottomValue < 0) {
    bottomValue = 0;
    topValue = ageInHours + 36 + (36 - ageInHours); // add on extra hours to range so a 72 hour window is always displayed
  }
  if (topValue > 336) {
    topValue = 336;
    bottomValue = ageInHours - 36 - (ageInHours + 36 - 336); // add on extra hours to range so a 72 hour window is always displayed
  }
  const xLabels = [];
  const finalXLabels = [];
  const photoArray = [];
  const exchangeArray = [];
  const dotArray = [];
  const xLabelDivisor = 24;
  const xLoopChopper = 12;
  for (let i = bottomValue; i < topValue + 1; i++) {
    photoArray.push(generatePhototherapyData(i, gestationWeeks));
    exchangeArray.push(generateExchangeData(i, gestationWeeks));
    xLabels.push(Number((i / xLabelDivisor).toFixed(1)));
    if (i === ageInHours) {
      dotArray.push(sbr);
    } else {
      dotArray.push(0);
    }
  }
  const highestLineReach = Math.round(
    generateExchangeData(topValue, gestationWeeks),
  );

  for (let t = 0; t < xLabels.length; t++) {
    if (t % xLoopChopper === 0) {
      finalXLabels.push(xLabels[t]);
    }
  }

  return {
    data: [
      {
        data: photoArray,
        svg: {stroke: 'dodgerblue'},
      },
      {
        data: exchangeArray,
        svg: {stroke: 'red'},
      },
      {
        data: dotArray,
        svg: {stroke: null},
      },
    ],
    topLimit: sbr > highestLineReach ? sbr : highestLineReach,
    finalXLabels: finalXLabels,
  };
};

export default makeDataObject;
