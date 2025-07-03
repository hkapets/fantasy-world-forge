import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Character {
  id: string;
  worldId: string;
  image?: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  race: string;
  ethnicity: string;
  status: string;
  relatives: string;
  characterClass: string;
  description: string;
  createdAt: string;
  lastModified: string;
}

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  onEdit,
  onDelete
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Ви впевнені, що хочете видалити персонажа "${character.name}"?`)) {
      onDelete();
    }
  };

  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        height: '280px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onClick}
    >
      {/* Кнопки дій */}
      <div style={{
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 10
      }}>
        <button
          onClick={handleEdit}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--fantasy-primary)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Редагувати персонажа"
        >
          <Edit size={16} />
        </button>
        
        <button
          onClick={handleDelete}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--fantasy-danger)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Видалити персонажа"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Зображення персонажа */}
      <div style={{
        height: '160px',
        background: character.image ? 
          `url(${character.image})` : 
          'var(--gradient-primary)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        position: 'relative'
      }}>
        {!character.image && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '3rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {character.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Інформація про персонажа */}
      <div style={{
        padding: '1rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            lineHeight: '1.3'
          }}>
            {character.name}
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            {character.race && (
              <div>
                <span style={{ fontWeight: '500' }}>Раса:</span> {character.race}
              </div>
            )}
            {character.characterClass && (
              <div>
                <span style={{ fontWeight: '500' }}>Клас:</span> {character.characterClass}
              </div>
            )}
            {character.status && (
              <div>
                <span style={{ fontWeight: '500' }}>Статус:</span> {character.status}
              </div>
            )}
          </div>
        </div>

        <div style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          marginTop: '0.5rem'
        }}>
          Створено: {new Date(character.createdAt).toLocaleDateString('uk-UA')}
        </div>
      </div>
    </div>
  );
};