# Sistema Плагінів - Розширена Документація

## Огляд

Fantasy World Builder має повноцінну систему плагінів, яка дозволяє розширяти функціональність застосунку без модифікації основного коду.

##架構

### Компоненти системи

1. **PluginManager** - Ядро системи, управління життєвим циклом плагінів
2. **PluginStore** - Магазин плагінів, каталог доступних розширень
3. **PluginAPI** - API для плагінів, доступ до можливостей додатку
4. **usePluginSystem** - React хук для роботи з плагінами

## Типи плагінів

### Категорії
- **generator** - Автоматичне створення контенту (імена, карти, світи)
- **exporter** - Експорт даних в різні формати (JSON, Markdown, PDF)
- **visualization** - Графіки, діаграми, інтерактивні візуалізації
- **utility** - Допоміжні інструменти (кидач кубиків, конвертори)
- **integration** - Синхронізація з зовнішніми сервісами (Notion, Google Drive)

## Структура маніфесту плагіну

```typescript
{
  "id": "my-plugin",
  "name": "Мой Плагин",
  "version": "1.0.0",
  "description": "Описание плагина",
  "author": "Автор",
  "apiVersion": "1.0.0",
  "minAppVersion": "1.0.0",
  "keywords": ["ключевые", "слова"],

  "extensionPoints": [
    {
      "id": "dashboard-widget",
      "type": "component",
      "target": "dashboard",
      "priority": 1
    }
  ],

  "permissions": [
    {
      "type": "storage",
      "description": "Доступ к локальному хранилищу",
      "required": true
    }
  ],

  "config": {
    "schema": {},
    "defaults": {},
    "ui": [
      {
        "key": "apiKey",
        "type": "text",
        "label": "API Key",
        "validation": "required"
      }
    ]
  }
}
```

## Plugin API

### Доступні сервіси

#### Storage API
```typescript
await api.storage.get(key)          // Отримати значення
await api.storage.set(key, value)   // Встановити значення
await api.storage.remove(key)       // Видалити значення
await api.storage.clear()           // Очистити все
await api.storage.keys()            // Отримати всі ключи
```

#### UI API
```typescript
api.ui.showNotification(msg, type)      // Показати сповіщення
await api.ui.showModal(component, props) // Показати модальне вікно
api.ui.addMenuItem(section, item)        // Додати пункт меню
api.ui.addToolbarButton(button)          // Додати кнопку в toolbar
api.ui.registerComponent(id, component)  // Зареєструвати компонент
```

#### Data API
```typescript
await api.data.getWorlds()                      // Всі світи
await api.data.getCurrentWorld()                // Поточний світ
await api.data.getCharacters(worldId)           // Персонажі світу
await api.data.getLore(worldId)                 // Лор світу
await api.data.getNotes(worldId)                // Нотатки світу
await api.data.createCharacter(worldId, data)   // Створити персонажа
await api.data.updateCharacter(id, data)        // Оновити персонажа
await api.data.deleteCharacter(id)              // Видалити персонажа
await api.data.search(query, types)             // Глобальний пошук
```

#### Events API
```typescript
api.events.on(event, handler)              // Слухати подію
api.events.off(event, handler)             // Припинити слухати
api.events.emit(event, data)               // Видати подію
api.events.onWorldChanged(handler)         // Світ змінився
api.events.onCharacterCreated(handler)     // Персонаж створений
api.events.onCharacterUpdated(handler)     // Персонаж оновлений
api.events.onCharacterDeleted(handler)     // Персонаж видалений
```

#### Utils API
```typescript
api.utils.generateId()              // Генерувати унікальний ID
api.utils.formatDate(date, format)  // Форматувати дату
api.utils.sanitizeHtml(html)        // Очистити HTML
api.utils.validateEmail(email)      // Валідувати email
api.utils.debounce(func, delay)     // Debounce функція
api.utils.throttle(func, delay)     // Throttle функція
```

## Приклад плагіну

### Simple Character Generator

```javascript
// manifest.json
{
  "id": "simple-char-gen",
  "name": "Простой генератор персонажей",
  "version": "1.0.0",
  "description": "Генерирует случайных персонажей",
  "author": "Developer",
  "apiVersion": "1.0.0",
  "minAppVersion": "1.0.0",
  "keywords": ["генератор", "персонаж"],
  "extensionPoints": [{
    "id": "char-gen-btn",
    "type": "component",
    "target": "dashboard",
    "priority": 1
  }],
  "permissions": [
    {"type": "storage", "required": true},
    {"type": "notifications", "required": false}
  ]
}

// plugin.js
const races = ['Людина', 'Ельф', 'Гнім', 'Напівельф'];
const classes = ['Воїн', 'Магістр', 'Розбійник', 'Священик'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

exports.activate = async (api) => {
  api.ui.addToolbarButton({
    id: 'gen-character',
    label: 'Генерувати персонажа',
    icon: '🎲',
    position: 'right',
    onClick: async () => {
      const world = await api.data.getCurrentWorld();
      if (!world) {
        api.ui.showNotification('Оберіть світ', 'warning');
        return;
      }

      const character = {
        name: `Персонаж ${api.utils.generateId().substr(0, 4)}`,
        race: getRandomElement(races),
        characterClass: getRandomElement(classes),
        description: 'Випадково генерований персонаж'
      };

      const id = await api.data.createCharacter(world.id, character);
      api.ui.showNotification('Персонаж створений!', 'success');
    }
  });
};

exports.deactivate = () => {
  console.log('Plugin deactivated');
};
```

## Управління плагінами

### Завантаження плагіну

```typescript
import { usePluginSystem } from '@/lib/pluginSystem';

const { loadPlugin } = usePluginSystem();

await loadPlugin({
  manifest: pluginManifest,
  code: pluginCode
});
```

### Активація/Деактивація

```typescript
const { togglePlugin } = usePluginSystem();

await togglePlugin(pluginId);
```

### Експорт/Імпорт

```typescript
const { exportPlugins, importPlugins } = usePluginSystem();

// Експорт
exportPlugins();

// Імпорт
const file = /* файл */;
await importPlugins(file);
```

## Статистика плагінів

```typescript
const { getStats } = usePluginSystem();

const stats = getStats();
console.log(`
  Total: ${stats.total}
  Active: ${stats.active}
  Errors: ${stats.errors}
  Avg Load Time: ${stats.avgLoadTime}ms
  Total Activations: ${stats.totalActivations}
`);
```

## Обробка помилок

### Проверка помилок

```typescript
const { getPluginsWithErrors } = usePluginSystem();

const errorPlugins = getPluginsWithErrors();
errorPlugins.forEach(plugin => {
  console.error(`${plugin.manifest.name}: ${plugin.lastError}`);
});
```

### Перезавантаження

```typescript
const { reloadPlugin } = usePluginSystem();

const success = await reloadPlugin(pluginId);
```

## Кращі практики

### 1. Обробка помилок
```javascript
exports.activate = async (api) => {
  try {
    // Ваш код
  } catch (error) {
    api.ui.showNotification(`Помилка: ${error.message}`, 'error');
  }
};
```

### 2. Асинхронні операції
```javascript
exports.activate = async (api) => {
  // Користуйтесь async/await
  const worlds = await api.data.getWorlds();
  const characters = await api.data.getCharacters(worlds[0].id);
};
```

### 3. Очищення ресурсів
```javascript
exports.deactivate = async () => {
  // Видаліть слухачі подій
  // Очистіть сховище
  // Остановіть таймери
};
```

### 4. Логування
```javascript
exports.activate = (api) => {
  console.log('Plugin activated');
  api.ui.showNotification('Плагін активирован', 'info');
};
```

## Безпека

### Дозволи плагінів

Система плагінів використовує модель дозволів:
- **storage** - Доступ до локального сховища
- **network** - Мережеві запити
- **filesystem** - Робота з файлами
- **notifications** - Показ сповіщень
- **clipboard** - Доступ до буфера обміну

### Ізоляція коду

Кожен плагін виконується в ізольованому контексті з обмеженим доступом до API.

## Розширення та плагіни спільноти

Магазин плагінів містить перевірені розширення від спільноти. Кожен плагін:
- ✅ Перевірено на безпеку
- ✅ Сумісно з поточною версією
- ✅ Протестовано на стабільність
- ✅ Задокументовано

## Розробка плагінів

### Локальне тестування

1. Створіть папку `plugins/my-plugin`
2. Додайте `manifest.json` та `plugin.js`
3. Завантажте в UI через Plugin Manager
4. Перевірте конзоль браузера на помилки

### Розповсюджування

1. Протестуйте на різних браузерах
2. Складіть README з документацією
3. Відправте на GitHub
4. Зареєструйте в Plugin Store

## Обмеження та обережності

- Плагіни виконуються з дозволами користувача
- Велики плагіни можуть знизити продуктивність
- Конфлікти залежностей слід уникати
- Тестуйте перед розповсюджуванням
