import React from 'react';
import gql from 'graphql-tag';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { get, camelCase } from 'lodash';
import Pie from 'chartkit/components/Pie';

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

const DemographicChart = ({ data, theme }) => (
  <PieChartContainer>
    <Pie
      style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
      title={'Gender'}
      data={data.gender}
      colors={[theme.chartColors.orange, '#FFFFFF']}
    />
    <Pie
      style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
      title={'Ethnicity'}
      data={data.ethnicity}
      colors={[theme.chartColors.darkblue, '#FFFFFF']}
    />
    <Pie
      style={{ height: '42%', width: '50%' }}
      title={'Race'}
      data={data.race}
      colors={[theme.chartColors.lightpurple, '#FFFFFF']}
    />

    <Pie
      style={{ height: '42%', width: '50%' }}
      title={'Family Composition'}
      data={data.familyComposition}
      colors={[theme.chartColors.lightblue, '#FFFFFF']}
    />
  </PieChartContainer>
);

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
    const toChartData = ({ key, doc_count }) => ({
      id: keyToId(key),
      label: key,
      value: doc_count,
    });
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

const keyToId = key => (key.includes('+') ? camelCase(key.replace('+', 'plus')) : camelCase(key));

export default compose(withTheme)(DemographicChart);
