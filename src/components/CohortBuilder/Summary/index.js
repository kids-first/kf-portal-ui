import React from 'react';
import { compose } from 'recompose';
// [NEXT] TODO - REMOVE react-grid-system in favor of whatever else we have
import { Col, Row } from 'react-grid-system';

import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';
import DiagnosesChart, { diagnosesQuery } from './DiagnosesChart';
import StudiesChart, { studiesQuery } from './StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './AgeDiagChart';
import SurvivalChart from './SurvivalChart';
import DataTypeChart, { dataTypesQuery, experimentalStrategyQuery } from './DataTypeChart';
import { CohortCard } from './ui';
import OntologySunburst from 'components/Charts/Ontology/OntologySunburst';
import './Summary.css';
import { isFeatureEnabled } from 'common/featuresToggles';
import PropTypes from 'prop-types';

const CardSlot = ({ children }) => (
  <Col style={{ padding: '4px' }} sm={12} md={6} lg={6} xl={4}>
    {children}
  </Col>
);

CardSlot.propTypes = {
  children: PropTypes.element,
};

const Summary = ({
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
          <CardSlot>
            <CohortCard title="Available Data" loading={isLoading}>
              <div className={'cardBodyDataChartType'}>
                <div className={'wrapperDataTypeChart'}>
                  <DataTypeChart
                    data={dataTypesData}
                    axisLeftLegend={'# Participants'}
                    axisBottomLegend={'Data Type'}
                    isLoading={isLoading}
                    height={350}
                  />
                </div>
                <div className={'wrapperDataTypeChart'}>
                  <DataTypeChart
                    data={experimentalStrategyData}
                    axisLeftLegend={'# Participants'}
                    axisBottomLegend={'Experimental Strategy'}
                    isLoading={isLoading}
                    height={350}
                  />
                </div>
              </div>
            </CohortCard>
          </CardSlot>
          {isFeatureEnabled('FT_SUNBURST') && (
            <CardSlot>
              <CohortCard title="Observed Phenotypes">
                <OntologySunburst sqon={sqon} />
              </CohortCard>
            </CardSlot>
          )}
          <CardSlot>
            <StudiesChart studies={studiesData} sqon={sqon} isLoading={isLoading} />
          </CardSlot>
          <CardSlot>
            <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} isLoading={isLoading} />
          </CardSlot>
          <CardSlot>
            <DemographicChart data={demographicData} isLoading={isLoading} />
          </CardSlot>
          <CardSlot>
            <AgeDiagChart data={ageDiagData} isLoading={isLoading} height={350} />
          </CardSlot>
          <CardSlot>
            <SurvivalChart sqon={sqon} />
          </CardSlot>
        </Row>
      );
    }}
  </QueriesResolver>
);

Summary.propTypes = {
  sqon: PropTypes.object,
  api: PropTypes.func.isRequired,
};

export default compose(withApi)(Summary);
