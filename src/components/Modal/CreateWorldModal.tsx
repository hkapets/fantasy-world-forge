import React, { useState } from 'react';
import { Modal } from './Modal';
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      alert(t('worlds.world_name') + ' is required');
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
      title={t('worlds.create_world')}
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
            {t('worlds.world_name')} *
          </label>
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('worlds.world_name_placeholder')}
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
            {t('worlds.world_description')}
          </label>
          <textarea
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('worlds.world_description_placeholder')}
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
          * - required fields
        </div>
      </div>
    </Modal>
  );
};