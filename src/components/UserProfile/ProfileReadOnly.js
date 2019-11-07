import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Divider, Card, Button, Typography, Icon } from 'antd';
import chunk from 'lodash/chunk';
import { toKebabCase } from 'utils';

const { Title } = Typography;

const generateInterests = interests => {
  const CHUNK_SIZE = 2;
  const chunks = chunk(interests, CHUNK_SIZE);
  return chunks.map((chunk, index) => {
    const [interestLeft, interestRight] = chunk;
    return (
      <Row key={toKebabCase(`${index}${interestLeft} ${interestRight}`)}>
        <Col span={12}>
          <span>
            <Icon type="check-circle" style={{ paddingRight: '5px' }} />
            {interestLeft}
          </span>
        </Col>
        <Col span={12}>
          {Boolean(interestRight) && (
            <span>
              <Icon type="check-circle" style={{ paddingRight: '5px' }} />
              {interestRight}
            </span>
          )}
        </Col>
      </Row>
    );
  });
};

const ProfileReadOnly = props => {
  const { data, canEdit, onClickEditCb } = props;
  const { interests = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] } = data; //TODO
  return (
    <Card
      title="Profile"
      extra={
        canEdit ? (
          <Button type="primary" icon="edit" shape="round" onClick={onClickEditCb}>
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={24}>
          <Title level={2}>My Bio</Title>
          <p>
            Lorem ipsum dolor super head lock amet, consectetur adipiscing bionic catapult into the
            Spanish announce table. Nullam dignissim frog splash leg sweep dui, et luctus mauris
            suscipit a. crossbody STO aptent taciti sociosqu ad atomic STF torquent per conubia
            nostra, per gutwrench hip toss himenaeos.
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={2}>My Story</Title>
          <p>
            Lorem ipsum dolor super head lock amet, consectetur adipiscing bionic catapult into the
            Spanish announce table. Nullam dignissim frog splash leg sweep dui, et luctus mauris
            suscipit a. crossbody STO aptent taciti sociosqu ad atomic STF torquent per conubia
            nostra, per gutwrench hip toss himenaeos.
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={2}>Research Interests</Title>
          {Array.isArray(interests) && interests.length > 0
            ? generateInterests(interests)
            : 'vulputate neque gutwrench figure-four pellentesque lorem. '}
        </Col>
      </Row>
    </Card>
  );
};

ProfileReadOnly.propTypes = {
  data: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onClickEditCb: PropTypes.func.isRequired,
};

export default ProfileReadOnly;
