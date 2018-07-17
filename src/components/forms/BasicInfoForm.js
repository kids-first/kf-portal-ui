import React, { Fragment } from 'react';

import { injectState } from 'freactal';
import { compose, withState } from 'recompose';
import { withFormik, Field } from 'formik';
import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import scriptjs from 'scriptjs';

import styled, { css } from 'react-emotion';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { ROLES } from 'common/constants';
import { googleMapsKey } from 'common/injectGlobals';
import { updateProfile } from 'services/profiles';
import {
  TRACKING_EVENTS,
  trackUserInteraction,
  addStateInfo as updateTrackingInfo,
} from 'services/analyticsTracking';
import Gravtar from 'uikit/Gravatar';
import ExternalLink from 'uikit/ExternalLink';
import { ModalFooter } from '../Modal/index.js';
import { withApi } from 'services/api';
import { Box } from 'uikit/Core';

const labelStyle = `
  font-size: 14px;
  letter-spacing: 0.2px;
  text-align: left;
  font-weight: 900;
`;

const StyledLabel = styled('label')`
  ${labelStyle};
  color: ${({ theme }) => theme.greyScale1};
`;

const AddressBox = styled(Box)`
  background: ${({ theme }) => theme.tertiaryBackground};
  padding: 20px;
  margin: 10px 0 10px 0;
  border-left: 4px solid ${({ theme }) => theme.primary};
`;

const AddressRow = styled(Row)`
  justify-content: space-between;
`;

const FormItem = styled(Column)`
  padding: 5px 0 5px;
`;

class WrappedPlacesAutocomplete extends React.Component {
  //https://github.com/kenny-hibino/react-places-autocomplete/pull/107
  state = {
    loaded: false,
  };

  componentDidMount() {
    scriptjs(
      `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`,
      () => {
        this.setState({
          loaded: true,
        });
      },
    );
  }

  render() {
    if (!this.state.loaded) return null;
    return <PlacesAutocomplete {...this.props} />;
  }
}

export default compose(
  withApi,
  withTheme,
  injectState,
  withState('location', 'setLocation', ({ state: { loggedInUser } }) => {
    const places = [
      loggedInUser.addressLine1,
      loggedInUser.city,
      loggedInUser.state,
      loggedInUser.country,
    ];
    return places.filter(Boolean).join(', ');
  }),
  withFormik({
    mapPropsToValues: ({
      state: { loggedInUser = { firstName: '', lastName: '', email: '', roles: [] } },
    }) => ({
      ...Object.entries(loggedInUser).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value ? value : '',
        }),
        {},
      ),
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
        props: {
          state: { loggedInUser },
          effects: { setUser, setModal, unsetModal },
          api,
          ...restProps
        },
        setSubmitting,
        setErrors,
      }: any,
    ) => {
      if (window.location.pathname.includes('/user') && values.roles !== loggedInUser.roles[0]) {
        trackUserInteraction({
          category: TRACKING_EVENTS.categories.user.profile,
          action: TRACKING_EVENTS.actions.userRoleSelected + ' to',
          label: values.roles,
        });
        updateTrackingInfo({ userRoles: [values.roles] });
      }
      const { email, ...rest } = loggedInUser;
      updateProfile(api)({
        user: {
          ...rest,
          ...values,
          roles: [values.roles],
        },
      }).then(
        async profile => {
          await setUser({ ...profile, email, api });
          unsetModal();
        },
        errors => setSubmitting(false),
      );
    },
  }),
)(
  ({
    theme,
    touched,
    errors,
    values,
    setFieldValue,
    handleSubmit,
    handleChange,
    state: { loggedInUser },
    effects: { setModal, unsetModal },
    location,
    setLocation,
  }) => (
    <Fragment>
      <div
        css={`
          ${theme.row};
          margin-bottom: 20px;
          z-index: 1;
          position: relative;
        `}
      >
        <div
          css={`
            padding-right: 30px;
            border-right: 1px solid #cacbcf;
          `}
        >
          <Gravtar
            email={values.email || ''}
            size={143}
            css={`
              border-radius: 50%;
              padding: 5px;
              background-color: #fff;
              border: 1px solid #cacbcf;
              margin-bottom: 5px;
            `}
          />
          <ExternalLink href="https://en.gravatar.com/site/login" css={theme.hollowButton}>
            change gravatar
          </ExternalLink>
        </div>
        <form
          onSubmit={handleSubmit}
          css={`
            padding-left: 30px;
            padding-right: 30px;
            width: 100%;
            overflow-y: scroll;
          `}
        >
          <div
            css={`
              ${theme.row};
              justify-content: space-between;
            `}
          >
            <FormItem>
              <StyledLabel>Title:</StyledLabel>
              <Field component="select" name="title" css={theme.select}>
                <option value="" selected disabled hidden>
                  -- select an option --
                </option>
                <option value="mr">Mr.</option>
                <option value="ms">Ms.</option>
                <option value="mrs">Mrs.</option>
                <option value="dr">Dr.</option>
              </Field>
            </FormItem>
            <div
              css={`
                ${theme.row} align-self: flex-end;
              `}
            >
              <div
                className={`${theme.column} ${css`
                  justify-content: center;
                `}`}
              >
                <StyledLabel>Profile Type: </StyledLabel>
              </div>
              {get(
                ROLES.reduce(
                  (acc, { type, icon, color }) => ({
                    ...acc,
                    [type]: icon({
                      height: '45px',
                      className: css`
                        margin: 5px 5px 5px 5px;
                      `,
                      fill: color,
                    }),
                  }),
                  {},
                ),
                values.roles,
              )}
              <div
                className={`${theme.column} ${css`
                  justify-content: center;
                `}`}
              >
                <Field
                  component="select"
                  name="roles"
                  defaultValue={values.roles}
                  className={`${css`
                    ${labelStyle};
                    color: ${theme.secondary};
                  `} ${theme.hollowSelect}`}
                >
                  {ROLES.map(({ type, displayName }) => (
                    <option value={type} key={type}>
                      {displayName}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </div>
          <FormItem>
            <StyledLabel>First Name:</StyledLabel>
            <Field
              css={`
                ${theme.input};
                width: 90%;
              `}
              name="firstName"
              placeholder="First Name"
              value={values.firstName}
            />
            {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
          </FormItem>
          <FormItem>
            <StyledLabel>Last Name:</StyledLabel>
            <Field
              css={`
                ${theme.input};
                width: 90%;
              `}
              name="lastName"
              placeholder="Last Name"
              value={values.lastName}
            />
            {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
          </FormItem>
          {values.roles === 'research' && (
            <FormItem>
              <StyledLabel>Title/Role:</StyledLabel>
              <Field
                css={`
                  ${theme.input};
                  width: 90%;
                `}
                name="jobTitle"
                placeholder="Job Title/Role"
                value={values.jobTitle}
              />
            </FormItem>
          )}
          {['research', 'community'].includes(values.roles) && (
            <FormItem>
              {values.roles === 'research' && <StyledLabel>Institution:</StyledLabel>}
              {values.roles === 'community' && <StyledLabel>Organization:</StyledLabel>}
              <Field
                css={`
                  ${theme.input};
                  width: 90%;
                `}
                name="institution"
                placeholder={values.roles === 'research' ? 'Institution' : 'Organization'}
                value={values.institution}
              />
            </FormItem>
          )}
          <FormItem>
            <StyledLabel>Suborganization/Department:</StyledLabel>
            <Field
              css={`
                ${theme.input};
                width: 90%;
              `}
              name="department"
              value={values.department}
            />
          </FormItem>
          <FormItem>
            <StyledLabel>Institutional Email Address</StyledLabel>
            <Field
              css={`
                ${theme.input};
                width: 90%;
              `}
              name="institutionalEmail"
              value={values.institutionalEmail}
            />
          </FormItem>
          <FormItem>
            <StyledLabel>Phone:</StyledLabel>
            <Field
              css={`
                ${theme.input};
                width: 90%;
              `}
              name="phone"
              placeholder="e.g. +1-555-5555"
              value={values.phone}
            />
          </FormItem>
          <FormItem>
            <StyledLabel>ERA Commons ID:</StyledLabel>
            <Field
              css={`
                ${theme.input};
                width: 90%;
              `}
              name="eraCommonsID"
              placeholder=""
              value={values.eraCommonsID}
            />
          </FormItem>
          <FormItem>
            <StyledLabel>Search Location:</StyledLabel>
            <WrappedPlacesAutocomplete
              inputProps={{
                value: location,
                onChange: setLocation,
              }}
              classNames={{
                input: css`
                  ${theme.input};
                  width: 90%;
                `,
                autocompleteContainer: css`
                  position: absolute;
                  top: 100%;
                  backgroundcolor: white;
                  border: 1px solid ${theme.greyScale4};
                  width: 100%;
                `,
              }}
              onSelect={(address, placeID) => {
                setLocation(address);
                geocodeByPlaceId(placeID)
                  .then(results => {
                    const country = results[0].address_components.find(c =>
                      c.types.includes('country'),
                    ).long_name;
                    const administrative_area_level_1 = results[0].address_components.find(c =>
                      c.types.includes('administrative_area_level_1'),
                    ).long_name;
                    const locality = results[0].address_components.find(c =>
                      c.types.includes('locality'),
                    ).long_name;
                    const streetNumber = results[0].address_components.find(c =>
                      c.types.includes('street_number'),
                    ).long_name;
                    const route = results[0].address_components.find(c => c.types.includes('route'))
                      .long_name;
                    const zip = results[0].address_components.find(
                      c => c.types.includes('zip') || c.types.includes('postal_code'),
                    ).long_name;
                    setFieldValue('addressLine1', `${streetNumber} ${route}`);
                    setFieldValue('country', country);
                    setFieldValue('state', administrative_area_level_1);
                    setFieldValue('city', locality);
                    setFieldValue('zip', zip);
                  })
                  .catch(error => console.error(error));
              }}
            />
          </FormItem>
          <AddressBox>
            <AddressRow>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 1:</StyledLabel>
                <Field
                  css={`
                    ${theme.input};
                  `}
                  name="addressLine1"
                  value={values.addressLine1}
                />
              </div>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 2:</StyledLabel>
                <Field
                  css={`
                    ${theme.input};
                  `}
                  name="addressLine2"
                  value={values.addressLine2}
                />
              </div>
            </AddressRow>
            <AddressRow>
              <div>
                <StyledLabel>City</StyledLabel>
                <Field
                  css={`
                    ${theme.input};
                    width: 90%;
                  `}
                  name="city"
                  value={values.city}
                />
              </div>
              <div>
                <StyledLabel>State/Province:</StyledLabel>
                <Field
                  css={`
                    ${theme.input};
                    width: 90%;
                  `}
                  name="city"
                  value={values.state}
                />
              </div>
              <div>
                <StyledLabel>Zip/Postal Code:</StyledLabel>
                <Field
                  css={`
                    ${theme.input};
                    width: 90%;
                  `}
                  name="zip"
                  value={values.zip}
                />
              </div>
            </AddressRow>
            <AddressRow>
              <div
                css={`
                  width: 100%;
                `}
              >
                <StyledLabel>Country:</StyledLabel>
                <Field
                  css={`
                    ${theme.input};
                  `}
                  name="zip"
                  value={values.country}
                />
              </div>
            </AddressRow>
          </AddressBox>
        </form>
      </div>
      <ModalFooter {...{ unsetModal, handleSubmit }} />
    </Fragment>
  ),
);
