import React, { useState, useRef } from 'react';
import { Upload, X, Image, FileText, File } from 'lucide-react';

interface DragDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number; // в байтах
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  onFilesSelected,
  acceptedTypes = ['image/*', 'text/*', 'application/json'],
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  children,
  className = '',
  style = {}
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Перевірка типу файлу
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Непідтримуваний тип файлу: ${file.type}`;
    }

    // Перевірка розміру
    if (file.size > maxFileSize) {
      return `Файл занадто великий: ${(file.size / 1024 / 1024).toFixed(1)}MB (макс: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB)`;
    }

    return null;
  };

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Перевірка кількості файлів
    if (fileArray.length > maxFiles) {
      errors.push(`Занадто багато файлів. Максимум: ${maxFiles}`);
      return;
    }

    // Валідація кожного файлу
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert('Помилки при завантаженні файлів:\n' + errors.join('\n'));
      return;
    }

    setSelectedFiles(validFiles);
    onFilesSelected(validFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image size={16} />;
    if (file.type.startsWith('text/')) return <FileText size={16} />;
    return <File size={16} />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ width: '100%', ...style }} className={className}>
      {/* Зона перетягування */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--fantasy-primary)' : 'var(--border-primary)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: isDragOver ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {children || (
          <div>
            <Upload 
              size={48} 
              style={{ 
                color: isDragOver ? 'var(--fantasy-primary)' : 'var(--text-muted)',
                marginBottom: '1rem'
              }} 
            />
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              {isDragOver ? 'Відпустіть файли тут' : 'Перетягніть файли або клікніть'}
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Підтримувані формати: {acceptedTypes.join(', ')}
              <br />
              Максимум {maxFiles} файл{maxFiles > 1 ? 'ів' : ''}, до {(maxFileSize / 1024 / 1024).toFixed(1)}MB кожен
            </p>
          </div>
        )}
      </div>

      {/* Список вибраних файлів */}
      {selectedFiles.length > 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          <h5 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem'
          }}>
            Вибрані файли ({selectedFiles.length}):
          </h5>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flex: 1,
                  minWidth: 0
                }}>
                  <div style={{ color: 'var(--fantasy-primary)' }}>
                    {getFileIcon(file)}
                  </div>
                  <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--text-primary)'
                    }}>
                      {file.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  style={{
                    background: 'var(--danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};