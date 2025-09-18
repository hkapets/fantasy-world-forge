// Система шаблонів для швидкого створення

import { useState, useEffect } from 'react';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'character' | 'lore' | 'world' | 'scenario';
  data: any;
  tags: string[];
  isBuiltIn: boolean;
  createdAt: string;
  usageCount: number;
}

// Вбудовані шаблони персонажів
const characterTemplates: Omit<Template, 'id' | 'createdAt' | 'usageCount'>[] = [
  {
    name: 'Лицар-захисник',
    description: 'Благородний воїн, що захищає слабких',
    category: 'character',
    isBuiltIn: true,
    tags: ['лицар', 'захисник', 'благородний', 'воїн'],
    data: {
      race: 'Людина',
      characterClass: 'Лицар',
      status: 'Живий',
      description: 'Благородний лицар, присвятивший своє життя захисту невинних. Носить сяючі обладунки та володіє мечем предків. Керується кодексом честі та справедливості.',
      tags: ['лицар', 'захисник', 'благородний', 'честь']
    }
  },
  {
    name: 'Мудрий маг',
    description: 'Досвідчений чаклун з великими знаннями',
    category: 'character',
    isBuiltIn: true,
    tags: ['маг', 'мудрий', 'чаклун', 'знання'],
    data: {
      race: 'Ельф',
      characterClass: 'Маг',
      status: 'Живий',
      description: 'Древній ельф-маг з величезними знаннями магічних мистецтв. Провів століття, вивчаючи таємниці всесвіту. Володіє потужними заклинаннями та мудрістю віків.',
      tags: ['маг', 'мудрий', 'древній', 'магія']
    }
  },
  {
    name: 'Хитрий злодій',
    description: 'Спритний розбійник з вулиць великого міста',
    category: 'character',
    isBuiltIn: true,
    tags: ['злодій', 'хитрий', 'спритний', 'вулиці'],
    data: {
      race: 'Людина',
      characterClass: 'Злодій',
      status: 'Живий',
      description: 'Спритний мешканець вулиць, що вміє непомітно пересуватися тінями. Майстер замків та кишенькових крадіжок. Має мережу інформаторів у підземному світі.',
      tags: ['злодій', 'тіні', 'спритний', 'підземний світ']
    }
  },
  {
    name: 'Лісовий рейнджер',
    description: 'Страж природи та майстер виживання',
    category: 'character',
    isBuiltIn: true,
    tags: ['рейнджер', 'ліс', 'природа', 'мисливець'],
    data: {
      race: 'Ельф',
      characterClass: 'Рейнджер',
      status: 'Живий',
      description: 'Самотній страж лісів, що присвятив життя захисту природи. Майстерно володіє луком та знає всі таємниці дикої природи. Може спілкуватися з тваринами.',
      tags: ['рейнджер', 'ліс', 'лук', 'тварини']
    }
  },
  {
    name: 'Гірський дворф',
    description: 'Майстер-коваль з гірського клану',
    category: 'character',
    isBuiltIn: true,
    tags: ['дворф', 'коваль', 'гори', 'майстер'],
    data: {
      race: 'Дворф',
      characterClass: 'Воїн',
      status: 'Живий',
      description: 'Досвідчений дворф-коваль з древнього гірського клану. Створює найкращу зброю та обладунки. Відомий своєю непохитністю та вірністю традиціям предків.',
      tags: ['дворф', 'коваль', 'зброя', 'традиції']
    }
  }
];

// Шаблони лору
const loreTemplates: Omit<Template, 'id' | 'createdAt' | 'usageCount'>[] = [
  {
    name: 'Древнє місто',
    description: 'Шаблон для створення історичного міста',
    category: 'lore',
    isBuiltIn: true,
    tags: ['місто', 'древнє', 'історія', 'архітектура'],
    data: {
      type: 'geography',
      subtype: 'city',
      description: 'Древнє місто з багатою історією, що пережило численні війни та епохи. Його вулиці пам\'ятають кроки королів та героїв. Архітектура поєднує різні стилі різних епох.',
      relatedLocations: 'Навколишні села, торгові шляхи',
      tags: ['древнє', 'історичне', 'архітектура', 'торгівля']
    }
  },
  {
    name: 'Магічний артефакт',
    description: 'Потужний магічний предмет з історією',
    category: 'lore',
    isBuiltIn: true,
    tags: ['артефакт', 'магія', 'потужний', 'легенда'],
    data: {
      type: 'artifacts',
      description: 'Легендарний артефакт, створений древніми магами. Володіє неймовірною силою, але вимагає великої мудрості від свого власника. Його історія сповнена як тріумфів, так і трагедій.',
      origin: 'Створений древніми магами',
      magicalSkills: 'Контроль стихій, телепортація, захист',
      tags: ['легендарний', 'магія', 'сила', 'мудрість']
    }
  },
  {
    name: 'Таємничий ліс',
    description: 'Зачарований ліс з магічними властивостями',
    category: 'lore',
    isBuiltIn: true,
    tags: ['ліс', 'магія', 'таємниця', 'природа'],
    data: {
      type: 'geography',
      subtype: 'forest',
      description: 'Зачарований ліс, де час тече по-іншому. Дерева тут живі та розумні, а стежки змінюються залежно від намірів мандрівника. Багато хто входить, але не всі повертаються.',
      dangerLevel: 'medium',
      relatedCharacters: 'Лісові духи, друїди, ельфи',
      tags: ['зачарований', 'живі дерева', 'час', 'духи']
    }
  }
];

// Шаблони світів
const worldTemplates: Omit<Template, 'id' | 'createdAt' | 'usageCount'>[] = [
  {
    name: 'Середньовічне фентезі',
    description: 'Класичний фентезійний світ у стилі середньовіччя',
    category: 'world',
    isBuiltIn: true,
    tags: ['середньовіччя', 'класичне', 'фентезі', 'магія'],
    data: {
      description: 'Світ мечів та магії, де древні королівства ведуть війни за владу, а герої вирушають у небезпечні пригоди. Магія існує, але рідкісна та могутня.',
      suggestedRaces: ['Людина', 'Ельф', 'Дворф', 'Хобіт'],
      magicSystem: 'Класична магія з заклинаннями',
      techLevel: 'Середньовіччя',
      themes: ['героїзм', 'пригоди', 'магія', 'честь']
    }
  },
  {
    name: 'Стімпанк світ',
    description: 'Світ парових машин та механічних винаходів',
    category: 'world',
    isBuiltIn: true,
    tags: ['стімпанк', 'технології', 'пар', 'механіка'],
    data: {
      description: 'Світ, де пар та механіка досягли неймовірних висот. Повітряні кораблі бороздять небеса, а механічні автомати допомагають людям у повсякденному житті.',
      suggestedRaces: ['Людина', 'Гном-винахідник', 'Механічна істота'],
      magicSystem: 'Техномагія та алхімія',
      techLevel: 'Індустріальна революція + фентезі',
      themes: ['винаходи', 'прогрес', 'пригоди', 'дослідження']
    }
  },
  {
    name: 'Постапокаліптичне фентезі',
    description: 'Світ після магічної катастрофи',
    category: 'world',
    isBuiltIn: true,
    tags: ['постапокаліпсис', 'руїни', 'виживання', 'відродження'],
    data: {
      description: 'Світ після Великого Розриву - магічної катастрофи, що знищила стару цивілізацію. Вижили будують нове суспільство серед руїн, а дика магія змінює саму природу.',
      suggestedRaces: ['Мутант', 'Виживший', 'Зачарований'],
      magicSystem: 'Дика та непередбачувана магія',
      techLevel: 'Змішаний (руїни + примітив)',
      themes: ['виживання', 'відродження', 'надія', 'небезпека']
    }
  }
];

// Шаблони сценаріїв
const scenarioTemplates: Omit<Template, 'id' | 'createdAt' | 'usageCount'>[] = [
  {
    name: 'Рятувальна місія',
    description: 'Класичний сценарій порятунку важливої особи',
    category: 'scenario',
    isBuiltIn: true,
    tags: ['порятунок', 'місія', 'пригода', 'герої'],
    data: {
      type: 'adventure',
      difficulty: 'medium',
      status: 'draft',
      estimatedDuration: '3-4 години',
      playerCount: '3-5 гравців',
      description: 'Важлива особа (принцеса, маг, дипломат) потрапила в полон до ворогів. Герої повинні проникнути у ворожу фортецю, знайти полоненого та вивести його в безпечне місце.',
      tags: ['порятунок', 'інфільтрація', 'бій', 'стелс']
    }
  },
  {
    name: 'Пошук артефакту',
    description: 'Квест за древнім магічним предметом',
    category: 'scenario',
    isBuiltIn: true,
    tags: ['артефакт', 'пошук', 'магія', 'древність'],
    data: {
      type: 'campaign',
      difficulty: 'hard',
      status: 'draft',
      estimatedDuration: '6-8 сесій',
      playerCount: '4-6 гравців',
      description: 'Древній артефакт, здатний змінити долю світу, був розділений на частини та схований у різних куточках світу. Герої повинні знайти всі фрагменти раніше за злих ворогів.',
      tags: ['епічний квест', 'артефакт', 'подорож', 'магія']
    }
  },
  {
    name: 'Таємниця зниклого села',
    description: 'Розслідування загадкового зникнення',
    category: 'scenario',
    isBuiltIn: true,
    tags: ['таємниця', 'розслідування', 'село', 'зникнення'],
    data: {
      type: 'oneshot',
      difficulty: 'medium',
      status: 'draft',
      estimatedDuration: '2-3 години',
      playerCount: '3-4 гравці',
      description: 'Ціле село зникло без сліду за одну ніч. Герої прибувають для розслідування та виявляють дивні сліди магії, покинуті будинки та загадкові символи.',
      tags: ['детектив', 'магія', 'таємниця', 'розслідування']
    }
  }
];

// Клас для роботи з шаблонами
export class TemplateManager {
  private static readonly STORAGE_KEY = 'fantasyWorldBuilder_templates';

  // Отримання всіх шаблонів
  static getAllTemplates(): Template[] {
    const customTemplates = this.getCustomTemplates();
    const builtInTemplates = this.getBuiltInTemplates();
    
    return [...builtInTemplates, ...customTemplates];
  }

  // Отримання вбудованих шаблонів
  static getBuiltInTemplates(): Template[] {
    const allBuiltIn = [
      ...characterTemplates,
      ...loreTemplates,
      ...worldTemplates,
      ...scenarioTemplates
    ];

    return allBuiltIn.map(template => ({
      ...template,
      id: `builtin-${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      createdAt: '2024-01-01T00:00:00.000Z',
      usageCount: 0
    }));
  }

  // Отримання користувацьких шаблонів
  static getCustomTemplates(): Template[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading custom templates:', error);
      return [];
    }
  }

  // Збереження користувацьких шаблонів
  static saveCustomTemplates(templates: Template[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving custom templates:', error);
    }
  }

  // Створення шаблону з існуючого елемента
  static createTemplateFromEntity(
    name: string,
    description: string,
    category: Template['category'],
    entityData: any,
    tags: string[] = []
  ): Template {
    const template: Template = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category,
      data: { ...entityData },
      tags,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    const customTemplates = this.getCustomTemplates();
    customTemplates.push(template);
    this.saveCustomTemplates(customTemplates);

    return template;
  }

  // Використання шаблону
  static useTemplate(templateId: string): any {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    // Збільшуємо лічильник використання
    this.incrementUsageCount(templateId);

    // Повертаємо копію даних шаблону
    return JSON.parse(JSON.stringify(template.data));
  }

  // Отримання шаблону за ID
  static getTemplateById(templateId: string): Template | null {
    const allTemplates = this.getAllTemplates();
    return allTemplates.find(template => template.id === templateId) || null;
  }

  // Збільшення лічильника використання
  static incrementUsageCount(templateId: string): void {
    if (templateId.startsWith('builtin-')) {
      // Для вбудованих шаблонів зберігаємо статистику окремо
      const stats = JSON.parse(localStorage.getItem('fantasyWorldBuilder_templateStats') || '{}');
      stats[templateId] = (stats[templateId] || 0) + 1;
      localStorage.setItem('fantasyWorldBuilder_templateStats', JSON.stringify(stats));
    } else {
      // Для користувацьких шаблонів оновлюємо безпосередньо
      const customTemplates = this.getCustomTemplates();
      const templateIndex = customTemplates.findIndex(t => t.id === templateId);
      if (templateIndex !== -1) {
        customTemplates[templateIndex].usageCount++;
        this.saveCustomTemplates(customTemplates);
      }
    }
  }

  // Видалення користувацького шаблону
  static deleteTemplate(templateId: string): boolean {
    if (templateId.startsWith('builtin-')) {
      return false; // Не можна видаляти вбудовані шаблони
    }

    const customTemplates = this.getCustomTemplates();
    const filteredTemplates = customTemplates.filter(t => t.id !== templateId);
    
    if (filteredTemplates.length !== customTemplates.length) {
      this.saveCustomTemplates(filteredTemplates);
      return true;
    }
    
    return false;
  }

  // Оновлення шаблону
  static updateTemplate(templateId: string, updates: Partial<Template>): boolean {
    if (templateId.startsWith('builtin-')) {
      return false; // Не можна редагувати вбудовані шаблони
    }

    const customTemplates = this.getCustomTemplates();
    const templateIndex = customTemplates.findIndex(t => t.id === templateId);
    
    if (templateIndex !== -1) {
      customTemplates[templateIndex] = {
        ...customTemplates[templateIndex],
        ...updates,
        id: templateId, // Зберігаємо оригінальний ID
        isBuiltIn: false // Завжди false для користувацьких
      };
      this.saveCustomTemplates(customTemplates);
      return true;
    }
    
    return false;
  }

  // Фільтрація шаблонів
  static getTemplatesByCategory(category: Template['category']): Template[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  // Пошук шаблонів
  static searchTemplates(query: string): Template[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTemplates().filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Отримання популярних шаблонів
  static getPopularTemplates(limit: number = 5): Template[] {
    const stats = JSON.parse(localStorage.getItem('fantasyWorldBuilder_templateStats') || '{}');
    
    return this.getAllTemplates()
      .map(template => ({
        ...template,
        usageCount: template.isBuiltIn ? (stats[template.id] || 0) : template.usageCount
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // Експорт шаблонів
  static exportTemplates(): void {
    const customTemplates = this.getCustomTemplates();
    const exportData = {
      templates: customTemplates,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `fantasy-templates-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  // Імпорт шаблонів
  static async importTemplates(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (!importData.templates || !Array.isArray(importData.templates)) {
        throw new Error('Невірний формат файлу шаблонів');
      }

      const customTemplates = this.getCustomTemplates();
      const newTemplates = importData.templates.filter((template: Template) => 
        !customTemplates.some(existing => existing.name === template.name)
      );

      if (newTemplates.length > 0) {
        // Оновлюємо ID та дати для імпортованих шаблонів
        newTemplates.forEach((template: Template) => {
          template.id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          template.createdAt = new Date().toISOString();
          template.isBuiltIn = false;
        });

        const updatedTemplates = [...customTemplates, ...newTemplates];
        this.saveCustomTemplates(updatedTemplates);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error importing templates:', error);
      return false;
    }
  }

  // Очищення статистики
  static clearUsageStats(): void {
    localStorage.removeItem('fantasyWorldBuilder_templateStats');
  }
}

// Хук для роботи з шаблонами
export function useTemplates(category?: Template['category']) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTemplates = () => {
    setLoading(true);
    try {
      const allTemplates = TemplateManager.getAllTemplates();
      const filteredTemplates = category 
        ? allTemplates.filter(t => t.category === category)
        : allTemplates;
      
      setTemplates(filteredTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [category]);

  const createTemplate = (
    name: string,
    description: string,
    category: Template['category'],
    entityData: any,
    tags: string[] = []
  ) => {
    const template = TemplateManager.createTemplateFromEntity(name, description, category, entityData, tags);
    loadTemplates();
    return template;
  };

  const useTemplate = (templateId: string) => {
    const data = TemplateManager.useTemplate(templateId);
    loadTemplates(); // Оновлюємо для відображення нової статистики
    return data;
  };

  const deleteTemplate = (templateId: string) => {
    const success = TemplateManager.deleteTemplate(templateId);
    if (success) {
      loadTemplates();
    }
    return success;
  };

  const updateTemplate = (templateId: string, updates: Partial<Template>) => {
    const success = TemplateManager.updateTemplate(templateId, updates);
    if (success) {
      loadTemplates();
    }
    return success;
  };

  return {
    templates,
    loading,
    createTemplate,
    useTemplate,
    deleteTemplate,
    updateTemplate,
    refreshTemplates: loadTemplates
  };
}