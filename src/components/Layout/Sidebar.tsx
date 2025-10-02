 "a"a/ni-tt=;o 
"e"wo;
 n "}'YтE
h  S
cr l<a  в0,oBi e i eP eW00  _s     gtgsoeoon:,eap'gd"l"i'iv
  sLrg *Hn'" W,l
  "tgR', nr ce"nh:e k    </button>
          );
        })}
      </nav>
    </aside>
import { Users, Book, Calendar, Image as MapIcon, Settings, CreditCard as Edit, Puzzle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

const sections = [
  { id: 'characters', name: 'Персонажі', icon: Users },
  { id: 'lore', name: 'Лор', icon: Book },
  { id: 'chronology', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'relationships', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'plugins', name: 'Плагіни', icon: Puzzle },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Вибір світу */}
      {worlds.length > 0 && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {t('sidebar.current_world')}
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
      )}

      {/* Навігація */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          {t('sidebar.sections')}
        </div>
        
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              {section.name}
            </button>
          );
        })}
      </nav>
    </aside>
  ) MapIcon, 
  Settings,
  Edit,
  Puzzle
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

const sections = [
  { id: 'characters', name: 'Персонажі', icon: Users },
  { id: 'lore', name: 'Лор', icon: Book },
  { id: 'chronology', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'relationships', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'plugins', name: 'Плагіни', icon: Puzzle },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Вибір світу */}
      {worlds.length > 0 && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {t('sidebar.current_world')}
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
      )}

      {/* Навігація */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          {t('sidebar.sections')}
        </div>
        
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              {section.name}
            </button>
          );
        })}
      </nav>
    </aside>
import { Users, Book, Calendar, Image as MapIcon, Settings, CreditCard as Edit, Puzzle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

const sections = [
  { id: 'characters', name: 'Персонажі', icon: Users },
  { id: 'lore', name: 'Лор', icon: Book },
  { id: 'chronology', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'relationships', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'plugins', name: 'Плагіни', icon: Puzzle },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Вибір світу */}
      {worlds.length > 0 && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {t('sidebar.current_world')}
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
      )}

      {/* Навігація */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          {t('sidebar.sections')}
        </div>
        
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              {section.name}
            </button>
          );
        })}
      </nav>
    </aside>
  )";
}k, 
  Calendar, 
  Image as MapIcon, 
  Settings,
  Edit,
  Puzzle
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

const sections = [
  { id: 'characters', name: 'Персонажі', icon: Users },
  { id: 'lore', name: 'Лор', icon: Book },
  { id: 'chronology', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'relationships', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'plugins', name: 'Плагіни', icon: Puzzle },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Вибір світу */}
      {worlds.length > 0 && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {t('sidebar.current_world')}
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
      )}

      {/* Навігація */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          {t('sidebar.sections')}
        </div>
        
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              {section.name}
            </button>
          );
        })}
      </nav>
    </aside>
import { Users, Book, Calendar, Image as MapIcon, Settings, CreditCard as Edit, Puzzle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

const sections = [
  { id: 'characters', name: 'Персонажі', icon: Users },
  { id: 'lore', name: 'Лор', icon: Book },
  { id: 'chronology', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'relationships', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'plugins', name: 'Плагіни', icon: Puzzle },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Вибір світу */}
      {worlds.length > 0 && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {t('sidebar.current_world')}
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
      )}

      {/* Навігація */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          {t('sidebar.sections')}
        </div>
        
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              {section.name}
            </button>
          );
        })}
      </nav>
    </aside>
  ) MapIcon, 
  Settings,
  Edit,
  Puzzle
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

const sections = [
  { id: 'characters', name: 'Персонажі', icon: Users },
  { id: 'lore', name: 'Лор', icon: Book },
  { id: 'chronology', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'relationships', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'plugins', name: 'Плагіни', icon: Puzzle },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Вибір світу */}
      {worlds.length > 0 && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {t('sidebar.current_world')}
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
      )}

      {/* Навігація */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          {t('sidebar.sections')}
        </div>
        
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              {section.name}
            </button>
          );
        })}
      </nav>
    </aside>
import { Users, Book, Calendar, Image as MapIcon, Settings, CreditCard as Edit, Puzzle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

const sections = [
  { id: 'characters', name: 'Персонажі', icon: Users },
  { id: 'lore', name: 'Лор', icon: Book },
  { id: 'chronology', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'relationships', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'plugins', name: 'Плагіни', icon: Puzzle },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Вибір світу */}
      {worlds.length > 0 && (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {t('sidebar.current_world')}
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
      )}

      {/* Навігація */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          {t('sidebar.sections')}
        </div>
        
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              {section.name}
            </button>
          );
        })}
      </nav>
    </aside>
  )";
};