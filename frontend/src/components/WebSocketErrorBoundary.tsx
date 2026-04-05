import React, { Component, ReactNode } from 'react';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface WebSocketErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorType?: 'connection' | 'message' | 'parsing' | 'unknown';
}

interface WebSocketErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorType: string) => void;
}

/**
 * Specialized error boundary for WebSocket-related errors
 */
export class WebSocketErrorBoundary extends Component<WebSocketErrorBoundaryProps, WebSocketErrorBoundaryState> {
  constructor(props: WebSocketErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<WebSocketErrorBoundaryState> {
    // Determine error type based on error message
    let errorType: WebSocketErrorBoundaryState['errorType'] = 'unknown';
    
    if (error.message.includes('WebSocket') || error.message.includes('connection')) {
      errorType = 'connection';
    } else if (error.message.includes('JSON') || error.message.includes('parse')) {
      errorType = 'parsing';
    } else if (error.message.includes('message') || error.message.includes('data')) {
      errorType = 'message';
    }

    return { hasError: true, error, errorType };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[WebSocketErrorBoundary] Caught WebSocket error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, this.state.errorType || 'unknown');
    }

    // Report to monitoring
    if ((window as any).gtag) {
      (window as any).gtag('event', 'websocket_error', {
        error_type: this.state.errorType,
        error_message: error.message,
        component_stack: errorInfo.componentStack,
      });
    }
  }

  handleReconnect = () => {
    // Trigger WebSocket reconnection
    if ((window as any).reconnectMarketWS) {
      (window as any).reconnectMarketWS();
    } else {
      // Fallback to page reload
      window.location.reload();
    }
  };

  getErrorIcon = () => {
    switch (this.state.errorType) {
      case 'connection':
        return <WifiOff className="w-8 h-8 text-red-400" />;
      case 'parsing':
        return <AlertTriangle className="w-8 h-8 text-orange-400" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-red-400" />;
    }
  };

  getErrorMessage = () => {
    switch (this.state.errorType) {
      case 'connection':
        return 'Connection to market data lost. The application will attempt to reconnect automatically.';
      case 'parsing':
        return 'Failed to process market data. Please refresh the page.';
      case 'message':
        return 'Invalid data received from market feed. The connection may be unstable.';
      default:
        return 'An unexpected error occurred while processing market data.';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="glass-morphism rounded-lg p-4 border-l-4 border-red-500 bg-red-900/20">
            <div className="flex items-start gap-3">
              {this.getErrorIcon()}
              
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-400 mb-1">
                  Market Data Error
                </h4>
                
                <p className="text-xs text-gray-300 mb-3">
                  {this.getErrorMessage()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={this.handleReconnect}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reconnect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebSocketErrorBoundary;
