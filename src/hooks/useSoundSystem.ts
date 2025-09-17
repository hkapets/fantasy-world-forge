import { useState, useEffect, useRef } from 'react';

interface Track {
  id: string;
  name: string;
  file: string;
}

// Список фонових треків (опціональні MP3 файли в public/audio/music/)
const backgroundTracks: Track[] = [
  // Треки будуть додані динамічно якщо файли існують
];

// Звукові ефекти (опціональні MP3 файли в public/audio/effects/)
const soundEffects = {
  // Ефекти будуть додані динамічно якщо файли існують
};

// Функція для перевірки існування аудіо файлу
const checkAudioFile = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Ініціалізація доступних аудіо файлів
const initializeAudioFiles = async () => {
  const musicFiles = [
    { id: 'ashes', name: 'Ashes', file: '/audio/music/Ashes.mp3' },
    { id: 'between-lines', name: 'Between The Lines', file: '/audio/music/Between The Lines.mp3' },
    { id: 'epic-quest', name: 'Epic Quest', file: '/audio/music/Epic Quest.mp3' },
    { id: 'mystic-realms', name: 'Mystic Realms', file: '/audio/music/Mystic Realms.mp3' },
    { id: 'mythic', name: 'Mythic', file: '/audio/music/Mythic.mp3' }
  ];

  const effectFiles = {
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

  // Перевіряємо та додаємо тільки існуючі файли
  for (const track of musicFiles) {
    const exists = await checkAudioFile(track.file);
    if (exists) {
      backgroundTracks.push(track);
    }
  }

  for (const [key, path] of Object.entries(effectFiles)) {
    const exists = await checkAudioFile(path);
    if (exists) {
      soundEffects[key as keyof typeof soundEffects] = path;
    }
  }
};

export function useSoundSystem() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [effectsVolume, setEffectsVolume] = useState(0.5);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effectsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Ініціалізація аудіо
  useEffect(() => {
    const initAudio = async () => {
      // Ініціалізуємо доступні аудіо файли
      await initializeAudioFiles();
      setAudioInitialized(true);
    };

    initAudio();

    // Створюємо аудіо елемент для фонової музики
    if (backgroundTracks.length > 0) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.loop = false;
      
      // Автоматичний перехід до наступного треку
      audioRef.current.addEventListener('ended', () => {
        nextTrack();
      });
    }

    // Створюємо аудіо елементи для звукових ефектів тільки якщо файли існують
    Object.entries(soundEffects).forEach(([key, path]) => {
      if (path) {
        const audio = new Audio(path);
        audio.volume = effectsVolume;
        audio.onerror = () => {
          console.warn(`Audio file not found: ${path}`);
        };
        effectsRef.current[key] = audio;
      }
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

    if (backgroundTracks.length === 0) {
      console.warn('No background tracks available');
      return;
    }

    const track = backgroundTracks[trackIndex];
    if (!track) return;

    // Перевіряємо чи файл існує перед відтворенням
    checkAudioFile(track.file).then(exists => {
      if (exists && audioRef.current) {
        audioRef.current.src = track.file;
        audioRef.current.play().catch(error => {
          console.warn('Error playing track:', error);
          setIsPlaying(false);
        });
        setCurrentTrack(trackIndex);
        setIsPlaying(true);
      } else {
        console.warn(`Track file not found: ${track.file}`);
      }
    });
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
    if (backgroundTracks.length === 0) return;
    const nextIndex = (currentTrack + 1) % backgroundTracks.length;
    playTrack(nextIndex);
  };

  const previousTrack = () => {
    if (backgroundTracks.length === 0) return;
    const prevIndex = currentTrack === 0 ? backgroundTracks.length - 1 : currentTrack - 1;
    playTrack(prevIndex);
  };

  const playEffect = (effectName: keyof typeof soundEffects) => {
    if (!isEnabled) return;

    const audio = effectsRef.current[effectName];
    if (audio) {
      audio.currentTime = 0; // Скидаємо до початку
      audio.play().catch(error => {
        console.warn(`Audio effect not available: ${effectName}`);
      });
    } else {
      // Fallback - просто логуємо що ефект був викликаний
      console.log(`Sound effect triggered: ${effectName} (audio file not available)`);
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
    getCurrentTrack: () => backgroundTracks.length > 0 ? backgroundTracks[currentTrack] : null,
    audioInitialized
  };
}