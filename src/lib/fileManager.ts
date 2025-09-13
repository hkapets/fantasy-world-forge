import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Інтерфейси для файлової системи
export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: string;
  path: string;
  thumbnail?: string;
}

export interface ExportOptions {
  format: 'json' | 'pdf' | 'html' | 'zip';
  includeImages: boolean;
  compressImages: boolean;
  sections: string[];
}

// Клас для управління файлами
export class FileManager {
  private static readonly STORAGE_KEY = 'fantasyWorldBuilder_files';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Збереження файлу в IndexedDB
  static async saveFile(file: File, category: string = 'general'): Promise<FileMetadata> {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`Файл занадто великий. Максимальний розмір: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const arrayBuffer = await file.arrayBuffer();
    
    // Створюємо thumbnail для зображень
    let thumbnail: string | undefined;
    if (file.type.startsWith('image/')) {
      thumbnail = await this.createThumbnail(file);
    }

    const metadata: FileMetadata = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date().toISOString(),
      path: `/${category}/${fileId}`,
      thumbnail
    };

    // Зберігаємо в IndexedDB
    await this.storeFileData(fileId, arrayBuffer, metadata);
    
    return metadata;
  }

  // Створення thumbnail для зображень
  private static async createThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        const maxSize = 150;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Збереження даних файлу в IndexedDB
  private static async storeFileData(fileId: string, data: ArrayBuffer, metadata: FileMetadata): Promise<void> {
    const request = indexedDB.open('FantasyWorldFiles', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('files')) {
          const store = db.createObjectStore('files', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        store.put({
          id: fileId,
          data,
          metadata,
          category: metadata.path.split('/')[1]
        });
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }

  // Отримання файлу з IndexedDB
  static async getFile(fileId: string): Promise<{ data: ArrayBuffer; metadata: FileMetadata } | null> {
    const request = indexedDB.open('FantasyWorldFiles', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        const getRequest = store.get(fileId);
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            resolve({
              data: result.data,
              metadata: result.metadata
            });
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  // Видалення файлу
  static async deleteFile(fileId: string): Promise<void> {
    const request = indexedDB.open('FantasyWorldFiles', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        store.delete(fileId);
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }

  // Отримання списку файлів
  static async getFilesList(category?: string): Promise<FileMetadata[]> {
    const request = indexedDB.open('FantasyWorldFiles', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        
        let cursor;
        if (category) {
          const index = store.index('category');
          cursor = index.openCursor(category);
        } else {
          cursor = store.openCursor();
        }
        
        const files: FileMetadata[] = [];
        
        cursor.onsuccess = (event) => {
          const result = (event.target as IDBRequest).result;
          if (result) {
            files.push(result.value.metadata);
            result.continue();
          } else {
            resolve(files);
          }
        };
        
        cursor.onerror = () => reject(cursor.error);
      };
    });
  }

  // Стиснення зображення
  static async compressImage(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Зменшуємо розмір якщо потрібно
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Помилка стиснення зображення'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Експорт світу в різних форматах
  static async exportWorld(worldId: string, options: ExportOptions): Promise<void> {
    const worldData = await this.collectWorldData(worldId, options.sections);

    switch (options.format) {
      case 'json':
        await this.exportAsJSON(worldData, worldId);
        break;
      case 'pdf':
        await this.exportAsPDF(worldData, worldId, options);
        break;
      case 'html':
        await this.exportAsHTML(worldData, worldId, options);
        break;
      case 'zip':
        await this.exportAsZIP(worldData, worldId, options);
        break;
    }
  }

  // Збір даних світу
  private static async collectWorldData(worldId: string, sections: string[]) {
    const data: any = {};

    // Основна інформація про світ
    const worlds = JSON.parse(localStorage.getItem('fantasyWorldBuilder_worlds') || '[]');
    data.world = worlds.find((w: any) => w.id === worldId);

    if (sections.includes('characters')) {
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      data.characters = characters.filter((char: any) => char.worldId === worldId);
    }

    if (sections.includes('lore')) {
      data.lore = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`) || '[]');
    }

    if (sections.includes('chronology')) {
      data.chronologies = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_chronologies_${worldId}`) || '[]');
      data.events = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_events_${worldId}`) || '[]');
    }

    if (sections.includes('notes')) {
      data.notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
    }

    if (sections.includes('maps')) {
      data.maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
      data.markers = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_markers_${worldId}`) || '[]');
    }

    if (sections.includes('relationships')) {
      data.relationships = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${worldId}`) || '[]');
    }

    if (sections.includes('scenarios')) {
      const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
      data.scenarios = scenarios.filter((scenario: any) => scenario.worldId === worldId);
    }

    return data;
  }

  // Експорт в JSON
  private static async exportAsJSON(data: any, worldId: string): Promise<void> {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    saveAs(blob, `${data.world?.name || 'world'}-${worldId}-${new Date().toISOString().split('T')[0]}.json`);
  }

  // Експорт в PDF
  private static async exportAsPDF(data: any, worldId: string, options: ExportOptions): Promise<void> {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Заголовок
    pdf.setFontSize(20);
    pdf.text(data.world?.name || 'Fantasy World', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    if (data.world?.description) {
      const lines = pdf.splitTextToSize(data.world.description, 170);
      pdf.text(lines, 20, yPosition);
      yPosition += lines.length * 7 + 10;
    }

    // Персонажі
    if (data.characters && data.characters.length > 0) {
      pdf.setFontSize(16);
      pdf.text('Персонажі', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      data.characters.forEach((char: any) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(`${char.name} (${char.race} ${char.characterClass})`, 25, yPosition);
        yPosition += 7;
        
        if (char.description) {
          const lines = pdf.splitTextToSize(char.description, 160);
          pdf.text(lines, 30, yPosition);
          yPosition += lines.length * 5 + 5;
        }
      });
    }

    // Аналогічно для інших розділів...

    pdf.save(`${data.world?.name || 'world'}-${worldId}.pdf`);
  }

  // Експорт в HTML
  private static async exportAsHTML(data: any, worldId: string, options: ExportOptions): Promise<void> {
    const html = this.generateHTMLTemplate(data, options);
    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, `${data.world?.name || 'world'}-${worldId}.html`);
  }

  // Експорт в ZIP архів
  private static async exportAsZIP(data: any, worldId: string, options: ExportOptions): Promise<void> {
    const zip = new JSZip();

    // Додаємо JSON файл з даними
    zip.file('data.json', JSON.stringify(data, null, 2));

    // Додаємо HTML версію
    const html = this.generateHTMLTemplate(data, options);
    zip.file('index.html', html);

    // Додаємо зображення якщо потрібно
    if (options.includeImages) {
      const imagesFolder = zip.folder('images');
      
      // Збираємо всі зображення з даних
      const images = this.extractImagesFromData(data);
      for (const [filename, imageData] of images) {
        if (imageData.startsWith('data:')) {
          const base64Data = imageData.split(',')[1];
          imagesFolder?.file(filename, base64Data, { base64: true });
        }
      }
    }

    // Генеруємо та зберігаємо ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${data.world?.name || 'world'}-${worldId}.zip`);
  }

  // Генерація HTML шаблону
  private static generateHTMLTemplate(data: any, options: ExportOptions): string {
    return `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.world?.name || 'Fantasy World'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #6B46C1, #D97706);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: center;
        }
        .section {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .character-card, .lore-card {
            border: 1px solid #e0e0e0;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 6px;
            background: #fafafa;
        }
        .character-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 50%;
            float: left;
            margin-right: 1rem;
            margin-bottom: 1rem;
        }
        h1 { font-size: 2.5rem; margin: 0; }
        h2 { color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 0.5rem; }
        h3 { color: #D97706; }
        .meta { font-size: 0.9rem; color: #666; }
        .tags { margin-top: 0.5rem; }
        .tag {
            display: inline-block;
            background: #6B46C1;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-right: 0.5rem;
        }
        @media print {
            body { background: white; }
            .section { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.world?.name || 'Fantasy World'}</h1>
        <p>${data.world?.description || ''}</p>
        <div class="meta">Експортовано: ${new Date().toLocaleDateString('uk-UA')}</div>
    </div>

    ${data.characters ? this.generateCharactersHTML(data.characters) : ''}
    ${data.lore ? this.generateLoreHTML(data.lore) : ''}
    ${data.chronologies ? this.generateChronologyHTML(data.chronologies, data.events) : ''}
    ${data.notes ? this.generateNotesHTML(data.notes) : ''}
    ${data.maps ? this.generateMapsHTML(data.maps) : ''}
    ${data.relationships ? this.generateRelationshipsHTML(data.relationships) : ''}
    ${data.scenarios ? this.generateScenariosHTML(data.scenarios) : ''}

    <div class="section">
        <h2>Інформація про експорт</h2>
        <p>Цей файл створено Fantasy World Builder</p>
        <p>Дата експорту: ${new Date().toLocaleString('uk-UA')}</p>
        <p>Включені розділи: ${options.sections.join(', ')}</p>
    </div>
</body>
</html>`;
  }

  // Генерація HTML для персонажів
  private static generateCharactersHTML(characters: any[]): string {
    if (characters.length === 0) return '';

    return `
    <div class="section">
        <h2>Персонажі (${characters.length})</h2>
        ${characters.map(char => `
            <div class="character-card">
                ${char.image ? `<img src="${char.image}" alt="${char.name}" class="character-image">` : ''}
                <h3>${char.name}</h3>
                <div class="meta">
                    ${char.race ? `Раса: ${char.race} | ` : ''}
                    ${char.characterClass ? `Клас: ${char.characterClass} | ` : ''}
                    ${char.status ? `Статус: ${char.status}` : ''}
                </div>
                ${char.birthPlace ? `<p><strong>Місце народження:</strong> ${char.birthPlace}</p>` : ''}
                ${char.description ? `<p>${char.description}</p>` : ''}
                ${char.tags && char.tags.length > 0 ? `
                    <div class="tags">
                        ${char.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>`;
  }

  // Генерація HTML для лору
  private static generateLoreHTML(lore: any[]): string {
    if (lore.length === 0) return '';

    const groupedLore = lore.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});

    return `
    <div class="section">
        <h2>Лор (${lore.length} записів)</h2>
        ${Object.entries(groupedLore).map(([type, items]: [string, any]) => `
            <h3>${this.getLoreTypeLabel(type)}</h3>
            ${items.map((item: any) => `
                <div class="lore-card">
                    <h4>${item.name}</h4>
                    ${item.subtype ? `<div class="meta">Тип: ${item.subtype}</div>` : ''}
                    <p>${item.description}</p>
                    ${item.relatedLocations ? `<p><strong>Пов'язані локації:</strong> ${item.relatedLocations}</p>` : ''}
                    ${item.relatedCharacters ? `<p><strong>Пов'язані персонажі:</strong> ${item.relatedCharacters}</p>` : ''}
                </div>
            `).join('')}
        `).join('')}
    </div>`;
  }

  // Генерація HTML для інших розділів...
  private static generateChronologyHTML(chronologies: any[], events: any[]): string {
    if (chronologies.length === 0) return '';

    return `
    <div class="section">
        <h2>Хронологія</h2>
        ${chronologies.map(chron => {
          const chronEvents = events.filter(e => e.chronologyId === chron.id).sort((a, b) => a.date - b.date);
          return `
            <h3>${chron.name}</h3>
            <p>${chron.description}</p>
            ${chronEvents.length > 0 ? `
                <h4>Події:</h4>
                <ul>
                    ${chronEvents.map(event => `
                        <li><strong>${event.date} рік:</strong> ${event.name} - ${event.description}</li>
                    `).join('')}
                </ul>
            ` : ''}
          `;
        }).join('')}
    </div>`;
  }

  private static generateNotesHTML(notes: any[]): string {
    if (notes.length === 0) return '';

    return `
    <div class="section">
        <h2>Нотатки (${notes.length})</h2>
        ${notes.map(note => `
            <div class="lore-card">
                <h3>${note.title}</h3>
                <div class="meta">Категорія: ${note.category}</div>
                <p>${note.content.replace(/\n/g, '<br>')}</p>
                ${note.tags && note.tags.length > 0 ? `
                    <div class="tags">
                        ${note.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>`;
  }

  private static generateMapsHTML(maps: any[]): string {
    if (maps.length === 0) return '';

    return `
    <div class="section">
        <h2>Карти (${maps.length})</h2>
        ${maps.map(map => `
            <div class="lore-card">
                <h3>${map.name}</h3>
                <p>${map.description}</p>
                <div class="meta">
                    Розмір: ${map.width} × ${map.height} | 
                    ${map.isPublic ? 'Публічна' : 'Приватна'}
                </div>
                ${map.tags && map.tags.length > 0 ? `
                    <div class="tags">
                        ${map.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>`;
  }

  private static generateRelationshipsHTML(relationships: any[]): string {
    if (relationships.length === 0) return '';

    return `
    <div class="section">
        <h2>Зв'язки (${relationships.length})</h2>
        ${relationships.map(rel => `
            <div class="lore-card">
                <h4>${rel.sourceName} → ${rel.targetName}</h4>
                <div class="meta">
                    Тип: ${rel.relationshipType} | 
                    Сила: ${rel.strength} | 
                    Статус: ${rel.status}
                </div>
                <p>${rel.description}</p>
            </div>
        `).join('')}
    </div>`;
  }

  private static generateScenariosHTML(scenarios: any[]): string {
    if (scenarios.length === 0) return '';

    return `
    <div class="section">
        <h2>Сценарії (${scenarios.length})</h2>
        ${scenarios.map(scenario => `
            <div class="lore-card">
                <h3>${scenario.title}</h3>
                <div class="meta">
                    Тип: ${scenario.type} | 
                    Складність: ${scenario.difficulty} | 
                    Статус: ${scenario.status}
                </div>
                <p>${scenario.description}</p>
                ${scenario.estimatedDuration ? `<p><strong>Тривалість:</strong> ${scenario.estimatedDuration}</p>` : ''}
                ${scenario.playerCount ? `<p><strong>Гравці:</strong> ${scenario.playerCount}</p>` : ''}
            </div>
        `).join('')}
    </div>`;
  }

  // Витягування зображень з даних
  private static extractImagesFromData(data: any): Map<string, string> {
    const images = new Map<string, string>();
    let imageCounter = 1;

    const processEntity = (entity: any, prefix: string) => {
      if (entity.image && entity.image.startsWith('data:')) {
        const extension = entity.image.includes('jpeg') ? 'jpg' : 'png';
        images.set(`${prefix}_${imageCounter}.${extension}`, entity.image);
        imageCounter++;
      }
    };

    // Обробляємо всі сутності з зображеннями
    if (data.characters) {
      data.characters.forEach((char: any) => processEntity(char, 'character'));
    }
    if (data.lore) {
      data.lore.forEach((item: any) => processEntity(item, 'lore'));
    }
    if (data.maps) {
      data.maps.forEach((map: any) => {
        if (map.imageFile) {
          images.set(`map_${imageCounter}.jpg`, map.imageFile);
          imageCounter++;
        }
      });
    }

    return images;
  }

  // Допоміжні методи
  private static getLoreTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      races: 'Раси',
      bestiary: 'Бестіарій',
      geography: 'Географія',
      history: 'Історія',
      politics: 'Політика',
      religion: 'Релігія і міфологія',
      languages: 'Писемність, мови і літочислення',
      magic: 'Магія',
      artifacts: 'Артефакти'
    };
    return labels[type] || type;
  }

  // Очищення файлової системи
  static async cleanupFiles(olderThanDays: number = 30): Promise<number> {
    const files = await this.getFilesList();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    let deletedCount = 0;
    for (const file of files) {
      if (new Date(file.lastModified) < cutoffDate) {
        await this.deleteFile(file.id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  // Отримання статистики файлів
  static async getFileStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const files = await this.getFilesList();
    
    const stats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      byCategory: {} as Record<string, number>,
      byType: {} as Record<string, number>
    };

    files.forEach(file => {
      const category = file.path.split('/')[1] || 'general';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      
      const type = file.type.split('/')[0] || 'other';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }
}

// Хук для роботи з файлами
export function useFileManager() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFiles = async (category?: string) => {
    setLoading(true);
    try {
      const filesList = await FileManager.getFilesList(category);
      setFiles(filesList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, category: string = 'general'): Promise<FileMetadata> => {
    const metadata = await FileManager.saveFile(file, category);
    await loadFiles();
    return metadata;
  };

  const deleteFile = async (fileId: string) => {
    await FileManager.deleteFile(fileId);
    await loadFiles();
  };

  return {
    files,
    loading,
    loadFiles,
    uploadFile,
    deleteFile
  };
}