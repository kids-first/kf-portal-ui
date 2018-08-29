import React from 'react';
import { Link } from 'react-router-dom';
import PencilIcon from 'react-icons/lib/fa/pencil';
import { WhiteButton } from '../../uikit/Button';

const EditButton = ({ egoId, theme, ...props }) => (
  <Link
    to={{
      pathname: `/user/${egoId}`,
      hash: '#aboutMe',
    }}
    {...props}
    style={{ textDecoration: 'none' }}
  >
    <WhiteButton>
      <PencilIcon width="12px" /> Edit Profile
    </WhiteButton>
  </Link>
);

export default EditButton;
