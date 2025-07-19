import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MapMarker } from '@/hooks/useMapsData';
import { Modal } from './Modal';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CreateMarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (markerData: Omit<MapMarker, 'id' | 'mapId' | 'createdAt' | 'lastModified'>) => void;
  editingMarker?: MapMarker | null;
  currentWorldId: string;
}

const markerTypes = [
  { value: 'location', label: 'Локація' },
  { value: 'character', label: 'Персонаж' },
  { value: 'event', label: 'Подія' },
  { value: 'lore', label: 'Знання' }
] as const;

const markerSizes = [
  { value: 'small', label: 'Малий' },
  { value: 'medium', label: 'Середній' },
  { value: 'large', label: 'Великий' }
] as const;

const predefinedColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16', '#06b6d4', '#eab308'
];

export const CreateMarkerModal: React.FC<CreateMarkerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMarker,
  currentWorldId
}) => {
  const [characters] = useLocalStorage('fantasyWorldBuilder_characters', []);
  const [loreItems] = useLocalStorage(`fantasyWorldBuilder_lore_${currentWorldId}`, []);
  
  // Фільтруємо персонажів поточного світу
  const worldCharacters = characters.filter((char: any) => char.worldId === currentWorldId);
  
  const [formData, setFormData] = useState({
    type: 'location' as 'location' | 'character' | 'event' | 'lore',
    entityId: '',
    entityName: '',
    title: '',
    description: '',
    color: '#3b82f6',
    size: 'medium' as 'small' | 'medium' | 'large',
    x: 0,
    y: 0,
    isVisible: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingMarker) {
      setFormData({
        type: editingMarker.type,
        entityId: editingMarker.entityId,
        entityName: editingMarker.entityName,
        title: editingMarker.title,
        description: editingMarker.description,
        color: editingMarker.color,
        size: editingMarker.size,
        x: editingMarker.x,
        y: editingMarker.y,
        isVisible: editingMarker.isVisible
      });
    } else {
      setFormData({
        type: 'location' as 'location' | 'character' | 'event' | 'lore',
        entityId: '',
        entityName: '',
        title: '',
        description: '',
        color: '#3b82f6',
        size: 'medium' as 'small' | 'medium' | 'large',
        x: 0,
        y: 0,
        isVisible: true
      });
    }
    setErrors({});
  }, [editingMarker, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Назва маркера обов\'язкова';
    }

    if (!formData.entityName.trim()) {
      newErrors.entityName = 'Назва сутності обов\'язкова';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave({
      ...formData,
      entityId: formData.entityId || Date.now().toString()
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingMarker ? 'Редагувати маркер' : 'Створити маркер'}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--background)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Заголовок */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            {editingMarker ? 'Редагувати маркер' : 'Створити маркер'}
          </h2>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            style={{ padding: '0.5rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Тип маркера */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Тип маркера
              </label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                {markerTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Швидкий вибір персонажа */}
            {formData.type === 'character' && worldCharacters.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Швидкий вибір персонажа
                </label>
                <select
                  className="input"
                  value=""
                  onChange={(e) => {
                    const selectedChar = worldCharacters.find((char: any) => char.id === e.target.value);
                    if (selectedChar) {
                      handleInputChange('entityId', selectedChar.id);
                      handleInputChange('entityName', selectedChar.name);
                      handleInputChange('title', selectedChar.name);
                      handleInputChange('description', `${selectedChar.status}${selectedChar.birthPlace ? ` • Народився: ${selectedChar.birthPlace}` : ''}`);
                    }
                  }}
                >
                  <option value="">Оберіть персонажа...</option>
                  {worldCharacters.map((char: any) => (
                    <option key={char.id} value={char.id}>
                      {char.name} ({char.race} {char.characterClass})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Назва маркера */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Назва маркера *
              </label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Назва маркера на карті"
              />
              {errors.title && (
                <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>
                  {errors.title}
                </span>
              )}
            </div>

            {/* Назва сутності */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Назва сутності *
              </label>
              <input
                type="text"
                className="input"
                value={formData.entityName}
                onChange={(e) => handleInputChange('entityName', e.target.value)}
                placeholder="Назва пов'язаної сутності"
              />
              {errors.entityName && (
                <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>
                  {errors.entityName}
                </span>
              )}
            </div>

            {/* Опис */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Опис
              </label>
              <textarea
                className="input"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Додатковий опис маркера"
                rows={3}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            {/* Колір та розмір */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Колір
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleInputChange('color', color)}
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: color,
                        border: formData.color === color ? '3px solid var(--primary)' : '2px solid var(--border)',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%', height: '40px' }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Розмір
                </label>
                <select
                  className="input"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                >
                  {markerSizes.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Видимість */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) => handleInputChange('isVisible', e.target.checked)}
              />
              <label htmlFor="isVisible" style={{ fontSize: '0.875rem' }}>
                Показувати маркер на карті
              </label>
            </div>
          </div>

          {/* Кнопки */}
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            marginTop: '2rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingMarker ? 'Зберегти зміни' : 'Створити маркер'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};