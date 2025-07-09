import React from 'react';
import { MapPin, Users, Calendar, Zap } from 'lucide-react';

interface LoreItem {
  id: string;
  name: string;
  image?: string;
  type: string;
  subtype?: string;
  description: string;
  relatedLocations?: string;
  relatedCharacters?: string;
  dangerLevel?: string;
  eventDate?: string;
  createdAt: string;
}

interface LoreCardProps {
  item: LoreItem;
  onClick: () => void;
}

const typeColors: Record<string, string> = {
  races: 'var(--fantasy-primary)',
  bestiary: 'var(--danger)',
  geography: 'var(--success)',
  history: 'var(--warning)',
  politics: 'var(--info)',
  religion: 'var(--purple)',
  languages: 'var(--cyan)',
  magic: 'var(--purple-light)',
  artifacts: 'var(--gold)'
};

const dangerLevelColors: Record<string, string> = {
  harmless: 'var(--success)',
  low: 'var(--warning)',
  medium: 'var(--orange)',
  high: 'var(--danger)',
  extreme: 'var(--danger-dark)'
};

export const LoreCard: React.FC<LoreCardProps> = ({ item, onClick }) => {
  const typeColor = typeColors[item.type] || 'var(--fantasy-primary)';

  const renderIcon = () => {
    switch (item.type) {
      case 'geography':
        return <MapPin size={16} />;
      case 'bestiary':
        return <Zap size={16} />;
      case 'history':
        return <Calendar size={16} />;
      case 'races':
      case 'politics':
      case 'religion':
        return <Users size={16} />;
      default:
        return null;
    }
  };

  const renderBadge = () => {
    if (item.dangerLevel) {
      const labels: Record<string, string> = {
        harmless: 'Нешкідливий',
        low: 'Низька загроза',
        medium: 'Середня загроза',
        high: 'Висока загроза',
        extreme: 'Критична загроза'
      };
      
      return (
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: dangerLevelColors[item.dangerLevel] || 'var(--bg-secondary)',
            color: 'white',
            fontWeight: '500'
          }}
        >
          {labels[item.dangerLevel] || item.dangerLevel}
        </span>
      );
    }

    if (item.eventDate) {
      return (
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            fontWeight: '500'
          }}
        >
          {item.eventDate}
        </span>
      );
    }

    if (item.subtype) {
      return (
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            fontWeight: '500'
          }}
        >
          {item.subtype}
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className="card card-hover"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%'
      }}
    >
      {/* Зображення */}
      {item.image && (
        <div
          style={{
            width: '100%',
            height: '150px',
            borderRadius: 'var(--radius)',
            background: `url(${item.image}) center/cover`,
            border: '1px solid var(--border-primary)'
          }}
        />
      )}

      {/* Заголовок та іконка */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0,
          flex: 1,
          lineHeight: '1.3'
        }}>
          {item.name}
        </h3>
        
        <div style={{ color: typeColor, flexShrink: 0 }}>
          {renderIcon()}
        </div>
      </div>

      {/* Бейдж */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {renderBadge()}
      </div>

      {/* Опис */}
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
        margin: 0,
        flex: 1,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
      }}>
        {item.description}
      </p>

      {/* Пов'язані елементи */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {item.relatedLocations && (
          <div style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: '500' }}>Локації:</span> {item.relatedLocations}
          </div>
        )}
        {item.relatedCharacters && (
          <div style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: '500' }}>Персонажі:</span> {item.relatedCharacters}
          </div>
        )}
        <div style={{ marginTop: '0.5rem', opacity: 0.7 }}>
          Створено {new Date(item.createdAt).toLocaleDateString('uk-UA')}
        </div>
      </div>
    </div>
  );
};