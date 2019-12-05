import React from 'react';
import scriptjs from 'scriptjs';
import PlacesAutocomplete from 'react-places-autocomplete';
import { googleMapsKey } from 'common/injectGlobals';

export default class PlacesAutoComplete extends React.Component {
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
