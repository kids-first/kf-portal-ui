import * as React from 'react';
import Component from 'react-component-component';
import { withApi } from 'services/api';
import { compose } from 'recompose';
import { EGO_JWT_KEY } from 'common/constants';
import { fenceTokensUri } from 'common/injectGlobals';

/*
 * Redirect Page Component
 * This component gets rendered in a new window. Nothing is rendered.
 * The code query param is sent to the Fence Token endpoint to request a token pair.
 */

export default compose(withApi)(({ api, fence }) => (
  <Component
    didMount={() => {
      const code = new URLSearchParams(window.location.search).get('code');
      const egoJwt = localStorage.getItem(EGO_JWT_KEY);

      if (code && egoJwt) {
        api({
          url: `${fenceTokensUri}?fence=${fence}&code=${code}`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${egoJwt}`,
          },
        })
          .then(result => {
            window.close();
          })
          .catch(err => {
            window.alert('Something went wrong, please refresh your window and try again.');
            window.close();
          });
      } else {
        window.close();
      }
    }}
  >
    {() => (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <strong>Please wait while you are redirected.</strong>
        <strong>Do not close or refresh your browser.</strong>
      </div>
    )}
  </Component>
));
