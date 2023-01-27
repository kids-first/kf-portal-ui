import * as React from 'react';

export default ({
  size = 256,
  width = size,
  height = size,
  fill = '#A6CE39',
  color = '#FFFFFF',
  ...rest
}) => {
  return (
    <svg
      id="Isolation_Mode"
      data-name="Isolation Mode"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 256 256"
      style={{
        enableBackground: 'new 0 0 256 256',
        verticalAlign: 'middle',
        paddingLeft: '2px',
      }}
      {...rest}
    >
      <defs>
        <style type="text/css">
          {`.st0 {fill: ${fill};}`}
          {`.st1 {fill: ${color};}`}
        </style>
      </defs>
      <path
        className="st0"
        d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"
      />
      <g>
        <path className="st1" d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z" />
        <path
          className="st1"
          d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5
		c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"
        />
        <path
          className="st1"
          d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1
		C84.2,46.7,88.7,51.3,88.7,56.8z"
        />
      </g>
    </svg>
  );
};