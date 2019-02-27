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
import { PaddedColumn, CohortCard, LongCardContainerRow, CardSlotOverflowVisible } from './ui';

const md = 6;
const lg = 4;

const enhance = compose(
  withApi,
  withTheme,
);

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
              <PaddedColumn md={md} lg={lg}>
                <FileBreakdown data={fileBreakdownMock} />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <StudiesChart studies={studiesData} sqon={sqon} />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <DemographicChart data={demographicData} />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CardSlotOverflowVisible title="Overall Survival">
                  <SurvivalChart data={survivalPlotMock} />
                </CardSlotOverflowVisible>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <AgeDiagChart data={ageDiagData} />
              </PaddedColumn>
            </Row>
          </Col>
          <PaddedColumn xl={3}>
            <LongCardContainerRow nogutter>
              <CohortCard long title="Phenotypes">
                <pre>{JSON.stringify(sqon, null, 2)}</pre>
              </CohortCard>
            </LongCardContainerRow>
          </PaddedColumn>
        </Row>
      );
    }}
  </QueriesResolver>
);

export default enhance(Summary);
