import React, { Fragment } from 'react';

import { injectState } from 'freactal';
import { compose, withState } from 'recompose';
import { withFormik, Field } from 'formik';
import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import SearchIcon from 'react-icons/lib/fa/search';

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
import Gravatar from 'uikit/Gravatar';
import ExternalLink from 'uikit/ExternalLink';
import { ModalFooter } from '../Modal/index.js';
import { withApi } from 'services/api';
import { Box } from 'uikit/Core';
import { WhiteButton } from 'uikit/Button.js';
import { FilterInput } from 'uikit/Input.js';
import { FieldInput } from './components';

import { select, hollowSelect } from './forms.module.css';
import { flexColumn, flexRow } from '../../theme/tempTheme.module.css';

const labelStyle = `
  font-size: 14px;
  letter-spacing: 0.2px;
  text-align: left;
  font-weight: 700;
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

const SearchLocationIcon = styled(SearchIcon)`
  position: absolute;
  top: 8px;
  left: 8px;
`;

const LocationFieldInput = styled(FilterInput)`
  width: 90%;
  padding-left: 34px;
`;

const AutoCompleteContainer = styled(Column)`
  position: absolute;
  top: 100%;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.greyScale4};
  width: 100%;
`;

const AutoCompleteItem = styled(Row)`
  background-color: ${({ isSelected, theme }) => (isSelected ? theme.greyScale4 : theme.white)};
  padding: 10px;
`;

const ContentRow = styled(Row)`
  margin-bottom: 20px;
  z-index: 1;
  position: relative;
  min-height: 0;
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
    return <PlacesAutocomplete {...this.props}>{this.props.children}</PlacesAutocomplete>;
  }
}

export default compose(
  withApi,
  withTheme,
  injectState,
  withState('location', 'setLocation', ({ state: { loggedInUser } }) => {
    const places = [
      loggedInUser.addressLine1 || '',
      loggedInUser.city || '',
      loggedInUser.state || '',
      loggedInUser.country || '',
    ];
    return places.filter(place => place.length).join(', ');
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
      <ContentRow>
        <div
          css={`
            padding-right: 30px;
            border-right: 1px solid #cacbcf;
          `}
        >
          <Column>
            <Gravatar
              email={values.email || ''}
              size={143}
              css={`
                align-self: center;
                border-radius: 50%;
                padding: 5px;
                background-color: #fff;
                border: 1px solid #cacbcf;
                margin-bottom: 5px;
              `}
            />
            <WhiteButton mt="4px" w="170px">
              <ExternalLink href="https://en.gravatar.com/site/login">change gravatar</ExternalLink>
            </WhiteButton>
          </Column>
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
              ${flexRow};
              justify-content: space-between;
            `}
          >
            <FormItem>
              <StyledLabel>Title:</StyledLabel>
              <Field component="select" name="title" className={select}>
                <option value="" selected disabled hidden>
                  -- select an option --
                </option>
                <option value="">N/A</option>
                <option value="mr">Mr.</option>
                <option value="ms">Ms.</option>
                <option value="mrs">Mrs.</option>
                <option value="dr">Dr.</option>
              </Field>
            </FormItem>
            <div
              css={`
                ${flexRow} align-self: flex-end;
              `}
            >
              <div
                className={`${flexColumn} ${css`
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
                      size: '45px',
                      style: {
                        margin: '5px 5px 5px 5px',
                      },
                      fill: color,
                    }),
                  }),
                  {},
                ),
                values.roles,
              )}
              <div
                className={`${flexColumn} ${css`
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
                  `} ${hollowSelect}`}
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
            <FieldInput width="90%" name="firstName" value={values.firstName} />
            {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
          </FormItem>
          <FormItem>
            <StyledLabel>Last Name:</StyledLabel>
            <FieldInput width="90%" name="lastName" value={values.lastName} />
            {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
          </FormItem>
          {values.roles === 'research' && (
            <FormItem>
              <StyledLabel>Title/Role:</StyledLabel>
              <FieldInput
                width="90%"
                name="jobTitle"
                placeholder="Job Title/Role"
                value={values.jobTitle}
              />
            </FormItem>
          )}
          {['research', 'community'].includes(values.roles) && (
            <FormItem>
              {values.roles === 'research' && <StyledLabel>Institution:</StyledLabel>}
              {values.roles === 'community' && <StyledLabel>Institution/Organization:</StyledLabel>}
              <FieldInput width="90%" name="institution" value={values.institution} />
            </FormItem>
          )}
          <FormItem>
            <StyledLabel>Suborganization/Department:</StyledLabel>
            <FieldInput width="90%" name="department" value={values.department} />
          </FormItem>
          <FormItem>
            <StyledLabel>Institutional Email Address</StyledLabel>
            <FieldInput width="90%" name="institutionalEmail" value={values.institutionalEmail} />
          </FormItem>
          <FormItem>
            <StyledLabel>Phone:</StyledLabel>
            <FieldInput
              width="90%"
              name="phone"
              placeholder="e.g. +1-555-555-5555"
              value={values.phone}
            />
          </FormItem>
          <FormItem>
            <StyledLabel>ERA Commons ID:</StyledLabel>
            <FieldInput
              width="90%"
              name="eraCommonsID"
              placeholder=""
              value={values.eraCommonsID}
            />
          </FormItem>
          <FormItem>
            <StyledLabel>Search Location:</StyledLabel>
            <WrappedPlacesAutocomplete
              value={location}
              onChange={setLocation}
              onSelect={(address, placeID) => {
                setLocation(address);
                geocodeByPlaceId(placeID)
                  .then(results => {
                    const defaultObject = { long_name: '' };
                    const country = (
                      results[0].address_components.find(c => c.types.includes('country')) ||
                      defaultObject
                    ).long_name;
                    const administrative_area_level_1 = (
                      results[0].address_components.find(c =>
                        c.types.includes('administrative_area_level_1'),
                      ) || defaultObject
                    ).long_name;
                    const locality = (
                      results[0].address_components.find(c => c.types.includes('locality')) ||
                      defaultObject
                    ).long_name;
                    const streetNumber = (
                      results[0].address_components.find(c => c.types.includes('street_number')) ||
                      defaultObject
                    ).long_name;
                    const route = (
                      results[0].address_components.find(c => c.types.includes('route')) ||
                      defaultObject
                    ).long_name;
                    const zip = (
                      results[0].address_components.find(
                        c => c.types.includes('zip') || c.types.includes('postal_code'),
                      ) || defaultObject
                    ).long_name;
                    setFieldValue('addressLine1', `${streetNumber} ${route}`);
                    setFieldValue('country', country);
                    setFieldValue('state', administrative_area_level_1);
                    setFieldValue('city', locality);
                    setFieldValue('zip', zip);
                  })
                  .catch(error => console.error(error));
              }}
            >
              {({ getInputProps, getSuggestionItemProps, suggestions, loading, ...rest }) => (
                <Box position="relative">
                  <SearchLocationIcon fill="#a9adc0" />
                  <LocationFieldInput
                    LeftIcon={null}
                    name="searchLocation"
                    placeholder="e.g 3401 Civic Center Blvd."
                    {...getInputProps()}
                  />
                  {!!suggestions.length && (
                    <AutoCompleteContainer>
                      {suggestions.map(suggestion => (
                        <AutoCompleteItem
                          isSelected={suggestion.description === location}
                          {...getSuggestionItemProps(suggestion)}
                        >
                          {suggestion.description}
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteContainer>
                  )}
                </Box>
              )}
            </WrappedPlacesAutocomplete>
          </FormItem>
          <AddressBox>
            <AddressRow>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 1:</StyledLabel>
                <FieldInput name="addressLine1" value={values.addressLine1} />
              </div>
              <div
                css={`
                  width: 48%;
                `}
              >
                <StyledLabel>Address Line 2:</StyledLabel>
                <FieldInput name="addressLine2" value={values.addressLine2} />
              </div>
            </AddressRow>
            <AddressRow>
              <div>
                <StyledLabel>City</StyledLabel>
                <FieldInput width="90$" name="city" value={values.city} />
              </div>
              <div>
                <StyledLabel>State/Province:</StyledLabel>
                <FieldInput width="90%" name="state" value={values.state} />
              </div>
              <div>
                <StyledLabel>Zip/Postal Code:</StyledLabel>
                <FieldInput width="90%" name="zip" value={values.zip} />
              </div>
            </AddressRow>
            <AddressRow>
              <div
                css={`
                  width: 100%;
                `}
              >
                <StyledLabel>Country:</StyledLabel>
                <FieldInput name="country" value={values.country} />
              </div>
            </AddressRow>
          </AddressBox>
        </form>
      </ContentRow>
      <ModalFooter {...{ unsetModal, handleSubmit }} />
    </Fragment>
  ),
);
