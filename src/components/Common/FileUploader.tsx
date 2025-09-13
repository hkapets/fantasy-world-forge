import React, { useState } from 'react';
import { Upload, Check, X, Image, Compress } from 'lucide-react';
import { DragDropZone } from './DragDropZone';
import { ImageCompressor } from './ImageCompressor';
import { FileManager } from '@/lib/fileManager';

interface FileUploaderProps {
  onFileUploaded: (fileUrl: string, metadata?: any) => void;
  acceptedTypes?: string[];
  category?: string;
  maxFileSize?: number;
  autoCompress?: boolean;
  showPreview?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  acceptedTypes = ['image/*'],
  category = 'general',
  maxFileSize = 10 * 1024 * 1024,
  autoCompress = true,
  showPreview = true
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    file: File;
    url: string;
    compressed?: boolean;
    originalSize?: number;
    compressedSize?: number;
  }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCompressor, setShowCompressor] = useState(false);
  const [currentImageForCompression, setCurrentImageForCompression] = useState<string>('');

  const handleFilesSelected = async (files: File[]) => {
    setSelectedFiles(files);
    
    if (autoCompress && files.length === 1 && files[0].type.startsWith('image/')) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImageForCompression(reader.result as string);
        setShowCompressor(true);
      };
      reader.readAsDataURL(file);
    } else {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    const uploaded: typeof uploadedFiles = [];

    try {
      for (const file of files) {
        // Стискаємо зображення якщо потрібно
        let fileToUpload = file;
        let compressed = false;
        let originalSize = file.size;
        let compressedSize = file.size;

        if (autoCompress && file.type.startsWith('image/') && file.size > 1024 * 1024) {
          try {
            fileToUpload = await FileManager.compressImage(file, 0.8, 1920);
            compressed = true;
            compressedSize = fileToUpload.size;
          } catch (error) {
            console.warn('Compression failed, using original file:', error);
          }
        }

        // Зберігаємо файл
        const metadata = await FileManager.saveFile(fileToUpload, category);
        
        // Створюємо URL для файлу
        const fileData = await FileManager.getFile(metadata.id);
        const blob = new Blob([fileData!.data], { type: fileToUpload.type });
        const url = URL.createObjectURL(blob);

        uploaded.push({
          file: fileToUpload,
          url,
          compressed,
          originalSize,
          compressedSize
        });

        // Повідомляємо про завантажений файл
        onFileUploaded(url, {
          id: metadata.id,
          name: metadata.name,
          size: metadata.size,
          compressed,
          originalSize,
          compressedSize
        });
      }

      setUploadedFiles(uploaded);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Помилка при завантаженні файлів');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompressedImage = async (compressedImage: string, originalSize: number, compressedSize: number) => {
    // Конвертуємо base64 в File
    const response = await fetch(compressedImage);
    const blob = await response.blob();
    const compressedFile = new File([blob], selectedFiles[0].name, {
      type: 'image/jpeg',
      lastModified: Date.now()
    });

    await uploadFiles([compressedFile]);
    setShowCompressor(false);
    setCurrentImageForCompression('');
  };

  const removeUploadedFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {/* Зона завантаження */}
      <DragDropZone
        onFilesSelected={handleFilesSelected}
        acceptedTypes={acceptedTypes}
        maxFiles={1}
        maxFileSize={maxFileSize}
      />

      {/* Прогрес завантаження */}
      {isUploading && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Upload size={18} style={{ color: 'var(--fantasy-primary)' }} />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Завантажую файли...
            </span>
          </div>
        </div>
      )}

      {/* Завантажені файли */}
      {uploadedFiles.length > 0 && showPreview && (
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
            Завантажені файли:
          </h5>

          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                marginBottom: '0.5rem'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flex: 1
              }}>
                {uploadedFile.file.type.startsWith('image/') && (
                  <img
                    src={uploadedFile.url}
                    alt={uploadedFile.file.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  />
                )}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {uploadedFile.file.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {formatBytes(uploadedFile.compressedSize || uploadedFile.file.size)}
                    {uploadedFile.compressed && (
                      <>
                        <Compress size={12} style={{ color: 'var(--success)' }} />
                        <span style={{ color: 'var(--success)' }}>
                          Стиснено з {formatBytes(uploadedFile.originalSize || 0)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeUploadedFile(index)}
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
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Компресор зображень */}
      {showCompressor && currentImageForCompression && (
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
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Стиснення зображення
              </h3>
              <button
                onClick={() => {
                  setShowCompressor(false);
                  setCurrentImageForCompression('');
                }}
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

            <ImageCompressor
              originalImage={currentImageForCompression}
              onCompressed={handleCompressedImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};