import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
}

/**
 * Enhanced Error boundary component to catch and handle React errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      retryCount: this.retryCount
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service if available
    if ((window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
      });
    }

    // Report to console in development with more details
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.retryCount < maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      console.log(`🔄 Retrying... Attempt ${this.retryCount} of ${maxRetries}`);
    } else {
      console.error('❌ Max retries reached. Please refresh the page.');
    }
  };

  handleReset = () => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    console.log('🔄 Error boundary reset');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const maxRetries = this.props.maxRetries || 3;
      const canRetry = this.retryCount < maxRetries;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="glass-morphism rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">
                Something went wrong
              </h1>

              <p className="text-gray-300 mb-6">
                The application encountered an unexpected error. We are working to fix this.
              </p>

              <div className="flex gap-3 justify-center mb-6">
                {canRetry && (
                  <button
                    onClick={this.handleRetry}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                  >
                    Try Again ({maxRetries - this.retryCount} attempts left)
                  </button>
                )}
                
                <button
                  onClick={this.handleReset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Reset
                </button>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Reload Application
              </button>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-400 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-400 overflow-auto bg-black/30 p-3 rounded">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Component Stack:</h4>
                      <pre className="text-xs text-yellow-400 overflow-auto bg-black/30 p-3 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
