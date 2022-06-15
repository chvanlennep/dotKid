import React from 'react';
import {Formik} from 'formik';
import {FormProvider, useForm} from 'react-hook-form';

function AppForm({
  initialValues,
  innerRef,
  onSubmit,
  validationSchema,
  children,
}) {
  const formMethods = useForm();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      innerRef={innerRef}
      validationSchema={validationSchema}>
      {() => <>{children}</>}
    </Formik>

    // <FormProvider
    //   {...formMethods}
    //   defaultValues={initialValues}
    //   onSubmit={onSubmit}
    //   innerRef={innerRef}
    //   validationSchema={validationSchema}>
    //   {() => <>{children}</>}
    // </FormProvider>
  );
}

export default AppForm;
