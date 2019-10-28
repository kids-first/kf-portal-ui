import { Button, Col, Divider, Icon, Row, Tooltip, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const UserProfilePageBox = props => {
  return (
    <Col
      span={24}
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        padding: 15,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        marginBottom: 5,
      }}
    >
      <Row type="flex" justify="space-around" align="middle">
        <Col span={20}>
          <Title level={2}>{props.title}</Title>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          {props.canEdit &&
            (props.isEditingBackgroundInfo ? (
              <Row style={{ display: 'inline-flex' }}>
                <Button
                  type="primary"
                  shape="round"
                  icon="save"
                  size={'small'}
                  onClick={props.onSave}
                >
                  Save
                </Button>
                <Button
                  type="default"
                  shape="round"
                  icon="close"
                  size={'small'}
                  onClick={props.onCancel}
                >
                  Cancel
                </Button>
              </Row>
            ) : (
              <Tooltip placement="topLeft" title={'Edit'}>
                <Icon
                  type="edit"
                  theme="twoTone"
                  style={{ fontSize: 25, paddingRight: 50 }}
                  onClick={props.onEditClick}
                />
              </Tooltip>
            ))}
        </Col>
      </Row>
      <Divider />
      <Row>{props.children}</Row>
    </Col>
  );
};

export default UserProfilePageBox;
