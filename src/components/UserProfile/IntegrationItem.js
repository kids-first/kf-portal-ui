import { Card, Col, Row, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import IntegrationItemErrorRow from './IntegrationItemErrorRow';
import { compose, setPropTypes } from 'recompose';
import { withRouter } from 'react-router';
import './style.css';

const { Paragraph } = Typography;

const hasAtLeastOneError = (...potentialErrors) => {
  return potentialErrors.some(e => Boolean(e));
};

const generateLabelForConnect = isLoading => {
  return isLoading ? 'Connecting' : 'Connect';
};

const IntegrationItem = props => {
  const {
    logo,
    loading,
    description,
    errorConnect,
    errorDisconnect,
    onClickConnectCb,
    onClickDisconnectCb,
    onClickResetErrorsCb,
    history,
    connected,
    actionButtonWhenConnected,
  } = props;
  const { onClick, label, icon } = actionButtonWhenConnected;
  return (
    <Card className={'ii-card'}>
      {hasAtLeastOneError(errorConnect, errorDisconnect) ? (
        <IntegrationItemErrorRow
          errorConnect={errorConnect}
          errorDisconnect={errorDisconnect}
          onClickConnectCb={onClickConnectCb}
          onClickDisconnectCb={onClickDisconnectCb}
          onClickResetErrorsCb={onClickResetErrorsCb}
          history={history}
        />
      ) : (
        <Fragment>
          <Row>
            <Col span={12}>{logo}</Col>
          </Row>
          <Row className={'ii-description-row'}>
            <Paragraph>{description}</Paragraph>
          </Row>
          <Row>
            <Col span={12}>
              <Button
                shape="round"
                loading={loading}
                className={'ii-button'}
                onClick={connected ? onClickDisconnectCb : onClickConnectCb}
                icon={connected ? 'disconnect' : 'api'}
              >
                {connected ? 'Disconnect' : generateLabelForConnect(loading)}
              </Button>
            </Col>
            {connected && (
              <Col span={12}>
                <Button shape="round" className={'ii-button'} onClick={onClick} icon={icon}>
                  {label}
                </Button>
              </Col>
            )}
          </Row>
        </Fragment>
      )}
    </Card>
  );
};

const Enhanced = compose(
  withRouter,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    connected: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    actionButtonWhenConnected: PropTypes.shape({
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
    onClickDisconnectCb: PropTypes.func.isRequired,
    onClickConnectCb: PropTypes.func.isRequired,
    errorConnect: PropTypes.object,
    errorDisconnect: PropTypes.object,
    history: PropTypes.object.isRequired,
    onClickResetErrorsCb: PropTypes.func.isRequired,
  }),
)(IntegrationItem);

export default Enhanced;
