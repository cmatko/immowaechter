'use client';

import { useState, useCallback } from 'react';

interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
  endpoint?: string;
  timestamp: string;
}

interface UseApiErrorReturn {
  error: ApiError | null;
  setError: (error: ApiError | null) => void;
  clearError: () => void;
  handleApiError: (error: any, endpoint?: string) => void;
  isError: boolean;
}

export function useApiError(): UseApiErrorReturn {
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((error: any, endpoint?: string) => {
    console.error('API Error caught by useApiError:', error, endpoint);

    const apiError: ApiError = {
      message: getErrorMessage(error),
      code: error.code || error.status,
      status: error.status || error.statusCode,
      endpoint,
      timestamp: new Date().toISOString(),
    };

    setError(apiError);

    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Production API error:', apiError);
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    handleApiError,
    isError: error !== null,
  };
}

function getErrorMessage(error: any): string {
  if (!error) return 'Ein unbekannter Fehler ist aufgetreten.';

  // Network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung.';
  }

  // Supabase errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'Daten nicht gefunden.';
      case '23505':
        return 'Eintrag bereits vorhanden.';
      case '23503':
        return 'Referenzfehler: Verknüpfte Daten nicht gefunden.';
      case '42501':
        return 'Berechtigungsfehler: Sie haben keine Berechtigung für diese Aktion.';
      default:
        return error.message || 'Datenbankfehler aufgetreten.';
    }
  }

  // HTTP status codes
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    switch (status) {
      case 400:
        return 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.';
      case 401:
        return 'Nicht autorisiert. Bitte melden Sie sich erneut an.';
      case 403:
        return 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.';
      case 404:
        return 'Ressource nicht gefunden.';
      case 409:
        return 'Konflikt: Die Ressource existiert bereits.';
      case 422:
        return 'Validierungsfehler. Bitte überprüfen Sie Ihre Eingaben.';
      case 429:
        return 'Zu viele Anfragen. Bitte warten Sie einen Moment.';
      case 500:
        return 'Serverfehler. Bitte versuchen Sie es später erneut.';
      case 502:
      case 503:
      case 504:
        return 'Service vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.';
      default:
        return `HTTP-Fehler ${status}: ${error.message || 'Unbekannter Fehler'}`;
    }
  }

  // Timeout errors
  if (error.message?.includes('timeout')) {
    return 'Zeitüberschreitung: Die Anfrage hat zu lange gedauert.';
  }

  // Generic error
  return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
}

// Hook for handling API calls with error boundaries
export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const { error, handleApiError, clearError } = useApiError();

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
      endpoint?: string;
    }
  ) => {
    setLoading(true);
    clearError();

    try {
      const result = await apiCall();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      handleApiError(err, options?.endpoint);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleApiError, clearError]);

  return {
    loading,
    data,
    error,
    execute,
    clearError,
  };
}


