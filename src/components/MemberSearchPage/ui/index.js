import React from 'react';
import Gravatar from 'uikit/Gravatar';

export const MemberImage = ({ style = {}, ...props }) => (
  <Gravatar
    style={{
      height: '75px',
      width: '75px',
      borderRadius: '50%',
      border: '5px solid #fff',
      ...style,
    }}
    {...props}
  />
);
