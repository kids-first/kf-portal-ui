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
import EmptyCohortOverlay from './../EmptyCohortOverlay';
import SurvivalChart from './SurvivalChart';
import PhenotypeBreakdown from './PhenotypeBreakdown';

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
              <FileBreakdown data={fileBreakdownMock} />
              <StudiesChart studies={studiesData} sqon={sqon} />
              <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} />
              <DemographicChart data={demographicData} />
              <SurvivalChart data={survivalPlotMock} />
              <AgeDiagChart data={ageDiagData} />
            </Row>
          </Col>
          <PhenotypeBreakdown sqon={sqon} />
        </Row>
      );
    }}
  </QueriesResolver>
);

export default compose(
  withApi,
  withTheme,
)(Summary);
