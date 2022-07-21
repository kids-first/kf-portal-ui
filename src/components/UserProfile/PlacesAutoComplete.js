import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

import { googleMapsKey } from 'common/injectGlobals';
import useAsyncScriptLoaded from 'hooks/useAsyncScriptLoader';

const PlacesAutoComplete = ({ children, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useAsyncScriptLoaded(
    `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`,
    () => setIsLoaded(true),
  );

  if (!isLoaded) return null;

  return <PlacesAutocomplete {...props}>{children}</PlacesAutocomplete>;
};

export default PlacesAutoComplete;
