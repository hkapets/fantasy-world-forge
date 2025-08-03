import React, { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock, 
  Tag,
  Check, 
  X, 
  ChevronDown, 
  ChevronRight,
  Zap,
  Brain,
  Target
} from 'lucide-react';
import { useSmartRecommendations, SmartRecommendation, AutoDetectedPattern } from '@/hooks/useSmartRecommendations';
import { useSoundSystem } from '@/hooks/useSoundSystem';

interface SmartRecommendationsProps {
  worldId: string;
  onNavigate?: (section: string, subsection?: string, itemId?: string) => void;
}

const recommendationTypeIcons = {
  relationship: Users,
  tag: Tag,
  location: MapPin,
  event: Clock
};

const patternIcons = {
  naming: Users,
  location: MapPin,
  timeline: Clock,
  family: Users,
  conflict: Zap
};

const confidenceColors = {
  high: 'var(--success)',
  medium: 'var(--warning)', 
  low: 'var(--text-muted)'
};

const getConfidenceLevel = (confidence: number) => {
  if (confidence >= 80) return 'high';
  if (confidence >= 60) return 'medium';
  return 'low';
};

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 80) return 'Висока';
  if (confidence >= 60) return 'Середня';
  return 'Низька';
};

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  worldId,
  onNavigate
}) => {
  const {
    recommendations,
    detectedPatterns,
    isAnalyzing,
    analyzeWorldData,
    applyRecommendation,
    dismissRecommendation,
    dismissPattern
  } = useSmartRecommendations(worldId);

  const { playEffect } = useSoundSystem();
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['recommendations']));
  const [selectedRecommendation, setSelectedRecommendation] = useState<SmartRecommendation | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleApplyRecommendation = (recommendation: SmartRecommendation) => {
    playEffect('create');
    applyRecommendation(recommendation);
    setSelectedRecommendation(null);
  };

  const handleDismissRecommendation = (recommendationId: string) => {
    playEffect('buttonClick');
    dismissRecommendation(recommendationId);
    setSelectedRecommendation(null);
  };

  const handleAnalyze = () => {
    playEffect('buttonClick');
    analyzeWorldData();
  };

  const highConfidenceRecs = recommendations.filter(rec => rec.confidence >= 80);
  const mediumConfidenceRecs = recommendations.filter(rec => rec.confidence >= 60 && rec.confidence < 80);
  const lowConfidenceRecs = recommendations.filter(rec => rec.confidence < 60);

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      {/* Заголовок */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Розумні рекомендації
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              ШІ-аналіз вашого світу для покращення зв'язків
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Target size={18} />
          {isAnalyzing ? 'Аналізую...' : 'Проаналізувати'}
        </button>
      </div>

      {/* Статистика */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--success)'
          }}>
            {highConfidenceRecs.length}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Висока довіра
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--warning)'
          }}>
            {mediumConfidenceRecs.length}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Середня довіра
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--fantasy-primary)'
          }}>
            {detectedPatterns.length}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Виявлені патерни
          </div>
        </div>
      </div>

      {/* Рекомендації */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => toggleSection('recommendations')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '1rem',
            width: '100%',
            textAlign: 'left'
          }}
        >
          {expandedSections.has('recommendations') ? 
            <ChevronDown size={16} /> : 
            <ChevronRight size={16} />
          }
          <Lightbulb size={18} style={{ color: 'var(--fantasy-primary)' }} />
          Рекомендації ({recommendations.length})
        </button>

        {expandedSections.has('recommendations') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommendations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Lightbulb size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>Немає рекомендацій</p>
                <button
                  className="btn btn-secondary"
                  onClick={handleAnalyze}
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}
                >
                  Проаналізувати світ
                </button>
              </div>
            ) : (
              <>
                {/* Високий рівень довіри */}
                {highConfidenceRecs.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--success)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <TrendingUp size={14} />
                      Висока довіра ({highConfidenceRecs.length})
                    </div>
                    {highConfidenceRecs.slice(0, 3).map(rec => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onApply={() => handleApplyRecommendation(rec)}
                        onDismiss={() => handleDismissRecommendation(rec.id)}
                        onSelect={() => setSelectedRecommendation(rec)}
                        isSelected={selectedRecommendation?.id === rec.id}
                      />
                    ))}
                  </div>
                )}

                {/* Середній рівень довіри */}
                {mediumConfidenceRecs.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--warning)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Target size={14} />
                      Середня довіра ({mediumConfidenceRecs.length})
                    </div>
                    {mediumConfidenceRecs.slice(0, 2).map(rec => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onApply={() => handleApplyRecommendation(rec)}
                        onDismiss={() => handleDismissRecommendation(rec.id)}
                        onSelect={() => setSelectedRecommendation(rec)}
                        isSelected={selectedRecommendation?.id === rec.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Виявлені патерни */}
      <div>
        <button
          onClick={() => toggleSection('patterns')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '1rem',
            width: '100%',
            textAlign: 'left'
          }}
        >
          {expandedSections.has('patterns') ? 
            <ChevronDown size={16} /> : 
            <ChevronRight size={16} />
          }
          <TrendingUp size={18} style={{ color: 'var(--fantasy-secondary)' }} />
          Виявлені патерни ({detectedPatterns.length})
        </button>

        {expandedSections.has('patterns') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {detectedPatterns.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)'
              }}>
                <TrendingUp size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem' }}>Патерни не виявлено</p>
              </div>
            ) : (
              detectedPatterns.map(pattern => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  onDismiss={() => dismissPattern(pattern.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Детальний перегляд рекомендації */}
      {selectedRecommendation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid var(--border-secondary)',
            boxShadow: 'var(--shadow-modal)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Деталі рекомендації
              </h4>
              <button
                onClick={() => setSelectedRecommendation(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                {selectedRecommendation.title}
              </h5>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                {selectedRecommendation.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: 'var(--text-muted)'
                }}>
                  Рівень довіри:
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: confidenceColors[getConfidenceLevel(selectedRecommendation.confidence)]
                }}>
                  {getConfidenceLabel(selectedRecommendation.confidence)} ({selectedRecommendation.confidence}%)
                </span>
              </div>

              {/* Обґрунтування */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  Обґрунтування:
                </div>
                <ul style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  paddingLeft: '1rem',
                  margin: 0
                }}>
                  {selectedRecommendation.reasoning.map((reason, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                className="btn btn-secondary"
                onClick={() => handleDismissRecommendation(selectedRecommendation.id)}
              >
                <X size={16} style={{ marginRight: '0.25rem' }} />
                Відхилити
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleApplyRecommendation(selectedRecommendation)}
              >
                <Check size={16} style={{ marginRight: '0.25rem' }} />
                Застосувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент картки рекомендації
const RecommendationCard: React.FC<{
  recommendation: SmartRecommendation;
  onApply: () => void;
  onDismiss: () => void;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ recommendation, onApply, onDismiss, onSelect, isSelected }) => {
  const Icon = recommendationTypeIcons[recommendation.type];
  const confidenceLevel = getConfidenceLevel(recommendation.confidence);
  const confidenceColor = confidenceColors[confidenceLevel];

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '1rem',
        background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: isSelected ? '2px solid var(--fantasy-primary)' : '1px solid var(--border-primary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: confidenceColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={16} style={{ color: 'white' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <h5 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}>
              {recommendation.title}
            </h5>
            
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: confidenceColor,
              marginLeft: '0.5rem'
            }}>
              {recommendation.confidence}%
            </div>
          </div>

          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            margin: 0,
            marginBottom: '0.75rem'
          }}>
            {recommendation.description}
          </p>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end'
          }}>
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              style={{
                fontSize: '0.75rem',
                padding: '0.375rem 0.75rem'
              }}
            >
              <X size={12} style={{ marginRight: '0.25rem' }} />
              Відхилити
            </button>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              style={{
                fontSize: '0.75rem',
                padding: '0.375rem 0.75rem'
              }}
            >
              <Check size={12} style={{ marginRight: '0.25rem' }} />
              Застосувати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент картки патерну
const PatternCard: React.FC<{
  pattern: AutoDetectedPattern;
  onDismiss: () => void;
}> = ({ pattern, onDismiss }) => {
  const Icon = patternIcons[pattern.pattern];
  const confidenceLevel = getConfidenceLevel(pattern.confidence);
  const confidenceColor = confidenceColors[confidenceLevel];

  return (
    <div style={{
      padding: '1rem',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-primary)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: confidenceColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={16} style={{ color: 'white' }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <h5 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {pattern.description}
            </h5>
            
            <button
              onClick={onDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <X size={14} />
            </button>
          </div>

          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            {pattern.suggestedAction}
          </p>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Елементи: {pattern.entities.map(e => e.name).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};