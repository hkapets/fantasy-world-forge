import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Save } from 'lucide-react';
import { CharacterLocationSync } from './CharacterLocationSync';
import { QuickLinksPanel } from '../Common/QuickLinksPanel';
import { RelationshipNetwork } from '../Common/RelationshipNetwork';
import { SmartSuggestions } from '../Common/SmartSuggestions';

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

interface CharacterViewProps {
  character: Character;
  onBack: () => void;
  onEdit: (character: Character) => void;
  onDelete: (characterId: string) => void;
  onSave: (character: Character) => void;
}

export const CharacterView: React.FC<CharacterViewProps> = ({
  character,
  onBack,
  onEdit,
  onDelete,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState<Character>(character);
  const [showQuickLinks, setShowQuickLinks] = useState(true);

  const handleSave = () => {
    onSave(editedCharacter);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCharacter(character);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Ви впевнені, що хочете видалити персонажа "${character.name}"?`)) {
      onDelete(character.id);
      onBack();
    }
  };

  const handleChange = (field: keyof Character, value: string) => {
    setEditedCharacter(prev => ({ ...prev, [field]: value }));
  };

  const InfoField: React.FC<{ 
    label: string; 
    value: string; 
    field?: keyof Character;
    multiline?: boolean;
  }> = ({ label, value, field, multiline = false }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </label>
      {isEditing && field ? (
        multiline ? (
          <textarea
            className="input"
            value={editedCharacter[field] as string}
            onChange={(e) => handleChange(field, e.target.value)}
            rows={4}
            style={{ minHeight: '100px', resize: 'vertical' }}
          />
        ) : (
          <input
            type="text"
            className="input"
            value={editedCharacter[field] as string}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        )
      ) : (
        <div style={{
          padding: '0.75rem 0',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          lineHeight: '1.6',
          whiteSpace: multiline ? 'pre-wrap' : 'normal'
        }}>
          {value || 'Не вказано'}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      {/* Розумні пропозиції */}
      <SmartSuggestions
        entityId={character.id}
        entityType="character"
        worldId={character.worldId}
        maxSuggestions={2}
      />

      {/* Хедер */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="btn btn-secondary"
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ArrowLeft size={18} />
            Назад
          </button>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {character.name}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isEditing ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Скасувати
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={18} />
                Зберегти
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Edit size={18} />
                Редагувати
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Trash2 size={18} />
                Видалити
              </button>
            </>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Зображення та основна інформація */}
        <div style={{ marginBottom: '2rem' }}>
          {/* Зображення */}
          {character.image && (
            <div style={{
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img 
                src={character.image} 
                alt={character.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-lg)',
                  border: '3px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-card)'
                }}
              />
            </div>
          )}

          {/* Базові характеристики */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Основна інформація
            </h3>

            <InfoField label="Раса" value={character.race} field="race" />
            <InfoField label="Клас" value={character.characterClass} field="characterClass" />
            <InfoField label="Статус" value={character.status} field="status" />
          </div>
        </div>

        {/* Детальна інформація */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: 'var(--text-primary)'
            }}>
              Детальна інформація
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <InfoField label="Дата народження" value={character.birthDate} field="birthDate" />
                <InfoField label="Місце народження" value={character.birthPlace} field="birthPlace" />
                <InfoField label="Етнічна приналежність" value={character.ethnicity} field="ethnicity" />
              </div>
              <div>
                <InfoField label="Родичі" value={character.relatives} field="relatives" />
              </div>
            </div>

            <InfoField 
              label="Опис персонажа" 
              value={character.description} 
              field="description" 
              multiline={true}
            />

            {/* Метадані */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--text-muted)'
            }}>
              <div>Створено: {new Date(character.createdAt).toLocaleString('uk-UA')}</div>
              <div>Остання зміна: {new Date(character.lastModified).toLocaleString('uk-UA')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Інтеграція з картами */}
      <div style={{ marginTop: '2rem' }}>
        <CharacterLocationSync 
          character={character}
          onNavigateToMap={(mapId, markerId) => {
            // TODO: Реалізувати навігацію до карти з фокусом на маркері
            console.log('Navigate to map:', mapId, 'marker:', markerId);
          }}
        />
      </div>

      {/* Мережа зв'язків */}
      <div style={{ marginTop: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Мережа зв'язків
          </h3>
          
          <RelationshipNetwork
            entityId={character.id}
            entityType="character"
            worldId={character.worldId}
            onNavigate={(entityType, entityId) => {
              console.log('Navigate to:', entityType, entityId);
            }}
            width={700}
            height={400}
          />
        </div>
      </div>

      {/* Панель швидких зв'язків */}
      <QuickLinksPanel
        entityId={character.id}
        entityType="character"
        entityName={character.name}
        worldId={character.worldId}
        onNavigate={(entityType, entityId) => {
          console.log('Navigate to:', entityType, entityId);
        }}
        isCollapsed={!showQuickLinks}
      />
    </div>
  );
};