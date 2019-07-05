import React from 'react';
import gql from 'graphql-tag';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { get, startCase } from 'lodash';
import Pie from 'chartkit/components/Pie';
import { CohortCard } from './ui';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { connect } from 'react-redux';
import {
  setSqonValueAtIndex,
  MERGE_VALUES_STRATEGIES,
  MERGE_OPERATOR_STRATEGIES,
} from '../../../common/sqonUtils';

const PieChartContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
`;

class DemographicChart extends React.Component {
  addSqon = (field, value) => {
    const { virtualStudy, setSqons } = this.props;

    const newSqon = {
      op: 'in',
      content: {
        field: field,
        value: [value],
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
    const { data, theme, isLoading: isParentLoading } = this.props;
    return (
      <CohortCard showHeader={false} loading={isParentLoading}>
        <PieChartContainer>
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
            onClick={data => {
              const value = data.label;
              this.addSqon('gender', value);
            }}
          />
          <Pie
            style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
            title={'Ethnicity'}
            data={data.ethnicity}
            colors={[theme.chartColors.darkblue, '#FFFFFF']}
            onClick={data => {
              const value = data.label.replace(' Or ', ' or ');
              this.addSqon('ethnicity', value);
            }}
          />
          <Pie
            style={{ height: '42%', width: '50%' }}
            title={'Race'}
            data={data.race}
            colors={[theme.chartColors.lightpurple, '#FFFFFF']}
            onClick={data => {
              const value = data.label.replace(' Or ', ' or ');
              this.addSqon('race', value);
            }}
          />
          <Pie
            style={{ height: '42%', width: '50%' }}
            title={'Family Composition'}
            data={data.familyComposition}
            colors={[theme.chartColors.lightblue, '#FFFFFF']}
            onClick={data => {
              const value = data.label.toLowerCase().replace('proband only', 'proband-only');
              this.addSqon('family.family_compositions.composition', value);
            }}
          />
        </PieChartContainer>
      </CohortCard>
    );
  }
}

export const demographicQuery = sqon => ({
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
  transform: data => {
    const toChartData = ({ key, doc_count }) => {
      const dataKey = keyToDisplay(key === DATA_MISSING ? 'No Data' : key);
      return {
        id: dataKey,
        label: dataKey,
        value: doc_count,
      };
    };

    const DATA_MISSING = '__missing__';

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

const keyToDisplay = key =>
  key.includes('+') ? startCase(key.replace('+', 'plus')) : startCase(key);

const mapStateToProps = state => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default compose(
  withTheme,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DemographicChart);
