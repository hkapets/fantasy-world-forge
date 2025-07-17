import { useState, useEffect, useRef } from 'react';

interface Track {
  id: string;
  name: string;
  file: string;
}

// Список фонових треків (додайте ваші MP3 файли в public/audio/music/)
const backgroundTracks: Track[] = [
  { id: 'ashes', name: 'Ashes', file: '/audio/music/Ashes.mp3' },
  { id: 'between-lines', name: 'Between The Lines', file: '/audio/music/Between The Lines.mp3' },
  { id: 'black-smoke', name: 'Black Smoke Freedom', file: '/audio/music/Black Smoke Freedom.mp3' },
  { id: 'doubletake', name: 'DoubleTake', file: '/audio/music/DoubleTake.mp3' },
  { id: 'echoes', name: 'Echoes', file: '/audio/music/Echoes.mp3' },
  { id: 'elysian', name: 'Elysian', file: '/audio/music/Elysian.mp3' },
  { id: 'epic-quest', name: 'Epic Quest', file: '/audio/music/Epic Quest.mp3' },
  { id: 'epic-realm', name: 'Epic Realm', file: '/audio/music/Epic Realm.mp3' },
  { id: 'epiphany', name: 'Epiphany', file: '/audio/music/Epiphany.mp3' },
  { id: 'every-step', name: 'Every Step', file: '/audio/music/Every Step.mp3' },
  { id: 'every-streetlight', name: 'Every Streetlight', file: '/audio/music/Every Streetlight.mp3' },
  { id: 'finale', name: 'Finale', file: '/audio/music/Finale.mp3' },
  { id: 'longing-echoes', name: 'Longing Echoes', file: '/audio/music/Longing Echoes.mp3' },
  { id: 'mystic-realms', name: 'Mystic Realms', file: '/audio/music/Mystic Realms.mp3' },
  { id: 'mystique', name: 'Mystique', file: '/audio/music/Mystique.mp3' },
  { id: 'mythic-pulse', name: 'Mythic Pulse', file: '/audio/music/Mythic Pulse.mp3' },
  { id: 'mythic-realm', name: 'Mythic Realm', file: '/audio/music/Mythic Realm.mp3' },
  { id: 'mythic-rise', name: 'Mythic Rise', file: '/audio/music/Mythic Rise.mp3' },
  { id: 'mythic', name: 'Mythic', file: '/audio/music/Mythic.mp3' },
  { id: 'paradox-breeze', name: 'Paradox Breeze', file: '/audio/music/Paradox Breeze.mp3' },
  { id: 'saga', name: 'Saga', file: '/audio/music/Saga.mp3' },
  { id: 'summon', name: 'Summon', file: '/audio/music/Summon.mp3' },
  { id: 'the-vanguard', name: 'The Vanguard', file: '/audio/music/The Vanguard.mp3' },
  { id: 'unbreakable', name: 'Unbreakable', file: '/audio/music/Unbreakable.mp3' },
  { id: 'valor', name: 'Valor', file: '/audio/music/Valor.mp3' },
  { id: 'yearning', name: 'Yearning', file: '/audio/music/Yearning.mp3' }
];

// Звукові ефекти (додайте ваші MP3 файли в public/audio/effects/)
const soundEffects = {
  pageFlip: '/audio/effects/page-flip.mp3',
  buttonClick: '/audio/effects/button-click.mp3',
  create: '/audio/effects/create.mp3',
  delete: '/audio/effects/delete.mp3',
  save: '/audio/effects/save.mp3',
  error: '/audio/effects/error.mp3',
  success: '/audio/effects/success.mp3',
  modalOpen: '/audio/effects/modal-open.mp3',
  modalClose: '/audio/effects/modal-close.mp3'
};

export function useSoundSystem() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [effectsVolume, setEffectsVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effectsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Ініціалізація аудіо
  useEffect(() => {
    // Створюємо аудіо елемент для фонової музики
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.loop = false;
    
    // Автоматичний перехід до наступного треку
    audioRef.current.addEventListener('ended', () => {
      nextTrack();
    });

    // Створюємо аудіо елементи для звукових ефектів
    Object.entries(soundEffects).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = effectsVolume;
      effectsRef.current[key] = audio;
    });

    // Завантажуємо налаштування з localStorage
    const savedSettings = localStorage.getItem('fantasyWorldBuilder_audioSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsEnabled(settings.isEnabled ?? true);
        setVolume(settings.volume ?? 0.3);
        setEffectsVolume(settings.effectsVolume ?? 0.5);
        setCurrentTrack(settings.currentTrack ?? 0);
      } catch (error) {
        console.error('Error loading audio settings:', error);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      Object.values(effectsRef.current).forEach(audio => {
        audio.pause();
      });
    };
  }, []);

  // Збереження налаштувань
  useEffect(() => {
    const settings = {
      isEnabled,
      volume,
      effectsVolume,
      currentTrack
    };
    localStorage.setItem('fantasyWorldBuilder_audioSettings', JSON.stringify(settings));
  }, [isEnabled, volume, effectsVolume, currentTrack]);

  // Оновлення гучності
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    Object.values(effectsRef.current).forEach(audio => {
      audio.volume = effectsVolume;
    });
  }, [volume, effectsVolume]);

  const playTrack = (trackIndex: number) => {
    if (!isEnabled || !audioRef.current) return;

    const track = backgroundTracks[trackIndex];
    if (!track) return;

    audioRef.current.src = track.file;
    audioRef.current.play().catch(error => {
      console.error('Error playing track:', error);
    });
    setCurrentTrack(trackIndex);
    setIsPlaying(true);
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeMusic = () => {
    if (audioRef.current && isEnabled) {
      audioRef.current.play().catch(error => {
        console.error('Error resuming track:', error);
      });
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % backgroundTracks.length;
    playTrack(nextIndex);
  };

  const previousTrack = () => {
    const prevIndex = currentTrack === 0 ? backgroundTracks.length - 1 : currentTrack - 1;
    playTrack(prevIndex);
  };

  const playEffect = (effectName: keyof typeof soundEffects) => {
    if (!isEnabled) return;

    const audio = effectsRef.current[effectName];
    if (audio) {
      audio.currentTime = 0; // Скидаємо до початку
      audio.play().catch(error => {
        console.error(`Error playing effect ${effectName}:`, error);
      });
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      if (audioRef.current?.src) {
        resumeMusic();
      } else {
        playTrack(currentTrack);
      }
    }
  };

  const toggleEnabled = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    if (!newEnabled && isPlaying) {
      pauseMusic();
    }
  };

  return {
    // Стан
    isEnabled,
    isPlaying,
    currentTrack,
    volume,
    effectsVolume,
    backgroundTracks,
    
    // Дії
    toggleEnabled,
    toggleMusic,
    playTrack,
    nextTrack,
    previousTrack,
    setVolume,
    setEffectsVolume,
    playEffect,
    
    // Поточний трек
    getCurrentTrack: () => backgroundTracks[currentTrack]
  };
}