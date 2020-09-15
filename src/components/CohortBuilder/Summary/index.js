import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Row } from 'antd';
import Card from './Cards/SummaryCard';

import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './Cards/DemographicChart';
import DiagnosesChart, { diagnosesQuery } from './Cards/DiagnosesChart';
import StudiesChart, { studiesQuery } from './Cards/StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './Cards/AgeDiagChart';
import SurvivalChart from './Cards/SurvivalChart';
import { dataTypesQuery, experimentalStrategyQuery } from './Cards/DataTypeChart';
import DataTypeCard from './Cards/DataTypeCard';
import OntologySunburst from 'components/Charts/Ontology/OntologySunburst';

import { isFeatureEnabled } from 'common/featuresToggles';

import './Summary.css';

const Summary = ({
  sqon = {
    op: 'and',
    content: [],
  },
  api,
}) => (
  <QueriesResolver
    name="GQL_SUMMARY_CHARTS"
    api={api}
    queries={[
      dataTypesQuery(sqon),
      experimentalStrategyQuery(sqon),
      demographicQuery(sqon),
      ageDiagQuery(sqon),
      studiesQuery(sqon),
      diagnosesQuery(sqon),
    ]}
  >
    {({ isLoading, data = null }) => {
      const [
        dataTypesData = [],
        experimentalStrategyData = [],
        demographicData = [],
        ageDiagData = [],
        studiesData = [],
        topDiagnosesData = [],
      ] = data;

      return !data ? (
        <Row nogutter> no data</Row>
      ) : (
        <>
          <DataTypeCard
            isLoading={isLoading}
            dataTypesData={dataTypesData}
            experimentalStrategyData={experimentalStrategyData}
          />
          {isFeatureEnabled('FT_SUNBURST') && (
            <Card title="Observed Phenotypes">
              <OntologySunburst sqon={sqon} />
            </Card>
          )}
          <StudiesChart studies={studiesData} sqon={sqon} isLoading={isLoading} />
          <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} isLoading={isLoading} />
          <DemographicChart data={demographicData} isLoading={isLoading} />
          <AgeDiagChart data={ageDiagData} isLoading={isLoading} height={350} />
          <SurvivalChart sqon={sqon} />
        </>
      );
    }}
  </QueriesResolver>
);

Summary.propTypes = {
  sqon: PropTypes.object,
  api: PropTypes.func.isRequired,
};

export default compose(withApi)(Summary);
