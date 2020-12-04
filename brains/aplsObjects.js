// NOTE: an array with nested objects
const primaryButtons = [
  { id: 'Confirm Cardiac Arrest' },
  { id: 'Call For Help' },
  { id: 'Assign Team Roles' },
  { id: 'Initiate CPR 15:2' },
  { id: 'Bag-Mask Ventilation' },
  { id: 'Get Cardiac Arrest Trolley' },
  { id: 'Attach Defibrillator' },
  { id: 'Gain Vascular Access' },
  { id: 'Take Bloods & Blood Gas' },
];
// NOTE: an array with nested objects
const secondaryButtons = [
  { id: 'Hypoxia' },
  { id: 'Hypovolaemia' },
  { id: 'Hypothermia' },
  { id: 'Hyper/Hypokalaemia' },
  { id: 'Tension Pneumothorax' },
  { id: 'Cardiac Tamponade' },
  { id: 'Toxins' },
  { id: 'Thrombosis' },
];
// NOTE: an array with nested objects
const tertiaryButtons = [
  { id: 'Automatic Compression Device' },
  { id: 'Blood Transfusion Started' },
  { id: 'Calcium Given' },
  { id: 'Insulin-Dextrose Given' },
  { id: 'IV Magnesium Given' },
  { id: 'Salbutamol IV Given' },
  { id: 'Patient Intubated' },
  { id: 'Repeat Blood Gas' },
  { id: 'Repeat Bloods' },
  { id: 'Sodium Bicarbonate Given' },
  { id: 'Tension Decompressed' },
  { id: 'Thrombolysis Given' },
  { id: 'Tranexamic Acid Given' },
];
// NOTE: an object with nested arrays
const extraItems = {
  'Start Time': [],
  Asystole: [],
  'Ventricular Fibrillation': [],
  'Pulseless VT': [],
  PEA: [],
  'Shock Delivered': [],
  'Adrenaline Administered': [],
  'Rhythm Analysed': [],
  ROSC: [],
  RIP: [],
};

const makeFunctionButtonsObject = () => {
  const outputObject = extraItems;
  for (let i = 0; i < primaryButtons.length; i++) {
    const newKey = primaryButtons[i]['id'];
    outputObject[newKey] = [];
  }
  for (let i = 0; i < secondaryButtons.length; i++) {
    const newKey = secondaryButtons[i]['id'];
    outputObject[newKey] = [];
  }
  for (let i = 0; i < tertiaryButtons.length; i++) {
    const newKey = tertiaryButtons[i]['id'];
    outputObject[newKey] = [];
  }
  return outputObject;
};

const makeKeyExtractorArray = () => {
  const keyExtractorArray = [];
  const secondHeader = {
    id: 'Exclude Hs & Ts:',
    downArrow: true,
    onDownPress: 1210,
    type: 'listHeader',
    upArrow: true,
    onUpPress: 0,
  };
  const thirdHeader = {
    id: 'Further Drugs & Procedures:',
    type: 'listHeader',
    upArrow: true,
    onUpPress: 600,
  };
  for (let i = 1; i < primaryButtons.length; i++) {
    const { id } = primaryButtons[i];
    keyExtractorArray.push({ id, type: 'primaryButton' });
  }
  keyExtractorArray.push(secondHeader);
  for (let i = 0; i < secondaryButtons.length; i++) {
    const { id } = secondaryButtons[i];
    keyExtractorArray.push({ id, type: 'secondaryButton' });
  }
  keyExtractorArray.push(thirdHeader);
  for (let i = 0; i < tertiaryButtons.length - 1; i++) {
    const { id } = tertiaryButtons[i];
    keyExtractorArray.push({ id, type: 'tertiaryButton' });
  }
  return keyExtractorArray;
};

const flatListData = makeKeyExtractorArray();
const functionButtons = makeFunctionButtonsObject();

export {
  flatListData,
  primaryButtons,
  secondaryButtons,
  tertiaryButtons,
  functionButtons,
};
