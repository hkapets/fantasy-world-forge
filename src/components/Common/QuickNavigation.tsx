import React, { useState, useEffect } from 'react';
import { Zap, Users, BookOpen, Clock, MapPin, FileText, Film, Star } from 'lucide-react';

interface QuickNavItem {
  id: string;
  type: 'character' | 'lore' | 'note' | 'map' | 'scenario' | 'chronology';
  name: string;
  section: string;
  subsection?: string;
  isFavorite?: boolean;
  lastAccessed?: number;
}

interface QuickNavigationProps {
  currentWorldId: string;
  onNavigate: (section: string, subsection?: string, itemId?: string) => void;
  maxItems?: number;
}

const typeIcons = {
  character: Users,
  lore: BookOpen,
  note: FileText,
  map: MapPin,
  scenario: Film,
  chronology: Clock
};

const typeColors = {
  character: 'var(--fantasy-primary)',
  lore: 'var(--success)',
  note: 'var(--info)',
  map: 'var(--fantasy-secondary)',
  scenario: 'var(--purple)',
  chronology: 'var(--warning)'
};

export const QuickNavigation: React.FC<QuickNavigationProps> = ({
  currentWorldId,
  onNavigate,
  maxItems = 8
}) => {
  const [quickNavItems, setQuickNavItems] = useState<QuickNavItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentWorldId) return;
    
    loadQuickNavItems();
    loadFavorites();
  }, [currentWorldId]);

  const loadQuickNavItems = () => {
    try {
      const items: QuickNavItem[] = [];

      // Завантажуємо персонажів
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      characters
        .filter((char: any) => char.worldId === currentWorldId)
        .slice(0, 3)
        .forEach((char: any) => {
          items.push({
            id: char.id,
            type: 'character',
            name: char.name,
            section: 'characters',
            lastAccessed: new Date(char.lastModified).getTime()
          });
        });

      // Завантажуємо лор
      const loreItems = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${currentWorldId}`) || '[]');
      loreItems
        .slice(0, 2)
        .forEach((item: any) => {
          items.push({
            id: item.id,
            type: 'lore',
            name: item.name,
            section: 'lore',
            subsection: item.type,
            lastAccessed: new Date(item.lastModified).getTime()
          });
        });

      // Завантажуємо нотатки
      const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${currentWorldId}`) || '[]');
      notes
        .slice(0, 2)
        .forEach((note: any) => {
          items.push({
            id: note.id,
            type: 'note',
            name: note.title,
            section: 'notes',
            lastAccessed: new Date(note.lastModified).getTime()
          });
        });

      // Завантажуємо карти
      const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${currentWorldId}`) || '[]');
      maps
        .slice(0, 1)
        .forEach((map: any) => {
          items.push({
            id: map.id,
            type: 'map',
            name: map.name,
            section: 'maps',
            lastAccessed: new Date(map.lastModified).getTime()
          });
        });

      // Сортуємо за останнім доступом та обмежуємо кількість
      const sortedItems = items
        .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
        .slice(0, maxItems);

      setQuickNavItems(sortedItems);
    } catch (error) {
      console.error('Error loading quick nav items:', error);
    }
  };

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem(`fantasyWorldBuilder_favorites_${currentWorldId}`);
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    
    setFavorites(newFavorites);
    localStorage.setItem(
      `fantasyWorldBuilder_favorites_${currentWorldId}`, 
      JSON.stringify(Array.from(newFavorites))
    );
  };

  const handleItemClick = (item: QuickNavItem) => {
    onNavigate(item.section, item.subsection, item.id);
  };

  if (quickNavItems.length === 0) {
    return null;
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <Zap size={18} style={{ color: 'var(--fantasy-primary)' }} />
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Швидка навігація
        </h4>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.75rem'
      }}>
        {quickNavItems.map(item => {
          const Icon = typeIcons[item.type];
          const isFavorite = favorites.has(item.id);
          
          return (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => handleItemClick(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--fantasy-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-primary)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: typeColors[item.type],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={16} style={{ color: 'white' }} />
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'capitalize'
                }}>
                  {item.type === 'character' ? 'Персонаж' :
                   item.type === 'lore' ? 'Лор' :
                   item.type === 'note' ? 'Нотатка' :
                   item.type === 'map' ? 'Карта' :
                   item.type === 'scenario' ? 'Сценарій' :
                   item.type === 'chronology' ? 'Хронологія' : item.type}
                </div>
              </div>

              {/* Кнопка улюбленого */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isFavorite ? 'var(--warning)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.2s ease'
                }}
                title={isFavorite ? 'Видалити з улюблених' : 'Додати до улюблених'}
              >
                <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};