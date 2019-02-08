import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import VerticalBar from 'chartkit/components/VerticalBar';

const ageAtDiagnosisTooltip = data => {
  return `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;
};

const AgeDiagChart = ({ data, theme }) => (
  <VerticalBar
    data={data}
    indexBy="label"
    tooltipFormatter={ageAtDiagnosisTooltip}
    sortByValue={true}
    height={225}
    colors={[theme.chartColors.lightblue]}
  />
);

export const ageDiagQuery = sqon => ({
  query: `query($sqon:JSON) {
    participant {
      aggregations(filters: $sqon) {
        diagnoses__age_at_event_days {
          newborn: histogram(interval: 10){
            buckets {
              doc_count
              key
              key_as_string
            }
          }
          
          adult:histogram(interval: 5){
            buckets {
              doc_count
              key
              key_as_string
            }
          }
        }
      
      } 
    }
  }
  `,
  variables: sqon,
  transform: x => x,
});

export default compose(withTheme)(AgeDiagChart);
