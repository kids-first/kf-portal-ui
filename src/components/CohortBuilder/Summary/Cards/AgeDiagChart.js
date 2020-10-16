import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import gql from 'graphql-tag';

import theme from 'theme/defaultTheme';
import VerticalBar from 'chartkit/components/VerticalBar';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { setSqonValueAtIndex } from 'common/sqonUtils';

import PropTypes from 'prop-types';

import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';

const ageAtDiagnosisTooltip = (data) =>
  `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;

class AgeDiagChart extends React.Component {
  static propTypes = {
    setSqons: PropTypes.func.isRequired,
    virtualStudy: PropTypes.object,
    height: PropTypes.number,
    isLoading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.object),
  };

  addSqon = (field, value) => {
    const { virtualStudy, setSqons } = this.props;

    let newSqon = {};
    switch (value) {
      case 'aggNewborn':
        newSqon = {
          op: '<=',
          content: { field, value: [364] },
        };
        break;
      case 'agg1to5':
        newSqon = {
          op: 'between',
          content: { field, value: [365, 1824] },
        };
        break;
      case 'agg5to10':
        newSqon = {
          op: 'between',
          content: { field, value: [1825, 3649] },
        };
        break;
      case 'agg10to15':
        newSqon = {
          op: 'between',
          content: { field, value: [3650, 5474] },
        };
        break;
      case 'agg15to18':
        newSqon = {
          op: 'between',
          content: { field, value: [5475, 6569] },
        };
        break;
      case 'aggAdult':
        newSqon = {
          op: '>=',
          content: { field, value: [6570] },
        };
        break;
      default:
    }

    const modifiedSqons = setSqonValueAtIndex(
      virtualStudy.sqons,
      virtualStudy.activeIndex,
      newSqon,
    );
    setSqons(modifiedSqons);
  };

  render() {
    const { data, isLoading: isParentLoading, height = 225 } = this.props;
    return (
      <Card title="Age at Diagnosis" loading={isParentLoading}>
        <VerticalBar
          showCursor={true}
          data={data}
          sortBy={false}
          indexBy="label"
          axisBottomLegend="Age at Diagnosis (years)"
          tooltipFormatter={ageAtDiagnosisTooltip}
          height={height}
          colors={[theme.chartColors.lightblue]}
          onClick={(data) => {
            this.addSqon('diagnoses.age_at_event_days', data.data.id);
          }}
        />
      </Card>
    );
  }
}

export const ageDiagQuery = (sqon) => ({
  variables: { sqon },
  query: gql`
    # embeds additional filter on the provided sqon to create the ranges.
    # diagnoses.age_at_event_days values are in days, converted from year
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
    { id: 'agg1to5', label: '[1, 5)', value: get(data, 'participant._1to5.total', 0) },
    { id: 'agg5to10', label: '[5, 10)', value: get(data, 'participant._5to10.total', 0) },
    { id: 'agg10to15', label: '[10, 15)', value: get(data, 'participant._10to15.total', 0) },
    { id: 'agg15to18', label: '[15, 18)', value: get(data, 'participant._15to18.total', 0) },
    { id: 'aggAdult', label: 'Adult', value: get(data, 'participant._18plus.total', 0) },
  ],
});

const mapStateToProps = (state) => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default connect(mapStateToProps, mapDispatchToProps)(AgeDiagChart);
