import React, { Component } from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Typography } from 'antd';
import { bind } from '../../utils';
import PropTypes from 'prop-types';

const { Paragraph } = Typography;

const regex = /<\/?em>/gi;

const compare = (a, b) => {
  if (a.highlighted && !b.highlighted) return 1;
  if (!a.highlighted && b.highlighted) return -1;
  return 0;
};

class MemberInterests extends Component {
  state = {
    filter: true,
  };

  static propTypes = {
    interests: PropTypes.array.isRequired,
    highlights: PropTypes.array.isRequired,
  };

  @bind
  onClick() {
    this.setState(prevState => ({
      filter: !prevState.filter,
    }));
  }

  @bind
  testIfHighlighted(originalInterest) {
    const { highlights } = this.props;
    const matched = highlights.find(hl => {
      return hl.replace(regex, '') === originalInterest;
    });
    return matched || null;
  }

  @bind
  getMergedInterests() {
    return this.props.interests
      .reduce((accumulator, currentInterest) => {
        const testResult = this.testIfHighlighted(currentInterest);
        return [
          ...accumulator,
          {
            original: currentInterest,
            highlighted: testResult,
          },
        ];
      }, [])
      .sort(compare)
      .reverse();
  }

  render() {
    const mergedInterests = this.getMergedInterests();
    const populatedList = this.state.filter ? mergedInterests.slice(0, 3) : mergedInterests;
    return (
      <div>
        <Paragraph className={'interest-container'}>
          <div>Research Interests: &nbsp; </div>
          {populatedList.map((item, index) => (
            <FormatLabel
              value={item.original}
              highLightValues={item.highlighted ? [item.highlighted] : null}
              key={index}
              classname={'comma'}
            />
          ))}
        </Paragraph>
        {mergedInterests.length > 3 ? (
          <div
            style={{ margin: 0 }}
            className="ant-typography-expand"
            aria-label="Expand"
            onClick={this.onClick}
          >
            {this.state.filter ? 'Expand' : 'Close'}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default MemberInterests;
