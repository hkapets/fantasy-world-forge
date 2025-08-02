import React, { useRef, useEffect, useState } from 'react';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'character' | 'lore' | 'note' | 'map' | 'scenario' | 'event';
  name: string;
  x: number;
  y: number;
  connections: string[];
  color: string;
}

interface NetworkEdge {
  from: string;
  to: string;
  type: string;
  strength: 'weak' | 'medium' | 'strong';
}

interface RelationshipNetworkProps {
  entityId: string;
  entityType: string;
  worldId: string;
  onNavigate?: (entityType: string, entityId: string) => void;
  maxDepth?: number;
  width?: number;
  height?: number;
}

const typeColors = {
  character: '#6B46C1',
  lore: '#059669',
  note: '#3B82F6',
  map: '#D97706',
  scenario: '#8B5CF6',
  event: '#F59E0B'
};

export const RelationshipNetwork: React.FC<RelationshipNetworkProps> = ({
  entityId,
  entityType,
  worldId,
  onNavigate,
  maxDepth = 2,
  width = 600,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Завантаження даних та побудова мережі
  useEffect(() => {
    buildNetwork();
  }, [entityId, entityType, worldId, maxDepth]);

  const buildNetwork = () => {
    const networkNodes: NetworkNode[] = [];
    const networkEdges: NetworkEdge[] = [];
    const processedEntities = new Set<string>();

    // Додаємо центральний вузол
    const centerNode: NetworkNode = {
      id: entityId,
      type: entityType as any,
      name: getEntityName(entityId, entityType),
      x: width / 2,
      y: height / 2,
      connections: [],
      color: typeColors[entityType as keyof typeof typeColors] || '#6B7280'
    };
    networkNodes.push(centerNode);
    processedEntities.add(`${entityType}-${entityId}`);

    // Рекурсивно додаємо пов'язані елементи
    addConnectedEntities(entityId, entityType, networkNodes, networkEdges, processedEntities, 0, maxDepth);

    // Розташовуємо вузли по колу навколо центрального
    const connectedNodes = networkNodes.filter(node => node.id !== entityId);
    connectedNodes.forEach((node, index) => {
      const angle = (index / connectedNodes.length) * 2 * Math.PI;
      const radius = 150;
      node.x = width / 2 + Math.cos(angle) * radius;
      node.y = height / 2 + Math.sin(angle) * radius;
    });

    setNodes(networkNodes);
    setEdges(networkEdges);
  };

  const getEntityName = (id: string, type: string): string => {
    try {
      switch (type) {
        case 'character':
          const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
          const char = characters.find((c: any) => c.id === id && c.worldId === worldId);
          return char?.name || 'Невідомий персонаж';

        case 'lore':
          const loreItems = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`) || '[]');
          const lore = loreItems.find((l: any) => l.id === id);
          return lore?.name || 'Невідомий лор';

        case 'note':
          const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
          const note = notes.find((n: any) => n.id === id);
          return note?.title || 'Невідома нотатка';

        case 'map':
          const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
          const map = maps.find((m: any) => m.id === id);
          return map?.name || 'Невідома карта';

        case 'scenario':
          const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
          const scenario = scenarios.find((s: any) => s.id === id && s.worldId === worldId);
          return scenario?.title || 'Невідомий сценарій';

        case 'event':
          const events = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_events_${worldId}`) || '[]');
          const event = events.find((e: any) => e.id === id);
          return event?.name || 'Невідома подія';

        default:
          return 'Невідомий елемент';
      }
    } catch {
      return 'Помилка завантаження';
    }
  };

  const addConnectedEntities = (
    currentId: string,
    currentType: string,
    nodes: NetworkNode[],
    edges: NetworkEdge[],
    processed: Set<string>,
    currentDepth: number,
    maxDepth: number
  ) => {
    if (currentDepth >= maxDepth) return;

    // Отримуємо зв'язки
    const relationships = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${worldId}`) || '[]');
    const entityRelationships = relationships.filter((rel: any) =>
      (rel.sourceType === currentType && rel.sourceId === currentId) ||
      (rel.targetType === currentType && rel.targetId === currentId)
    );

    entityRelationships.forEach((rel: any) => {
      const isSource = rel.sourceType === currentType && rel.sourceId === currentId;
      const connectedType = isSource ? rel.targetType : rel.sourceType;
      const connectedId = isSource ? rel.targetId : rel.sourceId;
      const connectedName = isSource ? rel.targetName : rel.sourceName;
      const entityKey = `${connectedType}-${connectedId}`;

      if (!processed.has(entityKey)) {
        const newNode: NetworkNode = {
          id: connectedId,
          type: connectedType,
          name: connectedName,
          x: 0,
          y: 0,
          connections: [],
          color: typeColors[connectedType as keyof typeof typeColors] || '#6B7280'
        };
        nodes.push(newNode);
        processed.add(entityKey);

        // Рекурсивно додаємо зв'язки
        addConnectedEntities(connectedId, connectedType, nodes, edges, processed, currentDepth + 1, maxDepth);
      }

      // Додаємо ребро
      edges.push({
        from: currentId,
        to: connectedId,
        type: rel.relationshipType,
        strength: rel.strength
      });
    });

    // Також додаємо зв'язки через теги
    addTagBasedConnections(currentId, currentType, nodes, edges, processed, currentDepth, maxDepth);
  };

  const addTagBasedConnections = (
    currentId: string,
    currentType: string,
    nodes: NetworkNode[],
    edges: NetworkEdge[],
    processed: Set<string>,
    currentDepth: number,
    maxDepth: number
  ) => {
    if (currentDepth >= maxDepth) return;

    // Отримуємо теги поточної сутності
    const currentTags = getEntityTags(currentId, currentType);
    if (!currentTags || currentTags.length === 0) return;

    // Шукаємо інші сутності з такими ж тегами
    const allEntities = getAllEntitiesWithTags();
    
    allEntities.forEach(entity => {
      if (entity.id === currentId && entity.type === currentType) return;
      
      const commonTags = entity.tags.filter(tag => 
        currentTags.some(currentTag => currentTag.toLowerCase() === tag.toLowerCase())
      );
      
      if (commonTags.length > 0) {
        const entityKey = `${entity.type}-${entity.id}`;
        
        if (!processed.has(entityKey)) {
          const newNode: NetworkNode = {
            id: entity.id,
            type: entity.type,
            name: entity.name,
            x: 0,
            y: 0,
            connections: [],
            color: typeColors[entity.type as keyof typeof typeColors] || '#6B7280'
          };
          nodes.push(newNode);
          processed.add(entityKey);
        }

        // Додаємо ребро на основі тегів
        const existingEdge = edges.find(edge => 
          (edge.from === currentId && edge.to === entity.id) ||
          (edge.from === entity.id && edge.to === currentId)
        );

        if (!existingEdge) {
          edges.push({
            from: currentId,
            to: entity.id,
            type: `Спільні теги: ${commonTags.join(', ')}`,
            strength: 'weak'
          });
        }
      }
    });
  };

  const getEntityTags = (id: string, type: string): string[] => {
    try {
      switch (type) {
        case 'character':
          const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
          const char = characters.find((c: any) => c.id === id && c.worldId === worldId);
          return char?.tags || [];

        case 'note':
          const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
          const note = notes.find((n: any) => n.id === id);
          return note?.tags || [];

        case 'map':
          const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
          const map = maps.find((m: any) => m.id === id);
          return map?.tags || [];

        case 'scenario':
          const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
          const scenario = scenarios.find((s: any) => s.id === id && s.worldId === worldId);
          return scenario?.tags || [];

        default:
          return [];
      }
    } catch {
      return [];
    }
  };

  const getAllEntitiesWithTags = () => {
    const entities: Array<{id: string, type: string, name: string, tags: string[]}> = [];

    try {
      // Персонажі
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      characters
        .filter((char: any) => char.worldId === worldId && char.tags)
        .forEach((char: any) => {
          entities.push({
            id: char.id,
            type: 'character',
            name: char.name,
            tags: char.tags
          });
        });

      // Нотатки
      const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
      notes
        .filter((note: any) => note.tags)
        .forEach((note: any) => {
          entities.push({
            id: note.id,
            type: 'note',
            name: note.title,
            tags: note.tags
          });
        });

      // Карти
      const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
      maps
        .filter((map: any) => map.tags)
        .forEach((map: any) => {
          entities.push({
            id: map.id,
            type: 'map',
            name: map.name,
            tags: map.tags
          });
        });

      // Сценарії
      const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
      scenarios
        .filter((scenario: any) => scenario.worldId === worldId && scenario.tags)
        .forEach((scenario: any) => {
          entities.push({
            id: scenario.id,
            type: 'scenario',
            name: scenario.title,
            tags: scenario.tags
          });
        });
    } catch (error) {
      console.error('Error loading entities:', error);
    }

    return entities;
  };

  // Малювання мережі
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаємо canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Застосовуємо трансформації
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Малюємо ребра
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Стиль лінії залежно від сили зв'язку
        ctx.strokeStyle = edge.strength === 'strong' ? '#059669' : 
                         edge.strength === 'medium' ? '#F59E0B' : '#9CA3AF';
        ctx.lineWidth = edge.strength === 'strong' ? 3 : 
                       edge.strength === 'medium' ? 2 : 1;
        ctx.stroke();

        // Підпис зв'язку
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        ctx.fillStyle = '#6B7280';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(edge.type.length > 20 ? edge.type.substring(0, 17) + '...' : edge.type, midX, midY - 5);
      }
    });

    // Малюємо вузли
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const isCentral = node.id === entityId;
      
      // Тіло вузла
      ctx.beginPath();
      ctx.arc(node.x, node.y, isCentral ? 25 : 20, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Обводка
      ctx.strokeStyle = isSelected ? '#FFFFFF' : isCentral ? '#FFFFFF' : node.color;
      ctx.lineWidth = isSelected ? 3 : isCentral ? 2 : 1;
      ctx.stroke();

      // Іконка типу (спрощена)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(getTypeIcon(node.type), node.x, node.y + 4);

      // Назва вузла
      ctx.fillStyle = '#1F2937';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      const maxWidth = 80;
      const text = node.name.length > 12 ? node.name.substring(0, 9) + '...' : node.name;
      ctx.fillText(text, node.x, node.y + 35);
    });

    ctx.restore();
  }, [nodes, edges, zoom, pan, selectedNode, entityId]);

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'character': return '👤';
      case 'lore': return '📚';
      case 'note': return '📝';
      case 'map': return '🗺️';
      case 'scenario': return '🎬';
      case 'event': return '📅';
      default: return '❓';
    }
  };

  // Обробка кліків по canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left - pan.x) / zoom);
    const y = ((e.clientY - rect.top - pan.y) / zoom);

    // Перевіряємо клік по вузлах
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= (node.id === entityId ? 25 : 20);
    });

    if (clickedNode) {
      if (e.shiftKey && onNavigate) {
        onNavigate(clickedNode.type, clickedNode.id);
      } else {
        setSelectedNode(clickedNode.id === selectedNode ? null : clickedNode.id);
      }
    } else {
      setSelectedNode(null);
    }
  };

  // Панування
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Зум
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * zoomFactor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const actualWidth = isFullscreen ? window.innerWidth - 100 : width;
  const actualHeight = isFullscreen ? window.innerHeight - 200 : height;

  return (
    <div style={{
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? '50px' : 'auto',
      left: isFullscreen ? '50px' : 'auto',
      right: isFullscreen ? '50px' : 'auto',
      bottom: isFullscreen ? '50px' : 'auto',
      zIndex: isFullscreen ? 1000 : 'auto',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Контроли */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Мережа зв'язків ({nodes.length} елементів)
        </h4>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setZoom(prev => Math.min(prev * 1.2, 3))}
            title="Збільшити"
          >
            <ZoomIn size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.3))}
            title="Зменшити"
          >
            <ZoomOut size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={resetView}
            title="Скинути вигляд"
          >
            <RotateCcw size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Згорнути" : "Розгорнути"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={actualWidth}
        height={actualHeight}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'block'
        }}
      />

      {/* Інформація про вибраний вузол */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: node.color
                  }} />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    {node.name}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textTransform: 'capitalize'
                  }}>
                    ({node.type})
                  </span>
                </div>
                
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>
                  Shift + клік для переходу до елемента
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Легенда */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem',
        fontSize: '0.75rem'
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Легенда:
        </div>
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: color
            }} />
            <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {type === 'character' ? 'Персонажі' :
               type === 'lore' ? 'Лор' :
               type === 'note' ? 'Нотатки' :
               type === 'map' ? 'Карти' :
               type === 'scenario' ? 'Сценарії' :
               type === 'event' ? 'Події' : type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};