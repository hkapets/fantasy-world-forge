import React from 'react';
import { Search, Volume2, VolumeX, Save, Download, Command } from 'lucide-react';
import fantasyIcon from '@/assets/fantasy-icon.png';
import { GlobalSearchModal } from './GlobalSearchModal';
import { useState } from 'react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSave: () => void;
  onExport: () => void;
  onHomeClick: () => void;
  onNavigate: (section: string, subsection?: string, itemId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onSave,
  onExport,
  onHomeClick,
  onNavigate
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsSearchModalOpen(true);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        height: '70px'
      }}>
        {/* Лого та назва */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onClick={onHomeClick}
        >
          <img 
            src={fantasyIcon} 
            alt="Fantasy World Builder" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)'
            }}
          />
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Fantasy World Builder
          </h1>
        </div>

        {/* Центральна частина - пошук */}
        <div style={{
          flex: '1',
          maxWidth: '400px',
          margin: '0 2rem'
        }}>
          <button
            onClick={handleSearchClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              fontSize: '0.875rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--fantasy-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-primary)';
            }}
          >
            <Search size={18} />
            <span style={{ flex: 1, textAlign: 'left' }}>
              Пошук по всьому проекту...
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              opacity: 0.7
            }}>
              <Command size={12} />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Кнопки дій */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <button
            className="btn btn-secondary"
            onClick={onToggleSound}
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={soundEnabled ? 'Вимкнути звук' : 'Увімкнути звук'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            className="btn btn-secondary"
            onClick={onSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Save size={18} />
            Зберегти
          </button>

          <button
            className="btn btn-primary"
            onClick={onExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={18} />
            Експорт
          </button>
        </div>
      </header>

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};