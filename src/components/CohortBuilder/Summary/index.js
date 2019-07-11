import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Col, Row } from 'react-grid-system';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import DiagnosesChart, { diagnosesQuery } from './DiagnosesChart';
import StudiesChart, { studiesQuery } from './StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import SurvivalChart from './SurvivalChart';
import DataTypeChart, { dataTypesQuery, experimentalStrategyQuery } from './DataTypeChart';
import styled from 'react-emotion';
import { CohortCard } from './ui';

const PaddedColumn = styled(Col)`
  padding: 4px !important;
`;

const spacing = {
  md: 6,
  lg: 4,
  xl: 3,
};

const Summary = ({
  theme,
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
          <Col xl={12}>
            <Row nogutter>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <CohortCard title="Available Data" loading={isLoading}>
                  <div style={{ height: '100%', width: '100%',  display: 'flex', flexFlow: 'column wrap'}}>
                    <DataTypeChart data={dataTypesData} axisLeftLegend={'# Participants'} axisBottomLegend={'Data Type'} isLoading={isLoading} />
                    <DataTypeChart data={experimentalStrategyData} axisLeftLegend={'# Participants'} axisBottomLegend={'Experimental Strategy'} isLoading={isLoading} />
                  </div>
                </CohortCard>
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <StudiesChart studies={studiesData} sqon={sqon} isLoading={isLoading} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} isLoading={isLoading} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <DemographicChart data={demographicData} isLoading={isLoading} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <AgeDiagChart data={ageDiagData} isLoading={isLoading} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <SurvivalChart sqon={sqon} />
              </PaddedColumn>
            </Row>
          </Col>
          {/* <PaddedColumn xl={spacing.xl}>
            <PhenotypeBreakdown sqon={sqon} />
          </PaddedColumn>  */}
        </Row>
      );
    }}
  </QueriesResolver>
);

export default compose(
  withApi,
  withTheme,
)(Summary);
