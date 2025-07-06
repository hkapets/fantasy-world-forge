import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Modal } from './Modal';
import { ChronologyEvent } from '@/hooks/useChronologyData';

interface CreateEventModalProps {
  chronologyId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<ChronologyEvent, 'id' | 'chronologyId' | 'createdAt' | 'lastModified'>) => void;
  editingEvent?: ChronologyEvent | null;
}

const eventTypes = [
  { value: 'battles', label: 'Битви' },
  { value: 'states', label: 'Створення/знищення держав' },
  { value: 'characters', label: 'Народження/смерть персонажів' },
  { value: 'magic', label: 'Магічні події' },
  { value: 'other', label: 'Інші події' }
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  chronologyId,
  isOpen,
  onClose,
  onSave,
  editingEvent
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: 0,
    type: 'other',
    description: '',
    image: '',
    relatedLocations: '',
    relatedCharacters: ''
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name,
        date: editingEvent.date,
        type: editingEvent.type,
        description: editingEvent.description,
        image: editingEvent.image || '',
        relatedLocations: editingEvent.relatedLocations || '',
        relatedCharacters: editingEvent.relatedCharacters || ''
      });
    } else {
      setFormData({
        name: '',
        date: 0,
        type: 'other',
        description: '',
        image: '',
        relatedLocations: '',
        relatedCharacters: ''
      });
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave({
        name: formData.name.trim(),
        date: formData.date,
        type: formData.type,
        description: formData.description.trim(),
        image: formData.image.trim() || undefined,
        relatedLocations: formData.relatedLocations.trim() || undefined,
        relatedCharacters: formData.relatedCharacters.trim() || undefined
      });
      onClose();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={editingEvent ? 'Редагувати подію' : 'Створити подію'}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
          {/* Зображення */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Зображення
            </label>
            
            <div style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              
              {formData.image ? (
                <div>
                  <img
                    src={formData.image}
                    alt="Прев'ю"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Клікніть для зміни
                  </p>
                </div>
              ) : (
                <div>
                  <ImageIcon size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Додати зображення
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Назва події */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                Назва події *
              </label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введіть назву події"
                required
              />
            </div>

            {/* Дата */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                Рік *
              </label>
              <input
                type="number"
                className="input"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Тип події */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Тип події
            </label>
            <select
              className="input"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Опис */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Опис
            </label>
            <textarea
              className="input"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Опишіть подію"
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Пов'язані локації */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Пов'язані локації
            </label>
            <input
              type="text"
              className="input"
              value={formData.relatedLocations}
              onChange={(e) => setFormData(prev => ({ ...prev, relatedLocations: e.target.value }))}
              placeholder="Вкажіть пов'язані локації"
            />
          </div>

          {/* Пов'язані персонажі */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Пов'язані персонажі
            </label>
            <input
              type="text"
              className="input"
              value={formData.relatedCharacters}
              onChange={(e) => setFormData(prev => ({ ...prev, relatedCharacters: e.target.value }))}
              placeholder="Вкажіть пов'язаних персонажів"
            />
          </div>

          {/* Кнопки */}
          <div style={{
            display: 'flex',
            gap: '1rem',
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
              {editingEvent ? 'Зберегти зміни' : 'Створити'}
            </button>
          </div>
      </form>
    </Modal>
  );
};