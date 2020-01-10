import { Button, Row, Typography } from 'antd';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ROUTES from 'common/routes';
import './style.css';

const { Text } = Typography;

const generateDataForError = ({
  errorConnect,
  errorDisconnect,
  onClickConnectCb,
  onClickDisconnectCb,
  history,
}) => {
  if (errorConnect) {
    return {
      buttonLabel: 'Try again to connect',
      onClick: onClickConnectCb,
      errorMsg: errorConnect.msg || 'Unknown Error',
    };
  } else if (errorDisconnect) {
    return {
      buttonLabel: 'Try again to disconnect',
      onClick: onClickDisconnectCb,
      errorMsg: errorDisconnect.msg || 'Unknown Error',
    };
  }
  // must never pass here, but better safe than sorry.
  return {
    buttonLabel: 'Go to dashboard',
    onClick: () => history.push(ROUTES.dashboard),
    errorMsg: 'Unknown Error',
  };
};

const IntegrationItemErrorRow = props => {
  const {
    errorConnect,
    errorDisconnect,
    onClickConnectCb,
    onClickDisconnectCb,
    onClickResetErrorsCb,
    history,
  } = props;

  const { buttonLabel, onClick, errorMsg } = generateDataForError({
    errorConnect,
    errorDisconnect,
    onClickConnectCb,
    onClickDisconnectCb,
    history,
  });
  return (
    <Fragment>
      <Row type={'flex'} align={'middle'} justify={'center'}>
        <Text type="danger">The following error occurred : {errorMsg}</Text>
      </Row>
      <Row type={'flex'} align={'middle'} justify={'center'}>
        <Button shape="round" onClick={onClick} key={'errorButton'} className={'ii-error-button'}>
          {buttonLabel}
        </Button>
        <Button
          shape="round"
          key="abort"
          onClick={onClickResetErrorsCb}
          className={'ii-error-button'}
        >
          Abort
        </Button>
      </Row>
    </Fragment>
  );
};

IntegrationItemErrorRow.propTypes = {
  onClickDisconnectCb: PropTypes.func.isRequired,
  onClickConnectCb: PropTypes.func.isRequired,
  errorConnect: PropTypes.object,
  errorDisconnect: PropTypes.object,
  history: PropTypes.object.isRequired,
  onClickResetErrorsCb: PropTypes.func.isRequired,
};

export default IntegrationItemErrorRow;
