import React, { Component } from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Col, Icon, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';

const { Paragraph, Title } = Typography;

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
    const populatedList = filter ? mergedInterests.slice(0, 10) : mergedInterests;
    return (
      <div>
        <Title
          className={'member-info-title'}
          level={3}
          style={{ marginBottom: 0, paddingBottom: 16 }}
        >
          Research Interests:
        </Title>
        <Paragraph
          className={'interest-container flex'}
          style={{ color: 'inherit', marginBottom: 0 }}
        >
          {populatedList.map((item, index) => (
            <Row
              key={index}
              className={'flex'}
              style={{
                paddingRight: 11,
              }}
            >
              <Col>
                <Icon
                  className={'icon-color'}
                  type="check-circle"
                  theme="filled"
                  style={{ paddingRight: 8 }}
                />
              </Col>
              <Col>
                <FormatLabel
                  value={item.original}
                  highLightValues={item.highlighted ? [item.highlighted] : null}
                  key={index}
                  index={index}
                />
              </Col>
            </Row>
          ))}
          {mergedInterests.length > 10 ? (
            <button
              style={{ margin: 0 }}
              type="link"
              className="ant-typography-expand"
              aria-label="Expand"
              onClick={this.onClick}
            >
              {filter ? (
                <div className={'flex'}>
                  <div style={{ paddingRight: 8 }}>Expand</div>
                  <Icon type="plus-circle" />
                </div>
              ) : (
                <div className={'flex'}>
                  <div style={{ paddingRight: 8 }}>Close</div>
                  <Icon type="minus-circle" />
                </div>
              )}
            </button>
          ) : (
            ''
          )}
        </Paragraph>
      </div>
    );
  }
}

export default MemberInterests;
