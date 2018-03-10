import React from 'react';
import { Link } from 'react-router-dom';
import PencilIcon from 'react-icons/lib/fa/pencil';

const EditButton = ({ egoId, theme, ...props }) => (
  <Link
    to={{
      pathname: `/user/${egoId}`,
      hash: '#aboutMe',
    }}
    css={`
      ${theme.hollowButton};
      text-transform: uppercase;
      font-weight: 500;
    `}
    {...props}
  >
    <PencilIcon
      css={`
        padding-right: 5px;
      `}
    />{' '}
    Edit Profile
  </Link>
);

export default EditButton;
