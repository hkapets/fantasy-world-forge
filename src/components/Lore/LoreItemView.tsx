import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react';
import { QuickLinksPanel } from '../Common/QuickLinksPanel';
import { RelationshipNetwork } from '../Common/RelationshipNetwork';
import { SmartSuggestions } from '../Common/SmartSuggestions';

interface LoreItemViewProps {
  item: any;
  type: string;
  onBack: () => void;
  onSave: (item: any) => void;
  onDelete: (itemId: string) => void;
}

export const LoreItemView: React.FC<LoreItemViewProps> = ({
  item,
  type,
  onBack,
  onSave,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = () => {
    onSave({
      ...editedItem,
      lastModified: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      onDelete(item.id);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Розумні пропозиції */}
      <SmartSuggestions
        entityId={item.id}
        entityType="lore"
        worldId={item.worldId}
        maxSuggestions={2}
      />

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '2rem' 
      }}>
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
          Назад
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isEditing ? (
            <>
              <button
                className="btn btn-primary"
                onClick={handleSave}
              >
                <Save size={20} style={{ marginRight: '0.5rem' }} />
                Зберегти
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                <X size={20} style={{ marginRight: '0.5rem' }} />
                Скасувати
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={20} style={{ marginRight: '0.5rem' }} />
                Редагувати
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <Trash2 size={20} style={{ marginRight: '0.5rem' }} />
                Видалити
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Image */}
        {(isEditing ? editedItem.image : item.image) && (
          <div style={{
            width: '100%',
            height: '300px',
            background: `url(${isEditing ? editedItem.image : item.image}) center/cover`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }} />
        )}

        {isEditing && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label">Зображення (URL)</label>
            <input
              type="url"
              className="input"
              value={editedItem.image || ''}
              onChange={(e) => setEditedItem({ ...editedItem, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {/* Name */}
        {isEditing ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label">Назва</label>
            <input
              type="text"
              className="input"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            />
          </div>
        ) : (
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            {item.name}
          </h1>
        )}

        {/* Subtype/Type specific fields */}
        {type === 'geography' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label">Тип</label>
            {isEditing ? (
              <select
                className="input"
                value={editedItem.subtype || ''}
                onChange={(e) => setEditedItem({ ...editedItem, subtype: e.target.value })}
              >
                <option value="">Оберіть тип</option>
                <option value="galaxy">Галактика</option>
                <option value="star-system">Зоряна система</option>
                <option value="star">Зірка</option>
                <option value="planet">Планета</option>
                <option value="satellite">Супутник</option>
                <option value="other-astronomical">Інший астрономічний об'єкт</option>
                <option value="continent">Континент</option>
                <option value="ocean">Океан</option>
                <option value="sea">Море</option>
                <option value="lake">Озеро</option>
                <option value="river">Річка</option>
                <option value="mountain">Гора</option>
                <option value="other-natural">Інші природні об'єкти</option>
                <option value="country">Країна</option>
                <option value="city">Місто</option>
                <option value="village">Село</option>
                <option value="capital">Столиця</option>
                <option value="forest">Ліс</option>
                <option value="desert">Пустеля</option>
                <option value="steppe">Степ</option>
                <option value="glacier">Льодовик</option>
                <option value="fortress">Фортеця</option>
                <option value="castle">Замок</option>
                <option value="cave">Печера</option>
                <option value="dungeon">Підземелля</option>
                <option value="temple">Храм</option>
                <option value="ruins">Руїни</option>
                <option value="magical-object">Магічний об'єкт</option>
                <option value="custom">Користувацька локація</option>
              </select>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>{item.subtype}</p>
            )}
          </div>
        )}

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label">Опис</label>
          {isEditing ? (
            <textarea
              className="input"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              rows={8}
              style={{ resize: 'vertical' }}
            />
          ) : (
            <div style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {item.description}
            </div>
          )}
        </div>

        {/* Additional fields based on type */}
        {(item.relatedLocations || isEditing) && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label">Пов'язані локації</label>
            {isEditing ? (
              <input
                type="text"
                className="input"
                value={editedItem.relatedLocations || ''}
                onChange={(e) => setEditedItem({ ...editedItem, relatedLocations: e.target.value })}
                placeholder="Назви локацій через кому"
              />
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>{item.relatedLocations}</p>
            )}
          </div>
        )}

        {/* Meta info */}
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-primary)'
        }}>
          <p>Створено: {new Date(item.createdAt).toLocaleDateString('uk-UA')}</p>
          {item.lastModified && (
            <p>Останні зміни: {new Date(item.lastModified).toLocaleDateString('uk-UA')}</p>
          )}
        </div>
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
            entityId={item.id}
            entityType="lore"
            worldId={item.worldId}
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
        entityId={item.id}
        entityType="lore"
        entityName={item.name}
        worldId={item.worldId}
        onNavigate={(entityType, entityId) => {
          console.log('Navigate to:', entityType, entityId);
        }}
      />
    </div>
  );
};