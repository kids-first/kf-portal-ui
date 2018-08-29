import React from 'react';
import { Link } from 'react-router-dom';
import CogIcon from 'react-icons/lib/fa/cog';
import { WhiteButton } from '../../uikit/Button';

const SettingsButton = ({ egoId, theme, ...props }) => (
  <Link
    to={{
      pathname: `/user/${egoId}`,
      hash: '#settings',
    }}
    {...props}
    style={{ textDecoration: 'none' }}
  >
    <WhiteButton>
      <CogIcon width="15px" /> Settings
    </WhiteButton>
  </Link>
);

export default SettingsButton;
