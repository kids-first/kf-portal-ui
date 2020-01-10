// import React, {Suspense} from 'react';
// import { arrangerAdminApiRoot } from 'common/injectGlobals';
// import { EGO_JWT_KEY } from 'common/constants';
// import { withRouter } from 'react-router-dom';

// const LazyArrangerAdminUi = React.lazy(() => import('@kfarranger/admin-ui/dist'))

// export default withRouter(({
//   baseRoute,
//   history,
//   failRedirect="/"
// }) => (
//   <div style={{ minHeight: "100vh" }}>
//     <Suspense fallback={<div>Loading...</div>}>
//       <LazyArrangerAdminUi
//         basename={baseRoute}
//         apiRoot={arrangerAdminApiRoot}
//         fetcher={(url, config) =>
//           fetch(url, {
//             ...config,
//             headers: {
//               ...config.headers,
//               authorization: `Bearer ${localStorage.getItem(EGO_JWT_KEY)}`
//             }
//           })
//           .catch(() => history.replace(failRedirect))
//       }/>
//     </Suspense>
//   </div>
// ))
