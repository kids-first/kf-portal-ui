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
  >
    <WhiteButton mx="4px">
      <PencilIcon size={12} className="icon" /> Edit Profile
    </WhiteButton>
  </Link>
);

export default EditButton;
