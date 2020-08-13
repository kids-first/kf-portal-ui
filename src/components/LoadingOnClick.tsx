import { FunctionComponent, useState } from 'react';

type Rest = {
  [x: string]: any;
};

type OwnProps = {
  onClick: Function;
  render: Function;
} & Rest;

const LoadingOnClick: FunctionComponent<OwnProps> = ({ onClick, render, ...props }) => {
  const [loading, setLoading] = useState(false);
  const enhancedOnClick = async (...args: any[]) => {
    setLoading(true);
    const result = onClick && (await onClick(...args));
    setLoading(false);
    return result;
  };
  return render({ onClick: enhancedOnClick, loading, ...props });
};

export default LoadingOnClick;
