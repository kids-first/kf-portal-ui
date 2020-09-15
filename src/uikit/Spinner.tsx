/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';

type SpinnerProps = SpinProps & {
  className?: string;
};

const defaultClassName = 'spinner'; //  see index.css

export const Spinner: FunctionComponent<SpinnerProps> = (props) => {
  const { className = defaultClassName, size, children } = props;
  return (
    <div className={className}>
      <Spin size={size}>{children}</Spin>
    </div>
  );
};
