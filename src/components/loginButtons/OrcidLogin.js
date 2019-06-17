import React from 'react';
import queryString from 'query-string';
import urlJoin from 'url-join';

import {
  orcidAuthAppId,
  orcidAuthApiBaseUri,
  orcidAuthScope,
  orcidAuthRedirectUri,
} from 'common/injectGlobals';

import DisabledOrcidLogin from './DisabledOrcidLogin';

import './OrcidLogin.css';

export default class OrcidButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  componentDidMount() {
    // TODO validate configs here, disable the button if one is missing
  }

  openORCID() {
    // redirect to Orcid OAuth flow
    const search = queryString.stringify({
      client_id: orcidAuthAppId,
      response_type: 'code',
      scope: orcidAuthScope,
      redirect_uri: urlJoin(window.location.origin, orcidAuthRedirectUri),
    });
    const url = urlJoin(orcidAuthApiBaseUri, `/oauth/authorize?${search}`);
    window.location = url;
  }

  render() {
    return this.state.disabled ? (
      <DisabledOrcidLogin />
    ) : (
      <button id="connect-orcid-button" onClick={this.openORCID}>
        <img
          id="orcid-id-icon"
          src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
          width="24"
          height="24"
          alt="ORCID iD icon"
        />
        Register or Connect your ORCID iD
      </button>
    );
  }
}
