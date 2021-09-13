import React from 'react';
import { ApiOutlined, BookOutlined, DisconnectOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type OwnProps = {
  isLoading: boolean;
  hasConnectError: boolean;
  isConnected: boolean;
  onClickConnectButton: () => void;
  onClickViewStudiesButton: () => void;
};

const FenceActionButtons = (props: OwnProps) => {
  const {
    isLoading,
    hasConnectError,
    isConnected,
    onClickConnectButton,
    onClickViewStudiesButton,
  } = props;

  return (
    <div className={'ii-button-container'}>
      <Button
        size={'small'}
        shape="round"
        className={'ii-button-common ii-connect-button'}
        loading={isLoading}
        disabled={isLoading || hasConnectError}
        danger={isConnected && !isLoading}
        type={'primary'}
        onClick={onClickConnectButton}
        icon={isConnected ? <DisconnectOutlined /> : <ApiOutlined />}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>
      {isConnected && (
        <Button
          shape="round"
          className={'ii-button-common ii-button-action'}
          onClick={onClickViewStudiesButton}
          icon={<BookOutlined />}
          size={'small'}
        >
          View Studies
        </Button>
      )}
    </div>
  );
};

export default FenceActionButtons;
