import React from 'react';
import { Button } from 'antd';
import cx from 'classnames';

import style from './index.module.css';

interface OwnProps {
  className?: string;
  icon?: React.ReactElement;
  isActive?: boolean;
  onClick?: () => void;
  title: string;
}

const HeaderButton = ({
  className = '',
  icon,
  isActive = false,
  onClick,
  title,
  ...props
}: OwnProps) => (
  <Button
    className={cx(className, style.headerBtn, isActive ? style.active : '')}
    onClick={(event) => {
      event.currentTarget.blur();
      onClick && onClick();
    }}
    icon={icon}
    {...props}
  >
    {title}
  </Button>
);

export default HeaderButton;
