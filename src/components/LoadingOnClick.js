import { compose, withState, withProps } from 'recompose';

const LoadingOnClick = compose(
  withState('loading', 'setLoading', false),
  withProps(({ onClick, setLoading }) => ({
    onClick: async (...args) => {
      setLoading(true);
      const result = await onClick(...args);
      setLoading(false);
      return result;
    },
  })),
)(({ render, ...props }) => render(props));

export default LoadingOnClick;
