import React, { useState, useEffect } from 'react';
import { Activity, Clock, Database, Zap, ChevronUp, ChevronDown, X } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  dataSize: number;
  lastUpdate: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    dataSize: 0,
    lastUpdate: Date.now()
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      const startTime = performance.now();
      
      // Вимірюємо розмір даних в localStorage
      let totalSize = 0;
      for (let key in localStorage) {
        if (key.startsWith('fantasyWorldBuilder_')) {
          totalSize += localStorage[key].length;
        }
      }

      // Вимірюємо використання пам'яті (якщо доступно)
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        memoryUsage = memInfo.usedJSHeapSize / 1024 / 1024; // MB
      }

      const endTime = performance.now();
      
      setMetrics({
        renderTime: endTime - startTime,
        memoryUsage,
        dataSize: totalSize / 1024, // KB
        lastUpdate: Date.now()
      });
    };

    // Оновлюємо метрики кожні 5 секунд
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Початкове оновлення

    return () => clearInterval(interval);
  }, []);

  // Показуємо тільки в dev режимі або при натисканні Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(!isVisible);
        if (!isVisible) {
          setIsCollapsed(false); // Розгортаємо при показі
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Автоматично показуємо якщо є проблеми з продуктивністю
  useEffect(() => {
    if (metrics.dataSize > 5000 || metrics.memoryUsage > 100) { // 5MB даних або 100MB пам'яті
      setIsVisible(true);
    }
  }, [metrics]);

  if (!isVisible && process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getDataSizeColor = () => {
    if (metrics.dataSize > 5000) return 'var(--danger)';
    if (metrics.dataSize > 2000) return 'var(--warning)';
    return 'var(--success)';
  };

  const getMemoryColor = () => {
    if (metrics.memoryUsage > 100) return 'var(--danger)';
    if (metrics.memoryUsage > 50) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-md)',
      padding: isCollapsed ? '0.5rem' : '0.75rem',
      fontSize: '0.75rem',
      color: 'var(--text-secondary)',
      zIndex: 1000,
      minWidth: isCollapsed ? 'auto' : '200px',
      boxShadow: 'var(--shadow-card)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isCollapsed ? 0 : '0.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          color: 'var(--text-primary)'
        }}>
          <Activity size={14} />
          {!isCollapsed && 'Продуктивність'}
        </div>
        
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.125rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isCollapsed ? 'Розгорнути' : 'Згорнути'}
          >
            {isCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.125rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Закрити"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={12} />
              <span>Рендер: {metrics.renderTime.toFixed(2)}мс</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={12} />
              <span style={{ color: getDataSizeColor() }}>
                Дані: {metrics.dataSize.toFixed(1)}КБ
              </span>
            </div>

            {metrics.memoryUsage > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={12} />
                <span style={{ color: getMemoryColor() }}>
                  Пам'ять: {metrics.memoryUsage.toFixed(1)}МБ
                </span>
              </div>
            )}
          </div>

          <div style={{
            fontSize: '0.625rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            Ctrl+Shift+P для перемикання
          </div>
        </>
      )}
    </div>
  );
};