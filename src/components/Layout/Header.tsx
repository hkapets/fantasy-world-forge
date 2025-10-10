import React from 'react';
import { Search, Volume2, VolumeX, Save, Download, Command, Package, Wand as Wand2, Globe } from 'lucide-react';
import fantasyIcon from '@/assets/fantasy-icon.png';
import { GlobalSearchModal } from './GlobalSearchModal';
import { MusicPlayer } from './MusicPlayer';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { ExportWizard } from '../Export/ExportWizard';
import { NameGeneratorModal } from '../Tools/NameGeneratorModal';
import { useWorldsData } from '@/hooks/useLocalStorage';
import { useState } from 'react';
import { useTranslation, Language } from '@/lib/i18n';

interface HeaderProps {
  onSave: () => void;
  onExport: () => void;
  onHomeClick: () => void;
  onNavigate: (section: string, subsection?: string, itemId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSave,
  onExport,
  onHomeClick,
  onNavigate
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const [showExportWizard, setShowExportWizard] = useState(false);
  const [showNameGenerator, setShowNameGenerator] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { isEnabled, toggleEnabled, playEffect } = useSoundSystem();
  const { getCurrentWorld, currentWorldId } = useWorldsData();

  const languages = [
    { code: 'uk' as Language, label: '🇺🇦 Українська', short: 'UA' },
    { code: 'en' as Language, label: '🇬🇧 English', short: 'EN' },
    { code: 'pl' as Language, label: '🇵🇱 Polski', short: 'PL' }
  ];

  const handleSearchClick = () => {
    playEffect('buttonClick');
    setIsSearchModalOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      playEffect('buttonClick');
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
            data-search-trigger
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
              {t('header.search_placeholder')}
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
          gap: '1rem'
        }}>
          {/* Музичний плеєр */}
          <MusicPlayer />

          {/* Перемикач мов */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                playEffect('buttonClick');
                setShowLanguageMenu(!showLanguageMenu);
              }}
              style={{
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '70px'
              }}
              title={t('settings.language')}
            >
              <Globe size={18} />
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                {languages.find(lang => lang.code === language)?.short}
              </span>
            </button>

            {showLanguageMenu && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999
                  }}
                  onClick={() => setShowLanguageMenu(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '180px',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        playEffect('buttonClick');
                        setLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: language === lang.code ? 'var(--bg-hover)' : 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        if (language !== lang.code) {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (language !== lang.code) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {lang.label}
                      {language === lang.code && (
                        <span style={{ marginLeft: 'auto', color: 'var(--fantasy-primary)' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => {
              playEffect('buttonClick');
              setShowNameGenerator(true);
            }}
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={t('header.name_generator')}
          >
            <Wand2 size={20} />
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              playEffect('buttonClick');
              toggleEnabled();
            }}
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isEnabled ? t('header.sound_on') : t('header.sound_off')}
          >
            {isEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              playEffect('save');
              onSave();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Save size={18} />
            {t('common.save')}
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              playEffect('success');
              if (currentWorldId) {
                setShowExportWizard(true);
              } else {
                onExport();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Package size={18} />
            {t('common.export')}
          </button>
        </div>
      </header>

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Експорт візард */}
      {showExportWizard && currentWorldId && (
        <ExportWizard
          isOpen={showExportWizard}
          onClose={() => setShowExportWizard(false)}
          worldId={currentWorldId}
          worldName={getCurrentWorld()?.name || t('worlds.select_world')}
        />
      )}

      {/* Глобальний генератор імен */}
      <NameGeneratorModal
        isOpen={showNameGenerator}
        onClose={() => setShowNameGenerator(false)}
        generationType="character"
      />
    </>
  );
};