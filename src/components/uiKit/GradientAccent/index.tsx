import React from 'react';
import cx from 'classnames';

import style from './index.module.css';

type OwnProps = {
  isFixed?: boolean;
};

const GradientAccent = ({ isFixed = false }: OwnProps) => (
  <div className={cx(style.gradientAccent, { [style.fixed]: isFixed })} />
);

export default GradientAccent;
