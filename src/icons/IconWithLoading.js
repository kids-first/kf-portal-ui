import React from 'react';
import Spinner from 'react-spinkit';

const IconWithLoading = ({ className, loading, icon }) =>
  loading ? (
    <Spinner
      fadeIn="none"
      name="circle"
      color="#fff"
      style={{
        width: 15,
        height: 15,
        marginRight: 9,
      }}
    />
  ) : (
    <img
      alt=""
      src={icon}
      css={`
        width: 10px;
        margin-right: 9px;
        ${className};
      `}
    />
  );

export default IconWithLoading;
