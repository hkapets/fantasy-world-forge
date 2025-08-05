import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
}

interface KeyboardShortcutsProps {
  onNavigate?: (section: string) => void;
  onSave?: () => void;
  onExport?: () => void;
  onCreateWorld?: () => void;
  onSearch?: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onNavigate,
  onSave,
  onExport,
  onCreateWorld,
  onSearch
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts: Shortcut[] = [
    {
      keys: ['Cmd', 'K'],
      description: 'Глобальний пошук',
      action: () => onSearch?.()
    },
    {
      keys: ['Cmd', 'S'],
      description: 'Зберегти дані',
      action: () => onSave?.()
    },
    {
      keys: ['Cmd', 'E'],
      description: 'Експортувати дані',
      action: () => onExport?.()
    },
    {
      keys: ['Cmd', 'N'],
      description: 'Створити новий світ',
      action: () => onCreateWorld?.()
    },
    {
      keys: ['1'],
      description: 'Персонажі',
      action: () => onNavigate?.('characters')
    },
    {
      keys: ['2'],
      description: 'Лор',
      action: () => onNavigate?.('lore')
    },
    {
      keys: ['3'],
      description: 'Хронологія',
      action: () => onNavigate?.('chronology')
    },
    {
      keys: ['4'],
      description: 'Карти',
      action: () => onNavigate?.('maps')
    },
    {
      keys: ['5'],
      description: 'Зв\'язки',
      action: () => onNavigate?.('relationships')
    },
    {
      keys: ['6'],
      description: 'Нотатки',
      action: () => onNavigate?.('notes')
    },
    {
      keys: ['7'],
      description: 'Сценарії',
      action: () => onNavigate?.('scenarios')
    },
    {
      keys: ['?'],
      description: 'Показати/приховати довідку',
      action: () => setShowHelp(!showHelp)
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ігноруємо якщо фокус на полі вводу
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const shortcut = shortcuts.find(s => {
        if (s.keys.length === 1) {
          return e.key === s.keys[0] && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
        } else if (s.keys.length === 2) {
          const [modifier, key] = s.keys;
          const hasModifier = (modifier === 'Cmd' && (e.metaKey || e.ctrlKey)) ||
                             (modifier === 'Shift' && e.shiftKey) ||
                             (modifier === 'Alt' && e.altKey);
          return hasModifier && e.key.toLowerCase() === key.toLowerCase();
        }
        return false;
      });

      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  // Показуємо індикатор клавіатурних скорочень
  return (
    <>
      {/* Кнопка довідки */}
      <button
        onClick={() => setShowHelp(true)}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--fantasy-primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-card)',
          zIndex: 999,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        }}
        title="Клавіатурні скорочення (?)"
      >
        <Keyboard size={20} />
      </button>

      {/* Модальне вікно довідки */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid var(--border-secondary)',
            boxShadow: 'var(--shadow-modal)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                ⌨️ Клавіатурні скорочення
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)'
                  }}
                >
                  <span style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    {shortcut.description}
                  </span>
                  
                  <div style={{
                    display: 'flex',
                    gap: '0.25rem'
                  }}>
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd style={{
                          padding: '0.25rem 0.5rem',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                          fontFamily: 'monospace'
                        }}>
                          {key === 'Cmd' ? (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl') : key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            alignSelf: 'center'
                          }}>
                            +
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              <strong>Підказка:</strong> Натисніть <kbd style={{
                padding: '0.125rem 0.25rem',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace'
              }}>?</kbd> в будь-який час для відкриття цієї довідки
            </div>
          </div>
        </div>
      )}
    </>
  );
};