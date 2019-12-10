import React from 'react';
import { withRouter } from 'react-router';
import { injectState } from 'freactal';
import { compose, withPropsOnChange } from 'recompose';
import { withFormik, Field } from 'formik';

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
import { ButtonsDiv } from './components';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import CheckboxBubble from 'uikit/CheckboxBubble';
import { H3 } from 'uikit/Headings';
import { Paragraph } from 'uikit/Core';
import { ActionButton } from 'uikit/Button';
import { FieldInput } from './components';

import { wizardButton } from './forms.module.css';
import './SelectRoleForm.css';

export const enhance = compose(
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
      <Column className="selectRoleForm-container">
        <form onSubmit={handleSubmit}>
          <Row>
            <label className="field-label">My first name is:</label>
            <Column>
              <FieldInput
                name="firstName"
                placeholder="First Name"
                value={values.firstName}
                onBlur={submitForm}
                style={{ width: '374px' }}
              />
              {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
            </Column>
          </Row>
          <Row mt={2}>
            <label className="field-label">My last name is:</label>
            <Column>
              <FieldInput
                name="lastName"
                placeholder="Last Name"
                value={values.lastName}
                onBlur={submitForm}
                style={{ width: '374px' }}
              />
              {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
            </Column>
          </Row>
          <Row mt={2}>
            <label className="field-label">My email address is:</label>
            <Column>
              <FieldInput
                type="email"
                name="email"
                value={values.email}
                placeholder="Email"
                disabled="true"
                style={{ width: '374px' }}
              />
            </Column>
          </Row>
          <Row mt={2}>
            <label className="field-label">Best describes my needs:</label>
            <Column>
              {ROLES.map(({ type, description, displayName, icon, color }) => (
                <CheckboxBubble
                  className="roleBubble"
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
                  {icon({ size: '64px', fill: color, style: { padding: '8px' } })}
                  <div>
                    <H3>{displayName}</H3>
                    <Paragraph lineHeight="26px" fontSize="14px">
                      {description}
                    </Paragraph>
                  </div>
                </CheckboxBubble>
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
            <label className="checkbox-label" htmlFor="acceptedKfOptIn">
              <Paragraph lineHeight="26px" fontSize="14px">
                I would like to receive the Kids First Data Resource Center quarterly newsletter to
                get the latest DRC news including recent study updates, new investigators and
                partners added to the effort.
              </Paragraph>
            </label>
          </Row>
          <Row mt={2} pb={2}>
            <Field
              type="checkbox"
              value={values.acceptedNihOptIn}
              checked={values.acceptedNihOptIn}
              id="acceptedNihOptIn"
              name="acceptedNihOptIn"
            />
            <label className="checkbox-label" htmlFor="acceptedNihOptIn">
              <Paragraph lineHeight="26px" fontSize="14px">
                I would like to receive updates from the NIH Kids First program including funding
                updates and news about the program.
              </Paragraph>
            </label>
          </Row>
          <Row mt={2}>
            <Field
              type="checkbox"
              value={values.acceptedDatasetSubscriptionKfOptIn}
              checked={values.acceptedDatasetSubscriptionKfOptIn}
              id="acceptedDatasetSubscriptionKfOptIn"
              name="acceptedDatasetSubscriptionKfOptIn"
            />
            <label className="checkbox-label" htmlFor="acceptedDatasetSubscriptionKfOptIn">
              <Paragraph lineHeight="26px" fontSize="14px">
                The Gabriella Miller Kids First Data Resource Center is constantly improving the
                availability and quality of new datasets added to the Data Resource Portal. Sign up
                below to opt-in to receive updates and announcements when new datasets are available
                in the Portal.
              </Paragraph>
            </label>
          </Row>
        </form>
        <ButtonsDiv>
          <DeleteButton className={wizardButton} disabled={prevDisabled}>
            <LeftIcon />
            Back
          </DeleteButton>
          <Row>
            <DeleteButton
              className={wizardButton}
              style={{
                fontWeight: 300,
              }}
            >
              Cancel
            </DeleteButton>
            <ActionButton
              onClick={() => {
                submitForm();
                nextStep();
              }}
              disabled={nextDisabled}
            >
              Next
              <RightIcon />
            </ActionButton>
          </Row>
        </ButtonsDiv>
      </Column>
    );
  },
);
