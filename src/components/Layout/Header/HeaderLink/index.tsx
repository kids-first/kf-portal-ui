import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import cx from 'classnames';

import style from 'components/Layout/Header/HeaderLink/index.module.css';

interface OwnProps {
  className?: string;
  to: string | string[];
  title: string;
  currentPathName: string;
  icon?: React.ReactElement;
}

const isActive = (current: string, to: string | string[]) =>
  to instanceof Array ? to.includes(current) : current === to;

const HeaderLink = ({ className = '', to, currentPathName, icon, title, ...props }: OwnProps) => (
  <Link className={style.headerLink} to={to instanceof Array ? to[0] : to} {...props}>
    <Button
      className={cx(className, style.headerBtn, isActive(currentPathName, to) ? style.active : '')}
      icon={icon}
    >
      {title}
    </Button>
  </Link>
);

export default HeaderLink;
