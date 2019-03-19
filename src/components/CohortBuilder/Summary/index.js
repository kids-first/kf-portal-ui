import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { survivalPlotMock } from './mock';
import { Col, Row } from 'react-grid-system';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import FileBreakdown, { fileBreakdownQuery } from './FileBreakdown';
import DiagnosesChart, { diagnosesQuery } from './DiagnosesChart';
import StudiesChart, { studiesQuery } from './StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import SurvivalChart from './SurvivalChart';
import styled from 'react-emotion';

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
      demographicQuery(sqon),
      ageDiagQuery(sqon),
      studiesQuery(sqon),
      diagnosesQuery(sqon),
      fileBreakdownQuery(sqon),
    ]}
  >
    {({ isLoading, data = null }) => {
      const [
        demographicData = [],
        ageDiagData = [],
        studiesData = [],
        topDiagnosesData = [],
        fileDataTypes = [],
      ] = data;

      return !data ? (
        <Row nogutter> no data</Row>
      ) : (
        <Row nogutter>
          <Col xl={12}>
            <Row nogutter>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <FileBreakdown fileDataTypes={fileDataTypes} sqon={sqon} isLoading={isLoading} />
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
                <SurvivalChart data={survivalPlotMock} isLoading={isLoading} />
              </PaddedColumn>{' '}
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <AgeDiagChart data={ageDiagData} isLoading={isLoading} />
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
