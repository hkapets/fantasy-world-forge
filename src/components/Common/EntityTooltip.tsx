import React, { useState, useEffect, useRef } from 'react';
import { Users, BookOpen, Clock, MapPin, FileText, Film, Calendar } from 'lucide-react';

interface EntityTooltipProps {
  entityType: 'character' | 'lore' | 'chronology' | 'event' | 'note' | 'map' | 'scenario';
  entityId: string;
  worldId: string;
  children: React.ReactNode;
  onQuickPreview?: () => void;
  delay?: number;
}

const entityTypeIcons = {
  character: Users,
  lore: BookOpen,
  chronology: Clock,
  event: Calendar,
  note: FileText,
  map: MapPin,
  scenario: Film
};

const entityTypeColors = {
  character: 'var(--fantasy-primary)',
  lore: 'var(--success)',
  chronology: 'var(--warning)',
  event: 'var(--warning)',
  note: 'var(--info)',
  map: 'var(--fantasy-secondary)',
  scenario: 'var(--purple)'
};

export const EntityTooltip: React.FC<EntityTooltipProps> = ({
  entityType,
  entityId,
  worldId,
  children,
  onQuickPreview,
  delay = 800
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [entityData, setEntityData] = useState<any>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !entityId) return;

    const loadEntityData = async () => {
      try {
        let data = null;

        switch (entityType) {
          case 'character':
            const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
            data = characters.find((char: any) => char.id === entityId && char.worldId === worldId);
            break;

          case 'lore':
            const loreItems = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`) || '[]');
            data = loreItems.find((item: any) => item.id === entityId);
            break;

          case 'note':
            const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
            data = notes.find((note: any) => note.id === entityId);
            break;

          case 'map':
            const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
            data = maps.find((map: any) => map.id === entityId);
            break;

          case 'scenario':
            const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
            data = scenarios.find((scenario: any) => scenario.id === entityId && scenario.worldId === worldId);
            break;
        }

        setEntityData(data);
      } catch (error) {
        console.error('Error loading tooltip data:', error);
      }
    };

    loadEntityData();
  }, [entityType, entityId, worldId, isVisible]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getEntityTitle = () => {
    if (!entityData) return 'Завантаження...';
    
    switch (entityType) {
      case 'character':
        return entityData.name;
      case 'lore':
        return entityData.name;
      case 'note':
        return entityData.title;
      case 'map':
        return entityData.name;
      case 'scenario':
        return entityData.title;
      default:
        return 'Невідомо';
    }
  };

  const getEntitySubtitle = () => {
    if (!entityData) return '';
    
    switch (entityType) {
      case 'character':
        return `${entityData.race || ''} ${entityData.characterClass || ''}`.trim();
      case 'lore':
        return entityData.subtype || entityData.type;
      case 'note':
        return entityData.category;
      case 'map':
        return `${entityData.width} × ${entityData.height}`;
      case 'scenario':
        return `${entityData.type} • ${entityData.difficulty}`;
      default:
        return '';
    }
  };

  const Icon = entityTypeIcons[entityType];
  const color = entityTypeColors[entityType];

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            boxShadow: 'var(--shadow-modal)',
            zIndex: 1002,
            minWidth: '200px',
            maxWidth: '300px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Icon size={16} style={{ color }} />
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}>
              {getEntityTitle()}
            </div>
          </div>
          
          {getEntitySubtitle() && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem'
            }}>
              {getEntitySubtitle()}
            </div>
          )}

          {entityData?.description && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: '1.4',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {entityType === 'note' ? entityData.content : entityData.description}
            </div>
          )}

          {onQuickPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickPreview();
                setIsVisible(false);
              }}
              style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                background: color,
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Детальний перегляд
            </button>
          )}

          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--bg-primary)'
          }} />
        </div>
      )}
    </div>
  );
};