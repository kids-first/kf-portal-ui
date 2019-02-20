import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import LoadingSpinner from 'uikit/LoadingSpinner';

import {
  topDiagnosesBarMock,
  studiesBarMock,
  ageAtDiagnosisBarMock,
  fileBreakdownMock,
  survivalPlotMock,
} from './mock';
import Card from 'uikit/Card';
import MultiHeader from 'uikit/Multicard/MultiHeader';
import { CardWrapper } from 'uikit/Card/styles';
import { Col, Row } from 'react-grid-system';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import VerticalBar from 'chartkit/components/VerticalBar';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import FileBreakdown from './FileBreakdown';
import SurvivalChart from './SurvivalChart';

const mostFrequentDiagnosisTooltip = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
};

const ageAtDiagnosisTooltip = data => {
  return `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;
};

const studiesToolTip = data => {
  const { familyMembers, probands, name } = data;
  const participants = familyMembers + probands;
  return (
    <div>
      <div>{name}</div>
      <div>{`${probands.toLocaleString()} Probands`}</div>
      <div>{`${familyMembers.toLocaleString()} Family Members`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`}</div>
    </div>
  );
};

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
};

const BarChartContainer = styled('div')`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
`;

const CardSlot = styled(Card)`
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
  height: 100%;
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

const multiHeader = (
  <MultiHeader
    headings={[{ title: 'Studies', badge: 7 }, { title: 'Participants', badge: 6155 }]}
  />
);

const Summary = ({ theme, sqon, api }) => (
  <QueriesResolver api={api} queries={[demographicQuery(sqon), demographicQuery(sqon)]}>
    {({ isLoading, data }) => {
      const [demographicData] = data || [];

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
                <CardSlotOverflowVisible title={multiHeader}>
                  <HorizontalBar
                    data={studiesBarMock}
                    indexBy="label"
                    keys={['probands', 'familyMembers']}
                    tooltipFormatter={studiesToolTip}
                    sortBy={sortDescParticipant}
                    tickInterval={4}
                    colors={[theme.chartColors.blue, theme.chartColors.purple]}
                    xTickTextLength={28}
                    legends={[
                      { title: 'Probands', color: theme.chartColors.blue },
                      { title: 'Family Members', color: theme.chartColors.purple },
                    ]}
                  />
                </CardSlotOverflowVisible>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CardSlotOverflowVisible title="Most Frequent Diagnoses">
                  <HorizontalBar
                    data={topDiagnosesBarMock}
                    indexBy="label"
                    keys={['probands', 'familyMembers']}
                    tooltipFormatter={mostFrequentDiagnosisTooltip}
                    sortByValue={true}
                    tickInterval={4}
                    colors={[theme.chartColors.blue, theme.chartColors.purple]}
                    xTickTextLength={28}
                    legends={[
                      { title: 'Probands', color: theme.chartColors.blue },
                      { title: 'Family Members', color: theme.chartColors.purple },
                    ]}
                  />
                </CardSlotOverflowVisible>
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
                  <VerticalBar
                    data={ageAtDiagnosisBarMock}
                    indexBy="label"
                    tooltipFormatter={ageAtDiagnosisTooltip}
                    sortByValue={true}
                    height={225}
                    colors={[theme.chartColors.lightblue]}
                  />
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
