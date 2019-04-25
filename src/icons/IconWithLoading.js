import React from 'react';
import Spinner from 'react-spinkit';

const IconWithLoading = ({
  className,
  loading,
  width = 10,
  Icon, // component
  spinnerProps = {},
  ...props
}) =>
  loading ? (
    <Spinner
      fadeIn="none"
      name="circle"
      color="#fff"
      css={`
        width: ${width + 2}px;
        height: ${width + 2}px;
        ${className};
      `}
      {...spinnerProps}
    />
  ) : (
    <Icon />
  );

export default IconWithLoading;
