import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from './Modal';
import { Note } from '@/hooks/useNotesData';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<Note, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => void;
  editingNote?: Note | null;
  currentWorldId?: string;
}

import { TagInput } from '../Common/TagInput';
import { RelatedEntities } from '../Common/RelatedEntities';

const categories = [
  { value: 'ideas', label: 'Ідеї' },
  { value: 'plot', label: 'Сюжет' },
  { value: 'world', label: 'Світобудова' },
  { value: 'characters', label: 'Персонажі' },
  { value: 'quests', label: 'Квести' },
  { value: 'other', label: 'Інше' }
];

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingNote,
  currentWorldId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'ideas',
    tags: ''
  });

  useEffect(() => {
    if (editingNote) {
      setFormData({
        title: editingNote.title,
        content: editingNote.content,
        category: editingNote.category,
        tags: editingNote.tags.join(', ')
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'ideas',
        tags: ''
      });
    }
  }, [editingNote, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Введіть назву нотатки');
      return;
    }

    if (!formData.content.trim()) {
      alert('Введіть вміст нотатки');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSave({
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      tags: tagsArray
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={editingNote ? 'Редагувати нотатку' : 'Створити нотатку'}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Назва нотатки *
          </label>
          <input
            type="text"
            className="input"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Введіть назву нотатки..."
            maxLength={100}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Категорія *
          </label>
          <select
            className="input"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Вміст *
          </label>
          <textarea
            className="input"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Введіть текст нотатки..."
            rows={10}
            style={{
              resize: 'vertical',
              minHeight: '200px',
              fontFamily: 'inherit'
            }}
          />
        </div>

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
          {currentWorldId && (
            <TagInput
              tags={formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)}
              onChange={(tags) => setFormData(prev => ({ ...prev, tags: tags.join(', ') }))}
              worldId={currentWorldId}
              placeholder="Додати тег для нотатки..."
            />
          )}
        </div>

        {/* Пов'язані елементи */}
        {formData.tags && currentWorldId && (
          <div style={{ marginBottom: '1.5rem' }}>
            <RelatedEntities
              entityId={editingNote?.id || 'new'}
              entityTags={formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)}
              worldId={currentWorldId}
              maxItems={4}
            />
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
            {editingNote ? 'Зберегти зміни' : 'Створити нотатку'}
          </button>
        </div>
      </form>
    </Modal>
  );
};