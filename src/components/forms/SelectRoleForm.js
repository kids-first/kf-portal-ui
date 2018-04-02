import React from 'react';
import { injectState } from 'freactal';
import { compose, withPropsOnChange } from 'recompose';
import { withFormik, Field } from 'formik';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';

import { ROLES } from 'common/constants';
import { updateProfile } from 'services/profiles';
import { ButtonsDiv } from '../Join';
import DeleteButton from 'components/loginButtons/DeleteButton';

const StyledLabel = styled('label')`
  width: 215px;
  padding-right: 3px;
  text-decoration: none;
  border: none;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 600;
  line-height: 2;
  color: ${props => props.theme.greyScale1};
`;

export const enhance = compose(
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

export const SelectRoleForm = ({
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
  nextStep,
  nextDisabled,
  prevDisabled,
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
          <StyledLabel>My first name is:</StyledLabel>
          <div className={theme.column}>
            <Field
              css={`
                ${theme.input};
                width: 374px;
              `}
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
          <StyledLabel>My last name is:</StyledLabel>
          <div className={theme.column}>
            <Field
              css={`
                ${theme.input};
                width: 374px;
              `}
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
          <StyledLabel>My email address is:</StyledLabel>
          <div className={theme.column}>
            <Field
              css={`
                ${theme.input};
                width: 374px;
              `}
              type="email"
              name="email"
              value={values.email}
              placeholder="Email"
              disabled="true"
            />
          </div>
        </div>

        <div className={theme.row}>
          <StyledLabel>Best describes my needs:</StyledLabel>
          <div className={theme.column}>
            {ROLES.map(({ type, description, displayName, icon, color }) => (
              <div
                key={type}
                className={css`
                  ${theme.row} border-radius: 10px;
                  background-color: ${values.roles === type ? '#e5f7fd' : '#fff'};
                  border: solid 1px ${values.roles === type ? theme.active : theme.greyScale4};
                  width: 560px;
                  padding: 5px;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 10px;
                  ${theme.normalText};
                `}
                onClick={() => setFieldValue('roles', type)}
              >
                <Field
                  type="radio"
                  value={type}
                  checked={values.roles.toLowerCase() === type}
                  name="roles"
                />
                {icon({ width: '64px', fill: color, style: { padding: '8px' } })}
                <div>
                  <label
                    className={css`
                      color: ${theme.secondary};
                      font-weight: 600;
                      display: block;
                      text-transform: capitalize;
                      border: none;
                      font-family: Montserrat;
                      font-size: 15px;
                      line-height: 1.33;
                    `}
                  >
                    {displayName}
                  </label>
                  {description}
                </div>
              </div>
            ))}
          </div>
          {touched.roles && errors.roles && <div>{errors.roles}</div>}
        </div>
      </form>

      <ButtonsDiv>
        <DeleteButton className={theme.wizardButton} disabled={prevDisabled}>
          <LeftIcon />
          Back
        </DeleteButton>
        <div className={theme.row}>
          <DeleteButton
            css={`
              ${theme.wizardButton} font-weight: 300;
            `}
          >
            Cancel
          </DeleteButton>
          <button
            className={theme.actionButton}
            onClick={() => {
              submitForm();
              nextStep();
            }}
            disabled={nextDisabled}
          >
            Next
            <RightIcon />
          </button>
        </div>
      </ButtonsDiv>
    </div>
  );
};

export default enhance(SelectRoleForm);
