import React from 'react';
import { provideLoggedInUser } from 'stateProviders';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withFormik, Field } from 'formik';
import { updateProfile } from 'services/profiles';
import _ from 'lodash';

const enhance = compose(
  injectState,
  withFormik({
    mapPropsToValues: ({ state: { loggedInUser } }) => {
      return { roles: (loggedInUser.roles && loggedInUser.roles[0]) || '' };
    },
    validate: (values, props) => {
      let errors = {} as any;
      if (!values.roles) {
        errors.roles = 'Must select a role';
      } else if (!ROLES.includes(values.roles)) {
        errors.roles = 'Invalid role';
      }
      return errors;
    },
    handleSubmit: async (
      values: any,
      {
        props: { state: { loggedInUser }, effects: { setUser }, onFinish },
        setSubmitting,
        setErrors,
      }: any,
    ) => {
      updateProfile({
        user: { ...loggedInUser, roles: [values.roles] },
      }).then(
        async profile => {
          await setUser(profile);
          if (onFinish) {
            onFinish();
          }
        },
        errors => setSubmitting(false),
      );
    },
  }),
);

const ROLES = ['Patient', 'Parent', 'Clinician', 'Researcher'];
const EditUserForm = ({ onFinish, errors, touched, handleSubmit, isSubmitting, values }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Roles:
        <Field component="select" name="roles">
          <option value="" disabled={true}>
            Please select a role
          </option>
          {ROLES.map(role => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </Field>
      </label>
      {touched.roles && errors.roles && <div>{errors.roles}</div>}

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default enhance(EditUserForm);
