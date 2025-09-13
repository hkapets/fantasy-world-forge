import React, { useState } from 'react';
import { Compress, Download, Eye, Settings } from 'lucide-react';

interface ImageCompressorProps {
  originalImage: string;
  onCompressed: (compressedImage: string, originalSize: number, compressedSize: number) => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({
  originalImage,
  onCompressed,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedImage, setCompressedImage] = useState<string>('');
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    reduction: number;
  } | null>(null);
  const [settings, setSettings] = useState({
    quality,
    maxWidth,
    maxHeight
  });
  const [showSettings, setShowSettings] = useState(false);

  const compressImage = async () => {
    setIsCompressing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalImage;
      });

      // Розрахунок нових розмірів
      let { width, height } = img;
      
      if (width > settings.maxWidth || height > settings.maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = Math.min(width, settings.maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, settings.maxHeight);
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      // Малюємо зображення з покращеною якістю
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = 'high';
      ctx!.drawImage(img, 0, 0, width, height);

      // Конвертуємо в base64
      const compressedDataUrl = canvas.toDataURL('image/jpeg', settings.quality);
      
      // Розрахунок статистики
      const originalSize = originalImage.length;
      const compressedSize = compressedDataUrl.length;
      const reduction = ((originalSize - compressedSize) / originalSize) * 100;

      setCompressedImage(compressedDataUrl);
      setCompressionStats({
        originalSize,
        compressedSize,
        reduction
      });

      onCompressed(compressedDataUrl, originalSize, compressedSize);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Помилка при стисненні зображення');
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed_image_${Date.now()}.jpg`;
    link.click();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      border: '1px solid var(--border-primary)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Compress size={18} />
          Стиснення зображення
        </h4>

        <button
          className="btn-icon btn-icon-sm"
          onClick={() => setShowSettings(!showSettings)}
          title="Налаштування стиснення"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Налаштування стиснення */}
      {showSettings && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem'
              }}>
                Якість ({Math.round(settings.quality * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.quality}
                onChange={(e) => setSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem'
              }}>
                Макс. ширина
              </label>
              <input
                type="number"
                className="input"
                value={settings.maxWidth}
                onChange={(e) => setSettings(prev => ({ ...prev, maxWidth: parseInt(e.target.value) || 1920 }))}
                min="100"
                max="4000"
                style={{ fontSize: '0.75rem', padding: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem'
              }}>
                Макс. висота
              </label>
              <input
                type="number"
                className="input"
                value={settings.maxHeight}
                onChange={(e) => setSettings(prev => ({ ...prev, maxHeight: parseInt(e.target.value) || 1080 }))}
                min="100"
                max="4000"
                style={{ fontSize: '0.75rem', padding: '0.25rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Попередній перегляд */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: compressedImage ? '1fr 1fr' : '1fr',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {/* Оригінал */}
        <div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem'
          }}>
            Оригінал
          </div>
          <img
            src={originalImage}
            alt="Оригінал"
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)'
            }}
          />
        </div>

        {/* Стиснене */}
        {compressedImage && (
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem'
            }}>
              Стиснене
            </div>
            <img
              src={compressedImage}
              alt="Стиснене"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}
            />
          </div>
        )}
      </div>

      {/* Статистика стиснення */}
      {compressionStats && (
        <div style={{
          padding: '1rem',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--text-primary)'
              }}>
                {formatBytes(compressionStats.originalSize)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                Оригінал
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--success)'
              }}>
                {formatBytes(compressionStats.compressedSize)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                Стиснене
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: compressionStats.reduction > 0 ? 'var(--success)' : 'var(--warning)'
              }}>
                {compressionStats.reduction > 0 ? '-' : '+'}{Math.abs(compressionStats.reduction).toFixed(1)}%
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                Зміна розміру
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Дії */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button
          className="btn btn-primary"
          onClick={compressImage}
          disabled={isCompressing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Compress size={16} />
          {isCompressing ? 'Стискаю...' : 'Стиснути'}
        </button>

        {compressedImage && (
          <button
            className="btn btn-secondary"
            onClick={downloadCompressed}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={16} />
            Завантажити
          </button>
        )}
      </div>
    </div>
  );
};