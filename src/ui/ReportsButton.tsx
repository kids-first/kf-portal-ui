/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Menu, Dropdown, notification } from 'antd';
import { Sqon } from '../types';
import { ClickParam } from 'antd/lib/menu';

type Props = {
  sqon: Sqon;
  action: (name: string, sqon: Sqon) => Promise<any>;
  generatorMenuItems: Function;
  className?: string;
};

function identity<T>(arg: T): T {
  return arg;
}

const ButtonDownloadReports: FunctionComponent<Props> = ({
  sqon,
  generatorMenuItems,
  action,
  className = '',
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDisabled, setDisable] = useState<boolean>(false);

  const handleClick = async (e: ClickParam) => {
    const reportName = e.key;

    setLoading(true);
    setDisable(true);

    try {
      await action(reportName, sqon);
      setDisable(false);
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'An error occurred. The table can not be exported. Please try again.',
        duration: null,
        onClose: () => setDisable(false),
      });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = generatorMenuItems();
  const menu = <Menu onClick={handleClick}>{menuItems.map(identity)}</Menu>;
  return (
    <Dropdown overlay={menu} disabled={isDisabled}>
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

export default ButtonDownloadReports;
