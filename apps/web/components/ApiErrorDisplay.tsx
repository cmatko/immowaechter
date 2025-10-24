'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, X, Wifi, Server, Clock } from 'lucide-react';

interface ApiErrorDisplayProps {
  error: {
    message: string;
    code?: string | number;
    status?: number;
    endpoint?: string;
    timestamp: string;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function ApiErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showDetails = false,
  className = ''
}: ApiErrorDisplayProps) {
  const getErrorIcon = () => {
    if (error.message.includes('Netzwerk') || error.message.includes('Internet')) {
      return <Wifi className="w-5 h-5 text-red-600" />;
    }
    if (error.message.includes('Server') || error.message.includes('Zeitüberschreitung')) {
      return <Server className="w-5 h-5 text-red-600" />;
    }
    if (error.message.includes('Zeitüberschreitung')) {
      return <Clock className="w-5 h-5 text-red-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  const getErrorType = () => {
    if (error.message.includes('Netzwerk') || error.message.includes('Internet')) {
      return 'Netzwerkfehler';
    }
    if (error.message.includes('Server')) {
      return 'Serverfehler';
    }
    if (error.message.includes('Zeitüberschreitung')) {
      return 'Zeitüberschreitung';
    }
    if (error.status) {
      return `HTTP ${error.status}`;
    }
    return 'API-Fehler';
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon()}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">
                {getErrorType()}
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {error.message}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Erneut versuchen"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Error Details */}
          {showDetails && (
            <div className="mt-3 text-xs text-red-600">
              {error.endpoint && (
                <p><strong>Endpoint:</strong> {error.endpoint}</p>
              )}
              {error.code && (
                <p><strong>Code:</strong> {error.code}</p>
              )}
              {error.status && (
                <p><strong>Status:</strong> {error.status}</p>
              )}
              <p><strong>Zeit:</strong> {new Date(error.timestamp).toLocaleString('de-AT')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Toast-style error display
export function ApiErrorToast({ 
  error, 
  onRetry, 
  onDismiss 
}: Omit<ApiErrorDisplayProps, 'showDetails' | 'className'>) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{error.message}</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-white hover:text-red-200 transition-colors"
                title="Erneut versuchen"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-white hover:text-red-200 transition-colors"
                title="Schließen"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline error display for forms
export function ApiErrorInline({ 
  error, 
  onRetry, 
  onDismiss 
}: Omit<ApiErrorDisplayProps, 'showDetails' | 'className'>) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-3">
      <div className="flex items-center">
        <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
        <p className="text-sm text-red-700">{error.message}</p>
        <div className="ml-auto flex items-center space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Erneut versuchen"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Schließen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiErrorDisplay;


