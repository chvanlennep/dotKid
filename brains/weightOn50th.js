import {
  computeChildMeasurementForGraph,
  generateLMSChild,
} from './newCalculateCentile';

export default (ageObject, sex) => {
  const lmsObject = generateLMSChild('weight', sex, ageObject);
  const output = computeChildMeasurementForGraph(0, lmsObject);
  return output;
};
