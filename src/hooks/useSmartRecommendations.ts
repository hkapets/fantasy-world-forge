import { useState, useEffect } from 'react';
import { useRelationshipsData } from './useRelationshipsData';
import { useTagsSystem } from './useTagsSystem';

export interface SmartRecommendation {
  id: string;
  type: 'relationship' | 'tag' | 'location' | 'event';
  title: string;
  description: string;
  confidence: number; // 0-100
  sourceEntity: {
    id: string;
    type: string;
    name: string;
  };
  targetEntity?: {
    id: string;
    type: string;
    name: string;
  };
  suggestedData: any;
  reasoning: string[];
}

export interface AutoDetectedPattern {
  id: string;
  pattern: 'naming' | 'location' | 'timeline' | 'family' | 'conflict';
  entities: Array<{
    id: string;
    type: string;
    name: string;
  }>;
  confidence: number;
  description: string;
  suggestedAction: string;
}

export function useSmartRecommendations(worldId: string) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [detectedPatterns, setDetectedPatterns] = useState<AutoDetectedPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { relationships, addRelationship } = useRelationshipsData(worldId);
  const { getEntitiesByTag, findPotentialConnections } = useTagsSystem(worldId);

  // Аналіз та генерація рекомендацій
  const analyzeWorldData = async () => {
    if (!worldId) return;
    
    setIsAnalyzing(true);
    const newRecommendations: SmartRecommendation[] = [];
    const newPatterns: AutoDetectedPattern[] = [];

    try {
      // Завантажуємо всі дані світу
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]')
        .filter((char: any) => char.worldId === worldId);
      const loreItems = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`) || '[]');
      const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
      const events = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_events_${worldId}`) || '[]');
      const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');

      // 1. Аналіз імен для виявлення родинних зв'язків
      analyzeNamingPatterns(characters, newRecommendations, newPatterns);

      // 2. Аналіз локацій для географічних зв'язків
      analyzeLocationPatterns(characters, loreItems, newRecommendations, newPatterns);

      // 3. Аналіз часових ліній для хронологічних зв'язків
      analyzeTimelinePatterns(characters, events, newRecommendations, newPatterns);

      // 4. Аналіз тегів для тематичних зв'язків
      analyzeTagPatterns(characters, loreItems, notes, maps, newRecommendations);

      // 5. Аналіз конфліктів та альянсів
      analyzeConflictPatterns(characters, events, newRecommendations, newPatterns);

      // 6. Аналіз відсутніх зв'язків
      analyzeMissingRelationships(characters, loreItems, newRecommendations);

      setRecommendations(newRecommendations.sort((a, b) => b.confidence - a.confidence));
      setDetectedPatterns(newPatterns.sort((a, b) => b.confidence - a.confidence));
    } catch (error) {
      console.error('Error analyzing world data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Аналіз імен для родинних зв'язків
  const analyzeNamingPatterns = (characters: any[], recommendations: SmartRecommendation[], patterns: AutoDetectedPattern[]) => {
    const familyGroups: { [surname: string]: any[] } = {};
    
    characters.forEach(char => {
      const nameParts = char.name.split(' ');
      if (nameParts.length > 1) {
        const surname = nameParts[nameParts.length - 1];
        if (!familyGroups[surname]) familyGroups[surname] = [];
        familyGroups[surname].push(char);
      }
    });

    Object.entries(familyGroups).forEach(([surname, members]) => {
      if (members.length > 1) {
        // Виявлено потенційну родину
        patterns.push({
          id: `family-${surname}-${Date.now()}`,
          pattern: 'family',
          entities: members.map(char => ({
            id: char.id,
            type: 'character',
            name: char.name
          })),
          confidence: 85,
          description: `Персонажі з прізвищем "${surname}" можуть бути родичами`,
          suggestedAction: `Створити родинні зв'язки між персонажами ${surname}`
        });

        // Рекомендації для кожної пари
        for (let i = 0; i < members.length; i++) {
          for (let j = i + 1; j < members.length; j++) {
            const char1 = members[i];
            const char2 = members[j];
            
            // Перевіряємо чи немає вже зв'язку
            const existingRelation = relationships.find(rel =>
              (rel.sourceId === char1.id && rel.targetId === char2.id) ||
              (rel.sourceId === char2.id && rel.targetId === char1.id)
            );

            if (!existingRelation) {
              recommendations.push({
                id: `family-rec-${char1.id}-${char2.id}`,
                type: 'relationship',
                title: `Родинний зв'язок: ${char1.name} ↔ ${char2.name}`,
                description: `Персонажі мають однакове прізвище "${surname}"`,
                confidence: 80,
                sourceEntity: {
                  id: char1.id,
                  type: 'character',
                  name: char1.name
                },
                targetEntity: {
                  id: char2.id,
                  type: 'character',
                  name: char2.name
                },
                suggestedData: {
                  sourceType: 'character',
                  sourceId: char1.id,
                  sourceName: char1.name,
                  targetType: 'character',
                  targetId: char2.id,
                  targetName: char2.name,
                  relationshipType: 'Родина',
                  description: `Можливі родичі з прізвищем ${surname}`,
                  strength: 'medium',
                  status: 'active',
                  isSecret: false
                },
                reasoning: [
                  'Однакове прізвище',
                  'Відсутність існуючого зв\'язку',
                  'Високий рівень довіри для родинних зв\'язків'
                ]
              });
            }
          }
        }
      }
    });
  };

  // Аналіз локацій
  const analyzeLocationPatterns = (characters: any[], loreItems: any[], recommendations: SmartRecommendation[], patterns: AutoDetectedPattern[]) => {
    const locationGroups: { [location: string]: any[] } = {};
    
    // Групуємо персонажів за місцем народження
    characters.forEach(char => {
      if (char.birthPlace) {
        const location = char.birthPlace.toLowerCase();
        if (!locationGroups[location]) locationGroups[location] = [];
        locationGroups[location].push({ ...char, entityType: 'character' });
      }
    });

    // Додаємо лор-локації
    loreItems.filter(item => item.type === 'geography').forEach(location => {
      const locationName = location.name.toLowerCase();
      if (!locationGroups[locationName]) locationGroups[locationName] = [];
      locationGroups[locationName].push({ ...location, entityType: 'lore' });
    });

    Object.entries(locationGroups).forEach(([location, entities]) => {
      const characters = entities.filter(e => e.entityType === 'character');
      const loreLocations = entities.filter(e => e.entityType === 'lore');

      if (characters.length > 1) {
        // Персонажі з однієї локації
        patterns.push({
          id: `location-${location}-${Date.now()}`,
          pattern: 'location',
          entities: characters.map(char => ({
            id: char.id,
            type: 'character',
            name: char.name
          })),
          confidence: 70,
          description: `Персонажі з локації "${location}" можуть знати один одного`,
          suggestedAction: `Створити зв'язки між персонажами з ${location}`
        });

        // Рекомендації для зв'язків
        for (let i = 0; i < characters.length; i++) {
          for (let j = i + 1; j < characters.length; j++) {
            const char1 = characters[i];
            const char2 = characters[j];
            
            const existingRelation = relationships.find(rel =>
              (rel.sourceId === char1.id && rel.targetId === char2.id) ||
              (rel.sourceId === char2.id && rel.targetId === char1.id)
            );

            if (!existingRelation) {
              recommendations.push({
                id: `location-rec-${char1.id}-${char2.id}`,
                type: 'relationship',
                title: `Земляки: ${char1.name} ↔ ${char2.name}`,
                description: `Обидва персонажі народилися в "${location}"`,
                confidence: 65,
                sourceEntity: {
                  id: char1.id,
                  type: 'character',
                  name: char1.name
                },
                targetEntity: {
                  id: char2.id,
                  type: 'character',
                  name: char2.name
                },
                suggestedData: {
                  sourceType: 'character',
                  sourceId: char1.id,
                  sourceName: char1.name,
                  targetType: 'character',
                  targetId: char2.id,
                  targetName: char2.name,
                  relationshipType: 'Знайомий',
                  description: `Земляки з ${location}`,
                  strength: 'weak',
                  status: 'active',
                  isSecret: false
                },
                reasoning: [
                  'Спільне місце народження',
                  'Ймовірність знайомства в малих населених пунктах',
                  'Базовий рівень довіри для земляків'
                ]
              });
            }
          }
        }
      }

      // Зв'язки персонажів з лор-локаціями
      characters.forEach(char => {
        loreLocations.forEach(loreLoc => {
          const existingRelation = relationships.find(rel =>
            (rel.sourceId === char.id && rel.targetId === loreLoc.id) ||
            (rel.sourceId === loreLoc.id && rel.targetId === char.id)
          );

          if (!existingRelation) {
            recommendations.push({
              id: `char-location-${char.id}-${loreLoc.id}`,
              type: 'relationship',
              title: `${char.name} ↔ ${loreLoc.name}`,
              description: `Персонаж народився в цій локації`,
              confidence: 90,
              sourceEntity: {
                id: char.id,
                type: 'character',
                name: char.name
              },
              targetEntity: {
                id: loreLoc.id,
                type: 'lore',
                name: loreLoc.name
              },
              suggestedData: {
                sourceType: 'character',
                sourceId: char.id,
                sourceName: char.name,
                targetType: 'lore',
                targetId: loreLoc.id,
                targetName: loreLoc.name,
                relationshipType: 'Народжений',
                description: `${char.name} народився в ${loreLoc.name}`,
                strength: 'strong',
                status: 'active',
                isSecret: false
              },
              reasoning: [
                'Точний збіг назви локації',
                'Високий рівень довіри для місця народження',
                'Важливий зв\'язок для розуміння персонажа'
              ]
            });
          }
        });
      });
    });
  };

  // Аналіз часових ліній
  const analyzeTimelinePatterns = (characters: any[], events: any[], recommendations: SmartRecommendation[], patterns: AutoDetectedPattern[]) => {
    // Групуємо події за роками
    const eventsByYear: { [year: number]: any[] } = {};
    events.forEach(event => {
      if (!eventsByYear[event.date]) eventsByYear[event.date] = [];
      eventsByYear[event.date].push(event);
    });

    // Шукаємо персонажів, які могли бути учасниками подій
    Object.entries(eventsByYear).forEach(([year, yearEvents]) => {
      const eventYear = parseInt(year);
      
      yearEvents.forEach(event => {
        characters.forEach(char => {
          // Перевіряємо чи персонаж міг бути живим під час події
          const birthYear = extractYearFromDate(char.birthDate);
          if (birthYear && birthYear <= eventYear && eventYear <= birthYear + 100) {
            
            // Перевіряємо збіги в локаціях або описах
            const hasLocationMatch = char.birthPlace && 
              (event.relatedLocations?.toLowerCase().includes(char.birthPlace.toLowerCase()) ||
               event.description?.toLowerCase().includes(char.birthPlace.toLowerCase()));

            const hasNameMatch = event.relatedCharacters?.toLowerCase().includes(char.name.toLowerCase()) ||
              event.description?.toLowerCase().includes(char.name.toLowerCase());

            if (hasLocationMatch || hasNameMatch) {
              const confidence = hasNameMatch ? 95 : hasLocationMatch ? 75 : 50;
              
              recommendations.push({
                id: `event-char-${event.id}-${char.id}`,
                type: 'relationship',
                title: `${char.name} ↔ ${event.name}`,
                description: `Персонаж міг бути учасником події`,
                confidence,
                sourceEntity: {
                  id: char.id,
                  type: 'character',
                  name: char.name
                },
                targetEntity: {
                  id: event.id,
                  type: 'event',
                  name: event.name
                },
                suggestedData: {
                  sourceType: 'character',
                  sourceId: char.id,
                  sourceName: char.name,
                  targetType: 'event',
                  targetId: event.id,
                  targetName: event.name,
                  relationshipType: hasNameMatch ? 'Учасник' : 'Свідок',
                  description: `${char.name} ${hasNameMatch ? 'брав участь у' : 'міг бути свідком'} ${event.name}`,
                  strength: hasNameMatch ? 'strong' : 'medium',
                  status: 'active',
                  isSecret: false
                },
                reasoning: [
                  hasNameMatch ? 'Ім\'я згадується в події' : 'Збіг локації',
                  'Персонаж був живий під час події',
                  'Географічна близькість'
                ]
              });
            }
          }
        });
      });
    });
  };

  // Аналіз тегів для тематичних зв'язків
  const analyzeTagPatterns = (characters: any[], loreItems: any[], notes: any[], maps: any[], recommendations: SmartRecommendation[]) => {
    const allEntities = [
      ...characters.map((c: any) => ({ ...c, entityType: 'character' })),
      ...loreItems.map((l: any) => ({ ...l, entityType: 'lore' })),
      ...notes.map((n: any) => ({ ...n, entityType: 'note', name: n.title })),
      ...maps.map((m: any) => ({ ...m, entityType: 'map' }))
    ];

    // Аналізуємо кожну сутність з тегами
    allEntities.filter(entity => entity.tags && entity.tags.length > 0).forEach(entity => {
      const potentialConnections = findPotentialConnections(entity.id, entity.tags);
      
      potentialConnections.forEach(connection => {
        if (connection.id !== entity.id) {
          const existingRelation = relationships.find(rel =>
            (rel.sourceId === entity.id && rel.targetId === connection.id) ||
            (rel.sourceId === connection.id && rel.targetId === entity.id)
          );

          if (!existingRelation) {
            const commonTags = entity.tags.filter((tag: string) => 
              connection.tags.some(connTag => connTag.toLowerCase() === tag.toLowerCase())
            );

            if (commonTags.length > 0) {
              recommendations.push({
                id: `tag-rec-${entity.id}-${connection.id}`,
                type: 'relationship',
                title: `${entity.name} ↔ ${connection.name}`,
                description: `Спільні теги: ${commonTags.join(', ')}`,
                confidence: Math.min(90, 40 + commonTags.length * 15),
                sourceEntity: {
                  id: entity.id,
                  type: entity.entityType,
                  name: entity.name
                },
                targetEntity: {
                  id: connection.id,
                  type: connection.type,
                  name: connection.name
                },
                suggestedData: {
                  sourceType: entity.entityType,
                  sourceId: entity.id,
                  sourceName: entity.name,
                  targetType: connection.type,
                  targetId: connection.id,
                  targetName: connection.name,
                  relationshipType: 'Пов\'язані',
                  description: `Пов'язані через теги: ${commonTags.join(', ')}`,
                  strength: commonTags.length > 2 ? 'strong' : commonTags.length > 1 ? 'medium' : 'weak',
                  status: 'active',
                  isSecret: false
                },
                reasoning: [
                  `Спільні теги: ${commonTags.join(', ')}`,
                  'Тематична близькість',
                  'Автоматично виявлений зв\'язок'
                ]
              });
            }
          }
        }
      });
    });
  };

  // Аналіз конфліктів
  const analyzeConflictPatterns = (characters: any[], events: any[], recommendations: SmartRecommendation[], patterns: AutoDetectedPattern[]) => {
    const conflictKeywords = ['битва', 'війна', 'конфлікт', 'напад', 'облога', 'повстання'];
    const allianceKeywords = ['союз', 'альянс', 'договір', 'мир', 'угода'];

    events.forEach(event => {
      const isConflict = conflictKeywords.some(keyword => 
        event.name.toLowerCase().includes(keyword) || 
        event.description.toLowerCase().includes(keyword)
      );

      const isAlliance = allianceKeywords.some(keyword => 
        event.name.toLowerCase().includes(keyword) || 
        event.description.toLowerCase().includes(keyword)
      );

      if (isConflict || isAlliance) {
        const relatedChars = characters.filter(char => 
          event.relatedCharacters?.toLowerCase().includes(char.name.toLowerCase()) ||
          event.description?.toLowerCase().includes(char.name.toLowerCase())
        );

        if (relatedChars.length > 1) {
          patterns.push({
            id: `${isConflict ? 'conflict' : 'alliance'}-${event.id}`,
            pattern: 'conflict',
            entities: relatedChars.map(char => ({
              id: char.id,
              type: 'character',
              name: char.name
            })),
            confidence: 80,
            description: `${isConflict ? 'Конфлікт' : 'Союз'} в події "${event.name}"`,
            suggestedAction: `Створити ${isConflict ? 'ворожі' : 'союзницькі'} зв'язки`
          });

          // Рекомендації для пар персонажів
          for (let i = 0; i < relatedChars.length; i++) {
            for (let j = i + 1; j < relatedChars.length; j++) {
              const char1 = relatedChars[i];
              const char2 = relatedChars[j];
              
              recommendations.push({
                id: `conflict-rec-${char1.id}-${char2.id}-${event.id}`,
                type: 'relationship',
                title: `${char1.name} ↔ ${char2.name}`,
                description: `${isConflict ? 'Конфлікт' : 'Союз'} в події "${event.name}"`,
                confidence: 75,
                sourceEntity: {
                  id: char1.id,
                  type: 'character',
                  name: char1.name
                },
                targetEntity: {
                  id: char2.id,
                  type: 'character',
                  name: char2.name
                },
                suggestedData: {
                  sourceType: 'character',
                  sourceId: char1.id,
                  sourceName: char1.name,
                  targetType: 'character',
                  targetId: char2.id,
                  targetName: char2.name,
                  relationshipType: isConflict ? 'Ворожнеча' : 'Союзник',
                  description: `${isConflict ? 'Конфлікт' : 'Союз'} під час ${event.name}`,
                  strength: 'strong',
                  status: 'active',
                  isSecret: false,
                  startDate: event.date?.toString()
                },
                reasoning: [
                  `Обидва згадуються в події "${event.name}"`,
                  `Подія типу "${isConflict ? 'конфлікт' : 'союз'}"`,
                  'Високий рівень довіри для історичних подій'
                ]
              });
            }
          }
        }
      }
    });
  };

  // Аналіз відсутніх зв'язків
  const analyzeMissingRelationships = (characters: any[], loreItems: any[], recommendations: SmartRecommendation[]) => {
    // Персонажі без зв'язків
    characters.forEach(char => {
      const charRelationships = relationships.filter(rel =>
        rel.sourceId === char.id || rel.targetId === char.id
      );

      if (charRelationships.length === 0) {
        // Рекомендуємо створити зв'язки на основі раси
        const sameRaceChars = characters.filter(otherChar => 
          otherChar.id !== char.id && 
          otherChar.race && 
          char.race && 
          otherChar.race.toLowerCase() === char.race.toLowerCase()
        );

        sameRaceChars.slice(0, 2).forEach(otherChar => {
          recommendations.push({
            id: `race-rec-${char.id}-${otherChar.id}`,
            type: 'relationship',
            title: `${char.name} ↔ ${otherChar.name}`,
            description: `Персонажі однієї раси: ${char.race}`,
            confidence: 45,
            sourceEntity: {
              id: char.id,
              type: 'character',
              name: char.name
            },
            targetEntity: {
              id: otherChar.id,
              type: 'character',
              name: otherChar.name
            },
            suggestedData: {
              sourceType: 'character',
              sourceId: char.id,
              sourceName: char.name,
              targetType: 'character',
              targetId: otherChar.id,
              targetName: otherChar.name,
              relationshipType: 'Знайомий',
              description: `Представники раси ${char.race}`,
              strength: 'weak',
              status: 'active',
              isSecret: false
            },
            reasoning: [
              'Персонаж не має зв\'язків',
              'Однакова раса',
              'Базова рекомендація для соціалізації'
            ]
          });
        });
      }
    });
  };

  // Допоміжна функція для витягування року з дати
  const extractYearFromDate = (dateString: string): number | null => {
    if (!dateString) return null;
    const yearMatch = dateString.match(/(\d{3,4})/);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  };

  // Застосування рекомендації
  const applyRecommendation = (recommendation: SmartRecommendation) => {
    if (recommendation.type === 'relationship') {
      addRelationship(recommendation.suggestedData);
      
      // Видаляємо застосовану рекомендацію
      setRecommendations(prev => prev.filter(rec => rec.id !== recommendation.id));
    }
  };

  // Відхилення рекомендації
  const dismissRecommendation = (recommendationId: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
    
    // Зберігаємо відхилені рекомендації щоб не показувати їх знову
    const dismissed = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_dismissedRecommendations_${worldId}`) || '[]');
    dismissed.push(recommendationId);
    localStorage.setItem(`fantasyWorldBuilder_dismissedRecommendations_${worldId}`, JSON.stringify(dismissed));
  };

  // Відхилення патерну
  const dismissPattern = (patternId: string) => {
    setDetectedPatterns(prev => prev.filter(pattern => pattern.id !== patternId));
  };

  // Автоматичний аналіз при зміні даних
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeWorldData();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [worldId, relationships.length]);

  return {
    recommendations,
    detectedPatterns,
    isAnalyzing,
    analyzeWorldData,
    applyRecommendation,
    dismissRecommendation,
    dismissPattern
  };
}