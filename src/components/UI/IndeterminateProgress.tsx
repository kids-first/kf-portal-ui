import React, { FC, useState } from 'react';
import { Progress } from 'antd';
import useInterval from 'hooks/useInterval';

type OwnProps = {
  delay?: number;
};

const DEFAULT_DELAY_IN_MS = 1000;
const MIN_PERCENT = 10;
const MAX_PERCENTAGE_TO_DISPLAY = 90;
const INCREASE_UNIT = 10;

const computePercentage = (count: number) => {
  const percent = (count * INCREASE_UNIT) % 100;
  const isBoundary = percent === 0 || percent >= MAX_PERCENTAGE_TO_DISPLAY;
  if (isBoundary) {
    return MIN_PERCENT;
  }
  return percent;
};

const IndeterminateProgress: FC<OwnProps> = ({ delay }) => {
  const [count, setCount] = useState(0);
  useInterval(
    () => {
      setCount(count + 1);
    },
    // Delay in milliseconds or null to stop it
    delay || DEFAULT_DELAY_IN_MS,
  );
  return <Progress percent={computePercentage(count)} showInfo={false} />;
};

export default IndeterminateProgress;
