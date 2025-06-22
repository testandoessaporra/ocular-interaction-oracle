
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary capturou erro', { 
      component: 'ErrorBoundary',
      data: {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      }
    });

    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen tactical-bg flex items-center justify-center p-4">
          <div className="tactical-card bg-red-900/20 border-red-500/30 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="tactical-title text-lg text-red-400 mb-2">ERRO DETECTADO</h2>
              <p className="tactical-body text-red-200 mb-4">
                Algo deu errado na aplicação. Por favor, recarregue a página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="tactical-btn-primary bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors"
              >
                RECARREGAR PÁGINA
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
