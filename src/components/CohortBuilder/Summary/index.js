import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { topDiagnosesBarMock, studiesBarMock, fileBreakdownMock, survivalPlotMock } from './mock';
import Card from 'uikit/Card';
import { Col, Row } from 'react-grid-system';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import FileBreakdown from './FileBreakdown';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import SurvivalChart from './SurvivalChart';
import DiagnosesChart, { diagnosesQuery } from './DiagnosesChart';
import StudiesChart, { studiesQuery } from './StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import SurvivalChart from './SurvivalChart';

export const BarChartContainer = styled('div')`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
`;

export const CardSlot = styled(Card)`
  height: 305px;
`;

const CardSlotOverflowVisible = styled(Card)`
  height: 305px;
  min-height: 305px;
  & div {
    overflow: visible;
  }
`;

const PaddedColumn = styled(Col)`
  padding: 4px !important;
`;

const LongCard = styled(Card)`
  width: 100%;
`;

const LongCardContainerRow = styled(Row)`
  height: 100%;
`;

const md = 6;
const lg = 4;

const enhance = compose(
  withApi,
  withTheme,
);

const defaultSqon = {
  op: 'and',
  content: [],
};
const Summary = ({ theme, sqon = defaultSqon, api }) => (
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
          <Col xl={9}>
            <Row nogutter>
              <PaddedColumn md={md} lg={lg}>
                <CardSlot scrollable={true} title="File Breakdown">
                  <FileBreakdown data={fileBreakdownMock} />
                </CardSlot>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <StudiesChart studies={studies} sqon={sqon} />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <DiagnosesChart
                  data={topDiagnosesBarMock}
                  sqon={sqon}
                  topDiagnoses={topDiagnosesData}
                />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CardSlot showHeader={false}>
                  <DemographicChart data={demographicData} />
                </CardSlot>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CardSlotOverflowVisible title="Overall Survival">
                  <SurvivalChart data={survivalPlotMock} />
                </CardSlotOverflowVisible>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CardSlot title="Age at Diagnosis">
                  <AgeDiagChart data={ageDiagData} />
                </CardSlot>
              </PaddedColumn>
            </Row>
          </Col>
          <PaddedColumn xl={3}>
            <LongCardContainerRow nogutter>
              <LongCard title="Phenotypes">
                <pre>{JSON.stringify(sqon, null, 2)}</pre>
              </LongCard>
            </LongCardContainerRow>
          </PaddedColumn>
        </Row>
      );
    }}
  </QueriesResolver>
);

export default enhance(Summary);
