import React from 'react';

import MaintenancePage from './MaintenancePage';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info
    });
  }

  render() {
    if (this.state.error) {
      return <MaintenancePage />;
    }

    return this.props.children;
  }
}
