import { Typography } from '@material-ui/core';
import React, { Component, ErrorInfo, ReactNode } from 'react';

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
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <Typography variant="h1"> Noe gikk galt </Typography>
          <Typography variant="body1">{this.state.errorMessage}</Typography>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
