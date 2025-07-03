import React, { useState } from 'react';
import { 
  Users, 
  Zap, 
  Map, 
  BookOpen, 
  Crown, 
  Star,
  FileText,
  Sparkles,
  Gem,
  Plus
} from 'lucide-react';
import { LoreSection } from './LoreSection';

const loreTypes = [
  { id: 'races', name: 'Раси', icon: Users, description: 'Різні раси вашого світу' },
  { id: 'bestiary', name: 'Бестіарій', icon: Zap, description: 'Істоти та монстри' },
  { id: 'geography', name: 'Географія', icon: Map, description: 'Локації та місця' },
  { id: 'history', name: 'Історія', icon: BookOpen, description: 'Важливі історичні події' },
  { id: 'politics', name: 'Політика', icon: Crown, description: 'Політичні структури' },
  { id: 'religion', name: 'Релігія і міфологія', icon: Star, description: 'Віри та міфи' },
  { id: 'languages', name: 'Писемність, мови і літочислення', icon: FileText, description: 'Мови та писемність' },
  { id: 'magic', name: 'Магія', icon: Sparkles, description: 'Магічні системи' },
  { id: 'artifacts', name: 'Артефакти', icon: Gem, description: 'Магічні предмети' }
];

interface LoreProps {
  currentWorldId: string | null;
}

export const Lore: React.FC<LoreProps> = ({ currentWorldId }) => {
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

  if (activeSubsection) {
    return (
      <LoreSection
        type={activeSubsection}
        currentWorldId={currentWorldId}
        onBack={() => setActiveSubsection(null)}
      />
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem',
          color: 'var(--text-primary)'
        }}>
          Лор
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Оберіть розділ лору для роботи
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {loreTypes.map(type => {
          const Icon = type.icon;
          
          return (
            <div
              key={type.id}
              className="card card-hover"
              onClick={() => setActiveSubsection(type.id)}
              style={{
                cursor: 'pointer',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Icon size={28} />
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  {type.name}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  {type.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};