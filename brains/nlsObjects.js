import React, { useEffect, useRef, useState } from 'react';

// NOTE: an array with nested objects

const preResusChecklist = [
  { id: 'Resuscitaire on' },
  { id: 'Resuscitaire heater on' },
  { id: 'Oxygen / air on' },
  { id: 'PIP/PEEP correct for gestation' },
  { id: 'Suction working' },
  { id: 'Correct mask size' },
  { id: 'Appropriate Hat' },
  { id: 'Warm blankets' },
  { id: 'Plastic wrap (if appropriate)' },
  { id: 'O2 +/- ECG monitoring' },
  { id: 'ECG monitor' },
  { id: 'Stethoscope' },
  { id: 'Laryngoscope available' },
  { id: 'ET tube available' },
  { id: 'CO2 detector available' },
  { id: 'Resus drugs available' },
];

// NOTE: an array with nested objects
const resusRequired = [
  { id: 'Open airway' },
  { id: '5 inflation breaths' },
  { id: 'Check for chest movement' },
  { id: 'Consider O2 +/- ECG monitoring' },
  { id: 'Consider help' },
];

// NOTE: an object with nested arrays
const extraItems = {
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

const noChestRise = [
  { id: 'Check head position' },
  { id: 'Repeat inflation breaths' },
  { id: '2-person airway control' },
  { id: 'O2 +/- ECG monitoring' },
  { id: 'Look for a response' },
  { id: 'Consider help' },
  { id: 'Airway inspection' },
  { id: 'Suction under direct vision' },
  { id: 'Meconium aspirator?' },
  { id: 'Chest is now moving' },
];

const afterChestRise = [
  { id: 'Check chest moving if HR<60' },
  { id: '30s vent. breaths if HR <60' },
  { id: 'Chest comp. 3:1 if HR<60' },
  { id: 'Vent. breaths given' },
  { id: 'PEEP +/- O2 if breathing' },
  { id: 'Emergency vascular access' },
  { id: 'Resuscitation drugs if approp.' },
  { id: 'Patient intubated' },
  { id: 'ET tube removed' },
  { id: 'Colour change on CO2 detector' },
];

const makeFunctionButtonsObject = () => {
  const outputObject = extraItems;
  for (let i = 0; i < preResusChecklist.length; i++) {
    const newKey = preResusChecklist[i]['id'];
    outputObject[newKey] = [];
  }
  for (let i = 0; i < resusRequired.length; i++) {
    const newKey = resusRequired[i]['id'];
    outputObject[newKey] = [];
  }
  for (let i = 0; i < noChestRise.length; i++) {
    const newKey = noChestRise[i]['id'];
    outputObject[newKey] = [];
  }
  for (let i = 0; i < afterChestRise.length; i++) {
    const newKey = afterChestRise[i]['id'];
    outputObject[newKey] = [];
  }
  return outputObject;
};

const makeKeyExtractorArray = () => {
  const keyExtractorArray = [];

  const secondHeader = {
    id: 'Initial Assessment',
    type: 'modal',
  };

  const thirdHeader = {
    id: 'Resuscitation Required:',
    type: 'listHeader',
    downArrow: true,
    onDownPress: 1540,
    upArrow: true,
    onUpPress: 0,
  };

  const fourthHeader = {
    id: 'After Chest Rise',
    type: 'listHeader',
    upArrow: true,
    onUpPress: 1070,
  };

  for (let i = 1; i < preResusChecklist.length; i++) {
    const { id } = preResusChecklist[i];
    keyExtractorArray.push({ id, type: 'preResusChecklist' });
  }
  keyExtractorArray.push(secondHeader);
  keyExtractorArray.push(thirdHeader);
  for (let i = 0; i < resusRequired.length; i++) {
    const { id } = resusRequired[i];
    keyExtractorArray.push({ id, type: 'resusRequired' });
  }
  keyExtractorArray.push(fourthHeader);
  for (let i = 0; i < afterChestRise.length - 1; i++) {
    const { id } = afterChestRise[i];
    keyExtractorArray.push({ id, type: 'afterChestRise' });
  }

  return keyExtractorArray;
};

const makeNoChestRiseKeyExtractorArray = () => {
  const keyExtractorArray = [];
  for (let i = 1; i < noChestRise.length - 1; i++) {
    const { id } = noChestRise[i];
    keyExtractorArray.push({ id, type: 'noChestRise' });
  }
  return keyExtractorArray;
};

const flatListOneData = makeKeyExtractorArray();
const chestRiseFlatList = makeNoChestRiseKeyExtractorArray();
const functionButtons = makeFunctionButtonsObject();

export {
  afterChestRise,
  chestRiseFlatList,
  flatListOneData,
  functionButtons,
  noChestRise,
  preResusChecklist,
  resusRequired,
};
