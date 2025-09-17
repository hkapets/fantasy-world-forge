// Система плагінів для Fantasy World Builder

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  license?: string;
  keywords: string[];
  
  // Технічні характеристики
  apiVersion: string;
  minAppVersion: string;
  maxAppVersion?: string;
  
  // Точки розширення
  extensionPoints: ExtensionPoint[];
  
  // Залежності
  dependencies?: PluginDependency[];
  
  // Дозволи
  permissions: PluginPermission[];
  
  // Конфігурація
  config?: PluginConfig;
  
  // Метадані
  createdAt: string;
  updatedAt: string;
  downloadCount?: number;
  rating?: number;
}

export interface ExtensionPoint {
  id: string;
  type: 'component' | 'hook' | 'service' | 'generator' | 'exporter' | 'importer';
  target: string; // Де розширення буде інтегровано
  priority: number; // Порядок виконання
  config?: any;
}

export interface PluginDependency {
  pluginId: string;
  version: string;
  optional: boolean;
}

export interface PluginPermission {
  type: 'storage' | 'network' | 'filesystem' | 'notifications' | 'clipboard';
  description: string;
  required: boolean;
}

export interface PluginConfig {
  schema: any; // JSON Schema для валідації
  defaults: any;
  ui?: PluginConfigUI[];
}

export interface PluginConfigUI {
  key: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'file';
  label: string;
  description?: string;
  options?: Array<{ value: any; label: string }>;
  validation?: any;
}

export interface Plugin {
  manifest: PluginManifest;
  code: string;
  isActive: boolean;
  isLoaded: boolean;
  instance?: any;
  config: any;
  
  // Статистика
  loadTime?: number;
  errorCount: number;
  lastError?: string;
  usageStats: PluginUsageStats;
}

export interface PluginUsageStats {
  activations: number;
  lastUsed: string;
  averageLoadTime: number;
  errorRate: number;
}

export interface PluginAPI {
  // Основні сервіси
  storage: PluginStorageAPI;
  ui: PluginUIAPI;
  data: PluginDataAPI;
  events: PluginEventAPI;
  utils: PluginUtilsAPI;
  
  // Інформація про додаток
  app: {
    version: string;
    currentWorldId: string | null;
    user: any;
  };
}

export interface PluginStorageAPI {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export interface PluginUIAPI {
  showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void;
  showModal(component: React.ComponentType, props?: any): Promise<any>;
  addMenuItem(section: string, item: MenuItem): void;
  addToolbarButton(button: ToolbarButton): void;
  registerComponent(id: string, component: React.ComponentType): void;
}

export interface PluginDataAPI {
  getWorlds(): Promise<any[]>;
  getCurrentWorld(): Promise<any | null>;
  getCharacters(worldId: string): Promise<any[]>;
  getLore(worldId: string): Promise<any[]>;
  getNotes(worldId: string): Promise<any[]>;
  getMaps(worldId: string): Promise<any[]>;
  getRelationships(worldId: string): Promise<any[]>;
  
  // Створення та оновлення
  createCharacter(worldId: string, data: any): Promise<string>;
  updateCharacter(characterId: string, data: any): Promise<void>;
  deleteCharacter(characterId: string): Promise<void>;
  
  // Пошук
  search(query: string, types?: string[]): Promise<any[]>;
}

export interface PluginEventAPI {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, data?: any): void;
  
  // Стандартні події
  onWorldChanged(handler: (worldId: string) => void): void;
  onCharacterCreated(handler: (character: any) => void): void;
  onCharacterUpdated(handler: (character: any) => void): void;
  onCharacterDeleted(handler: (characterId: string) => void): void;
}

export interface PluginUtilsAPI {
  generateId(): string;
  formatDate(date: Date, format?: string): string;
  sanitizeHtml(html: string): string;
  validateEmail(email: string): boolean;
  debounce(func: Function, delay: number): Function;
  throttle(func: Function, delay: number): Function;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  shortcut?: string;
  separator?: boolean;
}

export interface ToolbarButton {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  tooltip?: string;
  position: 'left' | 'center' | 'right';
}

// Менеджер плагінів
export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, Plugin> = new Map();
  private api: PluginAPI;
  private eventEmitter: EventTarget = new EventTarget();
  
  private constructor() {
    this.api = this.createPluginAPI();
  }

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  // Завантаження плагіну
  async loadPlugin(pluginData: { manifest: PluginManifest; code: string }): Promise<boolean> {
    try {
      const { manifest, code } = pluginData;
      
      // Валідація маніфесту
      if (!this.validateManifest(manifest)) {
        throw new Error('Невірний маніфест плагіну');
      }

      // Перевірка сумісності
      if (!this.checkCompatibility(manifest)) {
        throw new Error('Плагін несумісний з поточною версією');
      }

      // Перевірка дозволів
      if (!this.checkPermissions(manifest.permissions)) {
        throw new Error('Недостатньо дозволів для плагіну');
      }

      const startTime = performance.now();

      // Створення ізольованого контексту
      const pluginContext = this.createPluginContext(manifest.id);
      
      // Виконання коду плагіну
      const pluginFunction = new Function('api', 'require', 'module', 'exports', code);
      const moduleExports = {};
      
      pluginFunction(this.api, this.createRequire(manifest.id), { exports: moduleExports }, moduleExports);

      const loadTime = performance.now() - startTime;

      // Створення екземпляру плагіну
      const plugin: Plugin = {
        manifest,
        code,
        isActive: true,
        isLoaded: true,
        instance: moduleExports,
        config: { ...manifest.config?.defaults },
        loadTime,
        errorCount: 0,
        usageStats: {
          activations: 1,
          lastUsed: new Date().toISOString(),
          averageLoadTime: loadTime,
          errorRate: 0
        }
      };

      this.plugins.set(manifest.id, plugin);

      // Ініціалізація плагіну
      if (moduleExports.activate) {
        await moduleExports.activate(this.api);
      }

      // Реєстрація точок розширення
      this.registerExtensionPoints(manifest.id, manifest.extensionPoints);

      // Збереження в localStorage
      this.savePluginState();

      console.log(`✅ Плагін "${manifest.name}" завантажено успішно`);
      this.emit('pluginLoaded', { pluginId: manifest.id });
      
      return true;
    } catch (error) {
      console.error(`❌ Помилка завантаження плагіну:`, error);
      return false;
    }
  }

  // Вивантаження плагіну
  async unloadPlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId);
      if (!plugin) return false;

      // Деактивація плагіну
      if (plugin.instance?.deactivate) {
        await plugin.instance.deactivate();
      }

      // Видалення точок розширення
      this.unregisterExtensionPoints(pluginId);

      // Очищення з пам'яті
      this.plugins.delete(pluginId);

      // Оновлення localStorage
      this.savePluginState();

      console.log(`✅ Плагін "${plugin.manifest.name}" вивантажено`);
      this.emit('pluginUnloaded', { pluginId });
      
      return true;
    } catch (error) {
      console.error(`❌ Помилка вивантаження плагіну:`, error);
      return false;
    }
  }

  // Активація/деактивація плагіну
  async togglePlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    try {
      if (plugin.isActive) {
        if (plugin.instance?.deactivate) {
          await plugin.instance.deactivate();
        }
        plugin.isActive = false;
        this.unregisterExtensionPoints(pluginId);
      } else {
        if (plugin.instance?.activate) {
          await plugin.instance.activate(this.api);
        }
        plugin.isActive = true;
        this.registerExtensionPoints(pluginId, plugin.manifest.extensionPoints);
      }

      this.savePluginState();
      this.emit('pluginToggled', { pluginId, isActive: plugin.isActive });
      
      return true;
    } catch (error) {
      console.error(`❌ Помилка перемикання плагіну:`, error);
      return false;
    }
  }

  // Отримання списку плагінів
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  // Отримання плагіну за ID
  getPlugin(pluginId: string): Plugin | null {
    return this.plugins.get(pluginId) || null;
  }

  // Пошук плагінів
  searchPlugins(query: string): Plugin[] {
    const lowerQuery = query.toLowerCase();
    return this.getPlugins().filter(plugin =>
      plugin.manifest.name.toLowerCase().includes(lowerQuery) ||
      plugin.manifest.description.toLowerCase().includes(lowerQuery) ||
      plugin.manifest.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }

  // Створення API для плагінів
  private createPluginAPI(): PluginAPI {
    return {
      storage: {
        async get(key: string) {
          const data = localStorage.getItem(`plugin_storage_${key}`);
          return data ? JSON.parse(data) : null;
        },
        async set(key: string, value: any) {
          localStorage.setItem(`plugin_storage_${key}`, JSON.stringify(value));
        },
        async remove(key: string) {
          localStorage.removeItem(`plugin_storage_${key}`);
        },
        async clear() {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('plugin_storage_')) {
              localStorage.removeItem(key);
            }
          });
        },
        async keys() {
          return Object.keys(localStorage)
            .filter(key => key.startsWith('plugin_storage_'))
            .map(key => key.replace('plugin_storage_', ''));
        }
      },
      
      ui: {
        showNotification: (message: string, type = 'info') => {
          // Інтеграція з системою toast
          const event = new CustomEvent('plugin-notification', {
            detail: { message, type }
          });
          window.dispatchEvent(event);
        },
        
        showModal: async (component: React.ComponentType, props = {}) => {
          return new Promise((resolve) => {
            const event = new CustomEvent('plugin-modal', {
              detail: { component, props, resolve }
            });
            window.dispatchEvent(event);
          });
        },
        
        addMenuItem: (section: string, item: MenuItem) => {
          const event = new CustomEvent('plugin-menu-item', {
            detail: { section, item }
          });
          window.dispatchEvent(event);
        },
        
        addToolbarButton: (button: ToolbarButton) => {
          const event = new CustomEvent('plugin-toolbar-button', {
            detail: { button }
          });
          window.dispatchEvent(event);
        },
        
        registerComponent: (id: string, component: React.ComponentType) => {
          const event = new CustomEvent('plugin-register-component', {
            detail: { id, component }
          });
          window.dispatchEvent(event);
        }
      },
      
      data: {
        async getWorlds() {
          const worlds = localStorage.getItem('fantasyWorldBuilder_worlds');
          return worlds ? JSON.parse(worlds) : [];
        },
        
        async getCurrentWorld() {
          const currentWorldId = localStorage.getItem('fantasyWorldBuilder_currentWorld');
          if (!currentWorldId) return null;
          
          const worlds = await this.getWorlds();
          return worlds.find((w: any) => w.id === currentWorldId) || null;
        },
        
        async getCharacters(worldId: string) {
          const characters = localStorage.getItem('fantasyWorldBuilder_characters');
          const allCharacters = characters ? JSON.parse(characters) : [];
          return allCharacters.filter((char: any) => char.worldId === worldId);
        },
        
        async getLore(worldId: string) {
          const lore = localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`);
          return lore ? JSON.parse(lore) : [];
        },
        
        async getNotes(worldId: string) {
          const notes = localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`);
          return notes ? JSON.parse(notes) : [];
        },
        
        async getMaps(worldId: string) {
          const maps = localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`);
          return maps ? JSON.parse(maps) : [];
        },
        
        async getRelationships(worldId: string) {
          const relationships = localStorage.getItem(`fantasyWorldBuilder_relationships_${worldId}`);
          return relationships ? JSON.parse(relationships) : [];
        },
        
        async createCharacter(worldId: string, data: any) {
          const characters = await this.getCharacters(worldId);
          const newCharacter = {
            id: Date.now().toString(),
            worldId,
            ...data,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
          };
          
          const allCharacters = localStorage.getItem('fantasyWorldBuilder_characters');
          const allCharsArray = allCharacters ? JSON.parse(allCharacters) : [];
          allCharsArray.push(newCharacter);
          
          localStorage.setItem('fantasyWorldBuilder_characters', JSON.stringify(allCharsArray));
          return newCharacter.id;
        },
        
        async updateCharacter(characterId: string, data: any) {
          const allCharacters = localStorage.getItem('fantasyWorldBuilder_characters');
          const allCharsArray = allCharacters ? JSON.parse(allCharacters) : [];
          
          const index = allCharsArray.findIndex((char: any) => char.id === characterId);
          if (index !== -1) {
            allCharsArray[index] = {
              ...allCharsArray[index],
              ...data,
              lastModified: new Date().toISOString()
            };
            localStorage.setItem('fantasyWorldBuilder_characters', JSON.stringify(allCharsArray));
          }
        },
        
        async deleteCharacter(characterId: string) {
          const allCharacters = localStorage.getItem('fantasyWorldBuilder_characters');
          const allCharsArray = allCharacters ? JSON.parse(allCharacters) : [];
          
          const filteredChars = allCharsArray.filter((char: any) => char.id !== characterId);
          localStorage.setItem('fantasyWorldBuilder_characters', JSON.stringify(filteredChars));
        },
        
        async search(query: string, types = ['character', 'lore', 'note']) {
          const results: any[] = [];
          const lowerQuery = query.toLowerCase();
          
          if (types.includes('character')) {
            const characters = localStorage.getItem('fantasyWorldBuilder_characters');
            const allCharacters = characters ? JSON.parse(characters) : [];
            
            allCharacters.forEach((char: any) => {
              if (char.name.toLowerCase().includes(lowerQuery) ||
                  char.description.toLowerCase().includes(lowerQuery)) {
                results.push({ ...char, type: 'character' });
              }
            });
          }
          
          return results;
        }
      },
      
      events: {
        on: (event: string, handler: Function) => {
          this.eventEmitter.addEventListener(event, handler as EventListener);
        },
        
        off: (event: string, handler: Function) => {
          this.eventEmitter.removeEventListener(event, handler as EventListener);
        },
        
        emit: (event: string, data?: any) => {
          const customEvent = new CustomEvent(event, { detail: data });
          this.eventEmitter.dispatchEvent(customEvent);
        },
        
        onWorldChanged: (handler: (worldId: string) => void) => {
          this.eventEmitter.addEventListener('worldChanged', (e: any) => {
            handler(e.detail.worldId);
          });
        },
        
        onCharacterCreated: (handler: (character: any) => void) => {
          this.eventEmitter.addEventListener('characterCreated', (e: any) => {
            handler(e.detail.character);
          });
        },
        
        onCharacterUpdated: (handler: (character: any) => void) => {
          this.eventEmitter.addEventListener('characterUpdated', (e: any) => {
            handler(e.detail.character);
          });
        },
        
        onCharacterDeleted: (handler: (characterId: string) => void) => {
          this.eventEmitter.addEventListener('characterDeleted', (e: any) => {
            handler(e.detail.characterId);
          });
        }
      },
      
      utils: {
        generateId: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        
        formatDate: (date: Date, format = 'uk-UA') => {
          return date.toLocaleDateString(format);
        },
        
        sanitizeHtml: (html: string) => {
          const div = document.createElement('div');
          div.textContent = html;
          return div.innerHTML;
        },
        
        validateEmail: (email: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        
        debounce: (func: Function, delay: number) => {
          let timeoutId: NodeJS.Timeout;
          return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
          };
        },
        
        throttle: (func: Function, delay: number) => {
          let lastCall = 0;
          return (...args: any[]) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
              lastCall = now;
              func.apply(null, args);
            }
          };
        }
      },
      
      app: {
        version: '1.0.0',
        get currentWorldId() {
          return localStorage.getItem('fantasyWorldBuilder_currentWorld');
        },
        user: null
      }
    };
  }

  // Валідація маніфесту
  private validateManifest(manifest: PluginManifest): boolean {
    const required = ['id', 'name', 'version', 'description', 'author', 'apiVersion'];
    return required.every(field => manifest[field as keyof PluginManifest]);
  }

  // Перевірка сумісності
  private checkCompatibility(manifest: PluginManifest): boolean {
    const appVersion = '1.0.0';
    // Спрощена перевірка версій
    return manifest.minAppVersion <= appVersion && 
           (!manifest.maxAppVersion || manifest.maxAppVersion >= appVersion);
  }

  // Перевірка дозволів
  private checkPermissions(permissions: PluginPermission[]): boolean {
    // В реальному застосунку тут буде запит дозволу у користувача
    return true;
  }

  // Створення контексту плагіну
  private createPluginContext(pluginId: string) {
    return {
      pluginId,
      storage: this.createPluginStorage(pluginId),
      console: this.createPluginConsole(pluginId)
    };
  }

  // Створення ізольованого сховища для плагіну
  private createPluginStorage(pluginId: string) {
    return {
      get: (key: string) => {
        const data = localStorage.getItem(`plugin_${pluginId}_${key}`);
        return data ? JSON.parse(data) : null;
      },
      set: (key: string, value: any) => {
        localStorage.setItem(`plugin_${pluginId}_${key}`, JSON.stringify(value));
      },
      remove: (key: string) => {
        localStorage.removeItem(`plugin_${pluginId}_${key}`);
      }
    };
  }

  // Створення логера для плагіну
  private createPluginConsole(pluginId: string) {
    return {
      log: (...args: any[]) => console.log(`[Plugin:${pluginId}]`, ...args),
      warn: (...args: any[]) => console.warn(`[Plugin:${pluginId}]`, ...args),
      error: (...args: any[]) => console.error(`[Plugin:${pluginId}]`, ...args)
    };
  }

  // Створення require функції для плагіну
  private createRequire(pluginId: string) {
    return (moduleName: string) => {
      // Дозволені модулі для плагінів
      const allowedModules = {
        'react': React,
        'lodash': null, // Можна додати lodash якщо потрібно
      };
      
      if (allowedModules.hasOwnProperty(moduleName)) {
        return allowedModules[moduleName as keyof typeof allowedModules];
      }
      
      throw new Error(`Module "${moduleName}" is not allowed in plugins`);
    };
  }

  // Реєстрація точок розширення
  private registerExtensionPoints(pluginId: string, extensionPoints: ExtensionPoint[]) {
    extensionPoints.forEach(point => {
      const event = new CustomEvent('register-extension-point', {
        detail: { pluginId, extensionPoint: point }
      });
      window.dispatchEvent(event);
    });
  }

  // Видалення точок розширення
  private unregisterExtensionPoints(pluginId: string) {
    const event = new CustomEvent('unregister-extension-points', {
      detail: { pluginId }
    });
    window.dispatchEvent(event);
  }

  // Збереження стану плагінів
  private savePluginState() {
    const pluginStates = Array.from(this.plugins.entries()).map(([id, plugin]) => ({
      id,
      isActive: plugin.isActive,
      config: plugin.config,
      usageStats: plugin.usageStats
    }));
    
    localStorage.setItem('fantasyWorldBuilder_pluginStates', JSON.stringify(pluginStates));
  }

  // Завантаження стану плагінів
  loadPluginStates() {
    const saved = localStorage.getItem('fantasyWorldBuilder_pluginStates');
    if (saved) {
      try {
        const states = JSON.parse(saved);
        states.forEach((state: any) => {
          const plugin = this.plugins.get(state.id);
          if (plugin) {
            plugin.isActive = state.isActive;
            plugin.config = state.config;
            plugin.usageStats = state.usageStats;
          }
        });
      } catch (error) {
        console.error('Error loading plugin states:', error);
      }
    }
  }

  // Емітер подій
  private emit(event: string, data?: any) {
    const customEvent = new CustomEvent(event, { detail: data });
    this.eventEmitter.dispatchEvent(customEvent);
  }

  // Очищення всіх плагінів
  async clearAllPlugins(): Promise<void> {
    const pluginIds = Array.from(this.plugins.keys());
    for (const pluginId of pluginIds) {
      await this.unloadPlugin(pluginId);
    }
    
    // Очищення localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('plugin_') || key === 'fantasyWorldBuilder_pluginStates') {
        localStorage.removeItem(key);
      }
    });
  }

  // Експорт плагінів
  exportPlugins(): void {
    const pluginsData = Array.from(this.plugins.values()).map(plugin => ({
      manifest: plugin.manifest,
      code: plugin.code,
      config: plugin.config
    }));

    const exportData = {
      plugins: pluginsData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `fantasy-plugins-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  // Імпорт плагінів
  async importPlugins(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (!importData.plugins || !Array.isArray(importData.plugins)) {
        throw new Error('Невірний формат файлу плагінів');
      }

      let loadedCount = 0;
      for (const pluginData of importData.plugins) {
        const success = await this.loadPlugin(pluginData);
        if (success) loadedCount++;
      }

      return loadedCount > 0;
    } catch (error) {
      console.error('Error importing plugins:', error);
      return false;
    }
  }
}

// Хук для роботи з плагінами
export function usePluginSystem() {
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  const manager = PluginManager.getInstance();

  const refreshPlugins = () => {
    setPlugins(manager.getPlugins());
  };

  React.useEffect(() => {
    refreshPlugins();
    
    // Слухаємо події плагінів
    const handlePluginEvent = () => refreshPlugins();
    
    manager['eventEmitter'].addEventListener('pluginLoaded', handlePluginEvent);
    manager['eventEmitter'].addEventListener('pluginUnloaded', handlePluginEvent);
    manager['eventEmitter'].addEventListener('pluginToggled', handlePluginEvent);
    
    return () => {
      manager['eventEmitter'].removeEventListener('pluginLoaded', handlePluginEvent);
      manager['eventEmitter'].removeEventListener('pluginUnloaded', handlePluginEvent);
      manager['eventEmitter'].removeEventListener('pluginToggled', handlePluginEvent);
    };
  }, []);

  const loadPlugin = async (pluginData: { manifest: PluginManifest; code: string }) => {
    setLoading(true);
    try {
      const success = await manager.loadPlugin(pluginData);
      if (success) refreshPlugins();
      return success;
    } finally {
      setLoading(false);
    }
  };

  const unloadPlugin = async (pluginId: string) => {
    setLoading(true);
    try {
      const success = await manager.unloadPlugin(pluginId);
      if (success) refreshPlugins();
      return success;
    } finally {
      setLoading(false);
    }
  };

  const togglePlugin = async (pluginId: string) => {
    const success = await manager.togglePlugin(pluginId);
    if (success) refreshPlugins();
    return success;
  };

  const searchPlugins = (query: string) => {
    return manager.searchPlugins(query);
  };

  const exportPlugins = () => {
    manager.exportPlugins();
  };

  const importPlugins = async (file: File) => {
    setLoading(true);
    try {
      const success = await manager.importPlugins(file);
      if (success) refreshPlugins();
      return success;
    } finally {
      setLoading(false);
    }
  };

  return {
    plugins,
    loading,
    loadPlugin,
    unloadPlugin,
    togglePlugin,
    searchPlugins,
    exportPlugins,
    importPlugins,
    refreshPlugins
  };
}

// Приклади вбудованих плагінів
export const builtInPlugins = {
  // Плагін статистики
  statistics: {
    manifest: {
      id: 'core.statistics',
      name: 'Статистика світу',
      version: '1.0.0',
      description: 'Показує детальну статистику вашого фентезійного світу',
      author: 'Fantasy World Builder Team',
      apiVersion: '1.0.0',
      minAppVersion: '1.0.0',
      keywords: ['статистика', 'аналітика', 'графіки'],
      extensionPoints: [
        {
          id: 'dashboard-widget',
          type: 'component',
          target: 'dashboard',
          priority: 1
        }
      ],
      permissions: [
        {
          type: 'storage',
          description: 'Читання даних для аналізу',
          required: true
        }
      ],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    } as PluginManifest,
    
    code: `
      const StatisticsWidget = ({ api }) => {
        const [stats, setStats] = React.useState(null);
        
        React.useEffect(() => {
          const loadStats = async () => {
            const currentWorld = await api.data.getCurrentWorld();
            if (!currentWorld) return;
            
            const characters = await api.data.getCharacters(currentWorld.id);
            const lore = await api.data.getLore(currentWorld.id);
            const notes = await api.data.getNotes(currentWorld.id);
            
            setStats({
              characters: characters.length,
              lore: lore.length,
              notes: notes.length,
              totalElements: characters.length + lore.length + notes.length
            });
          };
          
          loadStats();
        }, []);
        
        if (!stats) return React.createElement('div', null, 'Завантаження...');
        
        return React.createElement('div', {
          style: {
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)'
          }
        }, [
          React.createElement('h4', { 
            key: 'title',
            style: { margin: 0, marginBottom: '0.5rem', color: 'var(--text-primary)' }
          }, 'Статистика світу'),
          React.createElement('div', { key: 'stats' }, [
            React.createElement('div', { key: 'chars' }, \`Персонажі: \${stats.characters}\`),
            React.createElement('div', { key: 'lore' }, \`Лор: \${stats.lore}\`),
            React.createElement('div', { key: 'notes' }, \`Нотатки: \${stats.notes}\`),
            React.createElement('div', { 
              key: 'total',
              style: { fontWeight: 'bold', marginTop: '0.5rem' }
            }, \`Всього: \${stats.totalElements}\`)
          ])
        ]);
      };
      
      exports.activate = (api) => {
        api.ui.registerComponent('statistics-widget', StatisticsWidget);
        api.ui.showNotification('Плагін статистики активовано', 'success');
      };
      
      exports.deactivate = () => {
        console.log('Statistics plugin deactivated');
      };
    `
  },

  // Плагін експорту в Markdown
  markdownExporter: {
    manifest: {
      id: 'core.markdown-exporter',
      name: 'Експорт в Markdown',
      version: '1.0.0',
      description: 'Експортує дані світу в формат Markdown',
      author: 'Fantasy World Builder Team',
      apiVersion: '1.0.0',
      minAppVersion: '1.0.0',
      keywords: ['експорт', 'markdown', 'документація'],
      extensionPoints: [
        {
          id: 'export-format',
          type: 'exporter',
          target: 'export-menu',
          priority: 1
        }
      ],
      permissions: [
        {
          type: 'storage',
          description: 'Читання даних для експорту',
          required: true
        },
        {
          type: 'filesystem',
          description: 'Збереження файлів',
          required: true
        }
      ],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    } as PluginManifest,
    
    code: `
      exports.activate = (api) => {
        api.ui.addMenuItem('export', {
          id: 'export-markdown',
          label: 'Експорт в Markdown',
          icon: '📝',
          onClick: async () => {
            const currentWorld = await api.data.getCurrentWorld();
            if (!currentWorld) {
              api.ui.showNotification('Оберіть світ для експорту', 'warning');
              return;
            }
            
            const characters = await api.data.getCharacters(currentWorld.id);
            const lore = await api.data.getLore(currentWorld.id);
            const notes = await api.data.getNotes(currentWorld.id);
            
            let markdown = \`# \${currentWorld.name}\\n\\n\`;
            markdown += \`\${currentWorld.description}\\n\\n\`;
            
            if (characters.length > 0) {
              markdown += \`## Персонажі\\n\\n\`;
              characters.forEach(char => {
                markdown += \`### \${char.name}\\n\`;
                markdown += \`- **Раса:** \${char.race || 'Невідомо'}\\n\`;
                markdown += \`- **Клас:** \${char.characterClass || 'Невідомо'}\\n\`;
                markdown += \`- **Статус:** \${char.status || 'Невідомо'}\\n\`;
                if (char.description) {
                  markdown += \`\\n\${char.description}\\n\`;
                }
                markdown += \`\\n\`;
              });
            }
            
            if (lore.length > 0) {
              markdown += \`## Лор\\n\\n\`;
              lore.forEach(item => {
                markdown += \`### \${item.name}\\n\`;
                markdown += \`\${item.description}\\n\\n\`;
              });
            }
            
            if (notes.length > 0) {
              markdown += \`## Нотатки\\n\\n\`;
              notes.forEach(note => {
                markdown += \`### \${note.title}\\n\`;
                markdown += \`\${note.content}\\n\\n\`;
              });
            }
            
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = \`\${currentWorld.name.replace(/[^a-zA-Z0-9]/g, '-')}.md\`;
            link.click();
            URL.revokeObjectURL(url);
            
            api.ui.showNotification('Markdown файл збережено', 'success');
          }
        });
      };
      
      exports.deactivate = () => {
        console.log('Markdown exporter deactivated');
      };
    `
  }
};