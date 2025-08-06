import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Activity, Zap } from 'lucide-react';

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  module: string;
  message: string;
  suggestion?: string;
  autoFix?: () => void;
}

export const DataValidator: React.FC = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);

  const validateData = async () => {
    setIsValidating(true);
    const foundIssues: ValidationIssue[] = [];

    try {
      // Валідація світів
      const worlds = JSON.parse(localStorage.getItem('fantasyWorldBuilder_worlds') || '[]');
      if (worlds.length === 0) {
        foundIssues.push({
          id: 'no-worlds',
          type: 'info',
          module: 'Світи',
          message: 'Немає створених світів',
          suggestion: 'Створіть перший світ для початку роботи'
        });
      }

      worlds.forEach((world: any) => {
        if (!world.name || world.name.trim().length === 0) {
          foundIssues.push({
            id: `world-no-name-${world.id}`,
            type: 'error',
            module: 'Світи',
            message: `Світ без назви (ID: ${world.id})`,
            suggestion: 'Додайте назву світу'
          });
        }
      });

      // Валідація персонажів
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      const orphanedCharacters = characters.filter((char: any) => 
        !worlds.some((world: any) => world.id === char.worldId)
      );

      if (orphanedCharacters.length > 0) {
        foundIssues.push({
          id: 'orphaned-characters',
          type: 'warning',
          module: 'Персонажі',
          message: `${orphanedCharacters.length} персонажів без світу`,
          suggestion: 'Видаліть або перенесіть персонажів до існуючих світів',
          autoFix: () => {
            const updatedCharacters = characters.filter((char: any) => 
              worlds.some((world: any) => world.id === char.worldId)
            );
            localStorage.setItem('fantasyWorldBuilder_characters', JSON.stringify(updatedCharacters));
            validateData();
          }
        });
      }

      characters.forEach((char: any) => {
        if (!char.name || char.name.trim().length === 0) {
          foundIssues.push({
            id: `char-no-name-${char.id}`,
            type: 'error',
            module: 'Персонажі',
            message: `Персонаж без імені (ID: ${char.id})`,
            suggestion: 'Додайте ім\'я персонажу'
          });
        }
      });

      // Валідація зв'язків
      worlds.forEach((world: any) => {
        const relationships = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${world.id}`) || '[]');
        const brokenRelationships = relationships.filter((rel: any) => {
          // Перевіряємо чи існують пов'язані елементи
          if (rel.sourceType === 'character') {
            const sourceExists = characters.some((char: any) => char.id === rel.sourceId);
            if (!sourceExists) return true;
          }
          if (rel.targetType === 'character') {
            const targetExists = characters.some((char: any) => char.id === rel.targetId);
            if (!targetExists) return true;
          }
          return false;
        });

        if (brokenRelationships.length > 0) {
          foundIssues.push({
            id: `broken-relationships-${world.id}`,
            type: 'warning',
            module: 'Зв\'язки',
            message: `${brokenRelationships.length} зламаних зв'язків у світі "${world.name}"`,
            suggestion: 'Видаліть зв\'язки з неіснуючими елементами',
            autoFix: () => {
              const validRelationships = relationships.filter((rel: any) => {
                if (rel.sourceType === 'character') {
                  const sourceExists = characters.some((char: any) => char.id === rel.sourceId);
                  if (!sourceExists) return false;
                }
                if (rel.targetType === 'character') {
                  const targetExists = characters.some((char: any) => char.id === rel.targetId);
                  if (!targetExists) return false;
                }
                return true;
              });
              localStorage.setItem(`fantasyWorldBuilder_relationships_${world.id}`, JSON.stringify(validRelationships));
              validateData();
            }
          });
        }
      });

      // Валідація розміру даних
      const totalDataSize = Object.keys(localStorage)
        .filter(key => key.startsWith('fantasyWorldBuilder_'))
        .reduce((total, key) => total + localStorage[key].length, 0);

      if (totalDataSize > 5 * 1024 * 1024) { // 5MB
        foundIssues.push({
          id: 'large-data-size',
          type: 'warning',
          module: 'Система',
          message: `Великий розмір даних: ${(totalDataSize / 1024 / 1024).toFixed(1)}МБ`,
          suggestion: 'Розгляньте можливість експорту та очищення старих даних'
        });
      }

      setIssues(foundIssues);
      setLastValidation(new Date());
    } catch (error) {
      console.error('Validation error:', error);
      foundIssues.push({
        id: 'validation-error',
        type: 'error',
        module: 'Система',
        message: 'Помилка при валідації даних',
        suggestion: 'Перевірте цілісність даних в localStorage'
      });
      setIssues(foundIssues);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    // Автоматична валідація при завантаженні
    validateData();

    // Періодична валідація кожні 5 хвилин
    const interval = setInterval(validateData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;

  if (issues.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      maxWidth: '400px',
      boxShadow: 'var(--shadow-modal)',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Activity size={18} style={{ color: 'var(--fantasy-primary)' }} />
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Валідація даних
          </h4>
        </div>

        <button
          className="btn-icon btn-icon-sm"
          onClick={validateData}
          disabled={isValidating}
          title="Перевірити знову"
        >
          <RefreshCw size={14} className={isValidating ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Статистика */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        fontSize: '0.875rem'
      }}>
        {errorCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--danger)'
          }}>
            <XCircle size={14} />
            {errorCount} помилок
          </div>
        )}
        
        {warningCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--warning)'
          }}>
            <AlertTriangle size={14} />
            {warningCount} попереджень
          </div>
        )}

        {issues.length === 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--success)'
          }}>
            <CheckCircle size={14} />
            Все гаразд
          </div>
        )}
      </div>

      {/* Список проблем */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxHeight: '300px',
        overflow: 'auto'
      }}>
        {issues.map(issue => {
          const Icon = issue.type === 'error' ? XCircle : 
                     issue.type === 'warning' ? AlertTriangle : 
                     CheckCircle;
          
          const color = issue.type === 'error' ? 'var(--danger)' : 
                       issue.type === 'warning' ? 'var(--warning)' : 
                       'var(--info)';

          return (
            <div
              key={issue.id}
              style={{
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${color}`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Icon size={16} style={{ color, flexShrink: 0, marginTop: '0.125rem' }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {issue.module}: {issue.message}
                  </div>
                  
                  {issue.suggestion && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      marginBottom: issue.autoFix ? '0.5rem' : 0
                    }}>
                      {issue.suggestion}
                    </div>
                  )}

                  {issue.autoFix && (
                    <button
                      className="btn btn-primary"
                      onClick={issue.autoFix}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.375rem 0.75rem'
                      }}
                    >
                      <Zap size={12} style={{ marginRight: '0.25rem' }} />
                      Автовиправлення
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lastValidation && (
        <div style={{
          fontSize: '0.625rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-primary)'
        }}>
          Остання перевірка: {lastValidation.toLocaleTimeString('uk-UA')}
        </div>
      )}
    </div>
  );
};