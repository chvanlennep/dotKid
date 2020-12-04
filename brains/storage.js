import AsyncStorage from '@react-native-async-storage/async-storage';

// Note: setValues parameter is a useState function initialised in the functional component

const readItemFromStorage = async (storageKey, setValues, valueIfNull) => {
  let values;
  try {
    values = await AsyncStorage.getItem(storageKey);
  } catch (error) {
    console.log(`Error reading item: ${error.message}`);
  }
  if (values === null || values === undefined) {
    setValues(valueIfNull);
  } else {
    const parsedValues = JSON.parse(values);
    setValues(parsedValues);
  }
};

const writeItemToStorage = async (storageKey, setValues, newValues) => {
  const serialisedValues = JSON.stringify(newValues);
  try {
    await AsyncStorage.setItem(storageKey, serialisedValues);
  } catch (error) {
    console.log(`Error writing item: ${error.message}`);
  }
  setValues(newValues);
};

export {readItemFromStorage, writeItemToStorage};
