import * as React from 'react';

export default ({ height, width, fill = '#fff', style, className, alt = '', ...props }) => {
  return (
    <img
      src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99.2 90.93"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-double-chevron-right-grey</title><path class="cls-1" d="M61.16,87.88l35-35a10.55,10.55,0,0,0,0-14.83l-35-35A10.42,10.42,0,0,0,46.43,17.79L74.11,45.46,46.43,73.14A10.42,10.42,0,0,0,61.16,87.88"/><path class="cls-1" d="M17.79,87.88l35-35a10.55,10.55,0,0,0,0-14.83l-35-35A10.42,10.42,0,1,0,3.05,17.79L30.73,45.46,3.05,73.14A10.42,10.42,0,0,0,17.79,87.88"/></svg>`}
      alt={alt}
      css={`
        width: ${width};
        height: ${height};
        ${className};
      `}
      style={style}
    />
  );
};
