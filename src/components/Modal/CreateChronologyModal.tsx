import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Modal } from './Modal';
import { Chronology } from '@/hooks/useChronologyData';

interface CreateChronologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chronologyData: Omit<Chronology, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => void;
  editingChronology?: Chronology | null;
}

export const CreateChronologyModal: React.FC<CreateChronologyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingChronology
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (editingChronology) {
      setFormData({
        name: editingChronology.name,
        description: editingChronology.description,
        image: editingChronology.image || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: ''
      });
    }
  }, [editingChronology, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || undefined
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
      title={editingChronology ? 'Редагувати хронологію' : 'Створити хронологію'}
      maxWidth="500px"
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
              transition: 'border-color 0.2s ease',
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
                      maxHeight: '200px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    Клікніть для зміни зображення
                  </p>
                </div>
              ) : (
                <div>
                  <ImageIcon 
                    size={48} 
                    style={{
                      color: 'var(--text-muted)',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    Клікніть або перетягніть зображення
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Назва */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Назва хронології *
            </label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Введіть назву хронології"
              required
            />
          </div>

          {/* Опис */}
          <div style={{ marginBottom: '2rem' }}>
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
              placeholder="Опишіть цю хронологію"
              rows={4}
              style={{ resize: 'vertical' }}
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
              {editingChronology ? 'Зберегти зміни' : 'Створити'}
            </button>
          </div>
      </form>
    </Modal>
  );
};