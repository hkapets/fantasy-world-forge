import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, History } from 'lucide-react';

interface NavigationItem {
  id: string;
  type: 'character' | 'lore' | 'note' | 'map' | 'scenario' | 'chronology' | 'event';
  name: string;
  section: string;
  subsection?: string;
  timestamp: number;
}

interface NavigationHistoryProps {
  onNavigate: (section: string, subsection?: string, itemId?: string) => void;
  maxHistorySize?: number;
}

export const NavigationHistory: React.FC<NavigationHistoryProps> = ({
  onNavigate,
  maxHistorySize = 20
}) => {
  const [history, setHistory] = useState<NavigationItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);

  // Завантаження історії з localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('fantasyWorldBuilder_navigationHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        setCurrentIndex(parsed.length - 1);
      } catch (error) {
        console.error('Error loading navigation history:', error);
      }
    }
  }, []);

  // Збереження історії в localStorage
  const saveHistory = (newHistory: NavigationItem[]) => {
    localStorage.setItem('fantasyWorldBuilder_navigationHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // Додавання нового елемента в історію
  const addToHistory = (item: NavigationItem) => {
    const newHistory = [...history];
    
    // Видаляємо дублікати
    const existingIndex = newHistory.findIndex(h => 
      h.id === item.id && h.type === item.type
    );
    if (existingIndex !== -1) {
      newHistory.splice(existingIndex, 1);
    }
    
    // Додаємо новий елемент
    newHistory.push(item);
    
    // Обмежуємо розмір історії
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }
    
    saveHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  // Навігація назад
  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const item = history[newIndex];
      setCurrentIndex(newIndex);
      onNavigate(item.section, item.subsection, item.id);
    }
  };

  // Навігація вперед
  const goForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const item = history[newIndex];
      setCurrentIndex(newIndex);
      onNavigate(item.section, item.subsection, item.id);
    }
  };

  // Навігація до конкретного елемента з історії
  const navigateToHistoryItem = (index: number) => {
    const item = history[index];
    setCurrentIndex(index);
    setShowHistory(false);
    onNavigate(item.section, item.subsection, item.id);
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative'
    }}>
      {/* Кнопка назад */}
      <button
        className="btn-icon"
        onClick={goBack}
        disabled={!canGoBack}
        style={{
          opacity: canGoBack ? 1 : 0.5,
          cursor: canGoBack ? 'pointer' : 'not-allowed'
        }}
        title="Назад"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Кнопка вперед */}
      <button
        className="btn-icon"
        onClick={goForward}
        disabled={!canGoForward}
        style={{
          opacity: canGoForward ? 1 : 0.5,
          cursor: canGoForward ? 'pointer' : 'not-allowed'
        }}
        title="Вперед"
      >
        <ArrowRight size={16} />
      </button>

      {/* Кнопка історії */}
      <button
        className="btn-icon"
        onClick={() => setShowHistory(!showHistory)}
        disabled={history.length === 0}
        style={{
          opacity: history.length > 0 ? 1 : 0.5,
          cursor: history.length > 0 ? 'pointer' : 'not-allowed'
        }}
        title="Історія навігації"
      >
        <History size={16} />
      </button>

      {/* Випадаючий список історії */}
      {showHistory && history.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '0.5rem',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-modal)',
          zIndex: 1000,
          minWidth: '250px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <div style={{
            padding: '0.75rem',
            borderBottom: '1px solid var(--border-primary)',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Історія навігації
          </div>
          
          {history.slice().reverse().map((item, reverseIndex) => {
            const index = history.length - 1 - reverseIndex;
            const isCurrentItem = index === currentIndex;
            
            return (
              <button
                key={`${item.id}-${item.timestamp}`}
                onClick={() => navigateToHistoryItem(index)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: isCurrentItem ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  borderBottom: reverseIndex < history.length - 1 ? '1px solid var(--border-primary)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentItem) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentItem) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: isCurrentItem ? '600' : '400',
                  color: isCurrentItem ? 'var(--fantasy-primary)' : 'var(--text-primary)',
                  marginBottom: '0.25rem'
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  {item.section}{item.subsection ? ` → ${item.subsection}` : ''}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Overlay для закриття історії */}
      {showHistory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  );

  // Експортуємо функцію для додавання в історію
  return {
    NavigationHistoryComponent: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative'
      }}>
        {/* Компонент як описано вище */}
      </div>
    ),
    addToHistory
  };
};