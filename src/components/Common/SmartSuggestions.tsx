import React, { useState, useEffect } from 'react';
import { Lightbulb, X, Check, Info } from 'lucide-react';
import { useSmartRecommendations } from '@/hooks/useSmartRecommendations';

interface SmartSuggestionsProps {
  entityId: string;
  entityType: 'character' | 'lore' | 'note' | 'map' | 'scenario';
  worldId: string;
  maxSuggestions?: number;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  entityId,
  entityType,
  worldId,
  maxSuggestions = 3
}) => {
  const { recommendations, applyRecommendation, dismissRecommendation } = useSmartRecommendations(worldId);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Фільтруємо рекомендації для поточної сутності
  const entityRecommendations = recommendations.filter(rec =>
    rec.sourceEntity.id === entityId || rec.targetEntity?.id === entityId
  ).slice(0, maxSuggestions);

  if (!showSuggestions || entityRecommendations.length === 0) {
    return null;
  }

  return (
    <div style={{
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--fantasy-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Lightbulb size={18} style={{ color: 'var(--fantasy-primary)' }} />
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Розумні пропозиції
          </h4>
        </div>
        
        <button
          onClick={() => setShowSuggestions(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {entityRecommendations.map(recommendation => (
          <div
            key={recommendation.id}
            style={{
              padding: '0.75rem',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <div style={{ flex: 1 }}>
                <h5 style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  {recommendation.title}
                </h5>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {recommendation.description}
                </p>
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                color: recommendation.confidence >= 80 ? 'var(--success)' : 
                       recommendation.confidence >= 60 ? 'var(--warning)' : 'var(--text-muted)',
                marginLeft: '0.5rem'
              }}>
                {recommendation.confidence}%
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'flex-end'
            }}>
              <button
                className="btn btn-secondary"
                onClick={() => dismissRecommendation(recommendation.id)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.375rem 0.75rem'
                }}
              >
                Відхилити
              </button>
              <button
                className="btn btn-primary"
                onClick={() => applyRecommendation(recommendation)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.375rem 0.75rem'
                }}
              >
                Застосувати
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem'
      }}>
        <Info size={12} />
        Рекомендації на основі ШІ-аналізу вашого світу
      </div>
    </div>
  );
};