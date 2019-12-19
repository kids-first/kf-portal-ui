import { Card, Row, Typography, Button } from 'antd';
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

const generateLabelForConnect = ({ loading, connected }) => {
  if (loading) {
    return 'Connecting';
  } else if (connected) {
    return 'Disconnect';
  }
  return 'Connect';
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
          <Row>{logo}</Row>
          <Row className={'ii-description-row'}>
            <Paragraph>{description}</Paragraph>
          </Row>
          <Row type={'flex'} justify={'space-between'}>
            <Button
              shape="round"
              loading={loading}
              type={connected && !loading ? 'danger' : 'primary'}
              onClick={connected ? onClickDisconnectCb : onClickConnectCb}
              icon={connected ? 'disconnect' : 'api'}
            >
              {generateLabelForConnect({ loading, connected })}
            </Button>
            {connected && (
              <Button shape="round" className={'ii-button'} onClick={onClick} icon={icon}>
                {label}
              </Button>
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
