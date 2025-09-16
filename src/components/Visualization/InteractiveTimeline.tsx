import React, { useState, useRef, useEffect } from 'react';
import { Clock, ZoomIn, ZoomOut, RotateCcw, Filter, Download, Maximize2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface TimelineEvent {
  id: string;
  name: string;
  date: number;
  type: string;
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  relatedCharacters?: string[];
  relatedLocations?: string[];
  image?: string;
}

interface InteractiveTimelineProps {
  events: any[];
  worldId: string;
  onNavigateToEvent?: (eventId: string) => void;
  height?: number;
}

const importanceColors = {
  low: '#9CA3AF',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#7C3AED'
};

const eventTypeColors = {
  battles: '#DC2626',
  states: '#D97706',
  characters: '#059669',
  magic: '#7C3AED',
  other: '#6B7280'
};

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  events,
  worldId,
  onNavigateToEvent,
  height = 400
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [centerYear, setCenterYear] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterImportance, setFilterImportance] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesImportance = filterImportance === 'all' || event.importance === filterImportance;
    return matchesType && matchesImportance;
  }).sort((a, b) => a.date - b.date);

  const minYear = filteredEvents.length > 0 ? Math.min(...filteredEvents.map(e => e.date)) : 0;
  const maxYear = filteredEvents.length > 0 ? Math.max(...filteredEvents.map(e => e.date)) : 100;
  const yearRange = maxYear - minYear || 100;

  useEffect(() => {
    if (filteredEvents.length > 0) {
      setCenterYear(Math.floor((minYear + maxYear) / 2));
    }
  }, [filteredEvents]);

  const exportAsImage = async () => {
    if (!timelineRef.current) return;
    
    try {
      const canvas = await html2canvas(timelineRef.current, {
        backgroundColor: '#0F0B14',
        scale: 2,
        width: timelineRef.current.scrollWidth,
        height: timelineRef.current.scrollHeight
      });
      
      const link = document.createElement('a');
      link.download = `timeline-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Помилка експорту зображення');
    }
  };

  const getEventPosition = (eventDate: number) => {
    const relativePosition = (eventDate - minYear) / yearRange;
    return relativePosition * 100; // відсоток від ширини
  };

  return (
    <div style={{
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? 0 : 'auto',
      left: isFullscreen ? 0 : 'auto',
      right: isFullscreen ? 0 : 'auto',
      bottom: isFullscreen ? 0 : 'auto',
      zIndex: isFullscreen ? 1000 : 'auto',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      borderRadius: isFullscreen ? 0 : 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Контроли */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Clock size={20} style={{ color: 'var(--fantasy-primary)' }} />
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Інтерактивна хронологія ({filteredEvents.length} подій)
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Фільтри */}
          <select
            className="input"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ fontSize: '0.75rem', padding: '0.5rem', minWidth: '120px' }}
          >
            <option value="all">Всі типи</option>
            <option value="battles">Битви</option>
            <option value="states">Держави</option>
            <option value="characters">Персонажі</option>
            <option value="magic">Магія</option>
            <option value="other">Інше</option>
          </select>

          <select
            className="input"
            value={filterImportance}
            onChange={(e) => setFilterImportance(e.target.value)}
            style={{ fontSize: '0.75rem', padding: '0.5rem', minWidth: '120px' }}
          >
            <option value="all">Вся важливість</option>
            <option value="critical">Критична</option>
            <option value="high">Висока</option>
            <option value="medium">Середня</option>
            <option value="low">Низька</option>
          </select>

          {/* Контроли масштабу */}
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))}
            title="Збільшити"
          >
            <ZoomIn size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.2))}
            title="Зменшити"
          >
            <ZoomOut size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setZoom(1)}
            title="Скинути"
          >
            <RotateCcw size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={exportAsImage}
            title="Експорт"
          >
            <Download size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Згорнути" : "Розгорнути"}
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Часова лінія */}
      <div
        ref={timelineRef}
        style={{
          height: isFullscreen ? 'calc(100vh - 120px)' : `${height}px`,
          overflow: 'auto',
          position: 'relative',
          background: 'var(--bg-primary)'
        }}
      >
        {filteredEvents.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-secondary)'
          }}>
            <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Немає подій для відображення</p>
          </div>
        ) : (
          <div style={{
            position: 'relative',
            width: `${Math.max(1000, yearRange * zoom * 2)}px`,
            height: '100%',
            margin: '0 auto'
          }}>
            {/* Основна лінія часу */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              right: '5%',
              height: '4px',
              background: 'var(--gradient-primary)',
              borderRadius: '2px',
              transform: 'translateY(-50%)'
            }} />

            {/* Маркери років */}
            {Array.from({ length: Math.ceil(yearRange / 10) + 1 }, (_, i) => {
              const year = minYear + i * 10;
              const position = getEventPosition(year);
              
              return (
                <div
                  key={year}
                  style={{
                    position: 'absolute',
                    left: `${5 + position * 0.9}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '2px',
                    height: '30px',
                    background: 'var(--border-secondary)',
                    margin: '0 auto',
                    marginBottom: '0.5rem'
                  }} />
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: '500'
                  }}>
                    {year}
                  </span>
                </div>
              );
            })}

            {/* Події */}
            {filteredEvents.map((event, index) => {
              const position = getEventPosition(event.date);
              const isEven = index % 2 === 0;
              const eventColor = eventTypeColors[event.type as keyof typeof eventTypeColors] || eventTypeColors.other;
              const importanceColor = importanceColors[event.importance as keyof typeof importanceColors] || importanceColors.medium;
              
              return (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event.id === selectedEvent ? null : event.id);
                    if (onNavigateToEvent) {
                      onNavigateToEvent(event.id);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${5 + position * 0.9}%`,
                    top: isEven ? 'calc(50% + 40px)' : 'calc(50% - 200px)',
                    transform: 'translateX(-50%)',
                    width: '180px',
                    cursor: 'pointer'
                  }}
                >
                  {/* Connector */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: isEven ? '-40px' : '200px',
                    width: '2px',
                    height: '40px',
                    background: eventColor,
                    transform: 'translateX(-50%)'
                  }} />

                  {/* Event card */}
                  <div
                    className="card"
                    style={{
                      padding: '1rem',
                      border: selectedEvent === event.id ? `2px solid ${eventColor}` : `1px solid var(--border-primary)`,
                      background: selectedEvent === event.id ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Дата та важливість */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: eventColor
                      }}>
                        {event.date}
                      </div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: importanceColor
                      }} />
                    </div>

                    {/* Зображення */}
                    {event.image && (
                      <div style={{
                        width: '100%',
                        height: '80px',
                        background: `url(${event.image}) center/cover`,
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '0.5rem'
                      }} />
                    )}

                    {/* Назва */}
                    <h5 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: 0,
                      marginBottom: '0.5rem',
                      lineHeight: '1.2'
                    }}>
                      {event.name}
                    </h5>

                    {/* Опис */}
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {event.description}
                    </p>

                    {/* Теги */}
                    {event.tags && event.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.25rem',
                        marginTop: '0.5rem'
                      }}>
                        {event.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            style={{
                              fontSize: '0.625rem',
                              padding: '0.125rem 0.375rem',
                              background: eventColor,
                              color: 'white',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: '500'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {event.tags.length > 2 && (
                          <span style={{
                            fontSize: '0.625rem',
                            padding: '0.125rem 0.375rem',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-muted)',
                            borderRadius: 'var(--radius-sm)'
                          }}>
                            +{event.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Легенда */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem',
        fontSize: '0.75rem'
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Важливість:
        </div>
        {Object.entries(importanceColors).map(([level, color]) => (
          <div key={level} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: color
            }} />
            <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {level === 'low' ? 'Низька' :
               level === 'medium' ? 'Середня' :
               level === 'high' ? 'Висока' : 'Критична'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};