import React from 'react';

// Магазин плагінів для Fantasy World Builder

export interface PluginStoreItem {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: 'generator' | 'exporter' | 'visualization' | 'utility' | 'integration';
  tags: string[];
  rating: number;
  downloadCount: number;
  price: number; // 0 для безкоштовних
  screenshots: string[];
  changelog: string;
  homepage?: string;
  repository?: string;
  license: string;
  size: number; // розмір в байтах
  lastUpdated: string;
  compatibility: {
    minVersion: string;
    maxVersion?: string;
  };
  featured: boolean;
  verified: boolean;
  manifest: any;
  downloadUrl: string;
}

export interface PluginCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface PluginReview {
  id: string;
  pluginId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

// Симуляція магазину плагінів (в реальному застосунку це буде API)
export const pluginStoreData: PluginStoreItem[] = [
  {
    id: 'advanced-name-generator',
    name: 'Розширений генератор імен',
    description: 'Генератор імен з підтримкою 20+ рас та культур, включаючи слов\'янські, скандинавські та азійські традиції',
    author: 'NameCraft Studios',
    version: '2.1.0',
    category: 'generator',
    tags: ['імена', 'генератор', 'раси', 'культури'],
    rating: 4.8,
    downloadCount: 15420,
    price: 0,
    screenshots: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    ],
    changelog: 'v2.1.0: Додано підтримку слов\'янських імен та покращено алгоритм генерації',
    repository: 'https://github.com/example/advanced-name-generator',
    license: 'MIT',
    size: 245760,
    lastUpdated: '2024-01-15T10:30:00.000Z',
    compatibility: {
      minVersion: '1.0.0'
    },
    featured: true,
    verified: true,
    manifest: {},
    downloadUrl: 'https://example.com/plugins/advanced-name-generator.json'
  },
  
  {
    id: 'world-map-generator',
    name: 'Генератор карт світу',
    description: 'Автоматично генерує реалістичні карти світу з континентами, океанами, горами та лісами',
    author: 'MapMaker Pro',
    version: '1.5.2',
    category: 'generator',
    tags: ['карти', 'генератор', 'світ', 'географія'],
    rating: 4.6,
    downloadCount: 8930,
    price: 299, // в копійках
    screenshots: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
    ],
    changelog: 'v1.5.2: Покращено алгоритм генерації берегових ліній',
    license: 'Commercial',
    size: 1024000,
    lastUpdated: '2024-01-10T14:20:00.000Z',
    compatibility: {
      minVersion: '1.0.0'
    },
    featured: true,
    verified: true,
    manifest: {},
    downloadUrl: 'https://example.com/plugins/world-map-generator.json'
  },

  {
    id: 'notion-integration',
    name: 'Інтеграція з Notion',
    description: 'Синхронізуйте ваші фентезійні світи з Notion для командної роботи',
    author: 'Integration Labs',
    version: '1.0.0',
    category: 'integration',
    tags: ['notion', 'синхронізація', 'команда', 'експорт'],
    rating: 4.2,
    downloadCount: 3240,
    price: 0,
    screenshots: [],
    changelog: 'v1.0.0: Початковий реліз',
    license: 'Apache-2.0',
    size: 156800,
    lastUpdated: '2024-01-05T09:15:00.000Z',
    compatibility: {
      minVersion: '1.0.0'
    },
    featured: false,
    verified: true,
    manifest: {},
    downloadUrl: 'https://example.com/plugins/notion-integration.json'
  },

  {
    id: 'dice-roller',
    name: 'Кидач кубиків',
    description: 'Вбудований кидач кубиків для D&D та інших настільних ігор',
    author: 'GameMaster Tools',
    version: '1.2.1',
    category: 'utility',
    tags: ['кубики', 'dnd', 'настільні ігри', 'випадковість'],
    rating: 4.9,
    downloadCount: 22100,
    price: 0,
    screenshots: [],
    changelog: 'v1.2.1: Додано підтримку кастомних кубиків',
    license: 'GPL-3.0',
    size: 89600,
    lastUpdated: '2024-01-12T16:45:00.000Z',
    compatibility: {
      minVersion: '1.0.0'
    },
    featured: false,
    verified: true,
    manifest: {},
    downloadUrl: 'https://example.com/plugins/dice-roller.json'
  },

  {
    id: 'timeline-visualizer',
    name: 'Візуалізатор часових ліній',
    description: 'Створюйте красиві інтерактивні часові лінії з анімаціями та ефектами',
    author: 'Visual Studios',
    version: '2.0.0',
    category: 'visualization',
    tags: ['часова лінія', 'візуалізація', 'анімації', 'інтерактив'],
    rating: 4.7,
    downloadCount: 6780,
    price: 199,
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    ],
    changelog: 'v2.0.0: Повне переписування з новими анімаціями',
    license: 'Commercial',
    size: 512000,
    lastUpdated: '2024-01-08T11:30:00.000Z',
    compatibility: {
      minVersion: '1.0.0'
    },
    featured: true,
    verified: true,
    manifest: {},
    downloadUrl: 'https://example.com/plugins/timeline-visualizer.json'
  }
];

export const pluginCategories: PluginCategory[] = [
  {
    id: 'generator',
    name: 'Генератори',
    description: 'Автоматичне створення контенту',
    icon: '🎲',
    color: '#6B46C1'
  },
  {
    id: 'exporter',
    name: 'Експортери',
    description: 'Експорт в різні формати',
    icon: '📤',
    color: '#059669'
  },
  {
    id: 'visualization',
    name: 'Візуалізація',
    description: 'Графіки, діаграми та візуалізації',
    icon: '📊',
    color: '#F59E0B'
  },
  {
    id: 'utility',
    name: 'Утіліти',
    description: 'Корисні інструменти та помічники',
    icon: '🔧',
    color: '#EF4444'
  },
  {
    id: 'integration',
    name: 'Інтеграції',
    description: 'Зв\'язок з зовнішніми сервісами',
    icon: '🔗',
    color: '#3B82F6'
  }
];

// Клас для роботи з магазином плагінів
export class PluginStore {
  private static cache: Map<string, PluginStoreItem[]> = new Map();
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 хвилин

  // Отримання списку плагінів
  static async getPlugins(category?: string, featured?: boolean): Promise<PluginStoreItem[]> {
    const cacheKey = `${category || 'all'}-${featured || 'all'}`;
    const now = Date.now();
    
    // Перевіряємо кеш
    if (this.cache.has(cacheKey) && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cache.get(cacheKey)!;
    }

    // Симулюємо API запит
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let plugins = [...pluginStoreData];
    
    if (category) {
      plugins = plugins.filter(plugin => plugin.category === category);
    }
    
    if (featured) {
      plugins = plugins.filter(plugin => plugin.featured);
    }
    
    // Сортуємо за рейтингом та кількістю завантажень
    plugins.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating * Math.log(b.downloadCount + 1)) - (a.rating * Math.log(a.downloadCount + 1));
    });
    
    this.cache.set(cacheKey, plugins);
    this.lastFetch = now;
    
    return plugins;
  }

  // Пошук плагінів
  static async searchPlugins(query: string): Promise<PluginStoreItem[]> {
    const allPlugins = await this.getPlugins();
    const lowerQuery = query.toLowerCase();
    
    return allPlugins.filter(plugin =>
      plugin.name.toLowerCase().includes(lowerQuery) ||
      plugin.description.toLowerCase().includes(lowerQuery) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      plugin.author.toLowerCase().includes(lowerQuery)
    );
  }

  // Отримання деталей плагіну
  static async getPluginDetails(pluginId: string): Promise<PluginStoreItem | null> {
    const allPlugins = await this.getPlugins();
    return allPlugins.find(plugin => plugin.id === pluginId) || null;
  }

  // Завантаження плагіну
  static async downloadPlugin(pluginId: string): Promise<{ manifest: any; code: string } | null> {
    try {
      // Симулюємо завантаження
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const plugin = await this.getPluginDetails(pluginId);
      if (!plugin) return null;

      // В реальному застосунку тут буде HTTP запит
      const response = await fetch(plugin.downloadUrl);
      const pluginData = await response.json();
      
      return pluginData;
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }
  }

  // Отримання категорій
  static getCategories(): PluginCategory[] {
    return pluginCategories;
  }

  // Очищення кешу
  static clearCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
  }
}

// Хук для роботи з магазином плагінів
export function usePluginStore() {
  const [plugins, setPlugins] = React.useState<PluginStoreItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [categories] = React.useState(PluginStore.getCategories());

  const loadPlugins = async (category?: string, featured?: boolean) => {
    setLoading(true);
    try {
      const pluginList = await PluginStore.getPlugins(category, featured);
      setPlugins(pluginList);
    } catch (error) {
      console.error('Error loading plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPlugins = async (query: string) => {
    setLoading(true);
    try {
      const results = await PluginStore.searchPlugins(query);
      setPlugins(results);
    } catch (error) {
      console.error('Error searching plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPlugin = async (pluginId: string) => {
    try {
      return await PluginStore.downloadPlugin(pluginId);
    } catch (error) {
      console.error('Error downloading plugin:', error);
      return null;
    }
  };

  React.useEffect(() => {
    loadPlugins();
  }, []);

  return {
    plugins,
    categories,
    loading,
    loadPlugins,
    searchPlugins,
    downloadPlugin
  };
}