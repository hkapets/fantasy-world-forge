import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Relationship, relationshipTypes } from '@/hooks/useRelationshipsData';

interface CreateRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (relationshipData: Omit<Relationship, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => void;
  editingRelationship?: Relationship | null;
  currentWorldId: string;
}

export const CreateRelationshipModal: React.FC<CreateRelationshipModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRelationship,
  currentWorldId
}) => {
  const [formData, setFormData] = useState({
    sourceType: 'character' as 'character' | 'location' | 'event' | 'lore',
    sourceId: '',
    sourceName: '',
    targetType: 'character' as 'character' | 'location' | 'event' | 'lore',
    targetId: '',
    targetName: '',
    relationshipType: '',
    description: '',
    strength: 'medium' as 'weak' | 'medium' | 'strong',
    status: 'active' as 'active' | 'inactive' | 'broken',
    startDate: '',
    endDate: '',
    isSecret: false
  });

  useEffect(() => {
    if (editingRelationship && isOpen) {
      setFormData({
        sourceType: editingRelationship.sourceType,
        sourceId: editingRelationship.sourceId,
        sourceName: editingRelationship.sourceName,
        targetType: editingRelationship.targetType,
        targetId: editingRelationship.targetId,
        targetName: editingRelationship.targetName,
        relationshipType: editingRelationship.relationshipType,
        description: editingRelationship.description,
        strength: editingRelationship.strength,
        status: editingRelationship.status,
        startDate: editingRelationship.startDate || '',
        endDate: editingRelationship.endDate || '',
        isSecret: editingRelationship.isSecret
      });
    } else if (isOpen) {
      setFormData({
        sourceType: 'character',
        sourceId: '',
        sourceName: '',
        targetType: 'character',
        targetId: '',
        targetName: '',
        relationshipType: '',
        description: '',
        strength: 'medium',
        status: 'active',
        startDate: '',
        endDate: '',
        isSecret: false
      });
    }
  }, [editingRelationship, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sourceName.trim()) {
      alert('Вкажіть джерело зв\'язку');
      return;
    }

    if (!formData.targetName.trim()) {
      alert('Вкажіть ціль зв\'язку');
      return;
    }

    if (!formData.relationshipType) {
      alert('Оберіть тип зв\'язку');
      return;
    }

    onSave({
      sourceType: formData.sourceType,
      sourceId: formData.sourceId || formData.sourceName.toLowerCase().replace(/\s+/g, '-'),
      sourceName: formData.sourceName.trim(),
      targetType: formData.targetType,
      targetId: formData.targetId || formData.targetName.toLowerCase().replace(/\s+/g, '-'),
      targetName: formData.targetName.trim(),
      relationshipType: formData.relationshipType,
      description: formData.description.trim(),
      strength: formData.strength,
      status: formData.status,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      isSecret: formData.isSecret
    });

    onClose();
  };

  const getRelationshipTypesForPair = () => {
    const key = `${formData.sourceType}-${formData.targetType}` as keyof typeof relationshipTypes;
    return relationshipTypes[key] || [];
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={editingRelationship ? 'Редагувати зв\'язок' : 'Створити зв\'язок'}
    >
      <form onSubmit={handleSubmit}>
        {/* Джерело зв'язку */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Джерело зв'язку *
          </label>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <select
              className="input"
              value={formData.sourceType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                sourceType: e.target.value as any,
                relationshipType: '' // Скидаємо тип зв'язку при зміні типу сутності
              }))}
              style={{ flex: '0 0 120px' }}
            >
              <option value="character">Персонаж</option>
              <option value="location">Локація</option>
              <option value="event">Подія</option>
              <option value="lore">Лор</option>
            </select>
            
            <input
              type="text"
              className="input"
              value={formData.sourceName}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceName: e.target.value }))}
              placeholder="Назва джерела..."
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Ціль зв'язку */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Ціль зв'язку *
          </label>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <select
              className="input"
              value={formData.targetType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                targetType: e.target.value as any,
                relationshipType: '' // Скидаємо тип зв'язку при зміні типу сутності
              }))}
              style={{ flex: '0 0 120px' }}
            >
              <option value="character">Персонаж</option>
              <option value="location">Локація</option>
              <option value="event">Подія</option>
              <option value="lore">Лор</option>
            </select>
            
            <input
              type="text"
              className="input"
              value={formData.targetName}
              onChange={(e) => setFormData(prev => ({ ...prev, targetName: e.target.value }))}
              placeholder="Назва цілі..."
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Тип зв'язку */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Тип зв'язку *
          </label>
          <select
            className="input"
            value={formData.relationshipType}
            onChange={(e) => setFormData(prev => ({ ...prev, relationshipType: e.target.value }))}
          >
            <option value="">Оберіть тип зв'язку</option>
            {getRelationshipTypesForPair().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Сила та статус */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Сила зв'язку
            </label>
            <select
              className="input"
              value={formData.strength}
              onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value as any }))}
            >
              <option value="weak">Слабкий</option>
              <option value="medium">Середній</option>
              <option value="strong">Сильний</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Статус
            </label>
            <select
              className="input"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            >
              <option value="active">Активний</option>
              <option value="inactive">Неактивний</option>
              <option value="broken">Розірваний</option>
            </select>
          </div>
        </div>

        {/* Дати */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Дата початку
            </label>
            <input
              type="text"
              className="input"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              placeholder="Наприклад: 1456 рік"
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
              Дата кінця
            </label>
            <input
              type="text"
              className="input"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              placeholder="Якщо зв'язок закінчився"
            />
          </div>
        </div>

        {/* Секретність */}
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
              checked={formData.isSecret}
              onChange={(e) => setFormData(prev => ({ ...prev, isSecret: e.target.checked }))}
            />
            Секретний зв'язок
          </label>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
            marginLeft: '1.5rem'
          }}>
            Зв'язок відомий не всім персонажам світу
          </div>
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
            placeholder="Детальний опис зв'язку..."
            rows={4}
            style={{
              resize: 'vertical',
              minHeight: '100px',
              fontFamily: 'inherit'
            }}
          />
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
            {editingRelationship ? 'Зберегти зміни' : 'Створити зв\'язок'}
          </button>
        </div>
      </form>
    </Modal>
  );
};