import React from 'react';
import md5 from 'md5';
import { trim } from 'lodash';

export default ({ email = '', d = '', size = 100, className, ...props }) => (
  <img
    className={className}
    src={`https://www.gravatar.com/avatar/${md5(trim(email.toLowerCase()))}?s=${size}&d=${d}`}
    alt="Gravtar"
    {...props}
  />
);
