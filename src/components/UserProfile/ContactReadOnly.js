import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Row, Typography } from 'antd';
import FindMeReadOnly from './FindMeReadOnly';
import ContactInformationReadOnly from './ContactInformationReadOnly';

const { Title } = Typography;

const ContactReadOnly = props => {
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
          Contact Information
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
            style={{ color: 'white', backgroundColor: '#90278e' }}
            icon="edit"
            shape="round"
            onClick={onClickEditCb}
          >
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={14} style={{ paddingRight: '72px' }}>
          <ContactInformationReadOnly data={data} />
        </Col>
        <Col
          span={10}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FindMeReadOnly findMe={data.findMe} />
        </Col>
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
