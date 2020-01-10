import React from 'react';

export const encodeSVG = svg => encodeURI(svg).replace(/#/g, '%23');

export const BaseSvg = ({
  svg,
  size = '1em',
  height = size,
  width = size,
  style,
  alt = '',
  ...props
}) => (
  <img
    src={`data:image/svg+xml;utf8,${encodeSVG(svg)}`}
    style={{
      ...style,
      width,
      height,
    }}
    alt={alt}
    {...props}
  />
);
