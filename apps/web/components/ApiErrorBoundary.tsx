'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi, Server } from 'lucide-react';

interface ApiErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isRetrying: boolean;
  retryCount: number;
}

interface ApiErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  retryDelay?: number;
  apiEndpoint?: string;
}

export class ApiErrorBoundary extends Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      isRetrying: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ApiErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ApiErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('API Error in production:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        apiEndpoint: this.props.apiEndpoint,
        timestamp: new Date().toISOString(),
      });
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      isRetrying: false,
      retryCount: 0
    });
  };

  handleRetry = () => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState({ isRetrying: true, retryCount: retryCount + 1 });

    // Simulate retry delay
    this.retryTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, retryDelay);
  };

  handleGoBack = () => {
    window.history.back();
  };

  getErrorMessage = () => {
    const { error } = this.state;
    const { apiEndpoint } = this.props;

    if (!error) return 'Ein unbekannter Fehler ist aufgetreten.';

    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung.';
    }

    // API errors
    if (error.message.includes('API') || error.message.includes('server')) {
      return 'Serverfehler: Der Server ist vorübergehend nicht erreichbar.';
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return 'Zeitüberschreitung: Die Anfrage hat zu lange gedauert.';
    }

    // Generic error
    return `Fehler beim Laden der Daten${apiEndpoint ? ` von ${apiEndpoint}` : ''}.`;
  };

  render() {
    const { hasError, isRetrying, retryCount } = this.state;
    const { fallback, maxRetries = 3, apiEndpoint } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      const canRetry = retryCount < maxRetries;
      const errorMessage = this.getErrorMessage();

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {this.state.error?.message.includes('network') || this.state.error?.message.includes('fetch') ? (
                <Wifi className="w-10 h-10 text-red-600" />
              ) : (
                <Server className="w-10 h-10 text-red-600" />
              )}
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              API-Fehler
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              {errorMessage}
            </p>

            {/* API Endpoint Info */}
            {apiEndpoint && (
              <div className="mb-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Endpoint:</strong> {apiEndpoint}
                </p>
              </div>
            )}

            {/* Retry Count */}
            {retryCount > 0 && (
              <div className="mb-6 p-3 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Versuch {retryCount} von {maxRetries}
                </p>
              </div>
            )}

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Technische Details (Development)
                </summary>
                <div className="bg-gray-100 p-3 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetrying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird wiederholt...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Erneut versuchen
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={this.handleGoBack}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                ← Zurück
              </button>
            </div>

            {/* Support Info */}
            <p className="text-xs text-gray-500 mt-6">
              Falls das Problem weiterhin besteht, kontaktieren Sie uns unter{' '}
              <a href="mailto:support@immowaechter.at" className="text-red-600 hover:text-red-700">
                support@immowaechter.at
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withApiErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ApiErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ApiErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ApiErrorBoundary>
  );

  WrappedComponent.displayName = `withApiErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default ApiErrorBoundary;


