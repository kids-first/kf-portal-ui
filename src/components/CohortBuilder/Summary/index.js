import React from 'react';
import styled, { css } from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { fileBreakdownMock, survivalPlotMock } from './mock';
import Card from 'uikit/Card';
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
import CardHeader from '../../../uikit/Card/CardHeader';

export const BarChartContainer = styled('div')`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
`;

export const CardSlot = styled(Card)`
  ${mediumCard}
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

const longCard = props =>
  css`
    width: 100%;
  `;
const mediumCard = props =>
  css`
    height: 305px;
    padding: 15px 20px;
  `;

const headerWrapperStyle = props => css`
  padding-bottom: 10px;
`;

const headingStyle = props =>
  css`
    font-size: 16px;
  `;

export const CohortCard = ({ title, children, long = false, ...props }) => (
  <Card
    cardWrapperStyle={long ? longCard : mediumCard}
    headerWrapperStyle={headerWrapperStyle}
    Header={<CardHeader title={title} headingStyle={headingStyle} />}
    {...props}
  >
    {children}
  </Card>
);

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
                <CohortCard scrollable={true} title="File Breakdown">
                  <FileBreakdown data={fileBreakdownMock} />
                </CohortCard>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <StudiesChart studies={studiesData} sqon={sqon} />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} />
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CohortCard showHeader={false}>
                  <DemographicChart data={demographicData} />
                </CohortCard>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CardSlotOverflowVisible title="Overall Survival">
                  <SurvivalChart data={survivalPlotMock} />
                </CardSlotOverflowVisible>
              </PaddedColumn>
              <PaddedColumn md={md} lg={lg}>
                <CohortCard title="Age at Diagnosis">
                  <AgeDiagChart data={ageDiagData} />
                </CohortCard>
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
