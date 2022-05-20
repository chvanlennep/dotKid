import deepCopy from './deepCopy';
import {headerType} from './aplsObjects';
import {ButtonRecord} from './aplsObjects';
import {FunctionButtonsType} from './aplsObjects';

// NOTE: an array with nested objects

const preResusChecklist: ButtonRecord = [
  {id: 'Resuscitaire on'},
  {id: 'Resuscitaire heater on'},
  {id: 'Oxygen / air on'},
  {id: 'PIP/PEEP correct for gestation'},
  {id: 'Suction working'},
  {id: 'Correct mask size'},
  {id: 'Appropriate Hat'},
  {id: 'Warm blankets'},
  {id: 'Plastic wrap (if appropriate)'},
  {id: 'O2 +/- ECG monitoring'},
  {id: 'Stethoscope'},
  {id: 'Laryngoscope available'},
  {id: 'ET tube available'},
  {id: 'CO2 detector available'},
  {id: 'Resus drugs available'},
];

// NOTE: an array with nested objects
const resusRequired: ButtonRecord = [
  {id: 'Open airway'},
  {id: '5 inflation breaths'},
  {id: 'Check for chest movement'},
  {id: 'Consider O2 +/- ECG monitoring'},
  {id: 'Consider help'},
];

// NOTE: an object with nested arrays
const extraItems: FunctionButtonsType = {
  'Start Time': [],
  RIP: [],
  '<60': [],
  '60-100': [],
  '>100': [],
  Apnoeic: [],
  'Inadequate Breathing': [],
  'Adequate Breathing': [],
  Floppy: [],
  'Good Tone': [],
  'Poor Tone': [],
  'Chest Moving': [],
  'Chest Not Moving': [],
  'Low For Age': [],
  'Adequate For Age': [],
  'Inadequate For Age': [],
  FiO2: [],
  'Dry and Wrap Baby': [],
  'Hat On': [],
  'Resuscitation complete': [],
  'Transferred to NICU': [],
  Pale: [],
  Blue: [],
  'Blue extremities': [],
  Pink: [],
};

const noChestRise: ButtonRecord = [
  {id: 'Check head position'},
  {id: 'Repeat inflation breaths'},
  {id: '2-person airway control'},
  {id: 'O2 +/- ECG monitoring'},
  {id: 'Look for a response'},
  {id: 'Consider help'},
  {id: 'Airway inspection'},
  {id: 'Suction under direct vision'},
  {id: 'Meconium aspirator?'},
  {id: 'Chest is now moving'},
];

const afterChestRise: ButtonRecord = [
  {id: 'Check chest moving if HR<60'},
  {id: '30s vent. breaths if HR <60'},
  {id: 'Chest comp. 3:1 if HR<60'},
  {id: 'Vent. breaths given'},
  {id: 'PEEP +/- O2 if breathing'},
  {id: 'Emergency vascular access'},
  {id: 'Resuscitation drugs if approp.'},
  {id: 'Patient intubated'},
  {id: 'ET tube removed'},
  {id: 'Colour change on CO2 detector'},
];

export const makeNlsFunctionButtonsObject = (): FunctionButtonsType => {
  const outputObject = deepCopy(extraItems);
  const allItems = [
    ...preResusChecklist,
    ...resusRequired,
    ...noChestRise,
    ...afterChestRise,
  ];

  allItems.forEach(({id}) => {
    outputObject[id] = [];
  });

  return outputObject;
};

export const initialAssessmentDetails = [
  {
    name: 'Dry and Wrap Baby',
    iconName: 'tumble-dryer',
    pickerContent: [{value: 'Done'}, {value: 'Not Done'}],
  },
  {
    name: 'Hat On',
    iconName: 'hat-fedora',
    pickerContent: [{value: 'Done'}, {value: 'Not Done'}],
  },
  {
    name: 'Heart Rate',
    iconName: 'heart-pulse',
    pickerContent: [{value: '<60'}, {value: '60-100'}, {value: '>100'}],
  },
  {
    name: 'Breathing',
    iconName: 'weather-windy',
    pickerContent: [
      {value: 'Apnoeic'},
      {value: 'Inadequate Breathing'},
      {value: 'Adequate Breathing'},
    ],
  },
  {
    name: 'Colour',
    iconName: 'percent',
    pickerContent: [
      {value: 'Pale'},
      {value: 'Blue'},
      {value: 'Blue extremities'},
      {value: 'Pink'},
    ],
  },
  {
    name: 'Tone',
    iconName: 'human-handsdown',
    pickerContent: [
      {value: 'Floppy'},
      {value: 'Poor Tone'},
      {value: 'Good Tone'},
    ],
  },
];

export const assessBabyPickerDetails = [
  {
    name: 'Chest Movement',
    iconName: 'circle-expand',
    pickerContent: [{value: 'Chest Not Moving'}, {value: 'Chest Moving'}],
  },
  {
    name: 'Breathing',
    iconName: 'weather-windy',
    pickerContent: [
      {value: 'Apnoeic'},
      {value: 'Inadequate Breathing'},
      {value: 'Adequate Breathing'},
    ],
  },
  {
    name: 'Heart Rate',
    iconName: 'heart-pulse',
    pickerContent: [{value: '<60'}, {value: '60-100'}, {value: '>100'}],
  },
  {
    name: 'Saturations',
    iconName: 'percent',
  },
  {
    name: 'Inhaled O2',
    iconName: 'gas-cylinder',
  },
  {
    name: 'Tone',
    iconName: 'human-handsdown',
    pickerContent: [
      {value: 'Floppy'},
      {value: 'Poor Tone'},
      {value: 'Good Tone'},
    ],
  },
];

export const makeChestRiseButtons = () => {
  const chestRiseOutput: Record<string, boolean> = {};
  noChestRise.forEach(({id}) => {
    chestRiseOutput[id] = false;
  });
  return chestRiseOutput;
};

const makeKeyExtractorArray = () => {
  const keyExtractorArray = [];

  const secondHeader: headerType = {
    id: 'Initial Assessment',
    type: 'modal',
  };

  const thirdHeader: headerType = {
    id: 'Resuscitation Required:',
    downArrow: true,
    downPressLocation: 1470,
    type: 'listHeader',
    upArrow: true,
    upPressLocation: 0,
  };

  const fourthHeader: headerType = {
    id: 'After Chest Rise',
    type: 'listHeader',
    upArrow: true,
    upPressLocation: 1070,
  };

  for (let i = 1; i < preResusChecklist.length; i++) {
    const {id} = preResusChecklist[i];
    keyExtractorArray.push({id, type: 'preResusChecklist'});
  }
  keyExtractorArray.push(secondHeader);
  keyExtractorArray.push(thirdHeader);
  for (let i = 0; i < resusRequired.length; i++) {
    const {id} = resusRequired[i];
    keyExtractorArray.push({id, type: 'resusRequired'});
  }
  keyExtractorArray.push(fourthHeader);
  for (let i = 0; i < afterChestRise.length - 1; i++) {
    const {id} = afterChestRise[i];
    keyExtractorArray.push({id, type: 'afterChestRise'});
  }

  return keyExtractorArray;
};

const makeNoChestRiseKeyExtractorArray = () => {
  const keyExtractorArray = [];
  for (let i = 1; i < noChestRise.length - 1; i++) {
    const {id} = noChestRise[i];
    keyExtractorArray.push({id, type: 'noChestRise'});
  }
  return keyExtractorArray;
};

const flatListOneData = makeKeyExtractorArray();
const chestRiseFlatList = makeNoChestRiseKeyExtractorArray();
const functionButtons = makeNlsFunctionButtonsObject();

export {
  afterChestRise,
  chestRiseFlatList,
  flatListOneData,
  functionButtons,
  noChestRise,
  preResusChecklist,
  resusRequired,
};
