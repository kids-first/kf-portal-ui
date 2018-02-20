import React from 'react';
import { injectState } from 'freactal';
import { compose, withPropsOnChange } from 'recompose';
import { withFormik, Field } from 'formik';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';

import { ROLES } from 'common/constants';
import { updateProfile } from 'services/profiles';

import researcherIconPath from 'theme/images/icon-researcher.svg';
import patientIconPath from 'theme/images/icon-patient.svg';
import clinicianIconPath from 'theme/images/icon-clinician.svg';

const iconPaths = {
  researcher: researcherIconPath,
  patient: patientIconPath,
  clinician: clinicianIconPath,
};

const StyledLabel = styled('label')`
  font-weight: 900;
  width: 140px;
`;

const enhance = compose(
  withTheme,
  injectState,
  withFormik({
    mapPropsToValues: ({
      state: { loggedInUser = { firstName: '', lastName: '', email: '', roles: [] } },
    }) => ({
      firstName: loggedInUser.firstName || '',
      lastName: loggedInUser.lastName || '',
      email: loggedInUser.email || '',
      roles: (loggedInUser.roles && loggedInUser.roles[0]) || '',
    }),
    isInitialValid: ({
      state: { loggedInUser = { firstName: '', lastName: '', email: '', roles: [] } },
    }) =>
      loggedInUser.firstName &&
      loggedInUser.lastName &&
      loggedInUser.email &&
      loggedInUser.roles.length,
    validate: (values, props) => {
      let errors = {};
      if (!values.roles) {
        errors.roles = 'Must select a role';
      } else if (!ROLES.map(r => r.type).includes(values.roles.toLowerCase())) {
        errors.roles = 'Invalid role';
      }
      if (!values.firstName || values.firstName.length === 0) {
        errors.firstName = 'First name is required';
      }
      if (!values.lastName || values.lastName.length === 0) {
        errors.lastName = 'Last name is required';
      }
      const { onValidateFinish } = props;
      onValidateFinish && onValidateFinish(errors);
      return errors;
    },
    handleSubmit: async (
      values: any,
      {
        props: { state: { loggedInUser }, effects: { setUser }, onFinish, ...restProps },
        setSubmitting,
        setErrors,
      }: any,
    ) => {
      const { email, ...rest } = loggedInUser;
      updateProfile({
        user: {
          ...rest,
          firstName: values.firstName,
          lastName: values.lastName,
          roles: [values.roles],
        },
      }).then(
        async profile => {
          await setUser({ ...profile, email });
          if (onFinish) {
            onFinish();
          }
        },
        errors => setSubmitting(false),
      );
    },
  }),
  withPropsOnChange(['isValid'], ({ isValid, onValidChange }) => onValidChange(isValid)),
);

const SelectRoleForm = ({
  theme,
  onFinish,
  errors,
  touched,
  handleSubmit,
  setFieldValue,
  submitForm,
  validate,
  isSubmitting,
  values,
  state: { percentageFilled },
}) => {
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={css`
          ${theme.column} justify-content: space-around;
        `}
      >
        <div className={theme.row}>
          <StyledLabel>First name:</StyledLabel>
          <div className={theme.column}>
            <Field
              className={theme.input}
              name="firstName"
              placeholder="First Name"
              value={values.firstName}
              onBlur={submitForm}
            />
            {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
          </div>
        </div>
        <div
          className={css`
            ${theme.row} margin-top: 10px;
          `}
        >
          <StyledLabel>Last name:</StyledLabel>
          <div className={theme.column}>
            <Field
              className={theme.input}
              name="lastName"
              placeholder="Last Name"
              value={values.lastName}
              onBlur={submitForm}
            />
            {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
          </div>
        </div>

        <div
          className={css`
            ${theme.row} margin-top: 10px;
          `}
        >
          <StyledLabel>Email:</StyledLabel>
          <div className={theme.column}>
            <Field
              className={theme.input}
              type="email"
              name="email"
              value={values.email}
              placeholder="Email"
              disabled="true"
            />
          </div>
        </div>

        <div className={theme.row}>
          <StyledLabel>Roles:</StyledLabel>
          <div className={theme.column}>
            {ROLES.map(({ type, description }) => (
              <div
                key={type}
                className={css`
                  ${theme.row} border-radius: 10px;
                  background-color: #e5f7fd;
                  border: solid 1px ${theme.active};
                  width: 525px;
                  padding: 10px;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 10px;
                `}
              >
                <Field
                  type="radio"
                  value={type}
                  checked={values.roles.toLowerCase() === type}
                  name="roles"
                  onBlur={submitForm}
                />
                <img src={iconPaths[type]} alt={type} style={{ width: '60px' }} />
                <div
                  className={css`
                    padding-left: 10px;
                  `}
                >
                  <label
                    className={css`
                      color: ${theme.secondary};
                      font-weight: bold;
                      font-family: 'Open Sans';
                      display: block;
                      text-transform: capitalize;
                    `}
                  >
                    {type}
                  </label>
                  {description}
                </div>
              </div>
            ))}
          </div>
          {touched.roles && errors.roles && <div>{errors.roles}</div>}
        </div>
      </form>
    </div>
  );
};

export default enhance(SelectRoleForm);
