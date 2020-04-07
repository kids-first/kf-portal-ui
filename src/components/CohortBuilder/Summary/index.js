import React from 'react';
import { compose } from 'recompose';
// [NEXT] TODO - REMOVE react-grid-system in favor of whatever else we have
import { Col, Row } from 'react-grid-system';

import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import DiagnosesChart, { diagnosesQuery } from './DiagnosesChart';
import StudiesChart, { studiesQuery } from './StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import SurvivalChart from './SurvivalChart';
import DataTypeChart, { dataTypesQuery, experimentalStrategyQuery } from './DataTypeChart';
import { CohortCard } from './ui';
import { Sunburst } from './SunburstChart';
import { isFeatureEnabled } from 'common/featuresToggles';

const CardSlot = ({ children }) => (
  <Col style={{ padding: '4px' }} sm={12} md={6} lg={6} xl={4}>
    {children}
  </Col>
);

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
        <Row nogutter>
          <CardSlot>
            <CohortCard title="Available Data" loading={isLoading}>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexFlow: 'column wrap',
                }}
              >
                <DataTypeChart
                  data={dataTypesData}
                  axisLeftLegend={'# Participants'}
                  axisBottomLegend={'Data Type'}
                  isLoading={isLoading}
                />
                <DataTypeChart
                  data={experimentalStrategyData}
                  axisLeftLegend={'# Participants'}
                  axisBottomLegend={'Experimental Strategy'}
                  isLoading={isLoading}
                />
              </div>
            </CohortCard>
          </CardSlot>
          <CardSlot>
            <StudiesChart studies={studiesData} sqon={sqon} isLoading={isLoading} />
          </CardSlot>
          <CardSlot>
            <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} isLoading={isLoading} />
          </CardSlot>
          <CardSlot>
            <DemographicChart data={demographicData} isLoading={isLoading} />
          </CardSlot>
          <CardSlot>
            <AgeDiagChart data={ageDiagData} isLoading={isLoading} />
          </CardSlot>
          <CardSlot>
            <SurvivalChart sqon={sqon} />
          </CardSlot>
          {isFeatureEnabled('showHpoSunburst') && ( //TODO : remove me one day :)
            <CardSlot>
              <CohortCard long={true} title="Observed Phenotypes" loading={false}>
                <Sunburst />
              </CohortCard>
            </CardSlot>
          )}
        </Row>
      );
    }}
  </QueriesResolver>
);

export default compose(withApi)(Summary);
