import React from 'react';
import { withRouter } from 'react-router';
import { injectState } from 'freactal';
import { compose, withPropsOnChange } from 'recompose';
import { withFormik, Field } from 'formik';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
// import { Trans } from 'react-i18next'; // TODO: issue #321

import { ROLES } from 'common/constants';
import { updateProfile } from 'services/profiles';
import {
  trackUserInteraction,
  TRACKING_EVENTS,
  addStateInfo as updateTrackingDimension,
} from 'services/analyticsTracking';
import { ButtonsDiv } from '../Join';
import DeleteButton from 'components/loginButtons/DeleteButton';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import CheckboxBubble from 'uikit/CheckboxBubble';
import { P, SmallText } from 'uikit/Typography';

const SelectRoleForm = styled('form')`
  justify-content: space-around;
  overflow-y: scroll;
`;

const FieldInput = styled(Field)`
  ${({ theme }) => theme.input};
  width: 374px;
`;

const RoleBubble = styled(CheckboxBubble)`
  width: 560px;
  padding: 5px;
  margin-top: 10px;
  line-height: 1.67;
  letter-spacing: 0.2px;
  ${({ theme }) => theme.text.left};
`;

const RoleDescription = ({ children }) => (
  <P my="0" p="0" color="greyScale0">
    <SmallText>{children}</SmallText>
  </P>
);

const RoleLabel = styled('label')`
  ${({ theme }) => theme.paragraph};
  font-weight: 600;
  display: block;
  ${({ theme }) => theme.text.capitalize};
  line-height: 1.33;

  color: ${({ theme }) => theme.colors.secondary};
`;

const Label = styled('label')`
  width: 215px;
  padding-right: 3px;
  font-weight: 600;
  line-height: 2;
  ${({ theme }) => theme.paragraph};
`;

// TODO: issue #321
// const CheckboxLabel = styled(`label`)`
//   font-size: 14px;
//   margin-left: 10px;
// `;

export const enhance = compose(
  withTheme,
  injectState,
  withRouter,
  withFormik({
    mapPropsToValues: ({
      state: {
        loggedInUser = {
          firstName: '',
          lastName: '',
          email: '',
          roles: [],
          acceptedKfOptIn: false,
          acceptedNihOptIn: false,
        },
      },
    }) => ({
      firstName: loggedInUser.firstName || '',
      lastName: loggedInUser.lastName || '',
      email: loggedInUser.email || '',
      roles: (loggedInUser.roles && loggedInUser.roles[0]) || '',
      acceptedKfOptIn: loggedInUser.acceptedKfOptIn || false,
      acceptedNihOptIn: loggedInUser.acceptedNihOptIn || false,
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
        props: {
          state: { loggedInUser },
          effects: { setUser },
          onFinish,
          api,
          location: { pathname },
          ...restProps
        },
        setSubmitting,
        setErrors,
      }: any,
    ) => {
      const { email, ...rest } = loggedInUser;
      updateProfile(api)({
        user: {
          ...rest,
          firstName: values.firstName,
          lastName: values.lastName,
          roles: [values.roles],
          // acceptedKfOptIn: !!values.acceptedKfOptIn, // TODO: Issue #321
          // acceptedNihOptIn: !!values.acceptedNihOptIn,
        },
      }).then(
        async profile => {
          await setUser({ ...profile, email, api });

          if (pathname === '/join') {
            updateTrackingDimension({ userRoles: profile.roles });
          }
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

export default enhance(
  ({
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
      <Column>
        <SelectRoleForm onSubmit={handleSubmit}>
          <Row>
            <Label>My first name is:</Label>
            <Column>
              <FieldInput
                name="firstName"
                placeholder="First Name"
                value={values.firstName}
                onBlur={submitForm}
              />
              {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
            </Column>
          </Row>
          <Row buffer>
            <Label>My last name is:</Label>
            <Column>
              <FieldInput
                name="lastName"
                placeholder="Last Name"
                value={values.lastName}
                onBlur={submitForm}
              />
              {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
            </Column>
          </Row>
          <Row buffer>
            <Label>My email address is:</Label>
            <Column>
              <FieldInput
                type="email"
                name="email"
                value={values.email}
                placeholder="Email"
                disabled="true"
              />
            </Column>
          </Row>
          <Row buffer>
            <Label>Best describes my needs:</Label>
            <Column>
              {ROLES.map(({ type, description, displayName, icon, color }) => (
                <RoleBubble
                  key={type}
                  active={values.roles === type}
                  onClick={() => {
                    setFieldValue('roles', type);
                    if (window.location.pathname === '/join') {
                      trackUserInteraction({
                        category: TRACKING_EVENTS.categories.join,
                        action: TRACKING_EVENTS.actions.userRoleSelected,
                        label: type,
                      });
                    }
                  }}
                >
                  <Field
                    type="radio"
                    value={type}
                    checked={values.roles.toLowerCase() === type}
                    name="roles"
                  />
                  {icon({
                    width: '64px',
                    fill: color,
                    style: { padding: '8px' },
                  })}
                  <div>
                    <RoleLabel>{displayName}</RoleLabel>
                    <RoleDescription>{description}</RoleDescription>
                  </div>
                </RoleBubble>
              ))}
            </Column>
            {touched.roles && errors.roles && <div>{errors.roles}</div>}
          </Row>
          {/* TODO: Issue #321 */}
          {/* <Row buffer>
            <Field
              type="checkbox"
              value={values.acceptedKfOptIn}
              checked={values.acceptedKfOptIn}
              id="acceptedKfOptIn"
              name="acceptedKfOptIn"
            />
            <CheckboxLabel htmlFor="acceptedKfOptIn">
              <Trans>
                I would like to receive the Kids First Data Resource Center quarterly newsletter to
                get the latest DRC news including recent study updates, new investigators and
                partners added to the effort.
              </Trans>
            </CheckboxLabel>
          </Row>
          <Row buffer>
            <Field
              type="checkbox"
              value={values.acceptedNihOptIn}
              checked={values.acceptedNihOptIn}
              id="acceptedNihOptIn"
              name="acceptedNihOptIn"
            />
            <CheckboxLabel htmlFor="acceptedNihOptIn">
              <Trans>
                I would like to receive updates from the NIH Kids First program including funding
                updates and news about the program.
              </Trans>
            </CheckboxLabel>
          </Row> */}
        </SelectRoleForm>

        <ButtonsDiv>
          <DeleteButton className={theme.wizardButton} disabled={prevDisabled}>
            <LeftIcon />
            Back
          </DeleteButton>
          <Row>
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
          </Row>
        </ButtonsDiv>
      </Column>
    );
  },
);
