import React from 'react';
import { Link } from 'react-router-dom';
import CogIcon from 'react-icons/lib/fa/cog';

const SettingsButton = ({ egoId, theme, ...props }) => (
  <Link
    to={{
      pathname: `/user/${egoId}`,
      hash: '#settings',
    }}
    css={`
      ${theme.hollowButton};
      text-transform: uppercase;
      font-weight: 500;
    `}
    {...props}
  >
    <CogIcon
      css={`
        padding-right: 5px;
      `}
    />{' '}
    Settings & Privacy
  </Link>
);

export default SettingsButton;
