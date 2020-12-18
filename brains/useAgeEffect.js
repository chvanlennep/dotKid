import {useLayoutEffect} from 'react';
import zeit from './zeit';

export default (dobObject, domObject, formikRef, setShowGestation) => {
  const dob = dobObject.value;
  const dom = domObject.value;
  useLayoutEffect(() => {
    let resetValues = true;
    if (formikRef.current) {
      if (formikRef.current.values !== formikRef.current.initialValues) {
        resetValues = false;
      }
    }
    if (dob) {
      const ageInDays = zeit(dob, 'days', dom);
      if (ageInDays >= 0 && ageInDays < 731) {
        setShowGestation(true);
      } else {
        setShowGestation(false);
      }
    } else if (resetValues || !dob) {
      setShowGestation(false);
    }
  }, [dob, dom, formikRef, setShowGestation]);
};
