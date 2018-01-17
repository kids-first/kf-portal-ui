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
      return _.mapValues(loggedInUser, (val, key) => (key === 'roles' ? val && val[0] : val) || '');
    },
    handleSubmit: async (
      values,
      {
        props: { state: { loggedInUser }, effects: { setUser }, onFinish },
        setSubmitting,
        setErrors,
      }: any,
    ) => {
      updateProfile({
        user: { ..._.mapValues(values, (val, key) => val || null) },
      }).then(
        async profile => {
          await setUser(profile);
          onFinish();
        },
        errors => setSubmitting(false),
      );
    },
  }),
);

const ROLES = ['Patient', 'Parent', 'Clinician', 'Researcher'];
const EditProfileForm = ({ onFinish, errors, touched, handleSubmit, isSubmitting, values }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Bio: <Field type="bio" name="bio" />
      </label>
      {touched.bio && errors.bio && <div>{errors.bio}</div>}
      <br />
      <label>
        Roles:
        <Field component="select" name="roles">
          <option value="">Please select a role</option>
          {ROLES.map(role => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </Field>
      </label>
      {touched.roles && errors.roles && <div>{errors.roles}</div>}
      <br />
      <label>
        City: <Field type="city" name="city" />
      </label>
      {touched.city && errors.city && <div>{errors.city}</div>}
      <br />
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
      <button disabled={isSubmitting} onClick={onFinish}>
        Cancel
      </button>
    </form>
  );
};

export default enhance(EditProfileForm);
