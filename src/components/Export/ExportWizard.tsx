import React, { useState } from 'react';
import { Download, FileText, Image, Package, Settings, Check, X } from 'lucide-react';
import { FileManager, ExportOptions } from '@/lib/fileManager';
import { Modal } from '../Modal/Modal';

interface ExportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  worldId: string;
  worldName: string;
}

const exportFormats = [
  {
    id: 'json',
    name: 'JSON',
    description: 'Структуровані дані для резервного копіювання',
    icon: FileText,
    recommended: true
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Документ для друку та перегляду',
    icon: FileText,
    recommended: false
  },
  {
    id: 'html',
    name: 'HTML',
    description: 'Веб-сторінка для перегляду в браузері',
    icon: FileText,
    recommended: false
  },
  {
    id: 'zip',
    name: 'ZIP Архів',
    description: 'Повний архів з усіма файлами та зображеннями',
    icon: Package,
    recommended: true
  }
];

const availableSections = [
  { id: 'characters', name: 'Персонажі', icon: '👤' },
  { id: 'lore', name: 'Лор', icon: '📚' },
  { id: 'chronology', name: 'Хронологія', icon: '📅' },
  { id: 'notes', name: 'Нотатки', icon: '📝' },
  { id: 'maps', name: 'Карти', icon: '🗺️' },
  { id: 'relationships', name: 'Зв\'язки', icon: '🔗' },
  { id: 'scenarios', name: 'Сценарії', icon: '🎬' }
];

export const ExportWizard: React.FC<ExportWizardProps> = ({
  isOpen,
  onClose,
  worldId,
  worldName
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeImages: true,
    compressImages: true,
    sections: ['characters', 'lore', 'chronology', 'notes', 'maps', 'relationships', 'scenarios']
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleFormatSelect = (format: string) => {
    setExportOptions(prev => ({ ...prev, format: format as any }));
    setCurrentStep(2);
  };

  const handleSectionToggle = (sectionId: string) => {
    setExportOptions(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(s => s !== sectionId)
        : [...prev.sections, sectionId]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Симуляція прогресу
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await FileManager.exportWorld(worldId, exportOptions);
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setCurrentStep(1);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export error:', error);
      alert('Помилка при експорті');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const renderStep1 = () => (
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '1rem'
      }}>
        Оберіть формат експорту
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {exportFormats.map(format => {
          const Icon = format.icon;
          return (
            <div
              key={format.id}
              onClick={() => handleFormatSelect(format.id)}
              style={{
                padding: '1.5rem',
                background: exportOptions.format === format.id ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                border: exportOptions.format === format.id ? '2px solid var(--fantasy-primary)' : '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {format.recommended && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'var(--success)',
                  color: 'white',
                  fontSize: '0.625rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '500'
                }}>
                  Рекомендовано
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <Icon size={24} style={{ color: 'var(--fantasy-primary)' }} />
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {format.name}
                </h4>
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {format.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '1rem'
      }}>
        Налаштування експорту
      </h3>

      {/* Вибір розділів */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          Розділи для експорту:
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          {availableSections.map(section => (
            <label
              key={section.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: exportOptions.sections.includes(section.id) ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                border: exportOptions.sections.includes(section.id) ? '2px solid var(--fantasy-primary)' : '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="checkbox"
                checked={exportOptions.sections.includes(section.id)}
                onChange={() => handleSectionToggle(section.id)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '1.25rem' }}>{section.icon}</span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}>
                {section.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Налаштування зображень */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)',
        marginBottom: '1.5rem'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Image size={18} />
          Налаштування зображень
        </h4>

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
              checked={exportOptions.includeImages}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
            />
            Включити зображення
          </label>

          {exportOptions.includeImages && (
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              marginLeft: '1.5rem'
            }}>
              <input
                type="checkbox"
                checked={exportOptions.compressImages}
                onChange={(e) => setExportOptions(prev => ({ ...prev, compressImages: e.target.checked }))}
              />
              Стискати зображення (рекомендовано)
            </label>
          )}
        </div>
      </div>

      {/* Кнопки навігації */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'space-between'
      }}>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentStep(1)}
        >
          Назад
        </button>

        <button
          className="btn btn-primary"
          onClick={handleExport}
          disabled={exportOptions.sections.length === 0 || isExporting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Download size={16} />
          {isExporting ? `Експортую... ${exportProgress}%` : 'Експортувати'}
        </button>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem'
      }}>
        <Download size={32} style={{ color: 'white' }} />
      </div>

      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '1rem'
      }}>
        Експортую світ "{worldName}"
      </h3>

      <div style={{
        width: '100%',
        height: '8px',
        background: 'var(--bg-secondary)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: `${exportProgress}%`,
          height: '100%',
          background: 'var(--gradient-primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        {exportProgress}% завершено
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Експорт світу"
      maxWidth="700px"
    >
      {isExporting ? renderProgress() : currentStep === 1 ? renderStep1() : renderStep2()}
    </Modal>
  );
};