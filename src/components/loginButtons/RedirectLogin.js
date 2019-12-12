// import React from 'react';
// import queryString from 'query-string';
// import urlJoin from 'url-join';

// import popBack from 'popback';
// import { defaultRedirectUri } from 'common/injectGlobals';

// export default ({ onLogin, ...props }) => {
//   return (
//     <button
//       {...props}
//       onClick={event => {
//         const search = queryString.stringify({
//           redirect_uri: urlJoin(window.location.origin, 'redirected'),
//         });

//         popBack({
//           id: 'external-authorize',
//           url: urlJoin(defaultRedirectUri, 'auth-redirect', `?${search}`),
//           height: 1000,
//           width: 600,
//         }).then(onLogin, () => global.log('failed to get jwt'));
//       }}
//     >
//       Open Login Popup
//     </button>
//   );
// };
