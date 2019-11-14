import { Card, Col, Row, Typography, Button, Switch } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const { Paragraph } = Typography;

const generateLabelForConnect = (isLoading) => {
    return isLoading ? 'Connecting' : 'Connect'
};

const IntegrationItem = props => {
  const {
    logo,
    description,
    connected,
    onClickConnectCb,
    onClickAuthorizedStudiesCb,
    onClickDisconnectCb,
      loading,
  } = props;

  return (
    <Card>
      <Row>
        <Col span={12}>{logo}</Col>
      </Row>
      <Row>
        <Paragraph>{description}</Paragraph>
      </Row>
      <Row>
        <Col span={12}>
          <Button
            icon="edit"
            shape="round"
            loading={loading}
            style={{ color: 'white', backgroundColor: '#90278e' }}
            onClick={connected ? onClickConnectCb : onClickDisconnectCb}
          >
            {connected ? 'Disconnect' : generateLabelForConnect(loading)}
          </Button>
        </Col>
        {connected && (
          <Col span={12}>
            <Button
              icon="edit"
              shape="round"
              style={{ color: 'white', backgroundColor: '#90278e' }}
              onClick={onClickAuthorizedStudiesCb}
            >
              {'Authorized studies'}
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
};

IntegrationItem.propTypes = {
  logo: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  connected: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  onClickAuthorizedStudiesCb: PropTypes.func.isRequired,
  onClickDisconnectCb: PropTypes.func.isRequired,
  onClickConnectCb: PropTypes.func.isRequired,
};

export default IntegrationItem;
