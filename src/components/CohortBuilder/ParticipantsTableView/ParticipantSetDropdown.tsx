import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

type Props = {
  onSave: Function;
};

const ParticipantSetDropdown = ({ onSave }: Props) => {
  const onClick: MenuClickEventHandler = (e) => {
    const key = e.key;
    switch (key) {
      case 'save':
        onSave();
        break;
      default:
        break;
    }
  };

  const menu = () => (
    <Menu onClick={onClick}>
      <Menu.Item key="save">Save as new Participants set</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu()} placement="bottomLeft" trigger={['click']}>
      <Button className={'save-set-btn'} onClick={(e) => e.preventDefault()}>
        Save participants set
      </Button>
    </Dropdown>
  );
};

export default ParticipantSetDropdown;
