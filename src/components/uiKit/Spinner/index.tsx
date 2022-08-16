/* eslint-disable react/prop-types */
import { FunctionComponent } from "react";
import { Spin } from "antd";
import { SpinProps } from "antd/lib/spin";

import style from "./index.module.scss";

type SpinnerProps = SpinProps & {
  className?: string;
};

const defaultClassName = style.spinner;

const Spinner: FunctionComponent<SpinnerProps> = (props) => {
  const { className = defaultClassName, size, children } = props;
  return (
    <div className={className}>
      <Spin size={size}>{children}</Spin>
    </div>
  );
};

export default Spinner;
