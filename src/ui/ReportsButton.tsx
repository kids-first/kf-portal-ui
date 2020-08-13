/* eslint-disable react/prop-types */
import React, { FunctionComponent, useEffect } from 'react';
import { Button, Dropdown, Menu, message as antdMessage, notification } from 'antd';
import { Sqon } from 'store/sqon';
import { RootState } from 'store/rootState';
import { connect, ConnectedProps } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { DispatchReport, ReportConfig } from 'store/reportTypes';
import { reInitializeState, fetchReportIfNeeded } from 'store/actionCreators/report';
import { MessageType as AntdMessageType } from 'antd/lib/message';
import {
  selectIsReportLoading,
  selectReportError,
  selectReportMessage,
} from 'store/selectors/report';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

function identity<T>(arg: T): T {
  return arg;
}

type OwnProps = {
  sqon: Sqon;
  generatorMenuItems: Function;
  className?: string;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const mapState = (state: RootState) => ({
  isLoading: selectIsReportLoading(state),
  message: selectReportMessage(state),
  error: selectReportError(state),
});

const mapDispatch = (dispatch: DispatchReport) => ({
  fetchReportIfNeeded: (params: ReportConfig) => dispatch(fetchReportIfNeeded(params)),
  reInitializeState: () => dispatch(reInitializeState()),
});

const DownloadButton: FunctionComponent<Props> = (props) => {
  const {
    isLoading,
    sqon,
    fetchReportIfNeeded,
    error,
    message,
    reInitializeState,
    generatorMenuItems,
    className = '',
  } = props;

  const handleClick: MenuClickEventHandler = async (e) => {
    const reportName = e.key as string;
    await fetchReportIfNeeded({ sqon, name: reportName });
  };

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred. The table can not be exported. Please try again.',
        duration: null,
        onClose: () => reInitializeState(),
      });
    }
  }, [error, reInitializeState]);

  useEffect(() => {
    let hideWhenDurationUnknown: AntdMessageType | null;
    if (message) {
      if (message.duration > 0) {
        antdMessage[message.type](message.content, message.duration);
      } else {
        hideWhenDurationUnknown = antdMessage[message.type](message.content, message.duration);
      }
    }
    return () => {
      hideWhenDurationUnknown && hideWhenDurationUnknown();
    };
  }, [message]);

  const menuItems = generatorMenuItems();

  return (
    <Dropdown
      // @ts-ignore
      overlay={<Menu onClick={handleClick}>{menuItems.map(identity)}</Menu>}
      disabled={error !== null}
    >
      <Button
        type={'primary'}
        loading={isLoading}
        icon={<DownloadOutlined />}
        className={className}
      >
        Download
      </Button>
    </Dropdown>
  );
};

const connector = connect(mapState, mapDispatch);

const Connected = connector(DownloadButton);

export default Connected;
