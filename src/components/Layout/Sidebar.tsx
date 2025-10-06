import { Users, Book, Calendar, Image as MapIcon, Settings, CreditCard as Edit, Puzzle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentWorld: string | null;
  worlds: Array<{ id: string; name: string }>;
  onWorldChange: (worldId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
  const { t } = useTranslation();

  const sections = [
    { id: 'characters', name: t('sidebar.characters'), icon: Users },
    { id: 'lore', name: t('sidebar.lore'), icon: Book },
    { id: 'chronology', name: t('sidebar.chronology'), icon: Calendar },
    { id: 'maps', name: t('sidebar.maps'), icon: MapIcon },
    { id: 'relationships', name: t('sidebar.relationships'), icon: Edit },
    { id: 'notes', name: t('sidebar.notes'), icon: Edit },
    { id: 'scenarios', name: t('sidebar.scenarios'), icon: Edit },
    { id: 'plugins', name: t('sidebar.plugins'), icon: Puzzle },
    { id: 'settings', name: t('sidebar.settings'), icon: Settings }
  ];

  return (
    <aside className="sidebar">
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
            style={{ width: '100%' }}
          >
            <option value="">{t('worlds.select_world')}</option>
            {worlds.map(world => (
              <option key={world.id} value={world.id}>{world.name}</option>
            ))}
          </select>
        </div>
      )}

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
  );
};
