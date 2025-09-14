import React, { useState } from 'react';
import { Template, Star, Clock, Users, BookOpen, Globe, Film, Copy, Trash2, Edit } from 'lucide-react';
import { useTemplates, TemplateManager } from '@/lib/templates';
import { Modal } from '../Modal/Modal';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: any) => void;
  category: 'character' | 'lore' | 'world' | 'scenario';
}

const categoryIcons = {
  character: Users,
  lore: BookOpen,
  world: Globe,
  scenario: Film
};

const categoryLabels = {
  character: 'Персонажі',
  lore: 'Лор',
  world: 'Світи',
  scenario: 'Сценарії'
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  category
}) => {
  const { templates, loading, useTemplate, deleteTemplate } = useTemplates(category);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuiltIn, setShowBuiltIn] = useState(true);
  const [showCustom, setShowCustom] = useState(true);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = (template.isBuiltIn && showBuiltIn) || (!template.isBuiltIn && showCustom);
    
    return matchesSearch && matchesType;
  });

  const builtInTemplates = filteredTemplates.filter(t => t.isBuiltIn);
  const customTemplates = filteredTemplates.filter(t => !t.isBuiltIn);

  const handleSelectTemplate = (template: Template) => {
    const templateData = useTemplate(template.id);
    if (templateData) {
      onSelectTemplate(templateData);
      onClose();
    }
  };

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    if (confirm(`Видалити шаблон "${templateName}"?`)) {
      deleteTemplate(templateId);
    }
  };

  const Icon = categoryIcons[category];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Шаблони: ${categoryLabels[category]}`}
      maxWidth="700px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Заголовок з іконкою */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Оберіть шаблон для швидкого створення
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Використовуйте готові шаблони або створюйте власні
            </p>
          </div>
        </div>

        {/* Пошук та фільтри */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            className="input"
            placeholder="Пошук шаблонів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={showBuiltIn}
                onChange={(e) => setShowBuiltIn(e.target.checked)}
              />
              Вбудовані шаблони ({builtInTemplates.length})
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={showCustom}
                onChange={(e) => setShowCustom(e.target.checked)}
              />
              Користувацькі шаблони ({customTemplates.length})
            </label>
          </div>
        </div>

        {/* Список шаблонів */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-secondary)'
          }}>
            Завантаження шаблонів...
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-secondary)'
          }}>
            {searchQuery ? 'Шаблонів не знайдено' : 'Немає доступних шаблонів'}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onClick={() => handleSelectTemplate(template)}
              >
                {/* Індикатор типу */}
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  display: 'flex',
                  gap: '0.25rem'
                }}>
                  {template.isBuiltIn ? (
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--success)',
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}>
                      Вбудований
                    </div>
                  ) : (
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--fantasy-primary)',
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}>
                      Користувацький
                    </div>
                  )}
                </div>

                {/* Назва та опис */}
                <h6 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginBottom: '0.5rem',
                  paddingRight: '5rem'
                }}>
                  {template.name}
                </h6>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4',
                  margin: 0,
                  marginBottom: '1rem'
                }}>
                  {template.description}
                </p>

                {/* Теги */}
                {template.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.25rem',
                    marginBottom: '1rem'
                  }}>
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '0.625rem',
                          padding: '0.25rem 0.5rem',
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span style={{
                        fontSize: '0.625rem',
                        padding: '0.25rem 0.5rem',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Статистика використання */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Star size={12} />
                    Використано: {template.usageCount} раз
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Clock size={12} />
                    {new Date(template.createdAt).toLocaleDateString('uk-UA')}
                  </div>
                </div>

                {/* Дії для користувацьких шаблонів */}
                {!template.isBuiltIn && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.25rem'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id, template.name);
                      }}
                      style={{
                        background: 'var(--danger)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Видалити шаблон"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Інформація */}
        <div style={{
          padding: '1rem',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <strong>Як використовувати:</strong>
          <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
            <li>Клікніть на шаблон щоб застосувати його</li>
            <li>Дані шаблону будуть вставлені у форму</li>
            <li>Ви можете редагувати дані перед збереженням</li>
            <li>Популярні шаблони показуються першими</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};