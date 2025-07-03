import React from 'react';

interface LoreItem {
  id: string;
  name: string;
  image?: string;
  type: string;
  subtype?: string;
  description: string;
  createdAt: string;
}

interface LoreCardProps {
  item: LoreItem;
  onClick: () => void;
}

export const LoreCard: React.FC<LoreCardProps> = ({ item, onClick }) => {
  return (
    <div
      className="card card-hover"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      {item.image && (
        <div style={{
          width: '100%',
          height: '180px',
          background: `url(${item.image}) center/cover`,
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
        }} />
      )}
      
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {item.name}
        </h3>
        
        {item.subtype && (
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'var(--text-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            {item.subtype}
          </div>
        )}
        
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {item.description}
        </p>
      </div>
    </div>
  );
};