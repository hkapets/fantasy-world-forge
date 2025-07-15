import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, BookOpen, Clock, MapPin, Link, FileText, Film, Loader2 } from 'lucide-react';
import { useGlobalSearch, SearchResult } from '@/hooks/useGlobalSearch';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string, subsection?: string, itemId?: string) => void;
}

const typeIcons = {
  character: Users,
  lore: BookOpen,
  chronology: Clock,
  event: Clock,
  note: FileText,
  relationship: Link,
  map: MapPin,
  scenario: Film
};

const typeColors = {
  character: 'var(--fantasy-primary)',
  lore: 'var(--success)',
  chronology: 'var(--warning)',
  event: 'var(--warning)',
  note: 'var(--info)',
  relationship: 'var(--accent)',
  map: 'var(--fantasy-secondary)',
  scenario: 'var(--purple)'
};

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const { searchResults, isSearching, performGlobalSearch } = useGlobalSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performGlobalSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performGlobalSearch]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      handleResultClick(searchResults[selectedIndex]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Навігація залежно від типу результату
    switch (result.type) {
      case 'character':
        onNavigate('characters', undefined, result.id);
        break;
      case 'lore':
        onNavigate('lore', result.subsection, result.id);
        break;
      case 'chronology':
        onNavigate('chronology', undefined, result.id);
        break;
      case 'event':
        onNavigate('chronology', 'event', result.id);
        break;
      case 'note':
        onNavigate('notes', undefined, result.id);
        break;
      case 'relationship':
        onNavigate('relationships', undefined, result.id);
        break;
      case 'map':
        onNavigate('maps', undefined, result.id);
        break;
      case 'scenario':
        onNavigate('scenarios', undefined, result.id);
        break;
    }
    onClose();
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ 
          background: 'var(--fantasy-primary)', 
          color: 'white',
          padding: '0 2px',
          borderRadius: '2px'
        }}>
          {part}
        </mark>
      ) : part
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh'
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '70vh',
        overflow: 'hidden',
        border: '1px solid var(--border-secondary)',
        boxShadow: 'var(--shadow-modal)'
      }}>
        {/* Заголовок з пошуком */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Пошук по всьому проекту..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1.125rem',
              color: 'var(--text-primary)'
            }}
          />
          {isSearching && <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />}
          <button
            onClick={onClose}
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

        {/* Результати пошуку */}
        <div style={{
          maxHeight: '50vh',
          overflow: 'auto'
        }}>
          {!query.trim() ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Почніть вводити для пошуку по всьому проекту</p>
              <div style={{
                fontSize: '0.875rem',
                marginTop: '1rem',
                opacity: 0.7
              }}>
                Пошук працює по персонажах, лорі, хронології, нотатках, зв'язках, картах та сценаріях
              </div>
            </div>
          ) : searchResults.length === 0 && !isSearching ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Нічого не знайдено за запитом "{query}"</p>
              <div style={{
                fontSize: '0.875rem',
                marginTop: '1rem',
                opacity: 0.7
              }}>
                Спробуйте інші ключові слова або перевірте правопис
              </div>
            </div>
          ) : (
            <div>
              {searchResults.length > 0 && (
                <div style={{
                  padding: '1rem 1.5rem 0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-primary)'
                }}>
                  Знайдено {searchResults.length} результат{searchResults.length === 1 ? '' : searchResults.length < 5 ? 'и' : 'ів'}
                </div>
              )}
              
              {searchResults.map((result, index) => {
                const Icon = typeIcons[result.type];
                const isSelected = index === selectedIndex;
                
                return (
                  <div
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    style={{
                      padding: '1rem 1.5rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-primary)',
                      background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: typeColors[result.type],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={20} style={{ color: 'white' }} />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          marginBottom: '0.25rem'
                        }}>
                          {highlightText(result.title, query)}
                        </div>
                        
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          marginBottom: '0.5rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {highlightText(result.description, query)}
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)'
                        }}>
                          <span>{result.worldName}</span>
                          <span>•</span>
                          <span>{result.section}</span>
                          {result.subsection && (
                            <>
                              <span>•</span>
                              <span>{result.subsection}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Підказки */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-primary)',
          background: 'var(--bg-secondary)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span>↑↓ навігація</span>
          <span>Enter вибрати</span>
          <span>Esc закрити</span>
        </div>
      </div>
    </div>
  );
};