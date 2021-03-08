import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Row } from 'antd';

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
import Card from '@ferlab/ui/core/view/GridCard';

import GridContainer from '@ferlab/ui/core/layout/Grid';

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
      diagnosesQuery(sqon),
      studiesQuery(sqon),
    ]}
  >
    {({ isLoading, data = null }) => {
      const [
        dataTypesData = [],
        experimentalStrategyData = [],
        demographicData = {},
        ageDiagData = [],
        topDiagnosesData = [],
        studiesData = [],
      ] = data;

      return !data ? (
        <Row nogutter> no data</Row>
      ) : (
        <>
          <GridContainer className={'summary-grid'}>
            <DataTypeCard
              isLoading={isLoading}
              dataTypesData={dataTypesData}
              experimentalStrategyData={experimentalStrategyData}
            />
            <StudiesChart isLoading={isLoading} data={studiesData} />
            <Card
              title={<span className={'title-summary-card'}>Observed Phenotypes</span>}
              classNameCardItem={'ontology-sunburst-card'}
            >
              <OntologySunburst sqon={sqon} />
            </Card>
            <DiagnosesChart
              api={api}
              sqon={sqon}
              topDiagnoses={topDiagnosesData}
              isLoading={isLoading}
            />
            <DemographicChart data={demographicData} isLoading={isLoading} />
            <AgeDiagChart data={ageDiagData} isLoading={isLoading} />
            <SurvivalChart sqon={sqon} />
          </GridContainer>
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
