import React, { FunctionComponent } from 'react';
import style from './Symbol.module.scss';

type OwnProps = {
  symbol: string | React.ReactNode;
};

const Symbol: FunctionComponent<OwnProps> = ({ symbol }) => (
  <span className={style.symbol}>{symbol}</span>
);

export default Symbol;
