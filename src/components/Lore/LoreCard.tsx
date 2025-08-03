import React from 'react';
import { BookOpen, Tag, Calendar, Eye } from 'lucide-react';

interface LoreItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  worldId: string;
  isSecret: boolean;
}

interface LoreCardProps {
  lore: LoreItem;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LoreCard: React.FC<LoreCardProps> = ({
  lore,
  onClick,
  onEdit,
  onDelete,
}) => {
  const truncatedContent = lore.content.length > 150 
    ? lore.content.substring(0, 150) + '...' 
    : lore.content;

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">{lore.title}</h3>
          {lore.isSecret && (
            <Eye className="w-4 h-4 text-red-500" title="Secret Lore" />
          )}
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {lore.category}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {truncatedContent}
      </p>

      {lore.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {lore.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {lore.tags.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{lore.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(lore.createdAt).toLocaleDateString()}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};