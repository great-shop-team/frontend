import type { Dictionary } from './en';

const uk: Dictionary = {
  nav: {
    catalog: 'Каталог',
    sales: 'Знижки',
    search: 'Пошук',
    searchPlaceholder: 'Пошук товарів',
    searchSubmit: 'Знайти',
    closeSearch: 'Закрити пошук',
    searchNoResults: 'Нічого не знайдено',
    brands: 'Бренди',
    shop: 'Магазин',
    brandsMenuAriaLabel: 'Навігація брендів',
    viewAllBrands: 'Всі бренди',
    showLess: 'Показати менше',
    openMenu: 'Відкрити меню',
    closeMenu: 'Закрити меню',
    menu: 'Меню',
    shopMenuAriaLabel: 'Навігація магазину',
    shopMenu: {
      shop: 'Магазин',
      category: 'Категорія',
      type: 'Тип',
      allProducts: 'Усі товари',
      newArrivals: 'Новинки',
      bestsellers: 'Хіти продажів',
      giftCard: 'Подарункова карта',
      women: 'Жінкам',
      men: 'Чоловікам',
      perfumes: 'Парфуми',
      accessories: 'Аксесуари',
      sport: 'Спорт',
      clothing: 'Одяг',
      shoes: 'Взуття',
      bags: 'Сумки',
      jewellery: 'Прикраси',
      beauty: 'Краса',
      womenTile: 'Жінки',
      menTile: 'Чоловіки',
      viewAllTypes: 'Дивитись всі типи',
    },
  },
  catalog: {
    title: 'Каталог',
    categoryNavAriaLabel: 'Категорії каталогу',
    sort: 'сортування',
    filter: 'фільтр',
    stylesFound: 'Знайдено {count} моделей',
    moreColours: 'Більше кольорів',
    viewedProducts: 'Ви переглянули {viewed} з {total} товарів',
    loadMore: 'Завантажити ще',
    addToCart: 'Додати в кошик',
    outOfStock: 'Немає в наявності',
    bannerAriaLabel: 'Банер каталогу',
    bannerImageAlt: 'Банер каталогу',
    bannerPlaceholder: 'Заглушка банера',
    clearFilters: 'Очистити все',
    applyFilters: 'Показати результати',
    closeFilters: 'Закрити фільтри',
    empty: 'Товарів не знайдено',
    loadError: 'Не вдалося завантажити товари. Спробуйте ще раз.',
    filtersEmpty: 'Фільтри з’являться, коли з’являться дані каталогу.',
    sortOptions: {
      featured: 'Рекомендовані',
      priceAsc: 'Ціна: від низької',
      priceDesc: 'Ціна: від високої',
      nameAsc: 'Назва: А–Я',
      nameDesc: 'Назва: Я–А',
    },
    filterGroups: {
      subcategory: 'Категорія',
      brand: 'Бренд',
      color: 'Колір',
      size: 'Розмір',
    },
    categories: {
      men: {
        navLabel: 'Чоловікам',
        title: 'Чоловічий каталог',
        bannerImageAlt: 'Банер чоловічого каталогу',
        bannerTitle: 'Ваш міський стиль',
        bannerDescription:
          'Базові речі для руху та впевненості щодня. Чисті лінії, преміальні тканини та силуети, що рухаються разом із вами — від вулиці до студії.',
      },
      women: {
        navLabel: 'Жінкам',
        title: 'Жіночий каталог',
        bannerImageAlt: 'Банер жіночого каталогу',
        bannerTitle: 'Стиль, що рухається з вами',
        bannerDescription:
          'Добірні базові речі та виразні шари для сучасного ритму. Відкрийте фасони, текстури та відтінки, які виглядають effortlessly від ранку до вечора.',
      },
      accessories: {
        navLabel: 'Аксесуари',
        title: 'Аксесуари',
        bannerImageAlt: 'Банер каталогу аксесуарів',
        bannerTitle: 'Відкрийте суть розкоші',
        bannerDescription:
          'Аромати, що говорять емоціями, а не словами. Кожен аромат — це подорож, створена з рідкісних інгредієнтів і вічної майстерності, щоб пробудити почуття та розповісти вашу історію без жодного слова.',
      },
    },
  },
  landing: {
    recentlyReleased: 'Нещодавно випущене',
    viewAllProducts: 'Переглянути всі товари',
    viewAll: 'Дивитись усі',
    shopAll: 'Увесь магазин',
    shopNow: 'Купити зараз',
    showMore: 'Показати більше',
    addToCart: 'Додати в кошик',
    addToWishlist: 'Додати в обране',
    add: 'Додати',
    selectSize: 'Оберіть розмір',
    bestSellers: 'Магазин / Бестселери',
    shopBy: 'Новинки / Категорії',
    shopByCategory: 'Категорії',
    prev: 'Назад',
    next: 'Далі',
    streetStyle: 'Стріт-стайл',
    pressMedia: 'СЛІДКУЙТЕ ЗА НАМИ',
    pressHandle: '@wearlystore',
    wearly: '#WEARLY',
    benefits: {
      worldwideShipping: 'Доставка по світу',
      freeReturns: 'Безкоштовне повернення',
      secureCheckout: 'Безпечна оплата',
      liveStyleAdvice: 'Живі поради зі стилю',
    },
    hero: {
      imageAlt: 'Модна урбаністична зйомка',
      title: 'Міський пульс',
      description:
        'Пориньте у світ, де мода поєднується з ритмом міста. Наша нова колекція поєднує енергію стрітвір з витонченими силуетами.',
      cta: 'Дослідити',
      slidesAriaLabel: 'Карусель героя',
      goToSlide: 'Перейти до слайду {n}',
      slides: {
        lessNoise: {
          title: 'Менше шуму\nБільше комфорту',
          description: 'Речі для сміливих — сезон за сезоном',
        },
        builtDifferent: {
          title: 'Зроблені інакше\nНосяться краще',
          description: 'Створені для довговічності. Продумані для будь-якого місця.',
        },
        quietConfidence: {
          title: 'Тиха\nвпевненість',
          description: 'Знайдіть легкість усередині інтенсивності.',
        },
        madeForMovement: {
          title: 'Створені\nдля руху',
          description: 'Грація в кожному кроці, комфорт у кожному крої.',
        },
        lessTrend: {
          title: 'Менше тренду\nБільше тебе',
          description: 'Вічний стиль, створений саме для тебе.',
        },
      },
    },
    promo: {
      imageAlt: 'Аромат Tom Ford Lost Cherry',
      title: 'Солодка одержимість',
      description:
        'Пориньте у провокаційні насичені нотки темної вишні та турецької троянди. Розкішний, насичений аромат, створений для того, щоб привертати увагу та залишати незабутній багряний шлейф.',
      cta: 'Забрати свій',
    },
    lifestyle: {
      imageAlt: 'Редакційний модний портрет',
      title: 'ПЕРЕТВОРЮЮЧИ БАЗОВІ РЕЧІ НА МИСТЕЦТВО',
      description:
        'Відкрийте для себе точність кожної текстури та золотистого акценту в нашій колекції High Summer.',
      cta: 'Дослідити кампанію',
    },
    topBanner: {
      text: 'Новачок тут? Зареєструйтесь та отримайте знижку 15 доларів на перше замовлення',
      textMobile: 'Новачок? Зареєструйтесь і отримайте $15 на перше замовлення',
      close: 'Закрити банер',
    },
    clothing: {
      'w-cloth-001': {
        title: 'Базова оверсайз футболка',
        imageAlt: 'Базова оверсайз футболка',
        price: '$100',
      },
      'w-cloth-002': {
        title: 'Рожева оверсайз футболка',
        imageAlt: 'Рожева оверсайз футболка',
        price: '$100',
      },
      'w-cloth-004': {
        title: 'Футболка Heritage Graphic',
        imageAlt: 'Футболка Heritage Graphic',
        price: '$100',
      },
    },
    shopByItems: {
      women: { label: 'Жінки', imageAlt: 'Жіночий каталог' },
      men: { label: 'Чоловіки', imageAlt: 'Чоловічий каталог' },
      perfumes: { label: 'Парфуми', imageAlt: 'Каталог ароматів' },
      accessories: { label: 'Аксесуари', imageAlt: 'Каталог аксесуарів' },
    },
    featuredFrames: {
      lookEditorial: {
        title: 'Базові речі, створені для міста',
        imageAlt: 'Міський tailored-образ',
      },
      lookProduct: {
        title: 'Жилет Heritage Crop',
        imageAlt: 'Жилет Heritage Crop Vest',
        price: '$300',
      },
      scentProduct: {
        title: 'Oud Sambac',
        subtitle: 'Oud Sambac eau de parfum',
        imageAlt: 'Oud Sambac eau de parfum',
        price: '$130',
      },
      scentEditorial: {
        title: 'Аромат, створений для міста',
        imageAlt: 'Стилізована зйомка Oud Sambac',
      },
    },
    featuredLook: {
      editorialAlt: 'Редакційна зйомка образу',
      product: {
        title: 'Чорний рубчиковий топ',
        imageAlt: 'Чорний рубчиковий укорочений топ',
        price: '$20',
      },
    },
    featuredFragrance: {
      editorialAlt: 'Редакційна зйомка аромату Lost Cherry',
      product: {
        title: 'Lost Cherry Eau de Parfum',
        imageAlt: 'Lost Cherry Eau de Parfum',
        price: '$350',
      },
    },
    streetStyleItems: {
      streetOne: { imageAlt: 'Стріт-стайл фото один' },
      streetTwo: { imageAlt: 'Стріт-стайл фото два' },
      streetThree: { imageAlt: 'Стріт-стайл фото три' },
    },
    wearlyItems: {
      container1: { imageAlt: '#WEARLY фото один' },
      container2: { imageAlt: '#WEARLY фото два' },
      container3: { imageAlt: '#WEARLY фото три' },
      container4: { imageAlt: '#WEARLY фото чотири' },
    },
    promoDuo: {
      nike: { label: 'Nike', imageAlt: 'Кампанія Nike' },
      ysl: { label: 'Yves Saint Laurent', imageAlt: 'Аромат Yves Saint Laurent' },
    },
    campaign: {
      imageAlt: 'Кампанія сонцезахисних окулярів',
      title: 'КОЛЕКЦІЯ ОКУЛЯРІВ',
      subtitle: 'Oliver Peoples',
      cta: 'Відкрити',
    },
    eyewear: {
      title: 'Бачити інакше',
      editorialAlt: 'Модель у окулярах Tortoise Aviator',
      product: {
        title: 'Окуляри Tortoise Aviator',
        imageAlt: 'Окуляри Tortoise Aviator на дерев’яній підставці',
        price: '$150',
      },
    },
    pressItems: {
      pressOne: { imageAlt: 'Прес-фото один' },
      pressTwo: { imageAlt: 'Прес-фото два' },
      pressThree: { imageAlt: 'Прес-фото три' },
      pressFour: { imageAlt: 'Прес-фото чотири' },
    },
    fragrances: {
      tobaccoVanille: {
        title: 'Tobacco Vanille Eau de Parfum',
        imageAlt: 'Tobacco Vanille Eau de Parfum',
        price: '$300',
      },
      lostCherry: {
        title: 'Lost Cherry Eau de Parfum',
        imageAlt: 'Lost Cherry Eau de Parfum',
        price: '$350',
      },
      vanillaSex: {
        title: 'Vanilla Sex Eau de Parfum',
        imageAlt: 'Vanilla Sex Eau de Parfum',
        price: '$300',
      },
    },
    categories: {
      urbanEssentials: {
        title: 'МІСЬКІ БАЗОВІ РЕЧІ',
        imageAlt: 'Колекція Urban Essentials',
      },
      oversizedTailoring: {
        title: 'ОВЕРСАЙЗ ТЕЙЛОРИНГ',
        imageAlt: 'Колекція Oversized Tailoring',
      },
    },
  },
  footer: {
    newsletterTitle: 'Підпишіться на нашу розсилку',
    subscribeAria: 'Підписатися на розсилку',
    copyright: '© 2026 WEARLY. Усі права захищені.',
    columns: {
      company: {
        title: 'Компанія',
        aboutUs: 'Про нас',
        careers: 'Кар’єра',
        contacts: 'Контакти',
      },
      helpCenter: {
        title: 'Допомога',
        shipping: 'Доставка',
        returns: 'Повернення',
        faq: 'FAQ',
        sizeGuide: 'Таблиця розмірів',
      },
      legal: {
        title: 'Правова інформація',
        privacyPolicy: 'Політика конфіденційності',
        terms: 'Умови',
        cookies: 'Cookies',
      },
      social: {
        title: 'Соцмережі',
        instagram: 'Instagram',
        facebook: 'Facebook',
        tiktok: 'TikTok',
      },
    },
  },
  newsletter: {
    invalidEmail: 'Введіть коректну email-адресу. Наприклад: you@email.com',
    success: 'Дякуємо за підписку!',
  },
  infoPage: {
    backToHome: '← На головну',
    open: 'Відкрити {title}',
  },
  stub: {
    wishlist: {
      title: 'Обране',
      description: 'Тут незабаром з’являться збережені товари.',
      cta: 'Перейти до каталогу',
    },
    cart: {
      title: 'Кошик',
      description: 'Кошик порожній. Додайте товари з каталогу.',
      cta: 'До каталогу',
    },
    sales: {
      title: 'Знижки',
      description: 'Тут незабаром з’являться товари зі знижками.',
      cta: 'Перейти до каталогу',
    },
  },
  infoPages: {
    about: {
      title: 'Про нас',
      description:
        'WEARLY — інтернет-магазин одягу з акцентом на сучасні базові речі. Цю сторінку незабаром буде оновлено історією нашого бренду.',
    },
    careers: {
      title: 'Кар’єра',
      description:
        'Ми розширюємо команду. Відкриті вакансії та деталі подачі заявок з’являться тут незабаром.',
    },
    contacts: {
      title: 'Контакти',
      description:
        'Потрібна допомога? Контактні дані та години підтримки будуть опубліковані на цій сторінці незабаром.',
    },
    shipping: {
      title: 'Доставка',
      description:
        'Інформація про варіанти доставки, терміни та відстеження з’явиться на цій сторінці незабаром.',
    },
    returns: {
      title: 'Повернення',
      description: 'Політику повернення та обміну буде описано на цій сторінці незабаром.',
    },
    faq: {
      title: 'FAQ',
      description:
        'Відповіді на поширені запитання про замовлення, оплату та обліковий запис з’являться тут незабаром.',
    },
    'size-guide': {
      title: 'Таблиця розмірів',
      description:
        'Таблиці вимірів та рекомендації щодо посадки будуть додані на цю сторінку незабаром.',
    },
    privacy: {
      title: 'Політика конфіденційності',
      description:
        'Як ми збираємо, використовуємо та захищаємо ваші персональні дані, буде описано тут незабаром.',
    },
    terms: {
      title: 'Умови використання',
      description:
        'Умови користування сайтом та послугами WEARLY будуть опубліковані тут незабаром.',
    },
    cookies: {
      title: 'Cookies',
      description:
        'Деталі про cookies та подібні технології на цьому сайті з’являться на цій сторінці незабаром.',
    },
    instagram: {
      title: 'Instagram',
      description: 'Слідкуйте за WEARLY в Instagram — новинки та натхнення для стилю.',
    },
    facebook: {
      title: 'Facebook',
      description: 'Приєднуйтесь до нашої спільноти у Facebook для новин та оголошень.',
    },
    tiktok: {
      title: 'TikTok',
      description: 'Дивіться WEARLY у TikTok — образи, тренди та закулісся.',
    },
  },
  wishlist: {
    loginRequiredTitle: 'Потрібен вхід',
    loginRequiredText:
      'Хочете зберегти улюблені товари? Увійдіть в особистий кабінет або скористайтесь швидкою реєстрацією.',
    loginButton: 'Увійти в акаунт',
    registerButton: 'Реєстрація',
    closeModal: 'Закрити',
  },
  account: {
    profile: 'Профіль',
    account: 'Обліковий запис',
    hello: 'Вітаємо',
    wishlist: 'Обране',
    myOrders: 'Мої замовлення',
    addresses: 'Адреси',
    changePassword: 'Змінити пароль',
    logOut: 'Вийти',
    bonuses: 'Бонуси',
    notifications: 'Сповіщення',
    user: 'Користувач',
  },
  common: {
    loading: 'Завантаження...',
    error: 'Помилка',
    back: 'Назад',
    home: 'Головна',
    language: 'Мова',
    ukrainian: 'Українська',
    english: 'Англійська',
    notFound: 'Не знайдено',
    catalog: 'Каталог',
    sending: 'Надсилання...',
    saving: 'Збереження...',
    verifying: 'Перевірка...',
    resend: 'Надіслати знову',
    digit: 'Цифра {number}',
    showPassword: 'Показати пароль',
    hidePassword: 'Приховати пароль',
  },
  validation: {
    firstNameRequired: "Ім'я обов'язкове.",
    lastNameRequired: "Прізвище обов'язкове.",
    emailRequired: "Email обов'язковий.",
    emailInvalid: 'Введіть коректну email-адресу.',
    passwordRequired: "Пароль обов'язковий.",
    passwordInvalid:
      'Пароль має містити щонайменше 8 символів, одну велику літеру та один спецсимвол.',
    confirmPasswordRequired: "Підтвердження пароля обов'язкове.",
    passwordsMustMatch: 'Паролі мають збігатися.',
    passwordsDoNotMatch: 'Паролі не збігаються.',
    acceptTerms: 'Потрібно прийняти Умови використання та Політику конфіденційності.',
    acceptTermsShort: 'Потрібно прийняти Умови використання.',
    enterFullCode: 'Введіть повний код',
  },
  auth: {
    labels: {
      email: 'Email-адреса',
      emailOrMobile: 'Email / мобільний',
      password: 'Пароль',
      confirmPassword: 'Підтвердіть пароль',
      newPassword: 'Новий пароль',
      confirmNewPassword: 'Підтвердіть новий пароль',
      verificationCode: 'Код підтвердження',
      enterCode: 'Введіть код',
    },
    placeholders: {
      email: 'email@example.com',
      emailShort: 'Email',
      password: 'Пароль',
      confirmPassword: 'Підтвердіть пароль',
      passwordDots: '••••••••',
    },
    login: {
      welcome: 'Вітаємо!',
      subtitle: 'Увійдіть у свій обліковий запис',
      rememberMe: "Запам'ятати мене",
      forgotPassword: 'Забули пароль?',
      submit: 'Увійти',
      createAccount: 'Створити обліковий запис?',
    },
    register: {
      title: 'Створити обліковий запис',
      subtitle: 'Введіть свої дані',
      agreeTerms: 'Я погоджуюсь з',
      termsLink: 'Умовами використання',
      googleTermsHint:
        'Щоб зареєструватися через Google, спочатку прийміть Умови використання вище.',
      submit: 'Зареєструватися',
      alreadyHaveAccount: 'Вже є обліковий запис?',
    },
    forgotPassword: {
      title: 'Забули пароль?',
      subtitle: 'Введіть email — ми надішлемо код для скидання пароля.',
      imageAlt: 'Забули пароль',
      submit: 'Надіслати код',
      rememberPassword: "Пам'ятаєте пароль?",
    },
    resetPassword: {
      title: 'Новий пароль',
      subtitle: 'Ми надіслали код підтвердження на {email}',
      submit: 'Скинути пароль',
      invalidCode: 'Недійсний або прострочений код. Спробуйте ще раз.',
    },
    verify: {
      title: 'Підтвердіть email-адресу',
      subtitle: 'Ми надіслали лист на {email}, введіть код нижче',
      submit: 'Підтвердити',
      didntSeeEmail: 'Не отримали лист?',
      invalidCode: 'Недійсний або прострочений код. Спробуйте ще раз або надішліть новий.',
      codeResent: 'Новий код надіслано на ваш email.',
      resendFailed: 'Не вдалося надіслати код. Перевірте email і спробуйте ще раз.',
    },
    getVerified: {
      title: 'Підтвердіть обліковий запис',
      subtitle: 'Код буде надіслано на ваш email',
      imageAlt: 'Підтвердження',
      submit: 'Отримати код',
      alreadyHaveAccount: 'Вже є обліковий запис?',
      sendFailed: 'Не вдалося надіслати код. Перевірте email і спробуйте ще раз.',
    },
    welcome: {
      title: 'Ласкаво просимо',
      subtitle: 'Введіть код нижче',
      imageAlt: 'Ласкаво просимо',
      submit: 'Почати',
      signingIn: 'Вхід...',
      goShopping: 'Перейти до покупок?',
    },
    hints: {
      emailVerifiedLogin:
        'Email підтверджено. Увійдіть з паролем, який ви вказали під час реєстрації.',
      signInToContinue: 'Увійдіть з email та паролем, щоб продовжити.',
      passwordResetSuccess: 'Пароль успішно змінено! Увійдіть з новим паролем.',
    },
    errors: {
      signInFailed: 'Не вдалося увійти. Перевірте email і пароль або спочатку підтвердіть email.',
      incorrectCredentials: 'Невірний email або пароль. Спробуйте ще раз.',
      resetCodeFailed: 'Не вдалося надіслати код. Перевірте email і спробуйте ще раз.',
      registrationFailed: 'Помилка реєстрації. Перевірте дані та спробуйте ще раз.',
      requestFailed: 'Помилка запиту. Спробуйте пізніше.',
      googleSignInFailed: 'Не вдалося увійти через Google. Спробуйте ще раз.',
    },
  },
  profile: {
    return: 'Повернення',
    returnPage: {
      title: 'Повернення товару',

      stepOneTitle: 'Оберіть замовлення',
      stepOneDescription:
        'Оберіть замовлення та товар(и), які ви бажаєте повернути. Повернення приймаються протягом 30 днів після доставки.',

      stepTwoTitle: 'Вкажіть причину повернення',
      stepTwoDescription:
        'Повідомте нам причину: неправильний розмір, передумали, пошкоджений товар або інше.',

      stepThreeTitle: 'Роздрукуйте етикетку та відправте',
      stepThreeDescription:
        'Ми надішлемо вам передплачену етикетку для повернення електронною поштою. Передайте посилку до будь-якого пункту прийому протягом 5 днів.',

      stepFourTitle: 'Повернення коштів',
      stepFourDescription:
        'Після отримання товару повернення коштів буде здійснено протягом 3–5 робочих днів на початковий спосіб оплати.',

      orderNumber: 'Номер замовлення',
      itemName: 'Назва товару',
      reason: 'Причина',
      preferredResolution: 'Бажане рішення',
      additionalNotes: 'Додаткові примітки (необов’язково)',

      reasonPlaceholder: 'Пошкоджений / Бракований',
      resolutionPlaceholder: 'Повернення коштів',

      submitButton: 'Надіслати запит на повернення',
    },
    myPromocodes: 'Мої промокоди',
    myPurchases: 'Мої покупки',
    myBonuses: 'Мої бонуси',
    personalData: 'Особисті дані',
    changePassword: 'Змінити пароль',
    orderFormList: 'Список замовлень',
    personalDataTitle: 'Особисті дані',
    firstName: "Ім'я",
    lastName: 'Прізвище',
    phoneNumber: 'Номер телефону',
    birthday: 'Дата народження',
    gender: 'Стать',
    city: 'Місто',
    sizes: 'Розміри',
    clothing: 'Одяг',
    shoeSize: 'Розмір взуття (EU)',
    accountDetails: 'Дані облікового запису',
    email: 'Email',
    password: 'Пароль',
    saveChanges: 'Зберегти зміни',
    deleteAccountTitle: 'Видалити обліковий запис',
    deleteAccountWarning:
      'Незворотна дія — усі ваші дані буде видалено без можливості відновлення.',
  },
  orderFormList: {
    delivery: 'Доставка',
    arrived: 'Прибув',
    canceled: 'Скасовано',
  },
  orders: {
    filtersAria: 'Фільтри статусу замовлень',
    delivery: 'Доставка',
    arrived: 'Отримано',
    canceled: 'Скасовано',
    orderId: 'Замовлення: {id}',
    estimatedDelivery: 'Орієнтовна дата доставки {date}',
    total: 'Разом: ${amount}',
    details: 'Деталі',
  },
  product: {
    youMayAlsoLike: 'Вам також може сподобатися',
    like: 'В обране',
    productCode: 'Код товару:',
    color: 'Колір',
    buyNow: 'Купити зараз',
    addToCart: 'Додати в кошик',
    info: 'Інфо',
    infoTabs: {
      materials: {
        label: 'Матеріали та деталі дизайну',
        content:
          'Преміумні тканини, акуратне виконання та розслаблений силует для повсякденного носіння.',
      },
      measurements: {
        label: 'Виміри',
        content:
          'Оверсайз-посадка. Обирайте звичний розмір для задуманого силуету або менший — для більш структурованого вигляду.',
      },
      packaging: {
        label: 'Упаковка',
        content:
          'Замовлення пакується у фірмовий захисний пакунок, щоб річ залишалась у ідеальному стані під час доставки.',
      },
      shipping: {
        label: 'Доставка та повернення',
        content:
          'Швидка доставка по всьому світу та простий процес повернення. Точні терміни залежать від регіону та обраного способу доставки.',
      },
    },
    reviews: {
      ariaLabel: 'Відгуки покупців',
      title: 'Відгуки покупців ({count})',
      writeReview: 'Написати відгук',
      viewMore: 'Показати більше',
      ratingDistributionAlt: 'Розподіл оцінок',
    },
    aria: {
      breadcrumb: 'Навігаційний ланцюжок',
      openGallery: 'Відкрити галерею зображень',
      closeInfo: 'Закрити інформацію',
      closeGallery: 'Закрити галерею зображень',
      previousImage: 'Попереднє зображення',
      nextImage: 'Наступне зображення',
      playPreview: 'Відтворити превʼю',
    },
    imageAlt: {
      front: '{title} — спереду',
      back: '{title} — ззаду',
      gallery: '{title} — галерея {n}',
      color: '{title} — {color}',
    },
  },
  changePassword: {
    currentPassword: 'Поточний пароль',
    EnterCurrentPassword: 'Введіть поточний пароль',
    NewPassword: 'Новий пароль',
    MinCharacters: 'Мін. 8 символів',
    ConfirmNewPassword: 'Підтвердіть новий пароль',
    RepeatNewPassword: 'Повторіть новий пароль',
    SaveChanges: 'Зберегти зміни',
  },
  promoCode: {
    MyPrCodes: 'Мої промокоди',
  },
  address: {
    address: 'Адреса',
    default: 'За замовчуванням',
    edit: 'Редагувати',
    delete: 'Видалити',
    setDefault: 'Встановити за замовчуванням',
    addNew: 'Додати нову адресу',
    editAddress: 'Редагувати адресу',
    streetAndHouseNumber: 'Вулиця та номер будинку',
    floor: "Поверх (необов'язково)",
    firstName: "Ім'я",
    lastName: 'Прізвище',
    streetAddress: 'Вулиця та номер будинку',
    apartment: 'Квартира',
    optional: "Необов'язково",
    city: 'Місто',
    postcode: 'Поштовий індекс',
    country: 'Країна',
    phone: 'Телефон',
    cancel: 'Скасувати',
    saveChanges: 'Зберегти зміни',
  },
};

export default uk;
