import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import Pie from 'chartkit/components/Pie';
import { CardWrapper } from 'uikit/Card/styles';

const CardSlotPies = styled(CardWrapper)`
  height: 305px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 10px;
`;

const DemographicChart = ({ data, theme }) => (
  <CardSlotPies>
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
  </CardSlotPies>
);

export const demographicQuery = ({ sqon }) => ({
  query: `query ($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        edges {
          node {
            race
            ethnicity
            gender
            family {
              family_compositions {
                hits {
                  edges {
                    node {
                      composition
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`,
  variables: sqon,
  transform: x => x,
});

export default compose(withTheme)(DemographicChart);
