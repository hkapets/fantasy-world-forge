import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { useTagsSystem } from '@/hooks/useTagsSystem';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  worldId: string;
  showSuggestions?: boolean;
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = "Додати тег...",
  worldId,
  showSuggestions = true,
  maxTags = 10
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { getTagSuggestions } = useTagsSystem(worldId);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = showSuggestions ? getTagSuggestions(tags) : [];
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.tag.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
      setShowDropdown(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(e.target.value.length > 0 || showSuggestions);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Поточні теги */}
      {tags.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                background: 'var(--fantasy-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <Tag size={12} />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '0.25rem'
                }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Поле вводу */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          className="input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowDropdown(true)}
          placeholder={tags.length >= maxTags ? `Максимум ${maxTags} тегів` : placeholder}
          disabled={tags.length >= maxTags}
          style={{
            paddingRight: '2.5rem'
          }}
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--fantasy-primary)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <Plus size={12} />
          </button>
        )}
      </div>

      {/* Dropdown з рекомендаціями */}
      {showDropdown && (showSuggestions || inputValue) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-modal)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto',
          marginTop: '0.25rem'
        }}>
          {filteredSuggestions.length > 0 ? (
            <>
              <div style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                borderBottom: '1px solid var(--border-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Рекомендовані теги
              </div>
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addTag(suggestion.tag)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Tag size={14} style={{ color: 'var(--fantasy-primary)' }} />
                    <span style={{
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}>
                      {suggestion.tag}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-tertiary)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {suggestion.count}
                  </span>
                </button>
              ))}
            </>
          ) : inputValue ? (
            <div style={{
              padding: '0.75rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}>
              Натисніть Enter щоб додати "{inputValue}"
            </div>
          ) : (
            <div style={{
              padding: '0.75rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}>
              Немає рекомендацій
            </div>
          )}
        </div>
      )}

      {/* Підказка */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: '0.5rem'
      }}>
        Натисніть Enter щоб додати тег • Backspace щоб видалити останній • {tags.length}/{maxTags} тегів
      </div>
    </div>
  );
};