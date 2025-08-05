import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Download } from 'lucide-react';

interface IntegrityIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  module: string;
  description: string;
  affectedItems: string[];
  autoFix?: () => Promise<boolean>;
  manualSteps?: string[];
}

export const DataIntegrityChecker: React.FC = () => {
  const [issues, setIssues] = useState<IntegrityIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const checkDataIntegrity = async () => {
    setIsChecking(true);
    const foundIssues: IntegrityIssue[] = [];

    try {
      // Перевірка цілісності світів
      const worlds = JSON.parse(localStorage.getItem('fantasyWorldBuilder_worlds') || '[]');
      const currentWorldId = localStorage.getItem('fantasyWorldBuilder_currentWorld');

      if (currentWorldId && !worlds.find((w: any) => w.id === currentWorldId)) {
        foundIssues.push({
          id: 'invalid-current-world',
          severity: 'critical',
          module: 'Світи',
          description: 'Поточний світ не існує',
          affectedItems: [currentWorldId],
          autoFix: async () => {
            localStorage.removeItem('fantasyWorldBuilder_currentWorld');
            return true;
          }
        });
      }

      // Перевірка персонажів
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      const orphanedChars = characters.filter((char: any) => 
        !worlds.find((world: any) => world.id === char.worldId)
      );

      if (orphanedChars.length > 0) {
        foundIssues.push({
          id: 'orphaned-characters',
          severity: 'warning',
          module: 'Персонажі',
          description: `${orphanedChars.length} персонажів без світу`,
          affectedItems: orphanedChars.map((char: any) => char.name),
          autoFix: async () => {
            const validCharacters = characters.filter((char: any) => 
              worlds.find((world: any) => world.id === char.worldId)
            );
            localStorage.setItem('fantasyWorldBuilder_characters', JSON.stringify(validCharacters));
            return true;
          }
        });
      }

      // Перевірка зв'язків для кожного світу
      for (const world of worlds) {
        const relationships = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${world.id}`) || '[]');
        const brokenRels = relationships.filter((rel: any) => {
          if (rel.sourceType === 'character') {
            return !characters.find((char: any) => char.id === rel.sourceId && char.worldId === world.id);
          }
          return false;
        });

        if (brokenRels.length > 0) {
          foundIssues.push({
            id: `broken-relationships-${world.id}`,
            severity: 'warning',
            module: 'Зв\'язки',
            description: `${brokenRels.length} зламаних зв'язків у світі "${world.name}"`,
            affectedItems: brokenRels.map((rel: any) => `${rel.sourceName} → ${rel.targetName}`),
            autoFix: async () => {
              const validRels = relationships.filter((rel: any) => {
                if (rel.sourceType === 'character') {
                  return characters.find((char: any) => char.id === rel.sourceId && char.worldId === world.id);
                }
                return true;
              });
              localStorage.setItem(`fantasyWorldBuilder_relationships_${world.id}`, JSON.stringify(validRels));
              return true;
            }
          });
        }
      }

      // Перевірка дублікатів
      const characterNames = characters.map((char: any) => char.name.toLowerCase());
      const duplicateNames = characterNames.filter((name, index) => 
        characterNames.indexOf(name) !== index
      );

      if (duplicateNames.length > 0) {
        foundIssues.push({
          id: 'duplicate-character-names',
          severity: 'info',
          module: 'Персонажі',
          description: `Знайдено дублікати імен персонажів`,
          affectedItems: [...new Set(duplicateNames)],
          manualSteps: [
            'Перейдіть до розділу Персонажі',
            'Знайдіть персонажів з однаковими іменами',
            'Змініть імена для унікальності'
          ]
        });
      }

      // Перевірка розміру даних
      const totalSize = Object.keys(localStorage)
        .filter(key => key.startsWith('fantasyWorldBuilder_'))
        .reduce((total, key) => total + localStorage[key].length, 0);

      if (totalSize > 8 * 1024 * 1024) { // 8MB
        foundIssues.push({
          id: 'large-data-warning',
          severity: 'warning',
          module: 'Система',
          description: `Великий розмір даних: ${(totalSize / 1024 / 1024).toFixed(1)}МБ`,
          affectedItems: ['localStorage'],
          manualSteps: [
            'Експортуйте дані як резервну копію',
            'Видаліть непотрібні світи або елементи',
            'Очистіть історію навігації'
          ]
        });
      }

      setIssues(foundIssues);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Integrity check error:', error);
      foundIssues.push({
        id: 'check-error',
        severity: 'critical',
        module: 'Система',
        description: 'Помилка при перевірці цілісності',
        affectedItems: ['localStorage'],
        manualSteps: [
          'Перезавантажте сторінку',
          'Перевірте консоль браузера',
          'Експортуйте дані якщо можливо'
        ]
      });
      setIssues(foundIssues);
    } finally {
      setIsChecking(false);
    }
  };

  const fixAllIssues = async () => {
    let fixedCount = 0;
    
    for (const issue of issues) {
      if (issue.autoFix) {
        try {
          const success = await issue.autoFix();
          if (success) {
            fixedCount++;
          }
        } catch (error) {
          console.error(`Failed to fix issue ${issue.id}:`, error);
        }
      }
    }

    if (fixedCount > 0) {
      await checkDataIntegrity();
      alert(`Виправлено ${fixedCount} проблем`);
    }
  };

  const exportDiagnostics = () => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      issues,
      lastCheck,
      dataSize: Object.keys(localStorage)
        .filter(key => key.startsWith('fantasyWorldBuilder_'))
        .reduce((total, key) => total + localStorage[key].length, 0),
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      },
      errorLogs: JSON.parse(localStorage.getItem('fantasyWorldBuilder_errorLogs') || '[]')
    };

    const blob = new Blob([JSON.stringify(diagnostics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fantasy-world-diagnostics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Автоматична перевірка при завантаженні
    checkDataIntegrity();

    // Періодична перевірка кожні 10 хвилин
    const interval = setInterval(checkDataIntegrity, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalIssues = issues.filter(issue => issue.severity === 'critical');
  const warningIssues = issues.filter(issue => issue.severity === 'warning');

  // Показуємо тільки якщо є критичні проблеми або багато попереджень
  if (criticalIssues.length === 0 && warningIssues.length < 3) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '1rem',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      maxWidth: '350px',
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
          <Shield size={18} style={{ 
            color: criticalIssues.length > 0 ? 'var(--danger)' : 'var(--warning)' 
          }} />
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Цілісність даних
          </h4>
        </div>

        <button
          className="btn-icon btn-icon-sm"
          onClick={() => setShowDetails(!showDetails)}
          title={showDetails ? 'Приховати деталі' : 'Показати деталі'}
        >
          {showDetails ? '−' : '+'}
        </button>
      </div>

      {/* Короткий огляд */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        fontSize: '0.875rem'
      }}>
        {criticalIssues.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--danger)'
          }}>
            <AlertTriangle size={14} />
            {criticalIssues.length} критичних
          </div>
        )}
        
        {warningIssues.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--warning)'
          }}>
            <AlertTriangle size={14} />
            {warningIssues.length} попереджень
          </div>
        )}
      </div>

      {/* Деталі */}
      {showDetails && (
        <div style={{
          marginBottom: '1rem',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {issues.map(issue => (
            <div
              key={issue.id}
              style={{
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '0.5rem',
                border: `1px solid ${
                  issue.severity === 'critical' ? 'var(--danger)' : 
                  issue.severity === 'warning' ? 'var(--warning)' : 'var(--info)'
                }`
              }}
            >
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem'
              }}>
                {issue.module}: {issue.description}
              </div>
              
              {issue.affectedItems.length > 0 && (
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem'
                }}>
                  Торкається: {issue.affectedItems.slice(0, 3).join(', ')}
                  {issue.affectedItems.length > 3 && ` та ще ${issue.affectedItems.length - 3}`}
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
                  Автовиправлення
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Дії */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn btn-secondary"
          onClick={checkDataIntegrity}
          disabled={isChecking}
          style={{
            fontSize: '0.75rem',
            padding: '0.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
          Перевірити
        </button>

        {issues.some(issue => issue.autoFix) && (
          <button
            className="btn btn-primary"
            onClick={fixAllIssues}
            style={{
              fontSize: '0.75rem',
              padding: '0.5rem 0.75rem'
            }}
          >
            Виправити все
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={exportDiagnostics}
          style={{
            fontSize: '0.75rem',
            padding: '0.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Download size={12} />
          Експорт
        </button>
      </div>

      {lastCheck && (
        <div style={{
          fontSize: '0.625rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: '0.75rem'
        }}>
          Остання перевірка: {lastCheck.toLocaleTimeString('uk-UA')}
        </div>
      )}
    </div>
  );
};