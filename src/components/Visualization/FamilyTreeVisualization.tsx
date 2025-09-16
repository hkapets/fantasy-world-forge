import React, { useRef, useEffect, useState } from 'react';
import { Users, Download, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FamilyMember {
  id: string;
  name: string;
  generation: number;
  parents: string[];
  children: string[];
  spouse?: string;
  status: 'alive' | 'dead' | 'unknown';
  image?: string;
}

interface FamilyTreeVisualizationProps {
  characters: any[];
  worldId: string;
  onNavigateToCharacter?: (characterId: string) => void;
}

export const FamilyTreeVisualization: React.FC<FamilyTreeVisualizationProps> = ({
  characters,
  worldId,
  onNavigateToCharacter
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [zoom, setZoom] = useState(1);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    buildFamilyTree();
  }, [characters]);

  const buildFamilyTree = () => {
    const familyMembers: FamilyMember[] = [];
    
    // Аналізуємо персонажів для виявлення родинних зв'язків
    characters.forEach(char => {
      if (char.relatives) {
        const relatives = char.relatives.split(',').map((rel: string) => rel.trim());
        
        const member: FamilyMember = {
          id: char.id,
          name: char.name,
          generation: 0, // Буде розраховано пізніше
          parents: [],
          children: [],
          status: char.status?.toLowerCase().includes('живий') ? 'alive' : 
                  char.status?.toLowerCase().includes('мертвий') ? 'dead' : 'unknown',
          image: char.image
        };

        // Простий парсинг родичів
        relatives.forEach(relative => {
          const lowerRel = relative.toLowerCase();
          if (lowerRel.includes('батько') || lowerRel.includes('мати') || lowerRel.includes('родич')) {
            // Знаходимо персонажа з таким іменем
            const parentChar = characters.find((c: any) => 
              c.name.toLowerCase().includes(relative.toLowerCase()) ||
              relative.toLowerCase().includes(c.name.toLowerCase())
            );
            if (parentChar) {
              member.parents.push(parentChar.id);
            }
          }
        });

        familyMembers.push(member);
      }
    });

    // Розраховуємо покоління
    calculateGenerations(familyMembers);
    setFamilyData(familyMembers);
  };

  const calculateGenerations = (members: FamilyMember[]) => {
    const visited = new Set<string>();
    
    const calculateGeneration = (memberId: string, currentGen: number = 0): number => {
      if (visited.has(memberId)) return currentGen;
      visited.add(memberId);
      
      const member = members.find(m => m.id === memberId);
      if (!member) return currentGen;
      
      if (member.parents.length === 0) {
        member.generation = 0;
        return 0;
      }
      
      const parentGenerations = member.parents.map(parentId => 
        calculateGeneration(parentId, currentGen)
      );
      
      member.generation = Math.max(...parentGenerations) + 1;
      return member.generation;
    };
    
    members.forEach(member => calculateGeneration(member.id));
  };

  const exportAsImage = async () => {
    if (!containerRef.current) return;
    
    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#0F0B14',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `family-tree-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Помилка експорту зображення');
    }
  };

  const generations = familyData.reduce((acc, member) => {
    if (!acc[member.generation]) acc[member.generation] = [];
    acc[member.generation].push(member);
    return acc;
  }, {} as Record<number, FamilyMember[]>);

  const maxGeneration = Math.max(...Object.keys(generations).map(Number));

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
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Users size={20} style={{ color: 'var(--fantasy-primary)' }} />
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Родинне дерево ({familyData.length} членів)
          </h4>
        </div>

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
            onClick={() => setZoom(1)}
            title="Скинути масштаб"
          >
            <RotateCcw size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={exportAsImage}
            title="Експортувати як зображення"
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

      {/* Дерево */}
      <div
        ref={containerRef}
        style={{
          padding: '2rem',
          overflow: 'auto',
          height: isFullscreen ? 'calc(100vh - 80px)' : '500px',
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease'
        }}
      >
        {familyData.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-secondary)'
          }}>
            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Немає даних про родинні зв'язки</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Додайте інформацію про родичів у профілях персонажів
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem',
            minWidth: `${Math.max(800, familyData.length * 150)}px`
          }}>
            {Array.from({ length: maxGeneration + 1 }, (_, gen) => (
              <div key={gen} style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                {generations[gen]?.map(member => (
                  <div
                    key={member.id}
                    onClick={() => {
                      setSelectedMember(member.id === selectedMember ? null : member.id);
                      if (onNavigateToCharacter) {
                        onNavigateToCharacter(member.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem',
                      background: selectedMember === member.id ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                      border: selectedMember === member.id ? '2px solid var(--fantasy-primary)' : '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '120px',
                      position: 'relative'
                    }}
                  >
                    {/* Статус індикатор */}
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: member.status === 'alive' ? 'var(--success)' : 
                                 member.status === 'dead' ? 'var(--danger)' : 'var(--warning)'
                    }} />

                    {/* Зображення або ініціали */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: member.image ? `url(${member.image})` : 'var(--gradient-primary)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem',
                      border: '2px solid var(--border-primary)'
                    }}>
                      {!member.image && (
                        <span style={{
                          color: 'white',
                          fontSize: '1.5rem',
                          fontWeight: '700'
                        }}>
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Ім'я */}
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}>
                      {member.name}
                    </div>

                    {/* Покоління */}
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.25rem'
                    }}>
                      {gen === 0 ? 'Засновник' : `${gen} покоління`}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};