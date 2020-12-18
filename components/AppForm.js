import React from 'react';
import {Formik} from 'formik';

function AppForm({
  initialValues,
  innerRef,
  onSubmit,
  validationSchema,
  children,
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      innerRef={innerRef}
      validationSchema={validationSchema}>
      {() => <>{children}</>}
    </Formik>
  );
}

export default AppForm;
