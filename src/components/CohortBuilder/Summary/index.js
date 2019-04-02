import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Col, Row } from 'react-grid-system';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import FileBreakdown, { dataTypesExpStratPairsQuery } from './FileBreakdown';
import DiagnosesChart, { diagnosesQuery } from './DiagnosesChart';
import StudiesChart, { studiesQuery } from './StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import SurvivalChart from './SurvivalChart';
import styled from 'react-emotion';
import { TRACKING_EVENTS } from 'services/analyticsTracking';

const {
  categories: {
    cohortBuilder: {
      results: {
        summaryView,
      },
    },
  },
} = TRACKING_EVENTS;

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
        dataTypesExpStratPairsQuery(sqon),
      ]}
    >
      {({ isLoading, data = null }) => {
        const [
          demographicData = [],
          ageDiagData = [],
          studiesData = [],
          topDiagnosesData = [],
          dataTypesExpStratPairs = [],
        ] = data;

        return !data ? (
          <Row nogutter> no data</Row>
        ) : (
            <Row nogutter>
              <Col xl={12}>
                <Row nogutter>
                  <PaddedColumn md={spacing.md} lg={spacing.lg}>
                    <FileBreakdown
                      sqon={sqon}
                      isLoading={isLoading}
                      dataTypesExpStratPairs={dataTypesExpStratPairs}
                      analyticsTracking={{ category: summaryView, subcategory: 'Files' }}
                    />
                  </PaddedColumn>
                  <PaddedColumn md={spacing.md} lg={spacing.lg}>
                    <StudiesChart
                      studies={studiesData}
                      sqon={sqon}
                      isLoading={isLoading}
                      analyticsTracking={{ category: summaryView, subcategory: 'Studies' }}
                    />
                  </PaddedColumn>
                  <PaddedColumn md={spacing.md} lg={spacing.lg}>
                    <DiagnosesChart
                      topDiagnoses={topDiagnosesData}
                      sqon={sqon}
                      isLoading={isLoading}
                      analyticsTracking={{ category: summaryView, subcategory: 'Diagnoses' }}
                    />
                  </PaddedColumn>
                  <PaddedColumn md={spacing.md} lg={spacing.lg}>
                    <DemographicChart
                      data={demographicData}
                      isLoading={isLoading}
                      analyticsTracking={{ category: summaryView, subcategory: 'Demographic' }}
                    />
                  </PaddedColumn>
                  <PaddedColumn md={spacing.md} lg={spacing.lg}>
                    <SurvivalChart
                      sqon={sqon}
                      analyticsTracking={{ category: summaryView, subcategory: 'Survival' }}
                    />
                  </PaddedColumn>{' '}
                  <PaddedColumn md={spacing.md} lg={spacing.lg}>
                    <AgeDiagChart
                      data={ageDiagData}
                      isLoading={isLoading}
                      analyticsTracking={{ category: summaryView, subcategory: 'Age at Diagnosis' }}
                    />
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
