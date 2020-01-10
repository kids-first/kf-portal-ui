import React from 'react';
import ErrorPage from './ErrorPage';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info,
    });
  }

  render() {
    if (this.state.error) {
      return <ErrorPage title={`An Error Occurred : ${this.state.error}`} />;
    }
    return this.props.children;
  }
}
