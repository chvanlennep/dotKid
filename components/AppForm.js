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
      validationSchema={validationSchema}
      innerRef={innerRef}>
      {() => <>{children}</>}
    </Formik>
  );
}

export default AppForm;
