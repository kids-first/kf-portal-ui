import React from 'react';
import GridContainer from '@ferlab/ui/core/layout/Grid';
import Card from '@ferlab/ui/core/view/GridCard';
import { Row } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import OntologySunburst from 'components/Charts/Ontology/OntologySunburst';
import { withApi } from 'services/api';

import QueriesResolver from '../QueriesResolver';

import AgeDiagChart, { ageDiagQuery } from './Cards/AgeDiagChart';
import DataTypeCard from './Cards/DataTypeCard';
import { dataTypesQuery, experimentalStrategyQuery } from './Cards/DataTypeChart';
import DemographicChart, { demographicQuery } from './Cards/DemographicChart';
import DiagnosesChart, { diagnosesQuery } from './Cards/DiagnosesChart';
import StudiesChart, { studiesQuery } from './Cards/StudiesChart';
import SurvivalChart from './Cards/SurvivalChart';

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
      // allStudiesQuery(sqon),
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
        allStudiesQuery = [],
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
            <StudiesChart isLoading={isLoading} data={studiesData} studies={allStudiesQuery} />
            <Card
              title={<span className={'title-summary-card'}>Observed Phenotypes</span>}
              classNameCardItem={'ontology-sunburst-card'}
            >
              <OntologySunburst sqon={sqon} height={260} width={260} />
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
