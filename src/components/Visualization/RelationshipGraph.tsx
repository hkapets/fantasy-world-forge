import React, { useRef, useEffect, useState } from 'react';
import { Network, Download, ZoomIn, ZoomOut, RotateCcw, Maximize2, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';

interface GraphNode {
  id: string;
  name: string;
  type: 'character' | 'location' | 'event' | 'lore';
  x: number;
  y: number;
  connections: number;
  importance: number;
}

interface GraphEdge {
  from: string;
  to: string;
  type: string;
  strength: 'weak' | 'medium' | 'strong';
  isSecret: boolean;
}

interface RelationshipGraphProps {
  relationships: any[];
  characters: any[];
  worldId: string;
  onNavigateToEntity?: (entityType: string, entityId: string) => void;
  width?: number;
  height?: number;
}

const nodeColors = {
  character: '#6B46C1',
  location: '#059669',
  event: '#F59E0B',
  lore: '#3B82F6'
};

const strengthWidths = {
  weak: 1,
  medium: 2,
  strong: 3
};

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  relationships,
  characters,
  worldId,
  onNavigateToEntity,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showSecrets, setShowSecrets] = useState(true);

  useEffect(() => {
    buildGraph();
  }, [relationships, characters, filterType, showSecrets]);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, zoom, pan, selectedNode]);

  const buildGraph = () => {
    const nodeMap = new Map<string, GraphNode>();
    const graphEdges: GraphEdge[] = [];

    // Створюємо вузли з персонажів
    characters.forEach((char: any) => {
      if (char.worldId === worldId) {
        nodeMap.set(char.id, {
          id: char.id,
          name: char.name,
          type: 'character',
          x: Math.random() * (width - 100) + 50,
          y: Math.random() * (height - 100) + 50,
          connections: 0,
          importance: 1
        });
      }
    });

    // Додаємо ребра з зв'язків
    relationships.forEach((rel: any) => {
      if (rel.worldId === worldId) {
        // Фільтруємо секретні зв'язки
        if (!showSecrets && rel.isSecret) return;
        
        // Фільтруємо за типом
        if (filterType !== 'all' && rel.sourceType !== filterType && rel.targetType !== filterType) return;

        // Створюємо вузли якщо їх немає
        if (!nodeMap.has(rel.sourceId)) {
          nodeMap.set(rel.sourceId, {
            id: rel.sourceId,
            name: rel.sourceName,
            type: rel.sourceType,
            x: Math.random() * (width - 100) + 50,
            y: Math.random() * (height - 100) + 50,
            connections: 0,
            importance: 1
          });
        }

        if (!nodeMap.has(rel.targetId)) {
          nodeMap.set(rel.targetId, {
            id: rel.targetId,
            name: rel.targetName,
            type: rel.targetType,
            x: Math.random() * (width - 100) + 50,
            y: Math.random() * (height - 100) + 50,
            connections: 0,
            importance: 1
          });
        }

        // Додаємо ребро
        graphEdges.push({
          from: rel.sourceId,
          to: rel.targetId,
          type: rel.relationshipType,
          strength: rel.strength,
          isSecret: rel.isSecret
        });

        // Збільшуємо лічильник зв'язків
        const sourceNode = nodeMap.get(rel.sourceId)!;
        const targetNode = nodeMap.get(rel.targetId)!;
        sourceNode.connections++;
        targetNode.connections++;
      }
    });

    // Розраховуємо важливість вузлів
    nodeMap.forEach(node => {
      node.importance = Math.min(node.connections / 3, 3) + 1;
    });

    // Застосовуємо force-directed layout
    applyForceLayout(Array.from(nodeMap.values()), graphEdges);

    setNodes(Array.from(nodeMap.values()));
    setEdges(graphEdges);
  };

  const applyForceLayout = (nodes: GraphNode[], edges: GraphEdge[]) => {
    const iterations = 100;
    const repulsionForce = 50;
    const attractionForce = 0.01;
    const damping = 0.9;

    for (let i = 0; i < iterations; i++) {
      // Сили відштовхування між вузлами
      nodes.forEach(node1 => {
        let fx = 0, fy = 0;
        
        nodes.forEach(node2 => {
          if (node1.id !== node2.id) {
            const dx = node1.x - node2.x;
            const dy = node1.y - node2.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const force = repulsionForce / (distance * distance);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        });

        node1.x += fx * damping;
        node1.y += fy * damping;
      });

      // Сили притягування між з'єднаними вузлами
      edges.forEach(edge => {
        const node1 = nodes.find(n => n.id === edge.from);
        const node2 = nodes.find(n => n.id === edge.to);
        
        if (node1 && node2) {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = distance * attractionForce;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          node1.x += fx * damping;
          node1.y += fy * damping;
          node2.x -= fx * damping;
          node2.y -= fy * damping;
        }
      });

      // Утримуємо вузли в межах canvas
      nodes.forEach(node => {
        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
      });
    }
  };

  const drawGraph = () => {
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
        
        // Стиль лінії
        ctx.strokeStyle = edge.isSecret ? '#F59E0B' : 
                         edge.strength === 'strong' ? '#059669' : 
                         edge.strength === 'medium' ? '#F59E0B' : '#9CA3AF';
        ctx.lineWidth = strengthWidths[edge.strength];
        
        if (edge.isSecret) {
          ctx.setLineDash([5, 5]);
        } else {
          ctx.setLineDash([]);
        }
        
        ctx.stroke();
      }
    });

    // Малюємо вузли
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const nodeRadius = 8 + node.importance * 4;
      
      // Тіло вузла
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColors[node.type];
      ctx.fill();
      
      // Обводка
      if (isSelected) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Підпис
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${10 + node.importance}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillText(
        node.name.length > 12 ? node.name.substring(0, 9) + '...' : node.name,
        node.x,
        node.y + nodeRadius + 15
      );
    });

    ctx.restore();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left - pan.x) / zoom);
    const y = ((e.clientY - rect.top - pan.y) / zoom);

    // Перевіряємо клік по вузлах
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      const nodeRadius = 8 + node.importance * 4;
      return distance <= nodeRadius;
    });

    if (clickedNode) {
      if (e.shiftKey && onNavigateToEntity) {
        onNavigateToEntity(clickedNode.type, clickedNode.id);
      } else {
        setSelectedNode(clickedNode.id === selectedNode ? null : clickedNode.id);
      }
    } else {
      setSelectedNode(null);
    }
  };

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

  const exportAsImage = async () => {
    if (!containerRef.current) return;
    
    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#0F0B14',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `relationship-graph-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Помилка експорту зображення');
    }
  };

  const actualWidth = isFullscreen ? window.innerWidth - 100 : width;
  const actualHeight = isFullscreen ? window.innerHeight - 200 : height;

  return (
    <div
      ref={containerRef}
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? '50px' : 'auto',
        left: isFullscreen ? '50px' : 'auto',
        right: isFullscreen ? '50px' : 'auto',
        bottom: isFullscreen ? '50px' : 'auto',
        zIndex: isFullscreen ? 1000 : 'auto',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: isFullscreen ? 0 : 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
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
          <Network size={20} style={{ color: 'var(--fantasy-primary)' }} />
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Граф зв'язків ({nodes.length} вузлів, {edges.length} зв'язків)
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
            <option value="character">Персонажі</option>
            <option value="location">Локації</option>
            <option value="event">Події</option>
            <option value="lore">Лор</option>
          </select>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={showSecrets}
              onChange={(e) => setShowSecrets(e.target.checked)}
              style={{ transform: 'scale(0.8)' }}
            />
            Секретні
          </label>

          {/* Контроли масштабу */}
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
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
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
            
            const nodeEdges = edges.filter(e => e.from === node.id || e.to === node.id);
            
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
                    background: nodeColors[node.type]
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
                    ({node.type === 'character' ? 'Персонаж' : 
                      node.type === 'location' ? 'Локація' :
                      node.type === 'event' ? 'Подія' : 'Лор'})
                  </span>
                </div>
                
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>
                  Зв'язків: {node.connections} | Важливість: {node.importance.toFixed(1)}
                  <br />
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
          Типи:
        </div>
        {Object.entries(nodeColors).map(([type, color]) => (
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
               type === 'location' ? 'Локації' :
               type === 'event' ? 'Події' : 'Лор'}
            </span>
          </div>
        ))}
        
        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-primary)' }}>
          <div style={{ marginBottom: '0.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Зв'язки:
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            — Слабкий | —— Середній | ——— Сильний
            <br />
            - - - Секретний
          </div>
        </div>
      </div>
    </div>
  );
};