import React from 'react';
import { Trans } from 'react-i18next';
import { reactApiDataVersionApi, reactApiDataVersionFallback } from 'common/injectGlobals';
import { sortBy } from 'lodash';

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

export class DataVersionProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: '',
      loading: true,
    };
  }

  componentDidMount() {
    getLatestDataVersion().then(version => {
      this.setState({ version, loading: false });
    });
  }

  render() {
    return <Trans i18nKey="dataReleaseVersion">{this.state.version}</Trans>;
  }
}

export default getLatestDataVersion;
