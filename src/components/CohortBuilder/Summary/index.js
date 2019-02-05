import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { topDiagnosesBarMock, studiesBarMock } from './mock';
import Card from 'uikit/Card';
import MultiHeader from 'uikit/Multicard/MultiHeader';
import { Col, Row } from 'react-grid-system';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';

const mostFrequentDiagnosisTooltip = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
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

const SmallCard = styled(Card)`
  height: 305px;
`;

const LongCard = styled(Card)`
  height: 100%;
`;

const CardSlotPies = styled(CardWrapper)`
  height: 305px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 10px;
`;

const PaddedColumn = styled(Col)`
  padding: 4px !important;
`;

const enhance = compose(
  withApi,
  withTheme,
);

const multiHeader = (
  <MultiHeader
    headings={[{ title: 'Studies', badge: 7 }, { title: 'Participants', badge: 6155 }]}
  />
);

<<<<<<< HEAD
const Summary = ({ theme, sqon, api }) => (
  <QueriesResolver api={api} sqon={sqon} queries={[demographicQuery({ ...{ sqon } })]}>
    {({ loading, data }) => {
      return loading || !data ? (
        <div> loading</div>
      ) : (
        <Row nogutter>
          <Col sm={12} md={9} lg={9}>
            <Row nogutter>
              <PaddedColumn sm={12} md={12} lg={3}>
                <CardSlot title="Overall Survival" />
              </PaddedColumn>
              <PaddedColumn sm={12} md={12} lg={3}>
                <CardSlot title={multiHeader}>
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
                    padding={0.5}
                  />
                </CardSlot>
              </PaddedColumn>
              <PaddedColumn sm={12} md={12} lg={3}>
                <CardSlot title="Most Frequent Diagnoses">
                  <HorizontalBar
                    style={{ maxWidth: '100px' }}
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
                    padding={0.5}
                  />
                </CardSlot>
              </PaddedColumn>
              <PaddedColumn sm={12} md={12} lg={3}>
                <DemographicChart data={data} />
              </PaddedColumn>
              <PaddedColumn sm={12} md={12} lg={3}>
                <CardSlot title="File Breakdown" />
              </PaddedColumn>
              <PaddedColumn sm={12} md={12} lg={3}>
                <CardSlot title="Age at Diagnosis" />
              </PaddedColumn>
            </Row>
          </Col>
          <PaddedColumn sm={12} md={12} lg={3}>
            <LongCard title="Phenotypes">
              <pre>{JSON.stringify(sqon, null, 2)}</pre>
            </LongCard>
          </PaddedColumn>
        </Row>
      );
    }}
  </QueriesResolver>
=======
const Summary = ({ theme }) => (
  <Row nogutter>
    <Col sm={12} md={12} lg={9}>
      <Row nogutter>
        <PaddedColumn sm={12} md={md} lg={lg}>
          <SmallCard title="Overall Survival" />
        </PaddedColumn>
        <PaddedColumn sm={12} md={md} lg={lg}>
          <SmallCard title={multiHeader}>
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
              padding={0.5}
            />
          </SmallCard>
        </PaddedColumn>
        <PaddedColumn sm={12} md={md} lg={lg}>
          <SmallCard title="Most Frequent Diagnoses">
            <HorizontalBar
              style={{ maxWidth: '100px' }}
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
              padding={0.5}
            />
          </SmallCard>
        </PaddedColumn>
        <PaddedColumn sm={12} md={md} lg={lg}>
          <CardSlotPies>
            <Pie
              style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
              title={'Gender'}
              data={demographicPiesMock.gender}
              colors={[theme.chartColors.orange, '#FFFFFF']}
            />
            <Pie
              style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
              title={'Ethnicity'}
              data={demographicPiesMock.ethnicity}
              colors={[theme.chartColors.darkblue, '#FFFFFF']}
            />
            <Pie
              style={{ height: '42%', width: '50%' }}
              title={'Race'}
              data={demographicPiesMock.race}
              colors={[theme.chartColors.lightpurple, '#FFFFFF']}
            />
            <Pie
              style={{ height: '42%', width: '50%' }}
              title={'Family Composition'}
              data={demographicPiesMock.familyComposition}
              colors={[theme.chartColors.lightblue, '#FFFFFF']}
            />
          </CardSlotPies>
        </PaddedColumn>
        <PaddedColumn sm={12} md={md} lg={lg}>
          <SmallCard title="File Breakdown" />
        </PaddedColumn>
        <PaddedColumn sm={12} md={md} lg={lg}>
          <SmallCard title="Age at Diagnosis" />
        </PaddedColumn>
      </Row>
    </Col>
    <PaddedColumn sm={12} md={12} lg={3}>
      <LongCard title="Phenotypes">Long Card</LongCard>
    </PaddedColumn>
  </Row>
>>>>>>> cleanup and rebase
);

export default enhance(Summary);
