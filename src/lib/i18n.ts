// Система інтернаціоналізації для Fantasy World Builder

import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'uk' | 'en' | 'pl';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  uk: Translation;
  en: Translation;
  pl: Translation;
}

// Контекст для мови
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}>({
  language: 'uk',
  setLanguage: () => {},
  t: (key: string) => key
});

// Переклади
const translations: Translations = {
  uk: {
    // Загальні
    common: {
      save: 'Зберегти',
      cancel: 'Скасувати',
      delete: 'Видалити',
      edit: 'Редагувати',
      create: 'Створити',
      search: 'Пошук',
      back: 'Назад',
      next: 'Далі',
      previous: 'Попередній',
      close: 'Закрити',
      open: 'Відкрити',
      yes: 'Так',
      no: 'Ні',
      loading: 'Завантаження...',
      error: 'Помилка',
      success: 'Успіх',
      warning: 'Попередження',
      info: 'Інформація',
      name: 'Назва',
      description: 'Опис',
      image: 'Зображення',
      tags: 'Теги',
      type: 'Тип',
      status: 'Статус',
      date: 'Дата',
      author: 'Автор',
      version: 'Версія',
      settings: 'Налаштування',
      export: 'Експорт',
      import: 'Імпорт',
      all: 'Всі',
      none: 'Жодного',
      select: 'Обрати',
      clear: 'Очистити',
      reset: 'Скинути',
      refresh: 'Оновити',
      home: 'Головна'
    },

    // Заголовок
    header: {
      title: 'Fantasy World Builder',
      subtitle: 'Створювач фентезійних світів',
      search_placeholder: 'Пошук по всьому проекту...',
      save_tooltip: 'Зберегти дані',
      export_tooltip: 'Експортувати дані',
      sound_on: 'Вимкнути звук',
      sound_off: 'Увімкнути звук',
      name_generator: 'Генератор імен'
    },

    // Сайдбар
    sidebar: {
      current_world: 'Поточний світ:',
      sections: 'Розділи',
      characters: 'Персонажі',
      lore: 'Лор',
      chronology: 'Хронологія',
      maps: 'Карти світу',
      relationships: 'Зв\'язки',
      notes: 'Нотатки',
      scenarios: 'Сценарії',
      plugins: 'Плагіни',
      settings: 'Налаштування'
    },

    // Світи
    worlds: {
      title: 'Мої світи',
      create_world: 'Створити світ',
      create_first_world: 'Створити перший світ',
      select_world: 'Оберіть світ',
      world_name: 'Назва світу',
      world_description: 'Опис світу',
      world_name_placeholder: 'Введіть назву вашого фентезійного світу...',
      world_description_placeholder: 'Опишіть ваш світ: загальна атмосфера, ключові особливості, стиль...',
      created: 'Створено',
      modified: 'Змінено',
      no_worlds: 'Немає створених світів',
      welcome_title: 'Створити світ',
      welcome_description: 'Fantasy World Builder - це потужний інструмент для створення та управління фентезійними світами. Створюйте персонажів, будуйте історію, розробляйте магічні системи та керуйте складними взаємозв\'язками у ваших світах.'
    },

    // Персонажі
    characters: {
      title: 'Персонажі',
      create_character: 'Створити персонажа',
      create_first_character: 'Створити першого персонажа',
      character_name: 'Ім\'я персонажа',
      birth_date: 'Дата народження',
      birth_place: 'Місце народження',
      race: 'Раса',
      ethnicity: 'Етнічна приналежність',
      character_status: 'Статус',
      relatives: 'Родичі',
      character_class: 'Клас',
      character_description: 'Опис персонажа',
      character_image: 'Зображення персонажа',
      no_characters: 'У цьому світі ще немає персонажів',
      characters_not_found: 'Персонажів не знайдено',
      search_placeholder: 'Пошук персонажів...',
      filter_placeholder: 'Фільтр (раса, клас, статус)...',
      sort_by_name: 'За іменем',
      sort_by_race: 'За расою',
      sort_by_class: 'За класом',
      sort_by_created: 'За датою створення',
      delete_confirm: 'Ви впевнені, що хочете видалити персонажа "{name}"?',
      basic_info: 'Основна інформація',
      detailed_info: 'Детальна інформація',
      locations_on_maps: 'Локації на картах'
    },

    // Лор
    lore: {
      title: 'Лор',
      select_section: 'Оберіть розділ лору для роботи',
      races: 'Раси',
      races_desc: 'Різні раси вашого світу',
      bestiary: 'Бестіарій',
      bestiary_desc: 'Істоти та монстри',
      geography: 'Географія',
      geography_desc: 'Локації та місця',
      history: 'Історія',
      history_desc: 'Важливі історичні події',
      politics: 'Політика',
      politics_desc: 'Політичні структури',
      religion: 'Релігія і міфологія',
      religion_desc: 'Віри та міфи',
      languages: 'Писемність, мови і літочислення',
      languages_desc: 'Мови та писемність',
      magic: 'Магія',
      magic_desc: 'Магічні системи',
      artifacts: 'Артефакти',
      artifacts_desc: 'Магічні предмети',
      create_race: 'Створити расу',
      create_creature: 'Створити істоту',
      create_location: 'Створити локацію',
      create_event: 'Створити подію',
      create_structure: 'Створити структуру',
      create_belief: 'Створити віру',
      create_language: 'Створити мову',
      create_magic: 'Створити магію',
      create_artifact: 'Створити артефакт',
      no_entries: 'Немає записів у розділі {section}',
      create_first_entry: 'Створити перший запис'
    },

    // Хронологія
    chronology: {
      title: 'Хронологія',
      subtitle: 'Управляйте часовими лініями вашого світу',
      create_chronology: 'Створити хронологію',
      create_first_chronology: 'Створити першу хронологію',
      chronology_name: 'Назва хронології',
      chronology_description: 'Опис хронології',
      no_chronologies: 'Немає створених хронологій',
      chronologies_not_found: 'Хронологій не знайдено',
      search_placeholder: 'Пошук хронологій...',
      add_event: 'Додати подію',
      event_name: 'Назва події',
      event_year: 'Рік',
      event_type: 'Тип події',
      event_description: 'Опис події',
      related_locations: 'Пов\'язані локації',
      related_characters: 'Пов\'язані персонажі',
      event_types: {
        battles: 'Битви',
        states: 'Створення/знищення держав',
        characters: 'Народження/смерть персонажів',
        magic: 'Магічні події',
        other: 'Інші події'
      }
    },

    // Карти
    maps: {
      title: 'Карти світу',
      subtitle: 'Створюйте та керуйте картами вашого фентезійного світу',
      create_map: 'Створити карту',
      create_first_map: 'Створити першу карту',
      map_name: 'Назва карти',
      map_description: 'Опис карти',
      map_image: 'Зображення карти',
      map_width: 'Ширина (px)',
      map_height: 'Висота (px)',
      public_map: 'Публічна карта',
      no_maps: 'Немає створених карт',
      maps_not_found: 'Карт не знайдено',
      search_placeholder: 'Пошук карт...',
      total_maps: 'Всього карт',
      markers_on_maps: 'Маркерів на картах',
      public_maps: 'Публічних карт',
      add_marker: 'Додати маркер',
      marker_name: 'Назва маркера',
      marker_entity: 'Назва сутності',
      marker_description: 'Опис маркера',
      marker_color: 'Колір',
      marker_size: 'Розмір',
      marker_types: {
        location: 'Локація',
        character: 'Персонаж',
        event: 'Подія',
        lore: 'Знання'
      },
      marker_sizes: {
        small: 'Малий',
        medium: 'Середній',
        large: 'Великий'
      }
    },

    // Зв'язки
    relationships: {
      title: 'Зв\'язки',
      subtitle: 'Управляйте зв\'язками між елементами вашого світу',
      create_relationship: 'Створити зв\'язок',
      create_first_relationship: 'Створити перший зв\'язок',
      source: 'Джерело зв\'язку',
      target: 'Ціль зв\'язку',
      relationship_type: 'Тип зв\'язку',
      relationship_description: 'Опис зв\'язку',
      strength: 'Сила зв\'язку',
      relationship_status: 'Статус зв\'язку',
      start_date: 'Дата початку',
      end_date: 'Дата кінця',
      secret_relationship: 'Секретний зв\'язок',
      no_relationships: 'Немає створених зв\'язків',
      relationships_not_found: 'Зв\'язків не знайдено',
      search_placeholder: 'Пошук зв\'язків...',
      total_relationships: 'Всього зв\'язків',
      active_relationships: 'Активних',
      secret_relationships: 'Секретних',
      entity_types: {
        character: 'Персонаж',
        location: 'Локація',
        event: 'Подія',
        lore: 'Лор'
      },
      strengths: {
        weak: 'Слабкий',
        medium: 'Середній',
        strong: 'Сильний'
      },
      statuses: {
        active: 'Активний',
        inactive: 'Неактивний',
        broken: 'Розірваний'
      }
    },

    // Нотатки
    notes: {
      title: 'Нотатки',
      subtitle: 'Організуйте свої ідеї та записи',
      create_note: 'Створити нотатку',
      create_first_note: 'Створити першу нотатку',
      note_title: 'Назва нотатки',
      note_content: 'Вміст нотатки',
      note_category: 'Категорія',
      no_notes: 'Немає створених нотаток',
      notes_not_found: 'Нотаток не знайдено',
      search_placeholder: 'Пошук нотаток...',
      categories: {
        all: 'Всі нотатки',
        ideas: 'Ідеї',
        plot: 'Сюжет',
        world: 'Світобудова',
        characters: 'Персонажі',
        quests: 'Квести',
        other: 'Інше'
      }
    },

    // Сценарії
    scenarios: {
      title: 'Сценарії',
      create_scenario: 'Створити сценарій',
      create_first_scenario: 'Створити перший сценарій',
      scenario_title: 'Назва сценарію',
      scenario_description: 'Опис сценарію',
      scenario_type: 'Тип сценарію',
      difficulty: 'Складність',
      scenario_status: 'Статус сценарію',
      estimated_duration: 'Орієнтовна тривалість',
      player_count: 'Кількість гравців',
      no_scenarios: 'Створіть перший сценарій',
      scenarios_not_found: 'Сценаріїв не знайдено',
      search_placeholder: 'Пошук сценаріїв...',
      types: {
        adventure: 'Пригода',
        campaign: 'Кампанія',
        oneshot: 'Разова гра',
        sidequest: 'Побічний квест'
      },
      difficulties: {
        easy: 'Легкий',
        medium: 'Середній',
        hard: 'Складний',
        extreme: 'Екстремальний'
      },
      statuses: {
        draft: 'Чернетка',
        active: 'Активний',
        completed: 'Завершений',
        paused: 'Призупинений'
      }
    },

    // Налаштування
    settings: {
      title: 'Налаштування',
      subtitle: 'Персоналізуйте ваш досвід роботи з Fantasy World Builder',
      general: 'Загальні',
      database: 'База даних',
      plugins: 'Плагіни',
      store: 'Магазин',
      developer: 'Розробка',
      appearance: 'Зовнішній вигляд',
      theme: 'Тема інтерфейсу',
      theme_dark: 'Темна',
      theme_light: 'Світла',
      theme_auto: 'Автоматично',
      animations: 'Показувати анімації та переходи',
      compact_mode: 'Компактний режим (менші відступи)',
      sound_effects: 'Звукові ефекти',
      enable_sound: 'Увімкнути звукові ефекти',
      language: 'Мова інтерфейсу',
      autosave: 'Автозбереження',
      enable_autosave: 'Увімкнути автоматичне збереження',
      autosave_interval: 'Інтервал збереження: {minutes} хв',
      data_management: 'Управління даними',
      advanced_export: 'Розширений експорт',
      import_data: 'Імпортувати дані',
      reset_settings: 'Скинути налаштування',
      clear_all_data: 'Очистити всі дані',
      version_info: 'Версія 1.0.0 • Створено з ❤️ для фентезійних світів'
    },

    // Плагіни
    plugins: {
      title: 'Менеджер плагінів',
      subtitle: 'Розширюйте функціональність додатку',
      store_title: 'Магазин плагінів',
      store_subtitle: 'Розширюйте можливості Fantasy World Builder',
      developer_title: 'Розробка плагінів',
      developer_subtitle: 'Створюйте власні розширення для Fantasy World Builder',
      install: 'Встановити',
      uninstall: 'Видалити',
      enable: 'Увімкнути',
      disable: 'Вимкнути',
      installed: 'Встановлено',
      active: 'Активний',
      inactive: 'Неактивний',
      error: 'Помилка',
      no_plugins: 'Немає встановлених плагінів',
      install_first: 'Встановити перший плагін',
      search_placeholder: 'Пошук плагінів...',
      builtin_plugins: 'Вбудовані плагіни',
      installed_plugins: 'Встановлені плагіни',
      plugin_details: 'Деталі плагіну',
      permissions: 'Дозволи',
      usage_stats: 'Статистика використання',
      activations: 'Активацій',
      errors: 'Помилок',
      load_time: 'мс',
      categories: {
        generator: 'Генератори',
        exporter: 'Експортери',
        visualization: 'Візуалізація',
        utility: 'Утіліти',
        integration: 'Інтеграції'
      }
    },

    // Пошук
    search: {
      global_search: 'Глобальний пошук',
      start_typing: 'Почніть вводити для пошуку по всьому проекту',
      search_description: 'Пошук працює по персонажах, лорі, хронології, нотатках, зв\'язках, картах та сценаріях',
      nothing_found: 'Нічого не знайдено за запитом "{query}"',
      try_different: 'Спробуйте інші ключові слова або перевірте правопис',
      results_found: 'Знайдено {count} результат{plural}',
      navigation_help: '↑↓ навігація • Enter вибрати • Esc закрити'
    },

    // Помилки та повідомлення
    messages: {
      data_saved: 'Дані збережено!',
      data_exported: 'Дані експортовано!',
      auto_saved: 'Дані автоматично збережено',
      autosave_error: 'Помилка автозбереження: {error}',
      select_world_first: 'Оберіть світ для роботи з {section}',
      confirm_delete: 'Видалити {item}?',
      confirm_delete_all: 'Це видалить ВСІ дані застосунку назавжди. Ви впевнені?',
      last_warning: 'Останнє попередження! Всі світи, персонажі та дані будуть втрачені!',
      migration_complete: 'Міграція завершена успішно! Ваші дані тепер зберігаються в IndexedDB для кращої продуктивності.',
      backup_created: 'Резервну копію створено успішно!',
      data_imported: 'Дані імпортовано успішно!',
      plugin_installed: 'Плагін "{name}" встановлено успішно!',
      plugin_error: 'Помилка встановлення плагіну'
    }
  },

  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      name: 'Name',
      description: 'Description',
      image: 'Image',
      tags: 'Tags',
      type: 'Type',
      status: 'Status',
      date: 'Date',
      author: 'Author',
      version: 'Version',
      settings: 'Settings',
      export: 'Export',
      import: 'Import',
      all: 'All',
      none: 'None',
      select: 'Select',
      clear: 'Clear',
      reset: 'Reset',
      refresh: 'Refresh',
      home: 'Home'
    },

    // Header
    header: {
      title: 'Fantasy World Builder',
      subtitle: 'Fantasy World Creator',
      search_placeholder: 'Search across entire project...',
      save_tooltip: 'Save data',
      export_tooltip: 'Export data',
      sound_on: 'Turn off sound',
      sound_off: 'Turn on sound',
      name_generator: 'Name Generator'
    },

    // Sidebar
    sidebar: {
      current_world: 'Current world:',
      sections: 'Sections',
      characters: 'Characters',
      lore: 'Lore',
      chronology: 'Chronology',
      maps: 'World Maps',
      relationships: 'Relationships',
      notes: 'Notes',
      scenarios: 'Scenarios',
      plugins: 'Plugins',
      settings: 'Settings'
    },

    // Worlds
    worlds: {
      title: 'My Worlds',
      create_world: 'Create World',
      create_first_world: 'Create First World',
      select_world: 'Select World',
      world_name: 'World Name',
      world_description: 'World Description',
      world_name_placeholder: 'Enter your fantasy world name...',
      world_description_placeholder: 'Describe your world: general atmosphere, key features, style...',
      created: 'Created',
      modified: 'Modified',
      no_worlds: 'No worlds created',
      welcome_title: 'Create World',
      welcome_description: 'Fantasy World Builder is a powerful tool for creating and managing fantasy worlds. Create characters, build history, develop magic systems and manage complex relationships in your worlds.'
    },

    // Characters
    characters: {
      title: 'Characters',
      create_character: 'Create Character',
      create_first_character: 'Create First Character',
      character_name: 'Character Name',
      birth_date: 'Birth Date',
      birth_place: 'Birth Place',
      race: 'Race',
      ethnicity: 'Ethnicity',
      character_status: 'Status',
      relatives: 'Relatives',
      character_class: 'Class',
      character_description: 'Character Description',
      character_image: 'Character Image',
      no_characters: 'No characters in this world yet',
      characters_not_found: 'No characters found',
      search_placeholder: 'Search characters...',
      filter_placeholder: 'Filter (race, class, status)...',
      sort_by_name: 'By Name',
      sort_by_race: 'By Race',
      sort_by_class: 'By Class',
      sort_by_created: 'By Creation Date',
      delete_confirm: 'Are you sure you want to delete character "{name}"?',
      basic_info: 'Basic Information',
      detailed_info: 'Detailed Information',
      locations_on_maps: 'Locations on Maps'
    },

    // Lore
    lore: {
      title: 'Lore',
      select_section: 'Select a lore section to work with',
      races: 'Races',
      races_desc: 'Different races of your world',
      bestiary: 'Bestiary',
      bestiary_desc: 'Creatures and monsters',
      geography: 'Geography',
      geography_desc: 'Locations and places',
      history: 'History',
      history_desc: 'Important historical events',
      politics: 'Politics',
      politics_desc: 'Political structures',
      religion: 'Religion & Mythology',
      religion_desc: 'Beliefs and myths',
      languages: 'Writing, Languages & Calendar',
      languages_desc: 'Languages and writing systems',
      magic: 'Magic',
      magic_desc: 'Magic systems',
      artifacts: 'Artifacts',
      artifacts_desc: 'Magical items',
      create_race: 'Create Race',
      create_creature: 'Create Creature',
      create_location: 'Create Location',
      create_event: 'Create Event',
      create_structure: 'Create Structure',
      create_belief: 'Create Belief',
      create_language: 'Create Language',
      create_magic: 'Create Magic',
      create_artifact: 'Create Artifact',
      no_entries: 'No entries in {section} section',
      create_first_entry: 'Create first entry'
    },

    // Chronology
    chronology: {
      title: 'Chronology',
      subtitle: 'Manage timelines of your world',
      create_chronology: 'Create Chronology',
      create_first_chronology: 'Create First Chronology',
      chronology_name: 'Chronology Name',
      chronology_description: 'Chronology Description',
      no_chronologies: 'No chronologies created',
      chronologies_not_found: 'No chronologies found',
      search_placeholder: 'Search chronologies...',
      add_event: 'Add Event',
      event_name: 'Event Name',
      event_year: 'Year',
      event_type: 'Event Type',
      event_description: 'Event Description',
      related_locations: 'Related Locations',
      related_characters: 'Related Characters',
      event_types: {
        battles: 'Battles',
        states: 'State Creation/Destruction',
        characters: 'Character Birth/Death',
        magic: 'Magical Events',
        other: 'Other Events'
      }
    },

    // Maps
    maps: {
      title: 'World Maps',
      subtitle: 'Create and manage maps of your fantasy world',
      create_map: 'Create Map',
      create_first_map: 'Create First Map',
      map_name: 'Map Name',
      map_description: 'Map Description',
      map_image: 'Map Image',
      map_width: 'Width (px)',
      map_height: 'Height (px)',
      public_map: 'Public Map',
      no_maps: 'No maps created',
      maps_not_found: 'No maps found',
      search_placeholder: 'Search maps...',
      total_maps: 'Total Maps',
      markers_on_maps: 'Markers on Maps',
      public_maps: 'Public Maps',
      add_marker: 'Add Marker',
      marker_name: 'Marker Name',
      marker_entity: 'Entity Name',
      marker_description: 'Marker Description',
      marker_color: 'Color',
      marker_size: 'Size',
      marker_types: {
        location: 'Location',
        character: 'Character',
        event: 'Event',
        lore: 'Lore'
      },
      marker_sizes: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
      }
    },

    // Relationships
    relationships: {
      title: 'Relationships',
      subtitle: 'Manage relationships between elements of your world',
      create_relationship: 'Create Relationship',
      create_first_relationship: 'Create First Relationship',
      source: 'Relationship Source',
      target: 'Relationship Target',
      relationship_type: 'Relationship Type',
      relationship_description: 'Relationship Description',
      strength: 'Relationship Strength',
      relationship_status: 'Relationship Status',
      start_date: 'Start Date',
      end_date: 'End Date',
      secret_relationship: 'Secret Relationship',
      no_relationships: 'No relationships created',
      relationships_not_found: 'No relationships found',
      search_placeholder: 'Search relationships...',
      total_relationships: 'Total Relationships',
      active_relationships: 'Active',
      secret_relationships: 'Secret',
      entity_types: {
        character: 'Character',
        location: 'Location',
        event: 'Event',
        lore: 'Lore'
      },
      strengths: {
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong'
      },
      statuses: {
        active: 'Active',
        inactive: 'Inactive',
        broken: 'Broken'
      }
    },

    // Notes
    notes: {
      title: 'Notes',
      subtitle: 'Organize your ideas and records',
      create_note: 'Create Note',
      create_first_note: 'Create First Note',
      note_title: 'Note Title',
      note_content: 'Note Content',
      note_category: 'Category',
      no_notes: 'No notes created',
      notes_not_found: 'No notes found',
      search_placeholder: 'Search notes...',
      categories: {
        all: 'All Notes',
        ideas: 'Ideas',
        plot: 'Plot',
        world: 'Worldbuilding',
        characters: 'Characters',
        quests: 'Quests',
        other: 'Other'
      }
    },

    // Scenarios
    scenarios: {
      title: 'Scenarios',
      create_scenario: 'Create Scenario',
      create_first_scenario: 'Create First Scenario',
      scenario_title: 'Scenario Title',
      scenario_description: 'Scenario Description',
      scenario_type: 'Scenario Type',
      difficulty: 'Difficulty',
      scenario_status: 'Scenario Status',
      estimated_duration: 'Estimated Duration',
      player_count: 'Player Count',
      no_scenarios: 'Create first scenario',
      scenarios_not_found: 'No scenarios found',
      search_placeholder: 'Search scenarios...',
      types: {
        adventure: 'Adventure',
        campaign: 'Campaign',
        oneshot: 'One-shot',
        sidequest: 'Side Quest'
      },
      difficulties: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        extreme: 'Extreme'
      },
      statuses: {
        draft: 'Draft',
        active: 'Active',
        completed: 'Completed',
        paused: 'Paused'
      }
    },

    // Settings
    settings: {
      title: 'Settings',
      subtitle: 'Personalize your Fantasy World Builder experience',
      general: 'General',
      database: 'Database',
      plugins: 'Plugins',
      store: 'Store',
      developer: 'Development',
      appearance: 'Appearance',
      theme: 'Interface Theme',
      theme_dark: 'Dark',
      theme_light: 'Light',
      theme_auto: 'Automatic',
      animations: 'Show animations and transitions',
      compact_mode: 'Compact mode (smaller spacing)',
      sound_effects: 'Sound Effects',
      enable_sound: 'Enable sound effects',
      language: 'Interface Language',
      autosave: 'Auto-save',
      enable_autosave: 'Enable automatic saving',
      autosave_interval: 'Save interval: {minutes} min',
      data_management: 'Data Management',
      advanced_export: 'Advanced Export',
      import_data: 'Import Data',
      reset_settings: 'Reset Settings',
      clear_all_data: 'Clear All Data',
      version_info: 'Version 1.0.0 • Made with ❤️ for fantasy worlds'
    },

    // Plugins
    plugins: {
      title: 'Plugin Manager',
      subtitle: 'Extend application functionality',
      store_title: 'Plugin Store',
      store_subtitle: 'Extend Fantasy World Builder capabilities',
      developer_title: 'Plugin Development',
      developer_subtitle: 'Create custom extensions for Fantasy World Builder',
      install: 'Install',
      uninstall: 'Remove',
      enable: 'Enable',
      disable: 'Disable',
      installed: 'Installed',
      active: 'Active',
      inactive: 'Inactive',
      error: 'Error',
      no_plugins: 'No plugins installed',
      install_first: 'Install first plugin',
      search_placeholder: 'Search plugins...',
      builtin_plugins: 'Built-in Plugins',
      installed_plugins: 'Installed Plugins',
      plugin_details: 'Plugin Details',
      permissions: 'Permissions',
      usage_stats: 'Usage Statistics',
      activations: 'Activations',
      errors: 'Errors',
      load_time: 'ms',
      categories: {
        generator: 'Generators',
        exporter: 'Exporters',
        visualization: 'Visualization',
        utility: 'Utilities',
        integration: 'Integrations'
      }
    },

    // Search
    search: {
      global_search: 'Global Search',
      start_typing: 'Start typing to search across entire project',
      search_description: 'Search works across characters, lore, chronology, notes, relationships, maps and scenarios',
      nothing_found: 'Nothing found for query "{query}"',
      try_different: 'Try different keywords or check spelling',
      results_found: 'Found {count} result{plural}',
      navigation_help: '↑↓ navigate • Enter select • Esc close'
    },

    // Messages
    messages: {
      data_saved: 'Data saved!',
      data_exported: 'Data exported!',
      auto_saved: 'Data automatically saved',
      autosave_error: 'Auto-save error: {error}',
      select_world_first: 'Select a world to work with {section}',
      confirm_delete: 'Delete {item}?',
      confirm_delete_all: 'This will delete ALL application data forever. Are you sure?',
      last_warning: 'Last warning! All worlds, characters and data will be lost!',
      migration_complete: 'Migration completed successfully! Your data is now stored in IndexedDB for better performance.',
      backup_created: 'Backup created successfully!',
      data_imported: 'Data imported successfully!',
      plugin_installed: 'Plugin "{name}" installed successfully!',
      plugin_error: 'Plugin installation error'
    }
  },

  pl: {
    // Common
    common: {
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      edit: 'Edytuj',
      create: 'Utwórz',
      search: 'Szukaj',
      back: 'Wstecz',
      next: 'Dalej',
      previous: 'Poprzedni',
      close: 'Zamknij',
      open: 'Otwórz',
      yes: 'Tak',
      no: 'Nie',
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      warning: 'Ostrzeżenie',
      info: 'Informacja',
      name: 'Nazwa',
      description: 'Opis',
      image: 'Obraz',
      tags: 'Tagi',
      type: 'Typ',
      status: 'Status',
      date: 'Data',
      author: 'Autor',
      version: 'Wersja',
      settings: 'Ustawienia',
      export: 'Eksport',
      import: 'Import',
      all: 'Wszystkie',
      none: 'Żadne',
      select: 'Wybierz',
      clear: 'Wyczyść',
      reset: 'Resetuj',
      refresh: 'Odśwież',
      home: 'Główna'
    },

    // Header
    header: {
      title: 'Fantasy World Builder',
      subtitle: 'Kreator Światów Fantasy',
      search_placeholder: 'Szukaj w całym projekcie...',
      save_tooltip: 'Zapisz dane',
      export_tooltip: 'Eksportuj dane',
      sound_on: 'Wyłącz dźwięk',
      sound_off: 'Włącz dźwięk',
      name_generator: 'Generator Imion'
    },

    // Sidebar
    sidebar: {
      current_world: 'Aktualny świat:',
      sections: 'Sekcje',
      characters: 'Postacie',
      lore: 'Wiedza',
      chronology: 'Chronologia',
      maps: 'Mapy Świata',
      relationships: 'Relacje',
      notes: 'Notatki',
      scenarios: 'Scenariusze',
      plugins: 'Wtyczki',
      settings: 'Ustawienia'
    },

    // Worlds
    worlds: {
      title: 'Moje Światy',
      create_world: 'Utwórz Świat',
      create_first_world: 'Utwórz Pierwszy Świat',
      select_world: 'Wybierz Świat',
      world_name: 'Nazwa Świata',
      world_description: 'Opis Świata',
      world_name_placeholder: 'Wprowadź nazwę swojego fantasy świata...',
      world_description_placeholder: 'Opisz swój świat: ogólna atmosfera, kluczowe cechy, styl...',
      created: 'Utworzono',
      modified: 'Zmodyfikowano',
      no_worlds: 'Brak utworzonych światów',
      welcome_title: 'Utwórz Świat',
      welcome_description: 'Fantasy World Builder to potężne narzędzie do tworzenia i zarządzania światami fantasy. Twórz postacie, buduj historię, rozwijaj systemy magii i zarządzaj złożonymi relacjami w swoich światach.'
    },

    // Characters
    characters: {
      title: 'Postacie',
      create_character: 'Utwórz Postać',
      create_first_character: 'Utwórz Pierwszą Postać',
      character_name: 'Imię Postaci',
      birth_date: 'Data Urodzenia',
      birth_place: 'Miejsce Urodzenia',
      race: 'Rasa',
      ethnicity: 'Pochodzenie Etniczne',
      character_status: 'Status',
      relatives: 'Krewni',
      character_class: 'Klasa',
      character_description: 'Opis Postaci',
      character_image: 'Obraz Postaci',
      no_characters: 'Brak postaci w tym świecie',
      characters_not_found: 'Nie znaleziono postaci',
      search_placeholder: 'Szukaj postaci...',
      filter_placeholder: 'Filtr (rasa, klasa, status)...',
      sort_by_name: 'Według Imienia',
      sort_by_race: 'Według Rasy',
      sort_by_class: 'Według Klasy',
      sort_by_created: 'Według Daty Utworzenia',
      delete_confirm: 'Czy na pewno chcesz usunąć postać "{name}"?',
      basic_info: 'Podstawowe Informacje',
      detailed_info: 'Szczegółowe Informacje',
      locations_on_maps: 'Lokalizacje na Mapach'
    },

    // Lore
    lore: {
      title: 'Wiedza',
      select_section: 'Wybierz sekcję wiedzy do pracy',
      races: 'Rasy',
      races_desc: 'Różne rasy twojego świata',
      bestiary: 'Bestiariusz',
      bestiary_desc: 'Stworzenia i potwory',
      geography: 'Geografia',
      geography_desc: 'Lokacje i miejsca',
      history: 'Historia',
      history_desc: 'Ważne wydarzenia historyczne',
      politics: 'Polityka',
      politics_desc: 'Struktury polityczne',
      religion: 'Religia i Mitologia',
      religion_desc: 'Wierzenia i mity',
      languages: 'Pismo, Języki i Kalendarz',
      languages_desc: 'Języki i systemy pisma',
      magic: 'Magia',
      magic_desc: 'Systemy magii',
      artifacts: 'Artefakty',
      artifacts_desc: 'Magiczne przedmioty',
      create_race: 'Utwórz Rasę',
      create_creature: 'Utwórz Stworzenie',
      create_location: 'Utwórz Lokację',
      create_event: 'Utwórz Wydarzenie',
      create_structure: 'Utwórz Strukturę',
      create_belief: 'Utwórz Wierzenie',
      create_language: 'Utwórz Język',
      create_magic: 'Utwórz Magię',
      create_artifact: 'Utwórz Artefakt',
      no_entries: 'Brak wpisów w sekcji {section}',
      create_first_entry: 'Utwórz pierwszy wpis'
    },

    // Chronology
    chronology: {
      title: 'Chronologia',
      subtitle: 'Zarządzaj liniami czasowymi swojego świata',
      create_chronology: 'Utwórz Chronologię',
      create_first_chronology: 'Utwórz Pierwszą Chronologię',
      chronology_name: 'Nazwa Chronologii',
      chronology_description: 'Opis Chronologii',
      no_chronologies: 'Brak utworzonych chronologii',
      chronologies_not_found: 'Nie znaleziono chronologii',
      search_placeholder: 'Szukaj chronologii...',
      add_event: 'Dodaj Wydarzenie',
      event_name: 'Nazwa Wydarzenia',
      event_year: 'Rok',
      event_type: 'Typ Wydarzenia',
      event_description: 'Opis Wydarzenia',
      related_locations: 'Powiązane Lokacje',
      related_characters: 'Powiązane Postacie',
      event_types: {
        battles: 'Bitwy',
        states: 'Tworzenie/Zniszczenie Państw',
        characters: 'Narodziny/Śmierć Postaci',
        magic: 'Wydarzenia Magiczne',
        other: 'Inne Wydarzenia'
      }
    },

    // Maps
    maps: {
      title: 'Mapy Świata',
      subtitle: 'Twórz i zarządzaj mapami swojego fantasy świata',
      create_map: 'Utwórz Mapę',
      create_first_map: 'Utwórz Pierwszą Mapę',
      map_name: 'Nazwa Mapy',
      map_description: 'Opis Mapy',
      map_image: 'Obraz Mapy',
      map_width: 'Szerokość (px)',
      map_height: 'Wysokość (px)',
      public_map: 'Mapa Publiczna',
      no_maps: 'Brak utworzonych map',
      maps_not_found: 'Nie znaleziono map',
      search_placeholder: 'Szukaj map...',
      total_maps: 'Wszystkich Map',
      markers_on_maps: 'Znaczników na Mapach',
      public_maps: 'Map Publicznych',
      add_marker: 'Dodaj Znacznik',
      marker_name: 'Nazwa Znacznika',
      marker_entity: 'Nazwa Encji',
      marker_description: 'Opis Znacznika',
      marker_color: 'Kolor',
      marker_size: 'Rozmiar',
      marker_types: {
        location: 'Lokacja',
        character: 'Postać',
        event: 'Wydarzenie',
        lore: 'Wiedza'
      },
      marker_sizes: {
        small: 'Mały',
        medium: 'Średni',
        large: 'Duży'
      }
    },

    // Relationships
    relationships: {
      title: 'Relacje',
      subtitle: 'Zarządzaj relacjami między elementami swojego świata',
      create_relationship: 'Utwórz Relację',
      create_first_relationship: 'Utwórz Pierwszą Relację',
      source: 'Źródło Relacji',
      target: 'Cel Relacji',
      relationship_type: 'Typ Relacji',
      relationship_description: 'Opis Relacji',
      strength: 'Siła Relacji',
      relationship_status: 'Status Relacji',
      start_date: 'Data Rozpoczęcia',
      end_date: 'Data Zakończenia',
      secret_relationship: 'Tajna Relacja',
      no_relationships: 'Brak utworzonych relacji',
      relationships_not_found: 'Nie znaleziono relacji',
      search_placeholder: 'Szukaj relacji...',
      total_relationships: 'Wszystkich Relacji',
      active_relationships: 'Aktywnych',
      secret_relationships: 'Tajnych',
      entity_types: {
        character: 'Postać',
        location: 'Lokacja',
        event: 'Wydarzenie',
        lore: 'Wiedza'
      },
      strengths: {
        weak: 'Słaba',
        medium: 'Średnia',
        strong: 'Silna'
      },
      statuses: {
        active: 'Aktywna',
        inactive: 'Nieaktywna',
        broken: 'Zerwana'
      }
    },

    // Notes
    notes: {
      title: 'Notatki',
      subtitle: 'Organizuj swoje pomysły i zapiski',
      create_note: 'Utwórz Notatkę',
      create_first_note: 'Utwórz Pierwszą Notatkę',
      note_title: 'Tytuł Notatki',
      note_content: 'Treść Notatki',
      note_category: 'Kategoria',
      no_notes: 'Brak utworzonych notatek',
      notes_not_found: 'Nie znaleziono notatek',
      search_placeholder: 'Szukaj notatek...',
      categories: {
        all: 'Wszystkie Notatki',
        ideas: 'Pomysły',
        plot: 'Fabuła',
        world: 'Światotwórstwo',
        characters: 'Postacie',
        quests: 'Questy',
        other: 'Inne'
      }
    },

    // Scenarios
    scenarios: {
      title: 'Scenariusze',
      create_scenario: 'Utwórz Scenariusz',
      create_first_scenario: 'Utwórz Pierwszy Scenariusz',
      scenario_title: 'Tytuł Scenariusza',
      scenario_description: 'Opis Scenariusza',
      scenario_type: 'Typ Scenariusza',
      difficulty: 'Trudność',
      scenario_status: 'Status Scenariusza',
      estimated_duration: 'Szacowany Czas Trwania',
      player_count: 'Liczba Graczy',
      no_scenarios: 'Utwórz pierwszy scenariusz',
      scenarios_not_found: 'Nie znaleziono scenariuszy',
      search_placeholder: 'Szukaj scenariuszy...',
      types: {
        adventure: 'Przygoda',
        campaign: 'Kampania',
        oneshot: 'Jednorazowa Gra',
        sidequest: 'Poboczny Quest'
      },
      difficulties: {
        easy: 'Łatwy',
        medium: 'Średni',
        hard: 'Trudny',
        extreme: 'Ekstremalny'
      },
      statuses: {
        draft: 'Szkic',
        active: 'Aktywny',
        completed: 'Ukończony',
        paused: 'Wstrzymany'
      }
    },

    // Settings
    settings: {
      title: 'Ustawienia',
      subtitle: 'Spersonalizuj swoje doświadczenie z Fantasy World Builder',
      general: 'Ogólne',
      database: 'Baza Danych',
      plugins: 'Wtyczki',
      store: 'Sklep',
      developer: 'Rozwój',
      appearance: 'Wygląd',
      theme: 'Motyw Interfejsu',
      theme_dark: 'Ciemny',
      theme_light: 'Jasny',
      theme_auto: 'Automatyczny',
      animations: 'Pokaż animacje i przejścia',
      compact_mode: 'Tryb kompaktowy (mniejsze odstępy)',
      sound_effects: 'Efekty Dźwiękowe',
      enable_sound: 'Włącz efekty dźwiękowe',
      language: 'Język Interfejsu',
      autosave: 'Automatyczny Zapis',
      enable_autosave: 'Włącz automatyczny zapis',
      autosave_interval: 'Interwał zapisu: {minutes} min',
      data_management: 'Zarządzanie Danymi',
      advanced_export: 'Zaawansowany Eksport',
      import_data: 'Importuj Dane',
      reset_settings: 'Resetuj Ustawienia',
      clear_all_data: 'Wyczyść Wszystkie Dane',
      version_info: 'Wersja 1.0.0 • Stworzone z ❤️ dla światów fantasy'
    },

    // Plugins
    plugins: {
      title: 'Menedżer Wtyczek',
      subtitle: 'Rozszerz funkcjonalność aplikacji',
      store_title: 'Sklep Wtyczek',
      store_subtitle: 'Rozszerz możliwości Fantasy World Builder',
      developer_title: 'Rozwój Wtyczek',
      developer_subtitle: 'Twórz niestandardowe rozszerzenia dla Fantasy World Builder',
      install: 'Zainstaluj',
      uninstall: 'Usuń',
      enable: 'Włącz',
      disable: 'Wyłącz',
      installed: 'Zainstalowane',
      active: 'Aktywne',
      inactive: 'Nieaktywne',
      error: 'Błąd',
      no_plugins: 'Brak zainstalowanych wtyczek',
      install_first: 'Zainstaluj pierwszą wtyczkę',
      search_placeholder: 'Szukaj wtyczek...',
      builtin_plugins: 'Wbudowane Wtyczki',
      installed_plugins: 'Zainstalowane Wtyczki',
      plugin_details: 'Szczegóły Wtyczki',
      permissions: 'Uprawnienia',
      usage_stats: 'Statystyki Użycia',
      activations: 'Aktywacji',
      errors: 'Błędów',
      load_time: 'ms',
      categories: {
        generator: 'Generatory',
        exporter: 'Eksportery',
        visualization: 'Wizualizacja',
        utility: 'Narzędzia',
        integration: 'Integracje'
      }
    },

    // Search
    search: {
      global_search: 'Globalne Wyszukiwanie',
      start_typing: 'Zacznij pisać aby szukać w całym projekcie',
      search_description: 'Wyszukiwanie działa w postaciach, wiedzy, chronologii, notatkach, relacjach, mapach i scenariuszach',
      nothing_found: 'Nic nie znaleziono dla zapytania "{query}"',
      try_different: 'Spróbuj innych słów kluczowych lub sprawdź pisownię',
      results_found: 'Znaleziono {count} wynik{plural}',
      navigation_help: '↑↓ nawigacja • Enter wybierz • Esc zamknij'
    },

    // Messages
    messages: {
      data_saved: 'Dane zapisane!',
      data_exported: 'Dane wyeksportowane!',
      auto_saved: 'Dane automatycznie zapisane',
      autosave_error: 'Błąd automatycznego zapisu: {error}',
      select_world_first: 'Wybierz świat aby pracować z {section}',
      confirm_delete: 'Usunąć {item}?',
      confirm_delete_all: 'To usunie WSZYSTKIE dane aplikacji na zawsze. Jesteś pewien?',
      last_warning: 'Ostatnie ostrzeżenie! Wszystkie światy, postacie i dane zostaną utracone!',
      migration_complete: 'Migracja zakończona pomyślnie! Twoje dane są teraz przechowywane w IndexedDB dla lepszej wydajności.',
      backup_created: 'Kopia zapasowa utworzona pomyślnie!',
      data_imported: 'Dane zaimportowane pomyślnie!',
      plugin_installed: 'Wtyczka "{name}" zainstalowana pomyślnie!',
      plugin_error: 'Błąd instalacji wtyczki'
    }
  }
};

// Функція для отримання перекладу
export function getTranslation(language: Language, key: string, params?: Record<string, string>): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback до української мови
      value = translations.uk;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Повертаємо ключ якщо переклад не знайдено
        }
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Заміна параметрів
  if (params) {
    Object.entries(params).forEach(([param, replacement]) => {
      value = value.replace(new RegExp(`{${param}}`, 'g'), replacement);
    });
  }
  
  return value;
}

// Провайдер контексту мови
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('fantasyWorldBuilder_language');
    return (saved as Language) || 'uk';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fantasyWorldBuilder_language', lang);
    
    // Оновлюємо HTML атрибут lang
    document.documentElement.lang = lang;
  };

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslation(language, key, params);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для використання перекладів
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}

// Хук для зміни мови
export function useLanguage() {
  const { language, setLanguage } = useContext(LanguageContext);
  return { language, setLanguage };
}

// Утіліти для форматування
export const formatUtils = {
  // Плюралізація для української мови
  pluralizeUk: (count: number, forms: [string, string, string]): string => {
    const n = Math.abs(count);
    if (n % 10 === 1 && n % 100 !== 11) return forms[0];
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return forms[1];
    return forms[2];
  },

  // Плюралізація для англійської мови
  pluralizeEn: (count: number, singular: string, plural: string): string => {
    return count === 1 ? singular : plural;
  },

  // Плюралізація для польської мови
  pluralizePl: (count: number, forms: [string, string, string]): string => {
    const n = Math.abs(count);
    if (n === 1) return forms[0];
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return forms[1];
    return forms[2];
  },

  // Універсальна плюралізація
  pluralize: (language: Language, count: number, key: string): string => {
    switch (language) {
      case 'uk':
        if (key === 'results') {
          return formatUtils.pluralizeUk(count, ['результат', 'результати', 'результатів']);
        }
        break;
      case 'en':
        if (key === 'results') {
          return formatUtils.pluralizeEn(count, '', 's');
        }
        break;
      case 'pl':
        if (key === 'results') {
          return formatUtils.pluralizePl(count, ['wynik', 'wyniki', 'wyników']);
        }
        break;
    }
    return '';
  }
};

// Компонент для перемикання мови
export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'uk' as Language, label: '🇺🇦 Українська', name: 'Українська' },
    { code: 'en' as Language, label: '🇺🇸 English', name: 'English' },
    { code: 'pl' as Language, label: '🇵🇱 Polski', name: 'Polski' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap'
    }}>
      {languages.map(lang => (
        <button
          key={lang.code}
          className={language === lang.code ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setLanguage(lang.code)}
          style={{ minWidth: '140px' }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};