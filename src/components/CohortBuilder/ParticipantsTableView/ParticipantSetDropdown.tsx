import React from 'react';
import { Button, Dropdown, Menu } from 'antd';

type Props = {
  onSave: Function;
};

const ParticipantSetDropdown = ({ onSave }: Props) => {
  const onClick = ({ key }: any) => {
    switch (key) {
      case 'save':
        onSave();
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
