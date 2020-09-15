/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import {
  DownOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import { Sqon } from 'store/sqon';
import { UserSet } from 'store/saveSetTypes';
import './ParticipantSetDropdown.css';

type Props = {
  onSave: Function;
  onAddToSet: Function;
  onDeleteToSet: Function;
  sqon: Sqon;
  userSets: UserSet[];
};

const ParticipantSetDropdown = (props: Props) => {
  const onClick: MenuClickEventHandler = (e) => {
    const key = e.key;
    switch (key) {
      case 'save':
        onSave();
        break;
      case 'add':
        onAddToSet();
        break;
      case 'delete':
        onDeleteToSet();
        break;
      default:
        break;
    }
  };

  const { onSave, onAddToSet, onDeleteToSet, sqon, userSets } = props;
  const [isEditDisabled, setIsEditDisabled] = useState(true);

  useEffect(() => {
    if (userSets && sqon) {
      setIsEditDisabled(!(userSets.length > 0 && sqon.content.length > 0));
    }
  }, [userSets, sqon]);

  const menu = () => (
    <Menu onClick={onClick}>
      <Menu.Item key="save" icon={<PlusOutlined />}>
        Save as new set
      </Menu.Item>
      <Menu.Item key="add" icon={<UsergroupAddOutlined />} disabled={isEditDisabled}>
        Add to existing set
      </Menu.Item>
      <Menu.Item key="delete" icon={<UsergroupDeleteOutlined />} disabled={isEditDisabled}>
        Remove from existing set
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu()}
      placement="bottomLeft"
      trigger={['click']}
      getPopupContainer={() => document.getElementById('dropdown-container') as HTMLElement}
    >
      <Button className={'save-set-btn'} onClick={(e) => e.preventDefault()}>
        Save participants set
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default ParticipantSetDropdown;
