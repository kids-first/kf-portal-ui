import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutoComplete from 'components/UserProfile/PlacesAutoComplete';
import { Input } from 'antd';
import { geocodeByPlaceId } from 'react-places-autocomplete';


class ContactEditablePlacesAutoComplete extends Component {
  static propTypes = {
    setAddressCb: PropTypes.func.isRequired,
  };

  state = {
    address: '',
    errorFetchingPlaces: null,
  };

  handleAddressChange = address => {
    this.setState({ address });
  };

  handleAddressSelect = async (address, placeId) => {
    const { setAddressCb } = this.props;
    this.setState({ address });
    const defaultObject = { long_name: '' };
    try {
      const response = await geocodeByPlaceId(placeId);
      const data = response[0];

      const addressComponent = data.address_components;
      const findAddressField = field =>
        addressComponent.find(c => c.types.includes(field)) || defaultObject;

      return setAddressCb({
        country: findAddressField('country').long_name,
        state: findAddressField('administrative_area_level_1').long_name,
        city: findAddressField('locality').long_name,
        addressLine1: `${findAddressField('streetNumber').long_name} ${
          findAddressField('route').long_name
        }`,
        zip: findAddressField('zip').long_name,
      });
    } catch (e) {
      this.setState({ errorFetchingPlaces: e });
    }
  };

  render() {
    const { address } = this.state;

    return (
      <PlacesAutoComplete
        onChange={this.handleAddressChange}
        onSelect={this.handleAddressSelect}
        value={address}
      >
        {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
          <React.Fragment>
            <Input
              {...getInputProps({
                id: 'address-input',
              })}
              placeholder={'e.g 3401 Civic Center Blvd.'}
            />

            <div>
              {loading ? <div>Loading...</div> : null}
              {suggestions.map(suggestion => {
                const spread = {
                  ...getSuggestionItemProps(suggestion),
                };

                return (
                  <div {...spread} key={suggestion.id}>
                    <div>{suggestion.description}</div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </PlacesAutoComplete>
    );
  }
}

export default ContactEditablePlacesAutoComplete;
