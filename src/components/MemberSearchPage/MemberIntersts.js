import React, { Component } from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const regex = /<\/?em>/gi;

class MemberInterests extends Component {
  state = {
    filter: true,
  };

  compare = (a, b) => {
    if (a.highlighted && !b.highlighted) return 1;
    if (!a.highlighted && b.highlighted) return -1;
    return 0;
  };

  onClick = () => {
    this.setState(prevState => ({
      filter: !prevState.filter,
    }));
  };

  render() {
    const INTERESTS = this.props.interests;

    const HIGHLIGHTS = this.props.highligthts ? this.props.highligthts : [];

    const testIfHighlighted = originalInterest => {
      const matched = HIGHLIGHTS.find(hl => {
        return hl.replace(regex, '') === originalInterest;
      });
      return matched || null;
    };

    const reducer = (accumulator, currentInterest) => {
      const testResult = testIfHighlighted(currentInterest);
      return [
        ...accumulator,
        {
          original: currentInterest,
          highlighted: testResult,
        },
      ];
    };

    const merged = INTERESTS.reduce(reducer, [])
      .sort(this.compare)
      .reverse();

    const populatedList = this.state.filter ? merged.slice(0, 3) : merged;

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
        {merged.length > 3 ? (
          <div style={{margin:0}} className="ant-typography-expand" aria-label="Expand" onClick={this.onClick}>
            {this.state.filter ? "Expand" : "Close"}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default MemberInterests;
