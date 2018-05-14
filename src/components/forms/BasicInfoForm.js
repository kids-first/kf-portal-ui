import React from 'react';

import { injectState } from 'freactal';
import { compose, withState } from 'recompose';
import { withFormik, Field } from 'formik';
import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import scriptjs from 'scriptjs';

import styled, { css } from 'react-emotion';

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

const StyledLabel = styled('label')`
  font-family: Montserrat;
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.2px;
  text-align: left;
  color: #343434;
  font-weight: 900;
  border-bottom: none;
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
    const places = [loggedInUser.city, loggedInUser.state, loggedInUser.country];
    return places.filter(Boolean).join(', ');
  }),
  withFormik({
    mapPropsToValues: ({
      state: { loggedInUser = { firstName: '', lastName: '', email: '', roles: [] } },
    }) => ({
      title: loggedInUser.title || '',
      firstName: loggedInUser.firstName || '',
      lastName: loggedInUser.lastName || '',
      email: loggedInUser.email || '',
      jobTitle: loggedInUser.jobTitle || '',
      institution: loggedInUser.institution || '',
      roles: (loggedInUser.roles && loggedInUser.roles[0]) || '',
      city: loggedInUser.city || '',
      country: loggedInUser.country || '',
      state: loggedInUser.state || '',
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
          action: TRACKING_EVENTS.actions.userRoleSelected+' to',
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
    <div>
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
            ${theme.column} justify-content: space-around;
            padding-left: 30px;
            width: 100%;
          `}
        >
          <div
            css={`
              ${theme.row} align-self: flex-end;
            `}
          >
            <StyledLabel>Role</StyledLabel>
            {get(
              ROLES.reduce(
                (acc, { type, icon, color }) => ({
                  ...acc,
                  [type]: icon({
                    height: '18px',
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
            <Field
              component="select"
              name="roles"
              defaultValue={values.roles}
              css={theme.hollowSelect}
            >
              {ROLES.map(({ type, displayName }) => (
                <option value={type} key={type}>
                  {displayName}
                </option>
              ))}
            </Field>
          </div>
          <div css={theme.column}>
            <StyledLabel>Title :</StyledLabel>
            <Field component="select" name="title" css={theme.select}>
              <option value="" selected disabled hidden>
                -- select an option --
              </option>
              <option value="mr">Mr.</option>
              <option value="ms">Ms.</option>
              <option value="mrs">Mrs.</option>
              <option value="dr">Dr.</option>
            </Field>
          </div>
          <div css={theme.column}>
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
          </div>
          <div css={theme.column}>
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
          </div>
          {values.roles === 'research' && [
            <div css={theme.column} key="jobTitle">
              <StyledLabel>Job Title/Role:</StyledLabel>
              <Field
                css={`
                  ${theme.input};
                  width: 90%;
                `}
                name="jobTitle"
                placeholder="Job Title/Role"
                value={values.jobTitle}
              />
            </div>,
            <div css={theme.column} key="institution">
              <StyledLabel>Institution:</StyledLabel>
              <Field
                css={`
                  ${theme.input};
                  width: 90%;
                `}
                name="institution"
                placeholder="Institution"
                value={values.institution}
              />
            </div>,
          ]}
          <div>
            <StyledLabel>Location:</StyledLabel>
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
                    setFieldValue('country', country);
                    setFieldValue('state', administrative_area_level_1);
                    setFieldValue('city', locality);
                  })
                  .catch(error => console.error(error));
              }}
            />
          </div>
        </form>
      </div>
      <ModalFooter {...{ unsetModal, handleSubmit }} />
    </div>
  ),
);
