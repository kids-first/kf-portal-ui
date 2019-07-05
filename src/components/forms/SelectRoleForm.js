import React from 'react';
import { withRouter } from 'react-router';
import { injectState } from 'freactal';
import { compose, withPropsOnChange } from 'recompose';
import { withFormik, Field } from 'formik';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import { ROLES } from 'common/constants';
import { updateProfile } from 'services/profiles';
import {
  trackUserInteraction,
  TRACKING_EVENTS,
  addStateInfo as updateTrackingDimension,
} from 'services/analyticsTracking';
import DeleteButton from 'components/loginButtons/DeleteButton';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { ButtonsDiv } from '../Join';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import CheckboxBubble from 'uikit/CheckboxBubble';
import { JoinH3 } from '../../uikit/Headings';
import { Paragraph } from '../../uikit/Core';

const SelectRoleForm = styled('form')`
  justify-content: space-around;
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
  text-align: left;
  color: ${({ theme }) => theme.greyScale0};
  font-size: 12px;
  justify-content: flex-start;
`;

const RoleLabel = styled(JoinH3)`
  display: block;
  text-transform: capitalize;
  border: none;
  line-height: 1.33;
  margin: 0;
`;

const Label = styled('label')`
  width: 215px;
  padding-right: 3px;
  text-decoration: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  line-height: 2;
  color: ${({ theme }) => theme.greyScale1};
`;

const CheckboxLabel = styled(`label`)`
  font-size: 14px;
  margin-left: 10px;
`;

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
          acceptedDatasetSubscriptionKfOptIn: false,
        },
      },
    }) => ({
      firstName: loggedInUser.firstName || '',
      lastName: loggedInUser.lastName || '',
      email: loggedInUser.email || '',
      roles: (loggedInUser.roles && loggedInUser.roles[0]) || '',
      acceptedKfOptIn: loggedInUser.acceptedKfOptIn || false,
      acceptedNihOptIn: loggedInUser.acceptedNihOptIn || false,
      acceptedDatasetSubscriptionKfOptIn: loggedInUser.acceptedDatasetSubscriptionKfOptIn || false,
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
      values,
      {
        props: {
          state: { loggedInUser },
          effects: { setUser },
          onFinish,
          api,
          location: { pathname },
        },
        setSubmitting,
      },
    ) => {
      const { email, ...rest } = loggedInUser;
      updateProfile(api)({
        user: {
          ...rest,
          firstName: values.firstName,
          lastName: values.lastName,
          roles: [values.roles],
          acceptedKfOptIn: !!values.acceptedKfOptIn,
          acceptedNihOptIn: !!values.acceptedNihOptIn,
          acceptedDatasetSubscriptionKfOptIn: !!values.acceptedDatasetSubscriptionKfOptIn,
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
          <Row mt={2}>
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
          <Row mt={2}>
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
          <Row mt={2}>
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
                  {icon({ width: '64px', fill: color, style: { padding: '8px' } })}
                  <div>
                    <RoleLabel>{displayName}</RoleLabel>
                    <Paragraph lineHeight="26px" fontSize="14px">
                      {description}
                    </Paragraph>
                  </div>
                </RoleBubble>
              ))}
            </Column>
            {touched.roles && errors.roles && <div>{errors.roles}</div>}
          </Row>
          <Row mt={2}>
            <Field
              type="checkbox"
              value={values.acceptedKfOptIn}
              checked={values.acceptedKfOptIn}
              id="acceptedKfOptIn"
              name="acceptedKfOptIn"
            />
            <CheckboxLabel htmlFor="acceptedKfOptIn">
              <Paragraph lineHeight="26px" fontSize="14px">
                <Trans>
                  I would like to receive the Kids First Data Resource Center quarterly newsletter
                  to get the latest DRC news including recent study updates, new investigators and
                  partners added to the effort.
                </Trans>
              </Paragraph>
            </CheckboxLabel>
          </Row>
          <Row mt={2} pb={2}>
            <Field
              type="checkbox"
              value={values.acceptedNihOptIn}
              checked={values.acceptedNihOptIn}
              id="acceptedNihOptIn"
              name="acceptedNihOptIn"
            />
            <CheckboxLabel htmlFor="acceptedNihOptIn">
              <Paragraph lineHeight="26px" fontSize="14px">
                <Trans>
                  I would like to receive updates from the NIH Kids First program including funding
                  updates and news about the program.
                </Trans>
              </Paragraph>
            </CheckboxLabel>
          </Row>
          <Row mt={2}>
            <Field
              type="checkbox"
              value={values.acceptedDatasetSubscriptionKfOptIn}
              checked={values.acceptedDatasetSubscriptionKfOptIn}
              id="acceptedDatasetSubscriptionKfOptIn"
              name="acceptedDatasetSubscriptionKfOptIn"
            />
            <CheckboxLabel htmlFor="acceptedDatasetSubscriptionKfOptIn">
              <Paragraph lineHeight="26px" fontSize="14px">
                <Trans>
                  The Gabriella Miller Kids First Data Resource Center is constantly improving the
                  availability and quality of new datasets added to the Data Resource Portal. Sign
                  up below to opt-in to receive updates and announcements when new datasets are
                  available in the Portal.
                </Trans>
              </Paragraph>
            </CheckboxLabel>
          </Row>
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
