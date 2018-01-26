import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withState, lifecycle, withPropsOnChange } from 'recompose';
import { injectState } from 'freactal';
import { withFormik } from 'formik';
import { mapValues, get } from 'lodash';

import { getProfile } from 'services/profiles';
import { logoutAll } from 'services/login';
import { deleteProfile } from 'services/profiles';
import EditableLabel from 'uikit/EditableLabel';
import { updateProfile } from 'services/profiles';
import { ROLES } from 'common/constants';
import LogoutButton from 'components/LogoutButton';

const uneditableFields = ['egoId', 'email', '_id'];
const requiredFields = ['lastName', 'firstName'];
const enhance = compose(
  withRouter,
  injectState,
  withState('isEditingAll', 'setEditingAll', false),
  withState('profile', 'setProfile', {}),
  lifecycle({
    async componentDidMount(): void {
      const { state: { loggedInUser }, match: { params: { egoId } }, setProfile } = this.props;
      loggedInUser && egoId === loggedInUser.egoId
        ? setProfile(loggedInUser)
        : setProfile(await getProfile({ egoId }));
    },
  }),
  withPropsOnChange(['profile'], ({ profile, state: { loggedInUser } }) => ({
    canEdit: loggedInUser && profile.egoId === loggedInUser.egoId,
  })),
  withPropsOnChange(
    ['match'],
    async ({ match: { params: { egoId } }, setProfile, state: { loggedInUser } }) => ({
      notUsed:
        loggedInUser && egoId === loggedInUser.egoId
          ? setProfile(loggedInUser)
          : setProfile(await getProfile({ egoId })),
    }),
  ),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ profile }) => {
      return mapValues(profile, (val, key) => (key === 'roles' ? val && val[0] : val) || '');
    },
    validate: (values, props) => {
      let errors = {};
      if (!values.roles) {
        errors.roles = 'Must select a role';
      } else if (!ROLES.includes(values.roles)) {
        errors.roles = 'Invalid role';
      }
      if (!values.firstName || values.firstName.length === 0) {
        errors.firstName = 'First name is required';
      }
      if (!values.lastName || values.lastName.length === 0) {
        errors.lastName = 'Last name is required';
      }
      return errors;
    },
    handleSubmit: async (
      values,
      {
        props: { state: { loggedInUser }, effects: { setUser }, onFinish, setEditingAll },
        setSubmitting,
        setErrors,
      }: any,
    ) => {
      const { email, ...rest } = values;
      updateProfile({
        user: { ...mapValues(rest, (val, key) => val || null) },
      }).then(
        async profile => {
          await setUser({ ...profile, email });
          setEditingAll(false);
          setSubmitting(false);
          onFinish();
        },
        errors => setSubmitting(false),
      );
    },
  }),
);

const UserProfile = ({
  state: { loggedInUser, percentageFilled },
  profile,
  match: { params: { egoId } },
  values,
  effects,
  isEditingAll,
  setEditingAll,
  handleReset,
  resetForm,
  handleSubmit,
  isSubmitting,
  handleChange,
  submitForm,
  errors,
  canEdit,
  history,
}) => {
  return (
    <div style={{ padding: '1em' }}>
      <h2>Kids First User Profile</h2>
      {Object.keys(profile || {}).length === 0 && (
        <div>No profile found matching egoId {egoId}</div>
      )}
      {canEdit && <span>Percent Filled: {percentageFilled}</span>}
      <form onSubmit={handleSubmit}>
        {Object.entries(values).map(([key, value]) => (
          <label key={key}>
            {(key || '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            {canEdit && (
              <EditableLabel
                required={requiredFields.includes(key)}
                name={key}
                value={value}
                onChange={handleChange}
                handleSave={value => {
                  submitForm();
                }}
                isEditing={isEditingAll}
                displayButtons={!isEditingAll}
                options={key === 'roles' ? ROLES : []}
                disabled={uneditableFields.includes(key)}
              />
            )}
            {!canEdit && <div>{value}</div>}
            {get(errors, key) && (
              <span>
                {get(errors, key)}
                <br />
              </span>
            )}
          </label>
        ))}
        {isEditingAll &&
          canEdit && (
            <span>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </span>
          )}
        {!isEditingAll && canEdit && <button onClick={() => setEditingAll(true)}>Edit all</button>}
      </form>
      {canEdit && (
        <div>
          <LogoutButton />
          <button
            onClick={async () => {
              await deleteProfile({ user: values });
              await logoutAll();
              await effects.setUser(null);
              await effects.setToken('');
              history.push('/');
            }}
          >
            DELETE ACCOUNT
          </button>
        </div>
      )}
    </div>
  );
};

export default enhance(UserProfile);
