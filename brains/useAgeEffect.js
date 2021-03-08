import {useLayoutEffect} from 'react';
import Zeit from './Zeit';

export default (dobObject, domObject, formikRef, setShowGestation) => {
  const dob = dobObject?.hasOwnProperty('value') ? dobObject.value : dobObject;
  const dom = domObject?.hasOwnProperty('value') ? domObject.value : domObject;
  useLayoutEffect(() => {
    let resetValues = true;
    if (formikRef.current) {
      if (formikRef.current.values !== formikRef.current.initialValues) {
        resetValues = false;
      }
    }
    if (dob) {
      const dateObject = new Zeit(dob, dom);
      const ageInDays = dateObject.calculate('days');
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
