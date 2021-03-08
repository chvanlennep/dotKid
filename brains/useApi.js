import {useState, useCallback} from 'react';

import {Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {API_CALC_LOCAL_URL, API_CALC_LAN_URL, API_CALC_REAL_URL} from '@env';
import {calculateBMI, formatDate} from './oddBits';
import {readItemFromStorage, writeItemToStorage} from './storage';

//parses dotKid measurements object into format recognised by the api
const makeApiArgument = (inputObject, measurementType) => {
  const {dob, dom, gestationInDays, sex} = inputObject;
  let measurement = inputObject[measurementType];
  if (!measurement && measurementType === 'bmi') {
    measurement = calculateBMI(inputObject.weight, inputObject.height);
  } else if (!measurement && inputObject.length) {
    measurement = inputObject.length;
  }
  const birthDate = formatDate(new Date(dob), true, true);
  const observationDate = formatDate(
    dom ? new Date(dom) : new Date(),
    true,
    true,
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
  const parsedSex = sex.toLowerCase();
  return {
    birth_date: birthDate,
    gestation_days: gestationDays,
    gestation_weeks: gestationWeeks,
    measurement_method: measurementMethod,
    observation_date: observationDate,
    observation_value: observationValue,
    sex: parsedSex,
  };
};

// timeout wrapper for fetch call, so fetch times out and doesn't go on forever
const timeoutForFetch = async (milliseconds, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout exceeded'));
    }, milliseconds);
    promise.then(resolve, reject);
  });
};

//to make common errors pretty
const errorsObject = {
  401: "The server responded with 'Not authorised'. Please check your API key.",
  422: 'The server was unable to process the measurements. This is probably a bug in dotKid.',
  500: 'The server encountered a problem.',
  'Network request failed':
    'The request to the server failed. Please check your internet connection.',
  'Timeout exceeded': 'Request to the server timed out.',
};

// urls in use
const urlObjectSingle = {
  local: API_CALC_LOCAL_URL,
  lan: API_CALC_LAN_URL,
  real: API_CALC_REAL_URL,
};

const useApi = () => {
  const [key, setKey] = useState('');

  useFocusEffect(
    useCallback(() => {
      readItemFromStorage('api_key', setKey, '');
    }, []),
  );

  const getSingleCentileData = async (inputObject, measurementType, url) => {
    const singleMeasurementUrl = urlObjectSingle[url];
    const headersObject = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    };
    if (url === 'real') {
      headersObject['Primary-Subscription-Key'] = key;
    }
    const apiArgument = makeApiArgument(inputObject, measurementType);
    try {
      const serverResponse = await timeoutForFetch(
        6000,
        fetch(singleMeasurementUrl, {
          method: 'POST',
          headers: headersObject,
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
      const errorMessage =
        errorsObject[error.message] || `Error: ${error.message}`;
      throw new Error(errorMessage);
    }
  };

  const setApiKey = async (newKey, setModalVisible, clearKey = false) => {
    if (!clearKey) {
      try {
        const serverResponse = await timeoutForFetch(
          6000,
          fetch(API_CALC_REAL_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Primary-Subscription-Key': newKey,
            },
            body: JSON.stringify(referenceArgumentsSingleMeasurement),
            redirect: 'follow',
          }),
        );
        if (serverResponse.ok) {
          writeItemToStorage('api_key', setKey, newKey);
          Alert.alert(
            'API subscription key accepted',
            'The key has been saved to your phone. The RCPCH calculators are now visible in dotKid.',
            [
              {
                text: 'OK',
                onPress: () => setModalVisible(false),
              },
            ],
            {cancelable: false},
          );
        } else {
          throw new Error('The server rejected your key');
        }
      } catch (error) {
        Alert.alert(
          'Error:',
          `${error.message}`,
          [
            {
              text: 'OK',
              onPress: () => null,
            },
          ],
          {cancelable: false},
        );
      }
    } else {
      Alert.alert(
        'Are you sure you want to disable?',
        'This will erase your subscription key from your phone',
        [
          {
            text: 'OK',
            onPress: () => {
              writeItemToStorage('api_key', setKey, '');
              setModalVisible(false);
            },
          },
          {
            text: 'Cancel',
            onPress: () => null,
          },
        ],
        {cancelable: false},
      );
    }
  };

  return {getSingleCentileData, key, setApiKey};
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
