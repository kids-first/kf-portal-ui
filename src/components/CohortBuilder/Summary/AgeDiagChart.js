import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { get, isEqual } from 'lodash';
import gql from 'graphql-tag';
import VerticalBar from 'chartkit/components/VerticalBar';
import { CohortCard } from './ui';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { connect } from 'react-redux';

const ageAtDiagnosisTooltip = data => {
  return `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;
};

class AgeDiagChart extends React.Component {
  addSqon = (field, value) => {
    const COHORT_BUILDER_FILTER_STATE = 'COHORT_BUILDER_FILTER_STATE';
    const savedSqon = localStorage.getItem(COHORT_BUILDER_FILTER_STATE);
    let globalSqon = JSON.parse(savedSqon);
    let ageSqon = {};
    switch (value) {
      case 'Newborn':
        ageSqon = {
          op: '<=',
          content: { field: field, value: [364] },
        };
        break;
      case '1 - 5':
        ageSqon = {
          op: 'between',
          content: { field: field, value: [365, 1824] },
        };
        break;
      case '5 - 10':
        ageSqon = {
          op: 'between',
          content: { field: field, value: [1825, 3649] },
        };
        break;
      case '10 - 15':
        ageSqon = {
          op: 'between',
          content: { field: field, value: [3650, 5474] },
        };
        break;
      case '15 - 18':
        ageSqon = {
          op: 'between',
          content: { field: field, value: [5475, 6569] },
        };
        break;
      case 'Adult':
        ageSqon = {
          op: '>=',
          content: { field: field, value: [6570] },
        };
        break;
      default:
    }

    const globalSqonContent = globalSqon.sqons[globalSqon.activeIndex].content;

    globalSqonContent.forEach(item => {
      if (item.content.field === field) {
        item.content.value = ageSqon.content.value;
        item.op = ageSqon.op;
      }
    });

    if (globalSqonContent.filter(item => isEqual(item, ageSqon)).length === 0) {
      globalSqonContent.push(ageSqon);
    }

    localStorage.setItem(COHORT_BUILDER_FILTER_STATE, JSON.stringify(globalSqon));
    this.props.setSqons(globalSqon.sqons);
  };

  render() {
    const { data, theme, isLoading: isParentLoading } = this.props;
    return (
      <CohortCard title="Age at Diagnosis" loading={isParentLoading}>
        <VerticalBar
          showCursor={true}
          data={data}
          indexBy="label"
          tooltipFormatter={ageAtDiagnosisTooltip}
          sortByValue={true}
          height={225}
          colors={[theme.chartColors.lightblue]}
          onClick={data => {
            this.addSqon('diagnoses.age_at_event_days', data.data.label);
          }}
        />
      </CohortCard>
    );
  }
}

export const ageDiagQuery = sqon => ({
  variables: { sqon },
  query: gql`
    # embeds additional filter on the provided sqon to create the ranges.
    # diagnoses.age_at_event_days values are indays, converted from year
    query($sqon: JSON) {
      participant {
        _0to1: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              { op: "<=", content: { field: "diagnoses.age_at_event_days", value: [364] } }
            ]
          }
        ) {
          total
        }
        _1to5: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [365, 1824] }
              }
            ]
          }
        ) {
          total
        }
        _5to10: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [1825, 3649] }
              }
            ]
          }
        ) {
          total
        }
        _10to15: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [3650, 5474] }
              }
            ]
          }
        ) {
          total
        }
        _15to18: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [5475, 6569] }
              }
            ]
          }
        ) {
          total
        }
        _18plus: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              { op: ">=", content: { field: "diagnoses.age_at_event_days", value: [6570] } }
            ]
          }
        ) {
          total
        }
      }
    }
  `,
  transform: ({ data }) => [
    { id: 'aggNewborn', label: 'Newborn', value: get(data, 'participant._0to1.total', 0) },
    { id: 'agg5to10', label: '1 - 5', value: get(data, 'participant._1to5.total', 0) },
    { id: 'agg5to10', label: '5 - 10', value: get(data, 'participant._5to10.total', 0) },
    { id: 'agg10to15', label: '10 - 15', value: get(data, 'participant._10to15.total', 0) },
    { id: 'agg15to18', label: '15 - 18', value: get(data, 'participant._15to18.total', 0) },
    { id: 'aggAdult', label: 'Adult', value: get(data, 'participant._18plus.total', 0) },
  ],
});

const mapDispatchToProps = {
  setSqons,
};

export default compose(
  withTheme,
  connect(
    null,
    mapDispatchToProps,
  ),
)(AgeDiagChart);
