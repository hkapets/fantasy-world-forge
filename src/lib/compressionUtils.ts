import { useState } from 'react';
import LZString from 'lz-string';

// Утіліти для стиснення даних
export class CompressionUtils {
  // Стиснення JSON даних
  static compressJSON(data: any): string {
    const jsonString = JSON.stringify(data);
    return LZString.compress(jsonString);
  }

  // Розпакування JSON даних
  static decompressJSON(compressedData: string): any {
    const jsonString = LZString.decompress(compressedData);
    return jsonString ? JSON.parse(jsonString) : null;
  }

  // Стиснення тексту
  static compressText(text: string): string {
    return LZString.compress(text);
  }

  // Розпакування тексту
  static decompressText(compressedText: string): string {
    return LZString.decompress(compressedText) || '';
  }

  // Стиснення Base64 зображення
  static compressBase64Image(base64: string, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = reject;
      img.src = base64;
    });
  }

  // Розрахунок коефіцієнта стиснення
  static getCompressionRatio(original: string, compressed: string): number {
    return ((original.length - compressed.length) / original.length) * 100;
  }

  // Автоматичне стиснення великих об'єктів
  static autoCompress(data: any, threshold: number = 100000): { data: any; compressed: boolean } {
    const jsonString = JSON.stringify(data);
    
    if (jsonString.length > threshold) {
      return {
        data: this.compressJSON(data),
        compressed: true
      };
    }
    
    return {
      data,
      compressed: false
    };
  }

  // Розумне розпакування
  static smartDecompress(data: any): any {
    if (typeof data === 'string' && data.length > 0) {
      try {
        // Спробуємо розпакувати як стиснений JSON
        const decompressed = this.decompressJSON(data);
        if (decompressed !== null) {
          return decompressed;
        }
      } catch {
        // Якщо не вдалося, повертаємо як є
      }
    }
    
    return data;
  }

  // Оптимізація localStorage
  static optimizeLocalStorage(): {
    originalSize: number;
    optimizedSize: number;
    savings: number;
  } {
    let originalSize = 0;
    let optimizedSize = 0;
    
    const keysToOptimize = Object.keys(localStorage).filter(key => 
      key.startsWith('fantasyWorldBuilder_')
    );

    keysToOptimize.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        originalSize += value.length;
        
        try {
          const parsed = JSON.parse(value);
          const { data: optimized, compressed } = this.autoCompress(parsed);
          
          if (compressed) {
            localStorage.setItem(key, JSON.stringify(optimized));
            optimizedSize += JSON.stringify(optimized).length;
          } else {
            optimizedSize += value.length;
          }
        } catch {
          optimizedSize += value.length;
        }
      }
    });

    return {
      originalSize,
      optimizedSize,
      savings: originalSize - optimizedSize
    };
  }

  // Очищення стиснених даних
  static cleanupCompressedData(): number {
    let cleanedSize = 0;
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('fantasyWorldBuilder_compressed_')) {
        const value = localStorage.getItem(key);
        if (value) {
          cleanedSize += value.length;
          localStorage.removeItem(key);
        }
      }
    });

    return cleanedSize;
  }
}

// Хук для роботи зі стисненням
export function useCompression() {
  const [compressionStats, setCompressionStats] = useState<{
    totalSize: number;
    compressedSize: number;
    savings: number;
  }>({ totalSize: 0, compressedSize: 0, savings: 0 });

  const calculateStats = () => {
    let totalSize = 0;
    let compressedSize = 0;

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('fantasyWorldBuilder_')) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
          
          // Симулюємо стиснення для розрахунку
          const compressed = LZString.compress(value);
          compressedSize += compressed.length;
        }
      }
    });

    const savings = totalSize - compressedSize;
    setCompressionStats({ totalSize, compressedSize, savings });
  };

  const optimizeStorage = () => {
    const result = CompressionUtils.optimizeLocalStorage();
    calculateStats();
    return result;
  };

  return {
    compressionStats,
    calculateStats,
    optimizeStorage
  };
}