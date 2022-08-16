import { Component, ReactNode } from 'react';
import ErrorPage from 'views/Error';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage status={500}></ErrorPage>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
