import React, { useState } from 'react';
import { Package, Trash2, Copy, Tag, Edit, CheckSquare, Square, X, Play, Pause } from 'lucide-react';
import { useBulkOperations, BulkOperation, CopyOptions } from '@/lib/bulkOperations';
import { Modal } from '../Modal/Modal';
import { useWorldsData } from '@/hooks/useLocalStorage';

interface BulkOperationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'character' | 'lore' | 'note' | 'map' | 'scenario';
  availableEntities: Array<{id: string, name: string}>;
  currentWorldId: string;
}

export const BulkOperationsPanel: React.FC<BulkOperationsPanelProps> = ({
  isOpen,
  onClose,
  entityType,
  availableEntities,
  currentWorldId
}) => {
  const { 
    operations, 
    activeOperations, 
    bulkUpdateCharacters, 
    bulkDelete, 
    copyEntitiesBetweenWorlds,
    bulkAddTags,
    clearCompleted,
    cancelOperation
  } = useBulkOperations();
  
  const { worlds } = useWorldsData();
  
  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(new Set());
  const [operationType, setOperationType] = useState<'update' | 'delete' | 'copy' | 'addTags'>('update');
  const [updateData, setUpdateData] = useState<any>({});
  const [copyOptions, setCopyOptions] = useState<CopyOptions>({
    sourceWorldId: currentWorldId,
    targetWorldId: '',
    includeRelationships: true,
    updateNames: false,
    namePrefix: '',
    nameSuffix: ''
  });
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const toggleEntity = (entityId: string) => {
    setSelectedEntities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entityId)) {
        newSet.delete(entityId);
      } else {
        newSet.add(entityId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedEntities(new Set(availableEntities.map(e => e.id)));
  };

  const selectNone = () => {
    setSelectedEntities(new Set());
  };

  const handleExecuteOperation = async () => {
    const entityIds = Array.from(selectedEntities);
    if (entityIds.length === 0) {
      alert('Оберіть елементи для операції');
      return;
    }

    let success = false;

    switch (operationType) {
      case 'update':
        if (entityType === 'character') {
          success = await bulkUpdateCharacters(entityIds, updateData);
        }
        break;
        
      case 'delete':
        if (confirm(`Видалити ${entityIds.length} елементів? Цю дію неможливо скасувати.`)) {
          success = await bulkDelete(entityType, entityIds);
        }
        break;
        
      case 'copy':
        if (!copyOptions.targetWorldId) {
          alert('Оберіть цільовий світ');
          return;
        }
        success = await copyEntitiesBetweenWorlds(entityType, entityIds, copyOptions);
        break;
        
      case 'addTags':
        if (tagsToAdd.length === 0) {
          alert('Додайте теги для операції');
          return;
        }
        success = await bulkAddTags(entityType, entityIds, tagsToAdd);
        break;
    }

    if (success) {
      setSelectedEntities(new Set());
      alert('Операція виконана успішно!');
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tagsToAdd.includes(tag)) {
      setTagsToAdd(prev => [...prev, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagsToAdd(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const entityTypeLabels = {
    character: 'персонажів',
    lore: 'записів лору',
    note: 'нотаток',
    map: 'карт',
    scenario: 'сценаріїв'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Масові операції: ${entityTypeLabels[entityType]}`}
      maxWidth="800px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Активні операції */}
        {activeOperations.length > 0 && (
          <div style={{
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)'
          }}>
            <h5 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem'
            }}>
              Активні операції ({activeOperations.length})
            </h5>
            
            {activeOperations.map(operation => (
              <div
                key={operation.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {operation.type} {operation.entities.length} {entityTypeLabels[operation.entityType]}
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${operation.progress}%`,
                      height: '100%',
                      background: 'var(--gradient-primary)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginLeft: '1rem'
                }}>
                  {operation.progress}%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Вибір елементів */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h5 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Оберіть елементи ({selectedEntities.size} з {availableEntities.length})
            </h5>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                onClick={selectAll}
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
              >
                Всі
              </button>
              <button
                className="btn btn-secondary"
                onClick={selectNone}
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
              >
                Жодного
              </button>
            </div>
          </div>

          <div style={{
            maxHeight: '200px',
            overflow: 'auto',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)'
          }}>
            {availableEntities.map(entity => (
              <label
                key={entity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-primary)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedEntities.has(entity.id) ? (
                    <CheckSquare size={18} style={{ color: 'var(--fantasy-primary)' }} />
                  ) : (
                    <Square size={18} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                
                <input
                  type="checkbox"
                  checked={selectedEntities.has(entity.id)}
                  onChange={() => toggleEntity(entity.id)}
                  style={{ display: 'none' }}
                />
                
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)'
                }}>
                  {entity.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Тип операції */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Тип операції
          </label>
          <select
            className="input"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value as any)}
          >
            <option value="update">Оновити дані</option>
            <option value="delete">Видалити</option>
            <option value="copy">Копіювати в інший світ</option>
            <option value="addTags">Додати теги</option>
          </select>
        </div>

        {/* Налаштування операції */}
        {operationType === 'update' && entityType === 'character' && (
          <div>
            <h6 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem'
            }}>
              Дані для оновлення
            </h6>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  marginBottom: '0.25rem',
                  color: 'var(--text-secondary)'
                }}>
                  Раса
                </label>
                <input
                  type="text"
                  className="input"
                  value={updateData.race || ''}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, race: e.target.value }))}
                  placeholder="Залишити без змін"
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  marginBottom: '0.25rem',
                  color: 'var(--text-secondary)'
                }}>
                  Клас
                </label>
                <input
                  type="text"
                  className="input"
                  value={updateData.characterClass || ''}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, characterClass: e.target.value }))}
                  placeholder="Залишити без змін"
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  marginBottom: '0.25rem',
                  color: 'var(--text-secondary)'
                }}>
                  Статус
                </label>
                <input
                  type="text"
                  className="input"
                  value={updateData.status || ''}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  placeholder="Залишити без змін"
                />
              </div>
            </div>
          </div>
        )}

        {operationType === 'copy' && (
          <div>
            <h6 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem'
            }}>
              Налаштування копіювання
            </h6>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                marginBottom: '0.25rem',
                color: 'var(--text-secondary)'
              }}>
                Цільовий світ
              </label>
              <select
                className="input"
                value={copyOptions.targetWorldId}
                onChange={(e) => setCopyOptions(prev => ({ ...prev, targetWorldId: e.target.value }))}
              >
                <option value="">Оберіть світ</option>
                {worlds
                  .filter(world => world.id !== currentWorldId)
                  .map(world => (
                    <option key={world.id} value={world.id}>
                      {world.name}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                  checked={copyOptions.includeRelationships}
                  onChange={(e) => setCopyOptions(prev => ({ ...prev, includeRelationships: e.target.checked }))}
                />
                Копіювати зв'язки
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
                  checked={copyOptions.updateNames}
                  onChange={(e) => setCopyOptions(prev => ({ ...prev, updateNames: e.target.checked }))}
                />
                Змінити назви
              </label>

              {copyOptions.updateNames && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginLeft: '1.5rem' }}>
                  <input
                    type="text"
                    className="input"
                    value={copyOptions.namePrefix || ''}
                    onChange={(e) => setCopyOptions(prev => ({ ...prev, namePrefix: e.target.value }))}
                    placeholder="Префікс"
                  />
                  <input
                    type="text"
                    className="input"
                    value={copyOptions.nameSuffix || ''}
                    onChange={(e) => setCopyOptions(prev => ({ ...prev, nameSuffix: e.target.value }))}
                    placeholder="Суфікс"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {operationType === 'addTags' && (
          <div>
            <h6 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem'
            }}>
              Теги для додавання
            </h6>
            
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <input
                type="text"
                className="input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Введіть тег..."
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-primary"
                onClick={addTag}
                style={{ padding: '0.75rem' }}
              >
                <Tag size={16} />
              </button>
            </div>

            {tagsToAdd.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {tagsToAdd.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.375rem 0.75rem',
                      background: 'var(--fantasy-primary)',
                      color: 'white',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Список елементів */}
        <div>
          <h6 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem'
          }}>
            Доступні елементи
          </h6>
          
          <div style={{
            maxHeight: '250px',
            overflow: 'auto',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)'
          }}>
            {availableEntities.map(entity => (
              <label
                key={entity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-primary)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedEntities.has(entity.id) ? (
                    <CheckSquare size={18} style={{ color: 'var(--fantasy-primary)' }} />
                  ) : (
                    <Square size={18} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                
                <input
                  type="checkbox"
                  checked={selectedEntities.has(entity.id)}
                  onChange={() => toggleEntity(entity.id)}
                  style={{ display: 'none' }}
                />
                
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)'
                }}>
                  {entity.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Кнопки дій */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-primary)'
        }}>
          <button
            className="btn btn-secondary"
            onClick={clearCompleted}
            style={{
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Trash2 size={16} />
            Очистити завершені
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Закрити
            </button>
            
            <button
              className="btn btn-primary"
              onClick={handleExecuteOperation}
              disabled={selectedEntities.size === 0 || activeOperations.length > 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Play size={16} />
              Виконати операцію
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};