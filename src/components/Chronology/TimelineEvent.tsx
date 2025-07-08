import React, { useState } from 'react';
import { Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import { ChronologyEvent } from '@/hooks/useChronologyData';

interface TimelineEventProps {
  event: ChronologyEvent;
  style?: React.CSSProperties;
  onEdit: () => void;
  onDelete: () => void;
}

const eventTypeColors: { [key: string]: string } = {
  battles: 'var(--danger)',
  states: 'var(--warning)', 
  characters: 'var(--success)',
  magic: 'var(--accent)',
  other: 'var(--muted)'
};

const eventTypeLabels: { [key: string]: string } = {
  battles: 'Битва',
  states: 'Держава',
  characters: 'Персонаж',
  magic: 'Магія',
  other: 'Інше'
};

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  style,
  onEdit,
  onDelete
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const typeColor = eventTypeColors[event.type] || eventTypeColors.other;

  return (
    <div
      style={{
        ...style,
        width: '150px'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Connector line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: style?.top?.toString().includes('- 160px') ? '100%' : '-20px',
        width: '2px',
        height: '20px',
        background: typeColor,
        transform: 'translateX(-50%)'
      }} />

      {/* Event card */}
      <div
        className="card"
        style={{
          padding: '0.75rem',
          cursor: 'pointer',
          border: `2px solid ${typeColor}`,
          transition: 'all 0.2s ease'
        }}
        onClick={onEdit}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: typeColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {eventTypeLabels[event.type] || 'Подія'}
          </div>
          
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'var(--text-secondary)'
          }}>
            {event.date}
          </div>
        </div>

        <h4 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0,
          marginBottom: '0.5rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {event.name}
        </h4>

        {event.image && (
          <div style={{
            width: '100%',
            height: '60px',
            background: `url(${event.image}) center/cover`,
            borderRadius: 'var(--radius-sm)',
            marginBottom: '0.5rem'
          }} />
        )}

        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          margin: 0,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.3'
        }}>
          {event.description}
        </p>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          marginTop: '0.5rem'
        }}>
          <button
            className="btn-icon btn-icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{ background: 'var(--bg-secondary)' }}
          >
            <Edit size={14} />
          </button>
          <button
            className="btn-icon btn-icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Видалити подію "${event.name}"?`)) {
                onDelete();
              }
            }}
            style={{ background: 'var(--danger)', color: 'white' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (event.relatedLocations || event.relatedCharacters) && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '100%',
          marginLeft: '10px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          boxShadow: 'var(--shadow-lg)',
          width: '200px',
          zIndex: 1000,
          fontSize: '0.75rem'
        }}>
          {event.relatedLocations && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.25rem',
                color: 'var(--text-secondary)'
              }}>
                <MapPin size={12} style={{ marginRight: '0.25rem' }} />
                Локації:
              </div>
              <div style={{ color: 'var(--text-primary)' }}>
                {event.relatedLocations}
              </div>
            </div>
          )}
          
          {event.relatedCharacters && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.25rem',
                color: 'var(--text-secondary)'
              }}>
                <Users size={12} style={{ marginRight: '0.25rem' }} />
                Персонажі:
              </div>
              <div style={{ color: 'var(--text-primary)' }}>
                {event.relatedCharacters}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};