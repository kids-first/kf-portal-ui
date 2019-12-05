import React from 'react';
import PropTypes from 'prop-types';
import { Col, Icon, Row, Typography } from 'antd';
import chunk from 'lodash/chunk';
import { toKebabCase } from 'utils';
import './style.css';

const { Text } = Typography;

const CHUNK_SIZE = 2;

const ResearchInterest = ({ interests }) => {
  const chunks = chunk(interests, CHUNK_SIZE);
  return chunks.map((chunk, index) => {
    const [interestLeft, interestRight] = chunk;
    return (
      <Row key={toKebabCase(`${index}${interestLeft} ${interestRight}`)} className={'ri-row'}>
        <Col span={12}>
          <Text>
            <Icon type="check-circle" theme="filled" className={'ri-icon'} />
            {interestLeft}
          </Text>
        </Col>
        <Col span={12}>
          {Boolean(interestRight) && (
            <Text>
              <Icon type="check-circle" theme="filled" className={'ri-icon'} />
              {interestRight}
            </Text>
          )}
        </Col>
      </Row>
    );
  });
};

ResearchInterest.propTypes = {
  interests: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ResearchInterest;
