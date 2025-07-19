import React, { useState } from 'react';
import { Modal } from './Modal';

import { TagInput } from '../Common/TagInput';
import { RelatedEntities } from '../Common/RelatedEntities';
import { useTagsSystem } from '@/hooks/useTagsSystem';

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
  tags?: string[];
  createdAt: string;
  lastModified: string;
}

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Omit<Character, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => void;
  editingCharacter?: Character | null;
  currentWorldId?: string;
}

export const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCharacter,
  currentWorldId
}) => {
  const { createAutoRelationships } = useTagsSystem(currentWorldId || '');

  const [formData, setFormData] = useState({
    image: editingCharacter?.image || '',
    name: editingCharacter?.name || '',
    birthDate: editingCharacter?.birthDate || '',
    birthPlace: editingCharacter?.birthPlace || '',
    race: editingCharacter?.race || '',
    ethnicity: editingCharacter?.ethnicity || '',
    status: editingCharacter?.status || '',
    relatives: editingCharacter?.relatives || '',
    characterClass: editingCharacter?.characterClass || '',
    description: editingCharacter?.description || '',
    tags: editingCharacter?.tags || []
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Будь ласка, введіть ім\'я персонажа');
      return;
    }

    onSave(formData);
    
    // Очистити форму якщо це не редагування
    if (!editingCharacter) {
      setFormData({
        image: '',
        name: '',
        birthDate: '',
        birthPlace: '',
        race: '',
        ethnicity: '',
        status: '',
        relatives: '',
        characterClass: '',
        description: '',
        tags: []
      });
    }
    onClose();
  };

  const handleCancel = () => {
    if (!editingCharacter) {
      setFormData({
        image: '',
        name: '',
        birthDate: '',
        birthPlace: '',
        race: '',
        ethnicity: '',
        status: '',
        relatives: '',
        characterClass: '',
        description: '',
        tags: []
      });
    } else {
      setFormData({
        image: editingCharacter.image || '',
        name: editingCharacter.name,
        birthDate: editingCharacter.birthDate,
        birthPlace: editingCharacter.birthPlace,
        race: editingCharacter.race,
        ethnicity: editingCharacter.ethnicity,
        status: editingCharacter.status,
        relatives: editingCharacter.relatives,
        characterClass: editingCharacter.characterClass,
        description: editingCharacter.description,
        tags: editingCharacter.tags || []
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={editingCharacter ? 'Редагувати персонажа' : 'Створити нового персонажа'}
      onSave={handleSave}
      onCancel={handleCancel}
      maxWidth="700px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Зображення */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Зображення персонажа
          </label>
          
          {formData.image && (
            <div style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img 
                src={formData.image} 
                alt="Персонаж"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border-primary)'
                }}
              />
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="input"
            style={{ padding: '0.5rem' }}
          />
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem'
          }}>
            Оберіть зображення або залиште порожнім
          </div>
        </div>

        {/* Основна інформація */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Ім'я персонажа *
            </label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Введіть ім'я персонажа..."
              maxLength={100}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Дата народження
            </label>
            <input
              type="text"
              className="input"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              placeholder="наpr., 15 день весни 1205 року..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Місце народження
            </label>
            <input
              type="text"
              className="input"
              value={formData.birthPlace}
              onChange={(e) => handleChange('birthPlace', e.target.value)}
              placeholder="Місто, регіон або країна..."
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Раса
            </label>
            <input
              type="text"
              className="input"
              value={formData.race}
              onChange={(e) => handleChange('race', e.target.value)}
              placeholder="Ельф, людина, дворф..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Етнічна приналежність
            </label>
            <input
              type="text"
              className="input"
              value={formData.ethnicity}
              onChange={(e) => handleChange('ethnicity', e.target.value)}
              placeholder="Північні ельфи, степові номади..."
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Статус
            </label>
            <input
              type="text"
              className="input"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              placeholder="Живий, мертвий, зниклий..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Родичі
            </label>
            <input
              type="text"
              className="input"
              value={formData.relatives}
              onChange={(e) => handleChange('relatives', e.target.value)}
              placeholder="Батьки, діти, брати/сестри..."
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Клас
            </label>
            <input
              type="text"
              className="input"
              value={formData.characterClass}
              onChange={(e) => handleChange('characterClass', e.target.value)}
              placeholder="Воїн, маг, злодій, лицар..."
            />
          </div>
        </div>

        {/* Опис */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Опис персонажа
          </label>
          <textarea
            className="input"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Детальний опис зовнішності, характеру, історії персонажа..."
            rows={6}
            style={{ 
              resize: 'vertical',
              minHeight: '150px'
            }}
          />
        </div>

        {/* Теги */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Теги
          </label>
          {currentWorldId && (
            <TagInput
              tags={formData.tags}
              onChange={(tags) => handleChange('tags', tags)}
              worldId={currentWorldId}
              placeholder="Додати тег для персонажа..."
            />
          )}
        </div>

        {/* Пов'язані елементи */}
        {formData.tags.length > 0 && currentWorldId && (
          <div>
            <RelatedEntities
              entityId={editingCharacter?.id || 'new'}
              entityTags={formData.tags}
              worldId={currentWorldId}
              maxItems={4}
            />
          </div>
        )}

        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          * - обов'язкові поля
        </div>
      </div>
    </Modal>
  );
};