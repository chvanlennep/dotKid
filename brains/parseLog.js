import zeit from "./zeit";

// functionButtons is object from the resus page logic
export default (functionButtons, type = "APLS") => {
  const objectAsArray = [];
  for (const [key, value] of Object.entries(functionButtons)) {
    if (Array.isArray(value) && value.length > 0) {
      let newKey = key;
      if (
        key === "Hypoxia" ||
        key === "Hypovolaemia" ||
        key === "Hypothermia" ||
        key === "Hyper/Hypokalaemia" ||
        key === "Tension Pneumothorax" ||
        key === "Cardiac Tamponade" ||
        key === "Toxins" ||
        key === "Thrombosis"
      ) {
        newKey = `${key} Considered`;
      }
      for (let i = 0; i < value.length; i++) {
        objectAsArray.push([value[i], newKey]);
      }
    }
  }
  objectAsArray.sort((a, b) => {
    if (a[0].getTime() === b[0].getTime()) {
      return 0;
    } else {
      return a[0].getTime() - b[0].getTime() < 0 ? -1 : 1;
    }
  });
  const formatTime = (time) => {
    let hours = "" + time.getHours();
    let minutes = "" + time.getMinutes();
    let seconds = "" + time.getSeconds();
    const milliseconds = time.getMilliseconds();
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;
    if (seconds.length < 2) seconds = "0" + seconds;
    return `${hours}:${minutes}:${seconds}`; //removed .${milliseconds}
  };
  const formatDate = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = "" + date.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  };
  if (objectAsArray[0] === undefined) return "No entries found in log";
  let outputString = `Log of ${type} encounter on ${formatDate(
    objectAsArray[0][0]
  )}:\n\n${formatTime(objectAsArray[0][0])}: Resuscitation Encounter Started`;
  for (let i = 1; i < objectAsArray.length; i++) {
    const newLine = `\n${formatTime(objectAsArray[i][0])}: ${
      objectAsArray[i][1]
    }`;
    outputString += newLine;
  } //need to get rid of milliseconds output from total elapsed time of resuscitation
  if (functionButtons.RIP.length === 1 || functionButtons.ROSC.length === 1) {
    outputString += `\nTotal elapsed time of resuscitation encounter: ${zeit(
      objectAsArray[0][0],
      "string",
      objectAsArray[objectAsArray.length - 1][0],
      true,
      0,
      true
    )}`;
    return outputString;
  } else {
    outputString += `\nResuscitation is ongoing`;
    return outputString;
  }
};
