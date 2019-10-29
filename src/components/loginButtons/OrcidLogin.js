import React from 'react';
import queryString from 'query-string';
import urlJoin from 'url-join';

import {
  orcidAuthAppId,
  orcidAuthApiBaseUri,
  orcidAuthScope,
  orcidAuthRedirectUri,
} from 'common/injectGlobals';

export default class OrcidButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
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
    return (
      <div className="login-button orcid-login-button">
        <button onClick={this.openORCID}>
          <img
            src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
            width="24"
            height="24"
            alt="ORCID iD icon"
          />
          <span>
            Log in with ORCID
          </span>
        </button>
      </div>
    );
  }
}
