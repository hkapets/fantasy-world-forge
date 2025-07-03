import React from 'react';
import { 
  Users, 
  Book, 
  Calendar, 
  Image as MapIcon, 
  Settings,
  Edit
} from 'lucide-react';

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
  { id: 'timeline', name: 'Хронологія', icon: Calendar },
  { id: 'maps', name: 'Карти світу', icon: MapIcon },
  { id: 'connections', name: "Зв'язки", icon: Edit },
  { id: 'notes', name: 'Нотатки', icon: Edit },
  { id: 'scenarios', name: 'Сценарії', icon: Edit },
  { id: 'settings', name: 'Налаштування', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  currentWorld,
  worlds,
  onWorldChange
}) => {
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
            Поточний світ:
          </label>
          <select
            className="input"
            value={currentWorld || ''}
            onChange={(e) => onWorldChange(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          >
            {worlds.map(world => (
              <option key={world.id} value={world.id}>
                {world.name}
              </option>
            ))}
          </select>
        </div>
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
          Розділи
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