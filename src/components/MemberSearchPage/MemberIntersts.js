import React, { Component } from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Typography, Button } from 'antd';
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
    const { interests } = this.props;
    return interests
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
    const { filter } = this.state;
    const mergedInterests = this.getMergedInterests();
    const populatedList = filter ? mergedInterests.slice(0, 3) : mergedInterests;
    return (
      <div>
        {/*TODO remove style with Ant Design theme*/}
        <Paragraph className={'interest-container'} style={{ color: 'inherit' }}>
          <div style={{ fontStyle: 'italic' }}>Research Interests: &nbsp; </div>
          {populatedList.map((item, index) => (
            <FormatLabel
              value={item.original}
              highLightValues={item.highlighted ? [item.highlighted] : null}
              key={index}
              index={index}
              classname={'comma'}
            />
          ))}
          {mergedInterests.length > 3 ? (
            <Button
              style={{ margin: 0 }}
              type="link"
              className="ant-typography-expand"
              aria-label="Expand"
              onClick={this.onClick}
            >
              {filter ? 'Expand' : 'Close'}
            </Button>
          ) : (
            ''
          )}
        </Paragraph>
      </div>
    );
  }
}

export default MemberInterests;
