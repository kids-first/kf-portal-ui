import React from 'react';
import { connect } from 'react-redux';
import Card from '@ferlab/ui/core/view/GridCard';
import { Badge } from 'antd';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import { MERGE_OPERATOR_STRATEGIES, setSqonValueAtIndex } from 'common/sqonUtils';
import { studiesToolTip } from 'components/Charts';
import Empty, { SIZE } from 'components/UI/Empty';
import { setSqons } from 'store/actionCreators/virtualStudies';
import theme from 'theme/defaultTheme';
import { toKebabCase } from 'utils';

import { getCohortBarColors } from '../ui';

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal - bTotal;
};

export const studiesQuery = (sqon) => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        probands: aggregations(
          aggregations_filter_themselves: true
          filters: {
            content: [$sqon, { content: { field: "is_proband", value: ["true"] }, op: "in" }]
            op: "and"
          }
        ) {
          study__code {
            buckets {
              key
              doc_count
            }
          }
        }
        familyMembers: aggregations(
          aggregations_filter_themselves: true
          filters: {
            content: [
              $sqon
              { content: { field: "is_proband", value: ["false", "__missing__"] }, op: "in" }
            ]
            op: "and"
          }
        ) {
          study__code {
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

    const probandsBuckets = participants.probands.study__code.buckets;
    probandsBuckets.forEach(
      (pB) => (studyLabelToCounts[pB.key] = { probands: pB.doc_count, familyMembers: 0 }),
    );

    const familyMembersBuckets = participants.familyMembers.study__code.buckets;
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

export const allStudiesQuery = () => ({
  query: gql`
    query {
      studies {
        hits {
          edges {
            node {
              id
              code
              name
            }
          }
        }
      }
    }
  `,
  transform: (response) => (response.data.studies?.hits?.edges ?? []).map((n) => n.node),
});

class StudiesChart extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    sqon: PropTypes.object,
    setSqons: PropTypes.func.isRequired,
    virtualStudy: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    studies: PropTypes.array.isRequired,
  };

  addSqon = (value) => {
    const { virtualStudy, setSqons } = this.props;

    const newSqon = {
      op: 'in',
      content: {
        field: 'study.code',
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
    const { data: rawData, isLoading, studies } = this.props;

    const data = rawData.flat();
    const hasNoData = data.length === 0;
    return (
      <Card
        title={
          <span className={'title-summary-card'}>
            {'Studies '} {hasNoData > 0 ? <Badge count={data.length} /> : ''}
          </span>
        }
        loading={isLoading}
      >
        {hasNoData ? (
          <div className={'empty-graph'}>
            <Empty size={SIZE.SMALL} />
          </div>
        ) : (
          <HorizontalBar
            showCursor={true}
            data={data}
            tooltipDictionary={studies.map((s) => ({ label: s.code, tooltip: s.name }))}
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
  }
}

const mapStateToProps = (state) => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default connect(mapStateToProps, mapDispatchToProps)(StudiesChart);
