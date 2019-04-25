import * as React from 'react';

export default ({ height, width, fill = '#fff', ...props }) => {
  return (
    <svg viewBox="0 0 496 496" width={width} height={height} {...props}>
      <title>icon-plus</title>
      <path d="M248,0C111,0,0,111,0,248S111,496,248,496,496,385,496,248,385,0,248,0ZM392,276a12,12,0,0,1-12,12H288v92a12,12,0,0,1-12,12H220a12,12,0,0,1-12-12V288H116a12,12,0,0,1-12-12V220a12,12,0,0,1,12-12h92V116a12,12,0,0,1,12-12h56a12,12,0,0,1,12,12v92h92a12,12,0,0,1,12,12Z" />
    </svg>
  );
};
