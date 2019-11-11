import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import ResearchInterest from './ResearchInterests_new';

const { Title, Text } = Typography;
//FIXME : make custom styles global.
const ProfileReadOnly = props => {
  const { data, canEdit, onClickEditCb } = props;
  return (
    <Card
      title={
        <Title
          level={3}
          style={{
            color: 'rgb(43, 56, 143)',
          }}
        >
          Profile
        </Title>
      }
      style={{
        width: '1000px',
        borderRadius: '10px',
      }}
      headStyle={{
        color: 'rgb(43, 56, 143)',
        backgroundColor: 'rgb(237,238,241)',
        paddingBottom: '14px',
        paddingTop: '14px',
        paddingLeft: '32px',
        paddingRight: '32px',
      }}
      bodyStyle={{
        padding: '32px',
      }}
      extra={
        canEdit ? (
          <Button
            icon="edit"
            shape="round"
            style={{ color: 'white', backgroundColor: '#90278e' }}
            onClick={onClickEditCb}
          >
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={24}>
          <Title
            level={4}
            style={{
              color: 'rgb(43, 56, 143)',
            }}
          >
            My Bio
          </Title>
          <Text style={{ fontStyle: 'italic', paddingBottom: '24px' }}>{data.bio}</Text>
          <Divider style={{ marginBottom: '24px' }} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title
            level={4}
            style={{
              color: 'rgb(43, 56, 143)',
            }}
          >
            My Story
          </Title>
          <Text style={{ fontStyle: 'italic', paddingBottom: '24px' }}>{data.story}</Text>
          <Divider style={{ marginBottom: '24px' }} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title
            level={4}
            style={{
              color: 'rgb(43, 56, 143)',
            }}
          >
            Research Interests
          </Title>
          {Array.isArray(data.interests) && data.interests.length > 0 ? (
            <ResearchInterest interests={data.interests} />
          ) : (
            <Text style={{ fontStyle: 'italic' }}>{'click edit to add interests '}</Text>
          )}
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
