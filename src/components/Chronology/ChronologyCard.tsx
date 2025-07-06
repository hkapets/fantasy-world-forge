import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Chronology } from '@/hooks/useChronologyData';

interface ChronologyCardProps {
  chronology: Chronology;
  onClick: () => void;
}

export const ChronologyCard: React.FC<ChronologyCardProps> = ({ chronology, onClick }) => {
  return (
    <div
      className="card card-hover"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      {chronology.image && (
        <div style={{
          width: '100%',
          height: '180px',
          background: `url(${chronology.image}) center/cover`,
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
        }} />
      )}
      
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem'
          }}>
            <Clock size={20} style={{ color: 'white' }} />
          </div>
          
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}>
            {chronology.name}
          </h3>
        </div>
        
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          marginBottom: '0.75rem'
        }}>
          {chronology.description}
        </p>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <Calendar size={14} style={{ marginRight: '0.25rem' }} />
          Створено {new Date(chronology.createdAt).toLocaleDateString('uk-UA')}
        </div>
      </div>
    </div>
  );
};