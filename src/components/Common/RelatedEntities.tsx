import React from 'react';
import { Users, BookOpen, FileText, Map, Gamepad2 } from 'lucide-react';

interface RelatedEntity {
  id: string;
  name: string;
  type: 'character' | 'lore' | 'note' | 'map' | 'scenario';
  sharedTags: string[];
}

interface RelatedEntitiesProps {
  entityId: string;
  entityType: 'character' | 'lore' | 'note' | 'map' | 'scenario';
  onNavigate?: (type: string, id: string) => void;
}

const typeIcons = {
  character: Users,
  lore: BookOpen,
  note: FileText,
  map: Map,
  scenario: Gamepad2,
};

const typeColors = {
  character: 'text-blue-600',
  lore: 'text-purple-600',
  note: 'text-green-600',
  map: 'text-orange-600',
  scenario: 'text-red-600',
};

export const RelatedEntities: React.FC<RelatedEntitiesProps> = ({
  entityId,
  entityType,
  onNavigate,
}) => {
  // Mock data - replace with actual hook
  const relatedEntities: RelatedEntity[] = [];

  if (relatedEntities.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Related Elements</h3>
        <p className="text-sm text-gray-500">No related elements found</p>
      </div>
    );
  }

  const groupedEntities = relatedEntities.reduce((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = [];
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, RelatedEntity[]>);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Related Elements</h3>
      
      {Object.entries(groupedEntities).map(([type, entities]) => {
        const Icon = typeIcons[type as keyof typeof typeIcons];
        const colorClass = typeColors[type as keyof typeof typeColors];
        
        return (
          <div key={type} className="mb-3 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${colorClass}`} />
              <span className="text-sm font-medium capitalize text-gray-700">
                {type}s ({entities.length})
              </span>
            </div>
            
            <div className="space-y-1 ml-6">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onNavigate?.(entity.type, entity.id)}
                >
                  <span className="text-sm text-gray-800">{entity.name}</span>
                  {entity.sharedTags.length > 0 && (
                    <div className="flex gap-1">
                      {entity.sharedTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {entity.sharedTags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{entity.sharedTags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};