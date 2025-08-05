import { useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface AutoSaveOptions {
  enabled: boolean;
  interval: number; // в мілісекундах
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave(options: AutoSaveOptions) {
  const [lastSave, setLastSave] = useLocalStorage('fantasyWorldBuilder_lastAutoSave', null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef<string>('');

  useEffect(() => {
    if (!options.enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const performAutoSave = () => {
      try {
        // Збираємо всі дані Fantasy World Builder
        const allData: Record<string, any> = {};
        
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('fantasyWorldBuilder_')) {
            allData[key] = localStorage.getItem(key);
          }
        });

        const currentDataHash = JSON.stringify(allData);
        
        // Перевіряємо чи змінилися дані
        if (currentDataHash !== lastDataRef.current) {
          lastDataRef.current = currentDataHash;
          setLastSave(new Date().toISOString());
          
          if (options.onSave) {
            options.onSave();
          }

          console.log('AutoSave: Дані збережено', new Date().toLocaleTimeString('uk-UA'));
        }
      } catch (error) {
        console.error('AutoSave error:', error);
        if (options.onError) {
          options.onError(error as Error);
        }
      }
    };

    // Початкове збереження
    performAutoSave();

    // Встановлюємо інтервал
    intervalRef.current = setInterval(performAutoSave, options.interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [options.enabled, options.interval, setLastSave]);

  // Ручне збереження
  const saveNow = () => {
    try {
      const allData: Record<string, any> = {};
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('fantasyWorldBuilder_')) {
          allData[key] = localStorage.getItem(key);
        }
      });

      setLastSave(new Date().toISOString());
      
      if (options.onSave) {
        options.onSave();
      }

      return true;
    } catch (error) {
      console.error('Manual save error:', error);
      if (options.onError) {
        options.onError(error as Error);
      }
      return false;
    }
  };

  return {
    lastSave,
    saveNow,
    isEnabled: options.enabled
  };
}