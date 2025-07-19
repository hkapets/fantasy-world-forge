import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { WorldMap } from '@/hooks/useMapsData';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CreateMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mapData: Omit<WorldMap, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => void;
  editingMap?: WorldMap | null;
  currentWorldId: string;
}

import { TagInput } from '../Common/TagInput';
import { RelatedEntities } from '../Common/RelatedEntities';

const placeholderImages = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop', 
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop'
];

export const CreateMapModal: React.FC<CreateMapModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMap,
  currentWorldId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    imageFile: '',
    width: 1920,
    height: 1080,
    scale: 1,
    isPublic: false,
    tags: [] as string[]
  });

  const [tagInput, setTagInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMap && isOpen) {
      setFormData({
        name: editingMap.name,
        description: editingMap.description,
        imageUrl: editingMap.imageUrl || '',
        imageFile: editingMap.imageFile || '',
        width: editingMap.width,
        height: editingMap.height,
        scale: editingMap.scale,
        isPublic: editingMap.isPublic,
        tags: editingMap.tags
      });
      setSelectedImage(editingMap.imageFile || editingMap.imageUrl || '');
    } else if (isOpen) {
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        imageFile: '',
        width: 1920,
        height: 1080,
        scale: 1,
        isPublic: false,
        tags: []
      });
      setSelectedImage('');
      setTagInput('');
    }
  }, [editingMap, isOpen]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          setFormData(prev => ({ 
            ...prev, 
            imageFile: base64String,
            imageUrl: '' 
          }));
          setSelectedImage(base64String);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Будь ласка, оберіть файл зображення');
      }
    }
  };

  const handlePlaceholderSelect = (imageUrl: string) => {
    setFormData(prev => ({ 
      ...prev, 
      imageUrl,
      imageFile: '' 
    }));
    setSelectedImage(imageUrl);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Введіть назву карти');
      return;
    }

    if (!selectedImage) {
      alert('Оберіть або завантажте зображення карти');
      return;
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl,
      imageFile: formData.imageFile,
      width: formData.width,
      height: formData.height,
      scale: formData.scale,
      isPublic: formData.isPublic,
      tags: formData.tags
    });

    onClose();
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      imageUrl: '',
      imageFile: '' 
    }));
    setSelectedImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={editingMap ? 'Редагувати карту' : 'Створити карту'}
    >
      <form onSubmit={handleSubmit}>
        {/* Назва карти */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Назва карти *
          </label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Наприклад: Карта Середзем'я"
          />
        </div>

        {/* Опис */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Опис
          </label>
          <textarea
            className="input"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Опишіть вашу карту..."
            rows={3}
            style={{
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Зображення карти */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Зображення карти *
          </label>

          {/* Поточне зображення */}
          {selectedImage && (
            <div style={{ 
              position: 'relative', 
              marginBottom: '1rem',
              maxWidth: '300px'
            }}>
              <img 
                src={selectedImage} 
                alt="Попередній перегляд карти"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  border: '2px solid var(--border-primary)'
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'var(--bg-danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Завантаження файлу */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%' }}
            >
              <Upload size={16} style={{ marginRight: '0.5rem' }} />
              Завантажити зображення
            </button>
          </div>

          {/* Готові зображення */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem'
            }}>
              Або оберіть готове зображення:
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem'
            }}>
              {placeholderImages.map((imageUrl, index) => (
                <div
                  key={index}
                  onClick={() => handlePlaceholderSelect(imageUrl)}
                  style={{
                    cursor: 'pointer',
                    border: selectedImage === imageUrl 
                      ? '2px solid var(--fantasy-primary)' 
                      : '2px solid transparent',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    aspectRatio: '4/3'
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Готове зображення ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Розміри карти */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Ширина (px)
            </label>
            <input
              type="number"
              className="input"
              value={formData.width}
              onChange={(e) => setFormData(prev => ({ ...prev, width: parseInt(e.target.value) || 1920 }))}
              min="100"
              max="5000"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Висота (px)
            </label>
            <input
              type="number"
              className="input"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 1080 }))}
              min="100"
              max="5000"
            />
          </div>
        </div>

        {/* Теги */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Теги
          </label>
          
          <TagInput
            tags={formData.tags}
            onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
            worldId={currentWorldId}
            placeholder="Додати тег для карти..."
          />
        </div>

        {/* Публічність */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
            />
            Публічна карта
          </label>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
            marginLeft: '1.5rem'
          }}>
            Публічні карти можуть переглядати інші користувачі
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-primary)'
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
            {editingMap ? 'Зберегти зміни' : 'Створити карту'}
          </button>
        </div>
      </form>
    </Modal>
  );
};