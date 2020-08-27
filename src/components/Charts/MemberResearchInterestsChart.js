import React from 'react';
import orderBy from 'lodash/orderBy';
import { compose } from 'recompose';

import Donut from 'chartkit/components/Donut';
import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { titleCase } from 'common/displayFormatters';
import { publicStatsApiRoot } from 'common/injectGlobals';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import theme from 'theme/defaultTheme';
import ChartError from './ChartError';
import PropTypes from 'prop-types';

const ALLOWED_INTERESTS = []
  .concat(DISEASE_AREAS, STUDY_SHORT_NAMES)
  .map((interest) => interest.toLowerCase());

const UserInterestsChart = ({ data }) => {
  // sort by count then alpha, limit to top 10
  const filteredInterests = data.filter((interest) =>
    ALLOWED_INTERESTS.includes(interest.name.toLowerCase()),
  );
  const sortedInterests = orderBy(filteredInterests, ['count', 'name'], ['desc', 'asc'])
    .slice(0, 10)
    .map((interest) => ({
      id: titleCase(interest.name),
      label: titleCase(interest.name),
      value: interest.count,
    }));

  return (
    <Donut
      analyticsTracking={{
        category: TRACKING_EVENTS.categories.charts.donut.userInterests,
      }}
      data={sortedInterests}
      colors={[theme.chartColors.red, '#FFF']}
    />
  );
};

UserInterestsChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default compose(withApi)(({ api }) => (
  <DataProvider
    url={`${publicStatsApiRoot}users/interests`}
    api={api}
    transform={(data) => data.interests}
  >
    {(fetchedState) => (
      <ChartLoadGate Error={ChartError} fetchedState={fetchedState} Chart={UserInterestsChart} />
    )}
  </DataProvider>
));
