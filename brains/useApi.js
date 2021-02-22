// import {useNetInfo} from '@react-native-community/netinfo';
// import {primary} from '../../apiKey';

const apiSingleMeasurement =
  'https://api.rcpch.ac.uk/growth/v1/uk-who/calculation';

const singleMeasurement = 'http://192.168.86.34:5000/uk-who/calculation';
///const chartCoords = 'http://192.168.86.34:5000/uk-who/chart-coordinates';
const plottableChild = 'http://192.168.86.34:5000/uk-who/plottable-child-data';

const makeApiArgument = (
  dob,
  dom,
  gestationInDays,
  measurementType,
  measurement,
  inputSex,
) => {
  const makeStandardisedDateString = (dateObject) => {
    let month = `${dateObject.getMonth() + 1}`;
    let day = `${dateObject.getDate()}`;
    const year = `${dateObject.getFullYear()}`;
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  };
  const birthDate = makeStandardisedDateString(new Date(dob));
  const observationDate = makeStandardisedDateString(
    dom ? new Date(dom) : new Date(),
  );
  const gestationDays = gestationInDays % 7;
  const gestationWeeks = Math.floor(gestationInDays / 7);
  let measurementMethod = measurementType;
  if (measurementType === 'hc') {
    measurementMethod = 'ofc';
  }
  if (measurementType === 'length') {
    measurementMethod = 'height';
  }
  const observationValue = Number(measurement);
  const sex = inputSex.toLowerCase();
  return {
    birth_date: birthDate,
    gestation_days: gestationDays,
    gestation_weeks: gestationWeeks,
    measurement_method: measurementMethod,
    observation_date: observationDate,
    observation_value: observationValue,
    sex: sex,
  };
};

const timeoutForFetch = async (milliseconds, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout exceeded'));
    }, milliseconds);
    promise.then(resolve, reject);
  });
};

const useApi = () => {
  const getSingleCentileData = async (
    dob,
    dom,
    gestationInDays,
    measurementType,
    measurement,
    inputSex,
  ) => {
    const apiArgument = makeApiArgument(
      dob,
      dom,
      gestationInDays,
      measurementType,
      measurement,
      inputSex,
    );
    try {
      const serverResponse = await timeoutForFetch(
        6000,
        fetch(singleMeasurement, {
          method: 'POST',
          headers: {
            // 'Primary-Subscription-Key': primary,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify(apiArgument),
          redirect: 'follow',
        }),
      );
      if (!serverResponse.ok) {
        throw new Error(serverResponse.status);
      } else {
        const stringObject = await serverResponse.text();
        return JSON.parse(stringObject);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {getSingleCentileData};
};

const referenceArgumentsSingleMeasurement = {
  birth_date: '2003-02-10',
  gestation_days: 4,
  gestation_weeks: 40,
  measurement_method: 'height',
  observation_date: '2021-02-09',
  observation_value: 188,
  sex: 'male',
};

const referenceReturnObjectSingleMeasurement = {
  birth_data: {
    birth_date: 'Mon, 10 Feb 2003 00:00:00 GMT',
    estimated_date_delivery: null,
    estimated_date_delivery_string: null,
    gestation_days: 4,
    gestation_weeks: 40,
    sex: 'male',
  },
  child_observation_value: {
    measurement_method: 'height',
    observation_value: 188,
  },
  measurement_calculated_values: {
    centile: 94,
    centile_band:
      'This height measurement is between the 91st and 98th centiles.',
    measurement_method: 'height',
    sds: 1.5566015052679778,
  },
  measurement_dates: {
    chronological_calendar_age: '17 years, 11 months, 4 weeks and 2 days',
    chronological_decimal_age: 17.998631074606433,
    clinician_decimal_age_comment: 'Born Term. No correction necessary.',
    corrected_calendar_age: '17 years, 11 months, 4 weeks and 2 days',
    corrected_decimal_age: 17.998631074606433,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    lay_decimal_age_comment:
      'At 40+4, your child is considered to have been born at term. No age adjustment is necessary.',
    observation_date: 'Tue, 09 Feb 2021 00:00:00 GMT',
  },
};

const referenceReturnObjectPlottableChild = {
  child_data: {
    centile_data: [
      [
        {
          age_type: 'corrected_age',
          calendar_age: '1 year',
          centile_band:
            'This weight measurement is between the 25th and 50th centiles.',
          centile_value: 40,
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: 9.4,
        },
        {
          age_type: 'chronological_age',
          calendar_age: '1 year',
          centile_band:
            'This weight measurement is between the 25th and 50th centiles.',
          centile_value: 40,
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: 9.4,
        },
      ],
    ],
    measurement_method: 'weight',
    sds_data: [
      [
        {
          age_type: 'corrected_age',
          calendar_age: '1 year',
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: -0.24344224642481746,
        },
        {
          age_type: 'chronological_age',
          calendar_age: '1 year',
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: -0.24344224642481746,
        },
      ],
    ],
  },
  sex: 'male',
};

export default useApi;
