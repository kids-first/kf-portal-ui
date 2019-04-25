import React from 'react';
import { reactApiDataVersionApi, reactApiDataVersionFallback } from 'common/injectGlobals';
import { sortBy } from 'lodash';
import Component from 'react-component-component';

const getLatestDataVersion = () => {
  return fetch(reactApiDataVersionApi)
    .then(res => res.json())
    .then(({ results }) => {
      const publishedEtl = results
        .filter(release => {
          const hasETL = release.tasks.some(({ service_name }) => !!service_name);
          return hasETL;
        })
        .map(release => {
          const etl = release.tasks.find(({ service_name }) => service_name === 'ETL');
          return { etl, releaseDate: release.created_at, releaseVersion: release.version };
        })
        .filter(({ etl: { state } }) => state === 'published');
      const sortedEtls = sortBy(publishedEtl, ({ releaseDate, releaseVersion }) =>
        new Date().valueOf(releaseDate),
      );
      const latestVersion = (sortedEtls[0] || {}).releaseVersion;
      return latestVersion;
    })
    .catch(() => reactApiDataVersionFallback);
};

export const DataVersionProvider = ({ render }) => (
  <Component
    initialState={{ loading: true, version: '' }}
    didMount={({ setState }) =>
      getLatestDataVersion().then(version => {
        console.log('version: ', version);
        setState({ version, loading: false });
      })
    }
  >
    {({ state }) => render(state)}
  </Component>
);

export default getLatestDataVersion;
