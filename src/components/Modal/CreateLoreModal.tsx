import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface CreateLoreModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (loreData: any) => void;
  editingItem?: any;
}

const modalTitles: Record<string, string> = {
  races: 'расу',
  bestiary: 'істоту',
  geography: 'локацію',
  history: 'історичну подію',
  politics: 'політичну структуру',
  religion: 'релігійний/міфологічний запис',
  languages: 'мову/писемність',
  magic: 'магічний запис',
  artifacts: 'артефакт'
};

export const CreateLoreModal: React.FC<CreateLoreModalProps> = ({
  type,
  isOpen,
  onClose,
  onSave,
  editingItem
}) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    subtype: '',
    relatedLocations: '',
    relatedCharacters: '',
    dangerLevel: '',
    eventDate: '',
    origin: '',
    magicalSkills: ''
  });

  useEffect(() => {
    if (editingItem && isOpen) {
      setFormData({
        name: editingItem.name || '',
        image: editingItem.image || '',
        description: editingItem.description || '',
        subtype: editingItem.subtype || '',
        relatedLocations: editingItem.relatedLocations || '',
        relatedCharacters: editingItem.relatedCharacters || '',
        dangerLevel: editingItem.dangerLevel || '',
        eventDate: editingItem.eventDate || '',
        origin: editingItem.origin || '',
        magicalSkills: editingItem.magicalSkills || ''
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        image: '',
        description: '',
        subtype: '',
        relatedLocations: '',
        relatedCharacters: '',
        dangerLevel: '',
        eventDate: '',
        origin: '',
        magicalSkills: ''
      });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Заповніть обов'язкові поля: назва та опис");
      return;
    }

    const loreData = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      image: formData.image.trim() || undefined,
      description: formData.description.trim(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      ...(formData.subtype && { subtype: formData.subtype }),
      ...(formData.relatedLocations && { relatedLocations: formData.relatedLocations.trim() }),
      ...(formData.relatedCharacters && { relatedCharacters: formData.relatedCharacters.trim() }),
      ...(formData.dangerLevel && { dangerLevel: formData.dangerLevel }),
      ...(formData.eventDate && { eventDate: formData.eventDate }),
      ...(formData.origin && { origin: formData.origin.trim() }),
      ...(formData.magicalSkills && { magicalSkills: formData.magicalSkills.trim() })
    };

    onSave(loreData);
    setFormData({
      name: '',
      image: '',
      description: '',
      subtype: '',
      relatedLocations: '',
      relatedCharacters: '',
      dangerLevel: '',
      eventDate: '',
      origin: '',
      magicalSkills: ''
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      image: '',
      description: '',
      subtype: '',
      relatedLocations: '',
      relatedCharacters: '',
      dangerLevel: '',
      eventDate: '',
      origin: '',
      magicalSkills: ''
    });
    onClose();
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'geography':
        return (
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Тип *</label>
            <select
              className="input"
              value={formData.subtype}
              onChange={(e) => setFormData({ ...formData, subtype: e.target.value })}
              required
            >
              <option value="">Оберіть тип</option>
              <option value="galaxy">Галактика</option>
              <option value="star-system">Зоряна система</option>
              <option value="star">Зірка</option>
              <option value="planet">Планета</option>
              <option value="satellite">Супутник</option>
              <option value="other-astronomical">Інший астрономічний об'єкт</option>
              <option value="continent">Континент</option>
              <option value="ocean">Океан</option>
              <option value="sea">Море</option>
              <option value="lake">Озеро</option>
              <option value="river">Річка</option>
              <option value="mountain">Гора</option>
              <option value="other-natural">Інші природні об'єкти</option>
              <option value="country">Країна</option>
              <option value="city">Місто</option>
              <option value="village">Село</option>
              <option value="capital">Столиця</option>
              <option value="forest">Ліс</option>
              <option value="desert">Пустеля</option>
              <option value="steppe">Степ</option>
              <option value="glacier">Льодовик</option>
              <option value="fortress">Фортеця</option>
              <option value="castle">Замок</option>
              <option value="cave">Печера</option>
              <option value="dungeon">Підземелля</option>
              <option value="temple">Храм</option>
              <option value="ruins">Руїни</option>
              <option value="magical-object">Магічний об'єкт</option>
              <option value="custom">Користувацька локація</option>
            </select>
          </div>
        );

      case 'bestiary':
        return (
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Рівень небезпеки</label>
            <select
              className="input"
              value={formData.dangerLevel}
              onChange={(e) => setFormData({ ...formData, dangerLevel: e.target.value })}
            >
              <option value="">Оберіть рівень</option>
              <option value="harmless">Нешкідливий</option>
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
              <option value="extreme">Критичний</option>
            </select>
          </div>
        );

      case 'history':
        return (
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Дата події</label>
            <input
              type="text"
              className="input"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              placeholder="Наприклад: 1234 рік або Епоха Вогню"
            />
          </div>
        );

      case 'religion':
        return (
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Тип</label>
            <select
              className="input"
              value={formData.subtype}
              onChange={(e) => setFormData({ ...formData, subtype: e.target.value })}
            >
              <option value="">Оберіть тип</option>
              <option value="religion">Релігія</option>
              <option value="mythology">Mythologie</option>
              <option value="philosophy">Філософія</option>
            </select>
          </div>
        );

      case 'languages':
        return (
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Тип</label>
            <select
              className="input"
              value={formData.subtype}
              onChange={(e) => setFormData({ ...formData, subtype: e.target.value })}
            >
              <option value="">Оберіть тип</option>
              <option value="language">Мова</option>
              <option value="writing">Писемність</option>
              <option value="calendar">Літочислення</option>
            </select>
          </div>
        );

      case 'magic':
        return (
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Магічні навики</label>
            <input
              type="text"
              className="input"
              value={formData.magicalSkills}
              onChange={(e) => setFormData({ ...formData, magicalSkills: e.target.value })}
              placeholder="Назви навиків через кому"
            />
          </div>
        );

      default:
        return null;
    }
  };

    const title = editingItem 
      ? `Редагувати ${modalTitles[type] || 'запис'}`
      : `Створити ${modalTitles[type] || 'запис'}`;

    return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSave={handleSubmit}
      onCancel={handleCancel}
      maxWidth="600px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="label">Зображення (URL)</label>
          <input
            type="url"
            className="input"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="label">Назва *</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {renderTypeSpecificFields()}

        {(type === 'races' || type === 'geography') && (
          <div>
            <label className="label">Походження</label>
            <input
              type="text"
              className="input"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="Звідки походить"
            />
          </div>
        )}

        {(type !== 'languages' && type !== 'politics') && (
          <div>
            <label className="label">Пов'язані локації</label>
            <input
              type="text"
              className="input"
              value={formData.relatedLocations}
              onChange={(e) => setFormData({ ...formData, relatedLocations: e.target.value })}
              placeholder="Назви локацій через кому"
            />
          </div>
        )}

        {(type === 'religion' || type === 'magic' || type === 'artifacts') && (
          <div>
            <label className="label">Пов'язані персонажі</label>
            <input
              type="text"
              className="input"
              value={formData.relatedCharacters}
              onChange={(e) => setFormData({ ...formData, relatedCharacters: e.target.value })}
              placeholder="Імена персонажів через кому"
            />
          </div>
        )}

        <div>
          <label className="label">Опис *</label>
          <textarea
            className="input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            style={{ resize: 'vertical' }}
            required
          />
        </div>
      </div>
    </Modal>
  );
};