import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Викликаємо callback якщо він є
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Логуємо помилку для аналітики
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Зберігаємо помилку в localStorage для подальшого аналізу
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const existingLogs = JSON.parse(localStorage.getItem('fantasyWorldBuilder_errorLogs') || '[]');
      existingLogs.push(errorLog);
      
      // Зберігаємо тільки останні 10 помилок
      if (existingLogs.length > 10) {
        existingLogs.shift();
      }
      
      localStorage.setItem('fantasyWorldBuilder_errorLogs', JSON.stringify(existingLogs));
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Якщо є кастомний fallback, використовуємо його
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Стандартний UI помилки
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-modal)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem'
            }}>
              <AlertTriangle size={40} style={{ color: 'white' }} />
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Щось пішло не так
            </h2>

            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              Виникла неочікувана помилка в додатку. Ваші дані збережені в браузері і не втрачені.
            </p>

            {/* Деталі помилки (тільки в dev режимі) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '2rem',
                textAlign: 'left',
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  Деталі помилки (для розробників)
                </summary>
                <pre style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  overflow: 'auto',
                  maxHeight: '200px',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                className="btn btn-primary"
                onClick={this.handleRetry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <RefreshCw size={18} />
                Спробувати знову
              </button>

              <button
                className="btn btn-secondary"
                onClick={this.handleGoHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Home size={18} />
                На головну
              </button>

              <button
                className="btn btn-secondary"
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <RefreshCw size={18} />
                Перезавантажити
              </button>
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--text-muted)'
            }}>
              <strong>Підказка:</strong> Якщо проблема повторюється, спробуйте очистити кеш браузера 
              або експортувати дані та перезапустити додаток.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}