import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Divider, Card, Button, Typography } from 'antd';

const { Title, Text } = Typography;

const generateRows = data => {
  const dataSize = Object.keys(data).length;
  const lastIndex = dataSize - 1;
  return Object.entries(data).map(([key, val], index) => {
    const isNotLast = index !== lastIndex;
    return (
      <React.Fragment key={index}>
        <Row>
          <Col span={12}>{key}</Col>
          <Col span={12}>{val || 'Edit Card to Add Details'}</Col>
          {isNotLast && <Divider />}
        </Row>
      </React.Fragment>
    );
  });
};

const generateFindMeOn = () => {
  if (true) {
    return (
      <Text>
        {` Click Edit to add links to your personal channels such as Google Scholar, ORCID ID, GitHub, LinkedIn, Twitter and Facebook.`}
      </Text>
    );
  }

  return (
    <Fragment>
      <Row>
        <Title>h1. Ant Design</Title>
      </Row>
      <Row>
        <div>cossins</div>
      </Row>
    </Fragment>
  );
};

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb } = props;
  return (
    <Card
      title="Contact Information"
      extra={
        canEdit ? (
          <Button type="primary" icon="edit" shape="round" onClick={onClickEditCb}>
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={16}>{generateRows(data)}</Col>
        <Col span={8}>{generateFindMeOn()}</Col>
      </Row>
    </Card>
  );
};

ContactReadOnly.propTypes = {
  data: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onClickEditCb: PropTypes.func.isRequired,
};

export default ContactReadOnly;
