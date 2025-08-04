import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  onHomeClick?: () => void;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  onHomeClick
}) => {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 0',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)'
    }}>
      {/* Домашня сторінка */}
      {onHomeClick && (
        <>
          <button
            onClick={onHomeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--fantasy-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <Home size={14} />
            Головна
          </button>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        </>
      )}

      {/* Елементи навігації */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick ? (
            <button
              onClick={item.onClick}
              style={{
                background: 'none',
                border: 'none',
                color: item.isActive ? 'var(--fantasy-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'var(--transition-fast)',
                fontWeight: item.isActive ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (!item.isActive) {
                  e.currentTarget.style.color = 'var(--fantasy-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {item.label}
            </button>
          ) : (
            <span style={{
              color: item.isActive ? 'var(--fantasy-primary)' : 'var(--text-secondary)',
              fontWeight: item.isActive ? '600' : '400'
            }}>
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};