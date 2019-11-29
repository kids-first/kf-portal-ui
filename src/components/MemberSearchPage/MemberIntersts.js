import React, { Component } from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Col, Icon, Row, Typography } from 'antd';
import { bind } from '../../utils';
import PropTypes from 'prop-types';

const { Paragraph, Title } = Typography;

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
        <Title level={3} style={{ paddingBottom: 16, marginBottom: 0 }}>
          Research Interests:
        </Title>
        <Paragraph
          className={'interest-container'}
          style={{ display: 'flex', alignItems: 'center', color: 'inherit', marginBottom: 0  }}
        >
          {populatedList.map((item, index) => (
            <Row
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: 11,
              }}
            >
              <Col>
                <Icon
                  type="check-circle"
                  theme="filled"
                  style={{ paddingRight: 8, color: 'rgba(57, 69, 146, 0.5)' }}
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
            <a
              style={{ margin: 0 }}
              className="ant-typography-expand"
              aria-label="Expand"
              onClick={this.onClick}
            >
              {filter ? 'Expand' : 'Close'}
            </a>
          ) : (
            ''
          )}
        </Paragraph>
      </div>
    );
  }
}

export default MemberInterests;
