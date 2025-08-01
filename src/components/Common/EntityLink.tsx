import React, { useState } from 'react';
import { EntityTooltip } from './EntityTooltip';
import { QuickPreview } from './QuickPreview';

interface EntityLinkProps {
  entityType: 'character' | 'lore' | 'chronology' | 'event' | 'note' | 'map' | 'scenario';
  entityId: string;
  entityName: string;
  worldId: string;
  onNavigate?: (entityType: string, entityId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  showTooltip?: boolean;
  children?: React.ReactNode;
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  entityType,
  entityId,
  entityName,
  worldId,
  onNavigate,
  className = '',
  style = {},
  showTooltip = true,
  children
}) => {
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      // Shift/Ctrl/Cmd + click = quick preview
      const rect = e.currentTarget.getBoundingClientRect();
      setPreviewPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setShowQuickPreview(true);
    } else if (onNavigate) {
      // Regular click = navigate
      onNavigate(entityType, entityId);
    }
  };

  const handleQuickPreview = () => {
    setShowQuickPreview(true);
  };

  const linkStyle: React.CSSProperties = {
    color: 'var(--fantasy-primary)',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '1px solid transparent',
    transition: 'all 0.2s ease',
    ...style
  };

  const linkContent = (
    <span
      className={className}
      style={linkStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottomColor = 'var(--fantasy-primary)';
        e.currentTarget.style.color = 'var(--fantasy-secondary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottomColor = 'transparent';
        e.currentTarget.style.color = 'var(--fantasy-primary)';
      }}
      title={`${entityType === 'character' ? 'Персонаж' : 
              entityType === 'lore' ? 'Лор' :
              entityType === 'note' ? 'Нотатка' :
              entityType === 'map' ? 'Карта' :
              entityType === 'scenario' ? 'Сценарій' : 'Елемент'}: ${entityName}`}
    >
      {children || entityName}
    </span>
  );

  return (
    <>
      {showTooltip ? (
        <EntityTooltip
          entityType={entityType}
          entityId={entityId}
          worldId={worldId}
          onQuickPreview={handleQuickPreview}
        >
          {linkContent}
        </EntityTooltip>
      ) : (
        linkContent
      )}

      <QuickPreview
        entityType={entityType}
        entityId={entityId}
        worldId={worldId}
        isOpen={showQuickPreview}
        onClose={() => setShowQuickPreview(false)}
        onNavigate={onNavigate ? () => onNavigate(entityType, entityId) : undefined}
        position={previewPosition}
      />
    </>
  );
};