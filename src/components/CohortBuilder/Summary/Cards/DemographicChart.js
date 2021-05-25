import React from 'react';
import { connect } from 'react-redux';
import Card from '@ferlab/ui/core/view/GridCard';
import Pie from 'chartkit/components/Pie';
import gql from 'graphql-tag';
import get from 'lodash/get';
import startCase from 'lodash/startCase';
import PropTypes from 'prop-types';

import {
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
  setSqonValueAtIndex,
} from 'common/sqonUtils';
import Empty, { SIZE } from 'components/UI/Empty';
import { setSqons } from 'store/actionCreators/virtualStudies';
import theme from 'theme/defaultTheme';

const DATA_MISSING = '__missing__';

const NO_DATA = 'No Data';

const convertKeyToLabel = (key) => {
  if (key === DATA_MISSING) {
    return startCase(NO_DATA);
  } else if (key.includes('+')) {
    return startCase(key.replace('+', 'plus'));
  }
  return startCase(key);
};

const convertNoDataLabelToAnalogSqonValueIfNeeded = (labelValue) =>
  labelValue === NO_DATA ? DATA_MISSING : labelValue;

export const demographicQuery = (sqon) => ({
  query: gql`
    fragment bucketsAgg on Aggregations {
      buckets {
        key
        doc_count
      }
    }
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
          gender {
            ...bucketsAgg
          }
          ethnicity {
            ...bucketsAgg
          }
          race {
            ...bucketsAgg
          }
          family__family_compositions__composition {
            ...bucketsAgg
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: (data) => {
    const toChartData = ({ key, doc_count }) => {
      const dataKey = convertKeyToLabel(key);
      return {
        id: dataKey,
        label: dataKey,
        value: doc_count,
      };
    };

    return {
      race: get(data, 'data.participant.aggregations.race.buckets', []).map(toChartData),

      gender: get(data, 'data.participant.aggregations.gender.buckets', []).map(toChartData),

      ethnicity: get(data, 'data.participant.aggregations.ethnicity.buckets', []).map(toChartData),

      familyComposition: get(
        data,
        'data.participant.aggregations.family__family_compositions__composition.buckets',
        [],
      ).map(toChartData),
    };
  },
});

class DemographicChart extends React.Component {
  static propTypes = {
    virtualStudy: PropTypes.object,
    setSqons: PropTypes.func,
    data: PropTypes.object,
    isLoading: PropTypes.bool,
  };

  addSqon = (field, value) => {
    const { virtualStudy, setSqons } = this.props;

    const sqonValue = convertNoDataLabelToAnalogSqonValueIfNeeded(value);

    const newSqon = {
      op: 'in',
      content: {
        field: field,
        value: [sqonValue],
      },
    };

    const modifiedSqons = setSqonValueAtIndex(
      virtualStudy.sqons,
      virtualStudy.activeIndex,
      newSqon,
      {
        values: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
        operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR,
      },
    );
    setSqons(modifiedSqons);
  };

  render() {
    const { data = {}, isLoading: isParentLoading } = this.props;
    const dataEntries = Object.entries(data);
    const hasNoData =
      dataEntries.length === 0 || dataEntries.every(([, value]) => !value || value.length === 0);
    return (
      <Card
        title={<span className={'title-summary-card'}>Demographics</span>}
        loading={isParentLoading}
      >
        {hasNoData ? (
          <div className={'empty-graph'}>
            <Empty size={SIZE.SMALL} />
          </div>
        ) : (
          <div className={'pieChartContainer'}>
            <Pie
              style={{
                height: '42%',
                width: '50%',
                marginBottom: '10px',
                marginTop: '5px',
              }}
              title={'Gender'}
              data={data.gender}
              colors={[theme.chartColors.orange, '#FFFFFF']}
              onClick={(data) => {
                const value = data.label;
                this.addSqon('gender', value);
              }}
            />
            <Pie
              style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
              title={'Ethnicity'}
              data={data.ethnicity}
              colors={[theme.chartColors.darkblue, '#FFFFFF']}
              onClick={(data) => {
                const value = data.label.replace(' Or ', ' or ');
                this.addSqon('ethnicity', value);
              }}
            />
            <Pie
              style={{ height: '42%', width: '50%' }}
              title={'Race'}
              data={data.race}
              colors={[theme.chartColors.lightpurple, '#FFFFFF']}
              onClick={(data) => {
                const value = data.label.replace(' Or ', ' or ');
                this.addSqon('race', value);
              }}
            />
            <Pie
              style={{ height: '42%', width: '50%' }}
              title={'Family Composition'}
              data={data.familyComposition}
              colors={[theme.chartColors.lightblue, '#FFFFFF']}
              onClick={(data) => {
                const value = data.label.toLowerCase().replace('proband only', 'proband-only');
                this.addSqon('family.family_compositions.composition', value);
              }}
            />
          </div>
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default connect(mapStateToProps, mapDispatchToProps)(DemographicChart);
