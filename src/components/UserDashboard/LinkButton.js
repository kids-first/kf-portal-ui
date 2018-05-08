import React from 'react';
import { Link } from 'react-router-dom';
import CogIcon from 'react-icons/lib/fa/cog';

const LinkButton = ({
  egoId,
  hash = '#settings',
  theme,
  icon = <CogIcon />,
  children = 'setting',
  ...props
}) => (
  <Link
    to={{
      pathname: `/user/${egoId}`,
      hash: hash,
    }}
    className={`${theme.hollowButton} ${theme.uppercase}`}
    {...props}
  >
    <span className={`iconContainer`}>{icon}</span>
    {children}
  </Link>
);

export default LinkButton;
