// Генератор імен для фентезійних персонажів (офлайн словники)

interface NameData {
  male: string[];
  female: string[];
  surnames: string[];
  titles: string[];
  nicknames: string[];
}

interface RaceNameData {
  [race: string]: NameData;
}

// Офлайн словники імен для різних рас
const nameDatabase: RaceNameData = {
  human: {
    male: [
      'Олександр', 'Дмитро', 'Максим', 'Андрій', 'Сергій', 'Володимир', 'Іван', 'Михайло',
      'Артем', 'Роман', 'Віталій', 'Ярослав', 'Богдан', 'Тарас', 'Остап', 'Назар',
      'Данило', 'Павло', 'Юрій', 'Василь', 'Петро', 'Степан', 'Мирослав', 'Святослав',
      'Ростислав', 'Владислав', 'Станіслав', 'Вячеслав', 'Борислав', 'Радослав'
    ],
    female: [
      'Анна', 'Марія', 'Олена', 'Катерина', 'Наталія', 'Ірина', 'Оксана', 'Тетяна',
      'Юлія', 'Світлана', 'Людмила', 'Галина', 'Валентина', 'Лариса', 'Віра', 'Надія',
      'Любов', 'Софія', 'Дарина', 'Анастасія', 'Вікторія', 'Діана', 'Кристина', 'Аліна',
      'Ольга', 'Ганна', 'Мирослава', 'Ярослава', 'Богдана', 'Роксолана'
    ],
    surnames: [
      'Коваленко', 'Шевченко', 'Бойко', 'Ткаченко', 'Кравченко', 'Мельник', 'Петренко',
      'Іваненко', 'Савченко', 'Гриценко', 'Левченко', 'Павленко', 'Марченко', 'Руденко',
      'Лисенко', 'Волошин', 'Гончар', 'Кушнір', 'Столяр', 'Швець', 'Ковальчук', 'Мороз',
      'Білий', 'Чорний', 'Рудий', 'Сірий', 'Золотий', 'Срібний', 'Залізний', 'Мідний'
    ],
    titles: [
      'Сер', 'Лорд', 'Граф', 'Барон', 'Герцог', 'Принц', 'Король', 'Імператор',
      'Капітан', 'Командир', 'Генерал', 'Маршал', 'Магістр', 'Архімаг', 'Верховний жрець'
    ],
    nicknames: [
      'Хоробрий', 'Мудрий', 'Справедливий', 'Сильний', 'Швидкий', 'Тихий', 'Гучний',
      'Залізний', 'Золотий', 'Срібний', 'Вогняний', 'Крижаний', 'Буревісний', 'Зоряний',
      'Вовчий', 'Орлиний', 'Левиний', 'Ведмежий', 'Драконій', 'Фенічний'
    ]
  },
  elf: {
    male: [
      'Елронд', 'Леголас', 'Галадріель', 'Таранділ', 'Еленділ', 'Ісілдур', 'Арагорн',
      'Боромір', 'Фарамір', 'Імладріс', 'Рівенделл', 'Лотлоріен', 'Мітрандір', 'Радагаст',
      'Саруман', 'Гендальф', 'Елесар', 'Телконтар', 'Дунедайн', 'Рейнджер',
      'Аелінд', 'Белегорн', 'Келебрімбор', 'Дуілін', 'Еаренділ', 'Фінрод'
    ],
    female: [
      'Арвен', 'Галадріель', 'Елронд', 'Тауріель', 'Ніенна', 'Варда', 'Йаванна',
      'Есте', 'Ваіре', 'Нессе', 'Тулкас', 'Ороме', 'Мандос', 'Лоріен',
      'Аелвен', 'Белегвен', 'Келебрен', 'Дуілвен', 'Еарвен', 'Фінвен'
    ],
    surnames: [
      'Зірковий', 'Місячний', 'Сонячний', 'Вітряний', 'Лісовий', 'Річковий', 'Гірський',
      'Морський', 'Небесний', 'Земний', 'Вогняний', 'Водяний', 'Повітряний', 'Духовний',
      'Світлий', 'Темний', 'Сріблястий', 'Золотистий', 'Кришталевий', 'Діамантовий'
    ],
    titles: [
      'Лорд', 'Леді', 'Принц', 'Принцеса', 'Король', 'Королева', 'Верховний лорд',
      'Страж', 'Рейнджер', 'Маг', 'Чародій', 'Друїд', 'Бард', 'Мінстрель'
    ],
    nicknames: [
      'Зіркоокий', 'Місяцеликий', 'Сонцеволосий', 'Вітрокрилий', 'Лісоходець',
      'Річкоспівець', 'Гірський страж', 'Морський мандрівник', 'Небесний танцюрист',
      'Світлоносець', 'Тіньовий', 'Срібноголосий', 'Золотосердий', 'Кришталевий погляд'
    ]
  },
  dwarf: {
    male: [
      'Торін', 'Балін', 'Двалін', 'Філі', 'Кілі', 'Дорі', 'Норі', 'Орі',
      'Оін', 'Глоін', 'Біфур', 'Бофур', 'Бомбур', 'Гімлі', 'Даін',
      'Грогар', 'Дурган', 'Торек', 'Барек', 'Карек', 'Дарек', 'Гарек'
    ],
    female: [
      'Діс', 'Дейна', 'Дора', 'Нала', 'Віла', 'Гіла', 'Ріла', 'Тіла',
      'Бера', 'Гера', 'Кера', 'Лера', 'Мера', 'Нера', 'Пера', 'Тера'
    ],
    surnames: [
      'Залізнобород', 'Золотошукач', 'Каменетес', 'Молотобій', 'Сокирорук',
      'Щитоносець', 'Рудокоп', 'Самоцвітник', 'Кувальник', 'Броньовар',
      'Мечник', 'Алмазний', 'Сталевий', 'Мідний', 'Срібний', 'Платиновий'
    ],
    titles: [
      'Король', 'Принц', 'Лорд', 'Тан', 'Ярл', 'Майстер', 'Старійшина',
      'Страж', 'Капітан', 'Командир', 'Генерал', 'Маршал'
    ],
    nicknames: [
      'Залізний', 'Сталевий', 'Каменний', 'Міцний', 'Стійкий', 'Непохитний',
      'Грізний', 'Могутній', 'Сильний', 'Твердий', 'Незламний', 'Вірний'
    ]
  },
  orc: {
    male: [
      'Грішнак', 'Углук', 'Азог', 'Болг', 'Готмог', 'Лурц', 'Шаграт', 'Горбаг',
      'Музгаш', 'Рагдуш', 'Снага', 'Гришнак', 'Угарит', 'Мордор', 'Ізенгард'
    ],
    female: [
      'Грішна', 'Углука', 'Азога', 'Болга', 'Готмога', 'Лурца', 'Шаграт'
    ],
    surnames: [
      'Чорнокіготь', 'Кривозуб', 'Залізнорука', 'Червоноокий', 'Шрамолиций',
      'Костелом', 'Кровожер', 'Тінебіг', 'Вогнедих', 'Каменнокулак'
    ],
    titles: [
      'Вождь', 'Капітан', 'Командир', 'Генерал', 'Воєначальник', 'Страж'
    ],
    nicknames: [
      'Жорстокий', 'Безжальний', 'Лютий', 'Дикий', 'Кривавий', 'Темний',
      'Грізний', 'Страшний', 'Злий', 'Підступний', 'Хитрий', 'Сильний'
    ]
  }
};

// Клас генератора імен
export class NameGenerator {
  // Генерація повного імені
  static generateFullName(
    race: string = 'human',
    gender: 'male' | 'female' = 'male',
    includeTitle: boolean = false,
    includeNickname: boolean = false
  ): string {
    const raceData = nameDatabase[race.toLowerCase()] || nameDatabase.human;
    
    let fullName = '';
    
    // Титул
    if (includeTitle && Math.random() > 0.7) {
      const title = this.getRandomElement(raceData.titles);
      fullName += title + ' ';
    }
    
    // Ім'я
    const firstName = this.getRandomElement(raceData[gender]);
    fullName += firstName;
    
    // Прізвище
    if (Math.random() > 0.3) {
      const surname = this.getRandomElement(raceData.surnames);
      fullName += ' ' + surname;
    }
    
    // Прізвисько
    if (includeNickname && Math.random() > 0.8) {
      const nickname = this.getRandomElement(raceData.nicknames);
      fullName += ' "' + nickname + '"';
    }
    
    return fullName.trim();
  }

  // Генерація тільки імені
  static generateFirstName(race: string = 'human', gender: 'male' | 'female' = 'male'): string {
    const raceData = nameDatabase[race.toLowerCase()] || nameDatabase.human;
    return this.getRandomElement(raceData[gender]);
  }

  // Генерація прізвища
  static generateSurname(race: string = 'human'): string {
    const raceData = nameDatabase[race.toLowerCase()] || nameDatabase.human;
    return this.getRandomElement(raceData.surnames);
  }

  // Генерація прізвиська
  static generateNickname(race: string = 'human'): string {
    const raceData = nameDatabase[race.toLowerCase()] || nameDatabase.human;
    return this.getRandomElement(raceData.nicknames);
  }

  // Генерація множинних варіантів
  static generateMultipleNames(
    count: number = 5,
    race: string = 'human',
    gender: 'male' | 'female' = 'male',
    includeTitle: boolean = false,
    includeNickname: boolean = false
  ): string[] {
    const names: string[] = [];
    const usedNames = new Set<string>();
    
    while (names.length < count && names.length < 50) { // Запобігання нескінченному циклу
      const name = this.generateFullName(race, gender, includeTitle, includeNickname);
      if (!usedNames.has(name)) {
        names.push(name);
        usedNames.add(name);
      }
    }
    
    return names;
  }

  // Отримання випадкового елемента з масиву
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Отримання доступних рас
  static getAvailableRaces(): string[] {
    return Object.keys(nameDatabase);
  }

  // Додавання користувацької раси
  static addCustomRace(raceName: string, nameData: NameData): void {
    nameDatabase[raceName.toLowerCase()] = nameData;
  }

  // Генерація назв локацій
  static generateLocationName(type: 'city' | 'village' | 'forest' | 'mountain' | 'river' = 'city'): string {
    const prefixes = {
      city: ['Велико', 'Ново', 'Старо', 'Біло', 'Черво', 'Золото', 'Срібно', 'Камено'],
      village: ['Мало', 'Тихо', 'Зелено', 'Ясно', 'Світло', 'Добро', 'Миро', 'Радо'],
      forest: ['Темно', 'Глибоко', 'Дико', 'Старо', 'Зачаро', 'Таємно', 'Древо', 'Листо'],
      mountain: ['Високо', 'Круто', 'Камено', 'Снігово', 'Хмарно', 'Орло', 'Драко', 'Титано'],
      river: ['Швидко', 'Тихо', 'Глибоко', 'Чисто', 'Мутно', 'Холодно', 'Тепло', 'Кришталево']
    };

    const suffixes = {
      city: ['град', 'місто', 'бург', 'поль', 'дар', 'вар', 'тон', 'форд'],
      village: ['село', 'весь', 'хутір', 'слобода', 'двір', 'поле', 'луг', 'гай'],
      forest: ['ліс', 'бір', 'гай', 'діброва', 'пуща', 'хаща', 'роща', 'дубрава'],
      mountain: ['гора', 'пік', 'верх', 'скеля', 'кряж', 'хребет', 'вершина', 'утес'],
      river: ['річка', 'потік', 'струмок', 'ручай', 'вода', 'течія', 'джерело', 'криниця']
    };

    const prefix = this.getRandomElement(prefixes[type]);
    const suffix = this.getRandomElement(suffixes[type]);
    
    return prefix + suffix;
  }

  // Генерація назв організацій
  static generateOrganizationName(type: 'guild' | 'order' | 'clan' | 'house' = 'guild'): string {
    const adjectives = [
      'Благородний', 'Древній', 'Таємний', 'Священний', 'Могутній', 'Вічний',
      'Золотий', 'Срібний', 'Залізний', 'Кришталевий', 'Вогняний', 'Крижаний',
      'Зоряний', 'Місячний', 'Сонячний', 'Тіньовий', 'Світлий', 'Темний'
    ];

    const nouns = {
      guild: ['Гільдія', 'Братство', 'Спілка', 'Товариство', 'Об\'єднання', 'Союз'],
      order: ['Орден', 'Братство', 'Рицарство', 'Стража', 'Храм', 'Святиня'],
      clan: ['Клан', 'Рід', 'Плем\'я', 'Дім', 'Сім\'я', 'Династія'],
      house: ['Дім', 'Палац', 'Двір', 'Резиденція', 'Маєток', 'Замок']
    };

    const animals = [
      'Лева', 'Орла', 'Вовка', 'Ведмедя', 'Дракона', 'Фенікса', 'Грифона',
      'Тигра', 'Пантери', 'Сокола', 'Ворона', 'Лебедя', 'Оленя', 'Кабана'
    ];

    const adjective = this.getRandomElement(adjectives);
    const noun = this.getRandomElement(nouns[type]);
    
    if (Math.random() > 0.5) {
      const animal = this.getRandomElement(animals);
      return `${adjective} ${noun} ${animal}`;
    } else {
      return `${adjective} ${noun}`;
    }
  }
}

// Хук для роботи з генератором імен
export function useNameGenerator() {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNames = async (
    count: number = 5,
    race: string = 'human',
    gender: 'male' | 'female' = 'male',
    includeTitle: boolean = false,
    includeNickname: boolean = false
  ) => {
    setIsGenerating(true);
    
    // Симулюємо невелику затримку для UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const names = NameGenerator.generateMultipleNames(count, race, gender, includeTitle, includeNickname);
    setGeneratedNames(names);
    setIsGenerating(false);
  };

  const generateLocationNames = async (count: number = 5, type: 'city' | 'village' | 'forest' | 'mountain' | 'river' = 'city') => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(NameGenerator.generateLocationName(type));
    }
    
    setGeneratedNames(names);
    setIsGenerating(false);
  };

  const generateOrganizationNames = async (count: number = 5, type: 'guild' | 'order' | 'clan' | 'house' = 'guild') => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(NameGenerator.generateOrganizationName(type));
    }
    
    setGeneratedNames(names);
    setIsGenerating(false);
  };

  return {
    generatedNames,
    isGenerating,
    generateNames,
    generateLocationNames,
    generateOrganizationNames
  };
}