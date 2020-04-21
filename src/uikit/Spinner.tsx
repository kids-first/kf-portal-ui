/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';

type SpinnerProps = SpinProps & {
  className?: string;
};

export const Spinner: FunctionComponent<SpinnerProps> = props => {
  const { className = '', size } = props;
  return (
    <div className={className}>
      <Spin size={size} />
    </div>
  );
};
