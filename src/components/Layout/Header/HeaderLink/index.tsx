import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { getFTEnvVarByKey } from 'helpers/EnvVariables';

import style from 'components/Layout/Header/HeaderLink/index.module.scss';

interface OwnProps {
  className?: string;
  to: string | string[];
  title: string;
  currentPathName: string;
  icon?: React.ReactElement;
  featureToggleKey?: string;
}

const isActive = (current: string, to: string | string[]) =>
  to instanceof Array ? to.includes(current) : current === to;

const HeaderLink = ({
  className = '',
  to,
  currentPathName,
  icon,
  title,
  featureToggleKey = '',
  ...props
}: OwnProps) => {
  if (featureToggleKey !== '' && getFTEnvVarByKey(featureToggleKey) === 'false') {
    return <></>;
  }

  return (
    <Link className={style.headerLink} to={to instanceof Array ? to[0] : to} {...props}>
      <Button
        className={cx(
          className,
          style.headerBtn,
          isActive(currentPathName, to) ? style.active : '',
        )}
        icon={icon}
      >
        {title}
      </Button>
    </Link>
  );
};

export default HeaderLink;
