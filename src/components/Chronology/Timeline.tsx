import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Filter, ZoomIn, ZoomOut } from 'lucide-react';
import { TimelineEvent } from './TimelineEvent';
import { CreateEventModal } from '../Modal/CreateEventModal';
import { useChronologyData, Chronology, ChronologyEvent } from '@/hooks/useChronologyData';

interface TimelineProps {
  chronology: Chronology;
  onBack: () => void;
  onEdit: (chronology: Chronology) => void;
  onDelete: (chronologyId: string) => void;
}

const eventTypes = [
  { value: 'all', label: 'Всі події' },
  { value: 'battles', label: 'Битви' },
  { value: 'states', label: 'Створення/знищення держав' },
  { value: 'characters', label: 'Народження/смерть персонажів' },
  { value: 'magic', label: 'Магічні події' },
  { value: 'other', label: 'Інші події' }
];

export const Timeline: React.FC<TimelineProps> = ({
  chronology,
  onBack,
  onEdit,
  onDelete
}) => {
  const { events, addEvent, updateEvent, deleteEvent } = useChronologyData(chronology.worldId);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChronologyEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [zoom, setZoom] = useState(1);
  const [centerYear, setCenterYear] = useState(0);
  
  const timelineRef = useRef<HTMLDivElement>(null);

  const chronologyEvents = events.filter(event => event.chronologyId === chronology.id);

  const filteredEvents = useMemo(() => {
    let filtered = chronologyEvents.filter(event =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    return filtered.sort((a, b) => a.date - b.date);
  }, [chronologyEvents, searchQuery, filterType]);

  // Групування подій по рокам
  const eventsByYear = useMemo(() => {
    const grouped: { [year: number]: ChronologyEvent[] } = {};
    filteredEvents.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const years = Object.keys(eventsByYear).map(Number).sort((a, b) => a - b);
  const minYear = years.length > 0 ? Math.min(...years, 0) : 0;
  const maxYear = years.length > 0 ? Math.max(...years, 100) : 100;

  const handleCreateEvent = (eventData: Omit<ChronologyEvent, 'id' | 'chronologyId' | 'createdAt' | 'lastModified'>) => {
    addEvent(eventData, chronology.id);
  };

  const handleEditEvent = (eventData: Omit<ChronologyEvent, 'id' | 'chronologyId' | 'createdAt' | 'lastModified'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    }
  };

  const openEditEventModal = (event: ChronologyEvent) => {
    setEditingEvent(event);
    setIsCreateEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.2));

  const yearWidth = 100 * zoom;
  const timelineWidth = (maxYear - minYear + 1) * yearWidth;

  return (
    <div style={{ padding: '2rem', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        flexShrink: 0
      }}>
        <button
          className="btn btn-secondary"
          onClick={onBack}
          style={{ marginRight: '1rem' }}
        >
          <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
          Назад
        </button>
        
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {chronology.name}
          </h1>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsCreateEventModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Додати подію
        </button>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ 
          position: 'relative', 
          flex: '1', 
          minWidth: '200px' 
        }}>
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Пошук подій..."
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="input"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          {eventTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={handleZoomOut}>
            <ZoomOut size={18} />
          </button>
          <button className="btn btn-secondary" onClick={handleZoomIn}>
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div 
        ref={timelineRef}
        style={{ 
          flex: 1, 
          overflow: 'auto',
          position: 'relative',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}
      >
        <div style={{
          position: 'relative',
          width: `${timelineWidth}px`,
          minWidth: '100%',
          height: '400px'
        }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gradient-primary)',
            borderRadius: '2px',
            transform: 'translateY(-50%)'
          }} />

          {/* Year markers */}
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
            const year = minYear + i;
            const left = i * yearWidth;
            
            return (
              <div
                key={year}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '2px',
                  height: '20px',
                  background: 'var(--border)',
                  margin: '0 auto',
                  marginBottom: '0.5rem'
                }} />
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '500'
                }}>
                  {year}
                </span>
              </div>
            );
          })}

          {/* Events */}
          {Object.entries(eventsByYear).map(([year, yearEvents]) => {
            const yearNum = parseInt(year);
            const left = (yearNum - minYear) * yearWidth;
            
            return yearEvents.map((event, index) => {
              const isEvenYear = yearNum % 2 === 0;
              const stackOffset = index * 10;
              
              return (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  style={{
                    position: 'absolute',
                    left: `${left - 75 + stackOffset}px`,
                    top: isEvenYear ? `calc(50% + 22px + ${stackOffset}px)` : `calc(50% - 160px - ${stackOffset}px)`,
                    zIndex: yearEvents.length - index
                  }}
                  onEdit={() => openEditEventModal(event)}
                  onDelete={() => handleDeleteEvent(event.id)}
                  onNavigate={(entityType, entityId) => {
                    // TODO: Implement navigation to specific entity
                    console.log('Navigate to:', entityType, entityId);
                  }}
                />
              );
            });
          })}
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        chronologyId={chronology.id}
        isOpen={isCreateEventModalOpen}
        onClose={() => {
          setIsCreateEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={editingEvent ? handleEditEvent : handleCreateEvent}
        editingEvent={editingEvent}
      />
    </div>
  );
};