import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { fileBreakdownMock, survivalPlotMock } from './mock';
import { Col, Row } from 'react-grid-system';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import FileBreakdown from './FileBreakdown';
import DiagnosesChart, { diagnosesQuery } from './DiagnosesChart';
import StudiesChart, { studiesQuery } from './StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import EmptyCohortOverlay from '../EmptyCohortOverlay';
import SurvivalChart from './SurvivalChart';
import PhenotypeBreakdown from './PhenotypeBreakdown';
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
    api={api}
    queries={[demographicQuery(sqon), ageDiagQuery(sqon), studiesQuery(sqon), diagnosesQuery(sqon)]}
  >
    {({ isLoading, data }) => {
      const [demographicData, ageDiagData, studiesData, topDiagnosesData] = data || [];

      return isLoading ? (
        <Row nogutter>
          <div className={theme.fillCenter} style={{ marginTop: '30px' }}>
            <LoadingSpinner color={theme.greyScale11} size={'50px'} />
          </div>
        </Row>
      ) : !data ? (
        <Row nogutter> no data</Row>
      ) : (
        <Row nogutter>
          {!sqon ? <EmptyCohortOverlay /> : null}
          <Col xl={9}>
            <Row nogutter>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <FileBreakdown data={fileBreakdownMock} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <StudiesChart studies={studiesData} sqon={sqon} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <DemographicChart data={demographicData} />
              </PaddedColumn>
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <SurvivalChart data={survivalPlotMock} />
              </PaddedColumn>{' '}
              <PaddedColumn md={spacing.md} lg={spacing.lg}>
                <AgeDiagChart data={ageDiagData} />
              </PaddedColumn>
            </Row>
          </Col>
          <PaddedColumn xl={spacing.xl}>
            <PhenotypeBreakdown sqon={sqon} />
          </PaddedColumn>
        </Row>
      );
    }}
  </QueriesResolver>
);

export default compose(
  withApi,
  withTheme,
)(Summary);
