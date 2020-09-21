export default {
  functions: {},
  states: {
    dob: {
      label: "Date of Birth",
      value: null,
    },
    sex: {
      label: "Sex",
      showInput: false,
      showCancel: false,
      value: null,
    },

    gestation: {
      label: "Gestation at Birth",
      value: { gestationWeeks: null, gestationDays: null },
    },
    height: {
      label: "Height",
      value: null,
    },
    weight: {
      label: "Weight",
      value: null,
    },
    hc: {
      label: "Head Circumference",
      value: null,
    },
    dom: {
      label: "Measurement Date",
      value: new Date(),
    },
    sbp: {
      label: "Systolic Blood Pressure",
      value: null,
    },
    dbp: {
      label: "Diastolic Blood Pressure",
      value: null,
    },
    qt: {
      label: "QT interval",
      value: null,
    },
    rr: {
      label: "RR interval",
      value: null,
    },
    cf: {
      label: "Correction Factor",
      value: null,
    },
  },
};
