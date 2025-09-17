import { useState, useEffect } from 'react';
import { PluginManager } from '@/lib/pluginSystem';

// Хук для інтеграції плагінів в компоненти
export function usePluginIntegration(extensionPoint: string) {
  const [extensions, setExtensions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExtensions();
    
    // Слухаємо зміни плагінів
    const handlePluginChange = () => loadExtensions();
    
    window.addEventListener('register-extension-point', handlePluginChange);
    window.addEventListener('unregister-extension-points', handlePluginChange);
    
    return () => {
      window.removeEventListener('register-extension-point', handlePluginChange);
      window.removeEventListener('unregister-extension-points', handlePluginChange);
    };
  }, [extensionPoint]);

  const loadExtensions = () => {
    setLoading(true);
    
    try {
      const manager = PluginManager.getInstance();
      const plugins = manager.getPlugins();
      
      const relevantExtensions = plugins
        .filter(plugin => plugin.isActive && plugin.isLoaded)
        .flatMap(plugin => 
          plugin.manifest.extensionPoints
            .filter(point => point.target === extensionPoint)
            .map(point => ({
              pluginId: plugin.manifest.id,
              pluginName: plugin.manifest.name,
              extensionPoint: point,
              instance: plugin.instance
            }))
        )
        .sort((a, b) => a.extensionPoint.priority - b.extensionPoint.priority);
      
      setExtensions(relevantExtensions);
    } catch (error) {
      console.error('Error loading extensions:', error);
      setExtensions([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    extensions,
    loading,
    refreshExtensions: loadExtensions
  };
}

// Хук для обробки подій плагінів
export function usePluginEvents() {
  useEffect(() => {
    // Обробка сповіщень від плагінів
    const handlePluginNotification = (event: CustomEvent) => {
      const { message, type } = event.detail;
      
      // Інтеграція з системою toast
      const toastEvent = new CustomEvent('show-toast', {
        detail: { message, type }
      });
      window.dispatchEvent(toastEvent);
    };

    // Обробка модальних вікон від плагінів
    const handlePluginModal = (event: CustomEvent) => {
      const { component, props, resolve } = event.detail;
      
      // Тут можна інтегрувати з системою модальних вікон
      console.log('Plugin modal requested:', { component, props });
      resolve(null); // Поки що просто резолвимо
    };

    // Обробка пунктів меню від плагінів
    const handlePluginMenuItem = (event: CustomEvent) => {
      const { section, item } = event.detail;
      console.log('Plugin menu item added:', { section, item });
    };

    // Обробка кнопок тулбару від плагінів
    const handlePluginToolbarButton = (event: CustomEvent) => {
      const { button } = event.detail;
      console.log('Plugin toolbar button added:', button);
    };

    window.addEventListener('plugin-notification', handlePluginNotification);
    window.addEventListener('plugin-modal', handlePluginModal);
    window.addEventListener('plugin-menu-item', handlePluginMenuItem);
    window.addEventListener('plugin-toolbar-button', handlePluginToolbarButton);

    return () => {
      window.removeEventListener('plugin-notification', handlePluginNotification);
      window.removeEventListener('plugin-modal', handlePluginModal);
      window.removeEventListener('plugin-menu-item', handlePluginMenuItem);
      window.removeEventListener('plugin-toolbar-button', handlePluginToolbarButton);
    };
  }, []);
}

// Хук для створення плагінів
export function usePluginDevelopment() {
  const [isDebugging, setIsDebugging] = useState(false);
  const [pluginLogs, setPluginLogs] = useState<Array<{
    timestamp: string;
    pluginId: string;
    level: 'log' | 'warn' | 'error';
    message: string;
  }>>([]);

  const addLog = (pluginId: string, level: 'log' | 'warn' | 'error', message: string) => {
    setPluginLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      pluginId,
      level,
      message
    }].slice(-100)); // Зберігаємо тільки останні 100 логів
  };

  const clearLogs = () => {
    setPluginLogs([]);
  };

  const exportLogs = () => {
    const logsText = pluginLogs
      .map(log => `[${log.timestamp}] [${log.pluginId}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plugin-logs-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const validatePluginCode = (code: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    try {
      // Базова перевірка синтаксису
      new Function(code);
      
      // Перевірка обов'язкових експортів
      if (!code.includes('exports.activate')) {
        errors.push('Відсутня функція exports.activate');
      }
      
      // Перевірка небезпечних операцій
      const dangerousPatterns = [
        /eval\s*\(/,
        /Function\s*\(/,
        /document\.write/,
        /innerHTML\s*=/,
        /localStorage\.clear/,
        /sessionStorage\.clear/
      ];
      
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(code)) {
          errors.push(`Виявлено потенційно небезпечний код: ${pattern.source}`);
        }
      });
      
    } catch (syntaxError) {
      errors.push(`Синтаксична помилка: ${syntaxError.message}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return {
    isDebugging,
    setIsDebugging,
    pluginLogs,
    addLog,
    clearLogs,
    exportLogs,
    validatePluginCode
  };
}