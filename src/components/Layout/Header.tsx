import React from 'react';
import { Search, Volume2, VolumeX, Save, Download } from 'lucide-react';
import fantasyIcon from '@/assets/fantasy-icon.png';

interface HeaderProps {
  onSearch: (query: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSave: () => void;
  onExport: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  soundEnabled,
  onToggleSound,
  onSave,
  onExport,
  onHomeClick
}) => {
  return (
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
        margin: '0 2rem',
        position: 'relative'
      }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Пошук по всьому проекту..."
            className="input"
            style={{
              paddingLeft: '3rem',
              width: '100%'
            }}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
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
  );
};