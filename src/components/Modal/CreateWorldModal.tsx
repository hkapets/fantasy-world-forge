import React, { useState } from 'react';
import { Modal } from './Modal';

interface CreateWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (world: { name: string; description: string }) => void;
}

export const CreateWorldModal: React.FC<CreateWorldModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      alert('Будь ласка, введіть назву світу');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim()
    });

    // Очистити форму
    setName('');
    setDescription('');
    onClose();
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Створити новий світ"
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Назва світу *
          </label>
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть назву вашого фентезійного світу..."
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
            Опис світу
          </label>
          <textarea
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишіть ваш світ: загальна атмосфера, ключові особливості, стиль..."
            rows={5}
            maxLength={500}
            style={{ 
              resize: 'vertical',
              minHeight: '120px'
            }}
          />
        </div>

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