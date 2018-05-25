import React from 'react';

export const encodeSVG = svg => encodeURI(svg).replace('#', '%23');

export const BaseSvg = ({ alt = '', height, width, svg, style, className, ...props }) => (
  <img
    src={`data:image/svg+xml;utf8,${encodeSVG(svg)}`}
    alt={alt}
    css={`
      width: ${width};
      height: ${height};
      ${className};
      ${style};
    `}
    {...props}
  />
);
