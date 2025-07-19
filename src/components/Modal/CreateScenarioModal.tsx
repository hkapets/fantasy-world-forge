import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Scenario } from '@/hooks/useScenariosData';
import { TagInput } from '../Common/TagInput';

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scenario: Omit<Scenario, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => void;
  editingScenario?: Scenario | null;
}

export const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingScenario
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: 'adventure' | 'campaign' | 'oneshot' | 'sidequest';
    difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
    status: 'draft' | 'active' | 'completed' | 'paused';
    tags: string[];
    estimatedDuration: string;
    playerCount: string;
  }>({
    title: '',
    description: '',
    type: 'adventure',
    difficulty: 'medium',
    status: 'draft',
    tags: [],
    estimatedDuration: '',
    playerCount: ''
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingScenario) {
      setFormData({
        title: editingScenario.title,
        description: editingScenario.description,
        type: editingScenario.type,
        difficulty: editingScenario.difficulty,
        status: editingScenario.status,
        tags: editingScenario.tags,
        estimatedDuration: editingScenario.estimatedDuration,
        playerCount: editingScenario.playerCount
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'adventure',
        difficulty: 'medium',
        status: 'draft',
        tags: [],
        estimatedDuration: '',
        playerCount: ''
      });
    }
    setTagInput('');
  }, [editingScenario, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Введіть назву сценарію');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
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

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '0.75rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Заголовок */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {editingScenario ? 'Редагувати сценарій' : 'Створити сценарій'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Назва */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Назва сценарію *
            </label>
            <input
              type="text"
              className="input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Введіть назву сценарію"
              required
            />
          </div>

          {/* Тип та складність */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Тип сценарію
              </label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              >
                <option value="adventure">Пригода</option>
                <option value="campaign">Кампанія</option>
                <option value="oneshot">Разова гра</option>
                <option value="sidequest">Побічний квест</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Складність
              </label>
              <select
                className="input"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
              >
                <option value="easy">Легкий</option>
                <option value="medium">Середній</option>
                <option value="hard">Складний</option>
                <option value="extreme">Екстремальний</option>
              </select>
            </div>
          </div>

          {/* Статус та тривалість */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
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
              <select
                className="input"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="draft">Чернетка</option>
                <option value="active">Активний</option>
                <option value="completed">Завершений</option>
                <option value="paused">Призупинений</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Орієнтовна тривалість
              </label>
              <input
                type="text"
                className="input"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                placeholder="Наприклад: 2-3 години"
              />
            </div>
          </div>

          {/* Кількість гравців */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Кількість гравців
            </label>
            <input
              type="text"
              className="input"
              value={formData.playerCount}
              onChange={(e) => setFormData(prev => ({ ...prev, playerCount: e.target.value }))}
              placeholder="Наприклад: 3-5 гравців"
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
              Опис сценарію
            </label>
            <textarea
              className="input"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Опишіть сюжет, головні події, особливості сценарію..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Теги */}
          <div style={{ marginBottom: '2rem' }}>
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
              worldId="current" // TODO: передати правильний worldId
              placeholder="Додати тег для сценарію..."
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
              {editingScenario ? 'Зберегти' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};