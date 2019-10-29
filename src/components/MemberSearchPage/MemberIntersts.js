import React, { Component } from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Icon, Typography } from 'antd';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';

const { Paragraph } = Typography;

const regex = /<\/?em>/gi;

const compare = (a, b) => {
  if (a.highlighted && !b.highlighted) return 1;
  if (!a.highlighted && b.highlighted) return -1;
  return 0;
};

class MemberInterests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: true,
    };
    autobind(this);
  }

  static propTypes = {
    interests: PropTypes.array.isRequired,
    highlights: PropTypes.array.isRequired,
  };

  onClick() {
    this.setState(prevState => ({
      filter: !prevState.filter,
    }));
  }

  testIfHighlighted(originalInterest) {
    const { highlights } = this.props;
    const matched = highlights.find(hl => {
      return hl.replace(regex, '') === originalInterest;
    });
    return matched || null;
  }

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
              index={index}
              classname={'comma'}
            />
          ))}
          {this.state.filter && mergedInterests.length > 3 ? (
            <Icon className="ant-typography-expand" type="plus" onClick={this.onClick} />
          ) : (
            ''
          )}
        </Paragraph>
      </div>
    );
  }
}

export default MemberInterests;
