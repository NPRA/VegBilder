import { Typography } from '@material-ui/core';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Theme from 'theme/Theme';

interface IErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

// this component is written in this syntax in order to use componentDidCatch

class ErrorBoundary extends Component<IErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true, errorMessage: _.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ hasError: true, errorMessage: error.message });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            backgroundColor: Theme.palette.common.grayMenuItems,
            height: '100%',
          }}
        >
          <Typography variant="h3"> Oisann! Noe gikk galt </Typography>
          <a
            href="/"
            onClick={() => this.setState({ hasError: false })}
            style={{
              textDecoration: 'none',
              color: Theme.palette.common.grayDarker,
              borderBottom: `0.5px solid ${Theme.palette.common.grayDarker}`,
              marginTop: '3rem',
              marginBottom: '3rem',
            }}
          >
            Tilbake til Vegbilder
          </a>
          <Typography variant="body1" style={{ marginTop: '3rem' }}>
            {this.state.errorMessage}
          </Typography>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
