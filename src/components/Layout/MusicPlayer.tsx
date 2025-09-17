import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useSoundSystem } from '@/hooks/useSoundSystem';

export const MusicPlayer: React.FC = () => {
  const {
    isEnabled,
    isPlaying,
    currentTrack,
    volume,
    effectsVolume,
    backgroundTracks,
    audioInitialized,
    toggleEnabled,
    toggleMusic,
    nextTrack,
    previousTrack,
    setVolume,
    setEffectsVolume,
    getCurrentTrack
  } = useSoundSystem();

  const currentTrackInfo = getCurrentTrack();

  // Якщо аудіо не ініціалізовано або немає треків
  if (!audioInitialized || backgroundTracks.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Аудіо недоступне
        </span>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)'
      }}>
        <button
          onClick={toggleEnabled}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
          title="Увімкнути музику"
        >
          <VolumeX size={16} />
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Музика вимкнена
        </span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-primary)',
      minWidth: '300px'
    }}>
      {/* Контроли відтворення */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={previousTrack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          title="Попередній трек"
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={toggleMusic}
          style={{
            background: 'var(--fantasy-primary)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isPlaying ? 'Пауза' : 'Відтворити'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={nextTrack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          title="Наступний трек"
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* Інформація про трек */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {currentTrackInfo?.name || 'Невідомий трек'}
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          {currentTrack + 1} з {backgroundTracks.length}
        </div>
      </div>

      {/* Контроль гучності */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <button
          onClick={toggleEnabled}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
          title="Вимкнути музику"
        >
          <Volume2 size={16} />
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            width: '60px',
            height: '4px',
            background: 'var(--bg-input)',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer'
          }}
          title={`Гучність: ${Math.round(volume * 100)}%`}
        />
      </div>
    </div>
  );
};