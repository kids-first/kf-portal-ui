import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import gql from 'graphql-tag';
import { Badge } from 'antd';

import theme from 'theme/defaultTheme';
import { withApi } from 'services/api';
import QueriesResolver from '../../QueriesResolver';
import { getCohortBarColors } from '../ui';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { setSqonValueAtIndex, MERGE_OPERATOR_STRATEGIES } from 'common/sqonUtils';
import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';
import { antCardHeader } from './StudiesChart.module.css';
import { toKebabCase } from 'utils';
import PropTypes from 'prop-types';

const studiesToolTip = (data) => {
  const { familyMembers, probands, name } = data;
  const participants = familyMembers + probands;
  return (
    <div>
      <div>{name}</div>
      <div>{`${probands.toLocaleString()} Proband${probands !== 1 ? 's' : ''}`}</div>
      <div>{`${familyMembers.toLocaleString()} Other Participant${
        familyMembers > 1 ? 's' : ''
      }`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants !== 1 ? 's' : ''}`}</div>
    </div>
  );
};

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal - bTotal;
};

const studiesQuery = (sqon) => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        probands: aggregations(
          filters: {
            content: [$sqon, { content: { field: "is_proband", value: ["true"] }, op: "in" }]
            op: "and"
          }
        ) {
          study__short_name {
            buckets {
              key
              doc_count
            }
          }
        }
        familyMembers: aggregations(
          filters: {
            content: [
              $sqon
              { content: { field: "is_proband", value: ["false", "__missing__"] }, op: "in" }
            ]
            op: "and"
          }
        ) {
          study__short_name {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: (response) => {
    const participants = response.data.participant;

    const studyLabelToCounts = {};

    const probandsBuckets = participants.probands.study__short_name.buckets;
    probandsBuckets.forEach(
      (pB) => (studyLabelToCounts[pB.key] = { probands: pB.doc_count, familyMembers: 0 }),
    );

    const familyMembersBuckets = participants.familyMembers.study__short_name.buckets;
    familyMembersBuckets.forEach((fmB) => {
      const label = fmB.key;
      const labelAlreadyExists = !!studyLabelToCounts[label];
      const probandsCount = labelAlreadyExists ? studyLabelToCounts[label].probands : 0;

      studyLabelToCounts[label] = {
        familyMembers: fmB.doc_count,
        probands: probandsCount,
      };
    });

    return Object.entries(studyLabelToCounts).reduce((accumulator, [label, counts]) => {
      const { familyMembers, probands } = counts;
      return [...accumulator, { label, familyMembers, probands, id: toKebabCase(label) }];
    }, []);
  },
});

class StudiesChart extends React.Component {
  static propTypes = {
    api: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    sqon: PropTypes.object.isRequired,
    setSqons: PropTypes.func.isRequired,
    virtualStudy: PropTypes.object.isRequired,
  };

  addSqon = (value) => {
    const { virtualStudy, setSqons } = this.props;

    const newSqon = {
      op: 'in',
      content: {
        field: 'study.short_name',
        value: [value],
      },
    };

    const modifiedSqons = setSqonValueAtIndex(
      virtualStudy.sqons,
      virtualStudy.activeIndex,
      newSqon,
      { operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR },
    );
    setSqons(modifiedSqons);
  };

  render() {
    const { sqon, api, isLoading: isParentLoading } = this.props;

    return (
      <QueriesResolver name="GQL_STUDIES_CHART" api={api} queries={[studiesQuery(sqon)]}>
        {({ isLoading, data: rawData }) => {
          const data = rawData.flat();

          const Header = !(data && !isParentLoading) ? (
            <span>Studies</span>
          ) : (
            <div className={antCardHeader}>
              <span>Studies&nbsp;</span>
              <Badge style={{ backgroundColor: '#2b388f' }} count={data.length} />
            </div>
          );
          return (
            <Card title={Header} loading={isLoading}>
              {!data ? (
                <div>No data</div>
              ) : (
                <HorizontalBar
                  showCursor={true}
                  data={data}
                  indexBy="label"
                  keys={['probands', 'familyMembers']}
                  tooltipFormatter={studiesToolTip}
                  sortBy={sortDescParticipant}
                  tickInterval={4}
                  colors={getCohortBarColors(data, theme)}
                  xTickTextLength={28}
                  legends={[
                    { title: 'Probands', color: theme.chartColors.blue },
                    { title: 'Other Participants', color: theme.chartColors.purple },
                  ]}
                  padding={0.5}
                  onClick={({ data }) => {
                    this.addSqon(data.label);
                  }}
                />
              )}
            </Card>
          );
        }}
      </QueriesResolver>
    );
  }
}

const mapStateToProps = (state) => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default compose(withApi, connect(mapStateToProps, mapDispatchToProps))(StudiesChart);
