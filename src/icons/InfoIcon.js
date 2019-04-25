import React from 'react';

export default ({ alt = '', style, className }) => (
  <img
    src={require('../assets/icon-info.svg')}
    alt={alt}
    css={`
      width: 12px;
      height: 12px;
      margin-right: 10px;
      ${className};
      ${style};
    `}
  />
);
