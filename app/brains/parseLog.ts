import zeit from './zeit';

// functionButtons is object from the resus page logic
export default (functionButtons, type) => {
  const objectAsArray = [];
  for (const [key, value] of Object.entries(functionButtons)) {
    if (Array.isArray(value) && value.length > 0) {
      let newKey = key;
      if (
        key === 'Hypoxia' ||
        key === 'Hypovolaemia' ||
        key === 'Hypothermia' ||
        key === 'Hyper/Hypokalaemia' ||
        key === 'Tension Pneumothorax' ||
        key === 'Cardiac Tamponade' ||
        key === 'Toxins' ||
        key === 'Thrombosis'
      ) {
        newKey = `${key} Considered`;
      }
      if (key === '<60' || key === '60-100' || key === '>100') {
        newKey = `Heart Rate: ${key}bpm`;
      }
      for (let i = 0; i < value.length; i++) {
        objectAsArray.push([value[i], newKey]);
      }
    }
  }
  objectAsArray.sort((a, b) => {
    if (a[0].date.getTime() === b[0].date.getTime()) {
      return 0;
    } else {
      return a[0].date.getTime() - b[0].date.getTime() < 0 ? -1 : 1;
    }
  });
  const formatTime = time => {
    let hours = '' + time.date.getHours();
    let minutes = '' + time.date.getMinutes();
    let seconds = '' + time.date.getSeconds();
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    return `${hours}:${minutes}:${seconds}`; //removed .${milliseconds}
  };

  const formatDate = obj => {
    let dateEntry = obj.date;
    let month = '' + (dateEntry.getMonth() + 1);
    let day = '' + dateEntry.getDate();
    const year = '' + dateEntry.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  };
  if (objectAsArray[0] === undefined) {
    return null;
  }
  let startingItem = '';
  if (objectAsArray[0][1] !== 'Start Time') {
    startingItem = ` with '${objectAsArray[0][1]}'`;
  }
  console.log(objectAsArray[0][1]);
  let outputString = `Log of ${type} encounter on ${formatDate(
    objectAsArray[0][0],
  )}:\n\n${formatTime(
    objectAsArray[0][0],
  )}: Resuscitation Encounter started${startingItem}`;
  for (let i = 1; i < objectAsArray.length; i++) {
    let additionalComment = objectAsArray[i][0].comment
      ? `\nAdditional note: ${objectAsArray[i][0].comment}`
      : '';

    let newLine = `\n${formatTime(objectAsArray[i][0])}: ${
      objectAsArray[i][1]
    }${additionalComment}`;
    if (objectAsArray[i][1] === 'Start Time') {
      newLine = `\n${formatTime(objectAsArray[i][0])}: Timer Started`;
    }
    outputString += newLine;
  }

  if (
    functionButtons.ROSC &&
    (functionButtons.RIP.length === 1 || functionButtons.ROSC.length === 1)
  ) {
    outputString += `\nTotal elapsed time of resuscitation encounter: ${zeit(
      objectAsArray[0][0].date,
      'string',
      objectAsArray[objectAsArray.length - 1][0].date,
      true,
      0,
      true,
    )}`;
    return outputString;
  } else if (
    functionButtons['Resuscitation complete'] &&
    (functionButtons.RIP.length === 1 ||
      functionButtons['Resuscitation complete'].length === 1 ||
      functionButtons['Transferred to NICU'].length === 1)
  ) {
    outputString += `\nTotal elapsed time of resuscitation encounter: ${zeit(
      objectAsArray[0][0].date,
      'string',
      objectAsArray[objectAsArray.length - 1][0].date,
      true,
      0,
      true,
    )}`;
    return outputString;
  } else {
    outputString += `\nResuscitation is ongoing`;
    return outputString;
  }
};
