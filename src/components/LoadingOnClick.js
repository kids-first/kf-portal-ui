import { compose, withState, withProps } from 'recompose';

const LoadingOnClick = compose(
  withState('loading', 'setLoading', false),
  withProps(({ onClick, setLoading }) => ({
    disabled: !onClick,
    onClick: async (...args) => {
      setLoading(true);
      const result = onClick && (await onClick(...args));
      setLoading(false);
      return result;
    },
  })),
)(({ render, ...props }) => render(props));

export default LoadingOnClick;
