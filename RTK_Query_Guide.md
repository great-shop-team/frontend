# 🗺️ Посібник з Redux Toolkit та RTK Query: Від А до Я

Привіт! Якщо ти раніше не працював із **Redux Toolkit (RTK)** та **RTK Query**, цей гайд допоможе тобі зрозуміти логіку та архітектуру нашого проекту без зайвої складної термінології.

## 🏛️ Частина 1: Що це взагалі таке? (Проста метафора)

Уявімо, що наше Next.js додаток — це **великий ресторан**.

1. **Next.js Компоненти** — це **столики з гостями**. Вони хочуть їсти (їм потрібні дані з сервера) або роблять замовлення (відправляють форми реєстрації, логіну тощо).
2. **Бекенд (API / Swagger)** — це **кухня**. Вона знаходиться в іншій будівлі (на іншому сервері). Там зберігаються всі товари, категорії та користувачі.
3. **RTK Query** — це **кур'єр на мопеді**. Його єдина робота — швидко збігати на кухню за конкретною адресою (наприклад, `/api/categories/`), забрати дані й привезти їх назад на столик (у компонент).
4. **Класичний Redux Toolkit (Слайси)** — це **холодильник або сейф прямо біля столиків**. Якщо кур'єр привіз щось, що нам потрібно постійно тримати під рукою (наприклад, ключ від входу — _токен_, або список товарів у _кошику_), ми кладемо це в цей сейф, щоб не ганяти кур'єра на кухню щомиті.

## 🔄 Частина 2: Головне правило архітектури (Поділ даних)

У нашому проекті всі дані чітко діляться на дві різні кишені:

- **Серверні дані (Server State):** Все, що ми просимо у бекенда (товари, категорії, профілі). Вони отримуються через **RTK Query** (файли з закінченням `*Endpoints.ts`). Вони автоматично кешуються, і нам не потрібно створювати для них окремі слайси.
- **Клієнтські дані (Client State):** Все, що живе _тільки_ в браузері користувача (чи відкрита модалка, яка тема сайту, що лежить у кошику прямо зараз). Вони створюються через класичні **Слайси** (файли з закінченням `*Slice.ts`).

## 📂 Частина 3: Структура нашої папки `store`

Щоб у проекті був залізобетонний порядок, ми розділили логіку по окремих файлах:

```
src/store/
├── api.ts                  # Головний файл (налаштування baseUrl, токенів)
├── types.ts                # Усі TypeScript-інтерфейси з коментарями
├── store.ts                # Конфігурація Redux Store (де все зшивається разом)
│
├── endpoints/              # Окрема папка суто для запитів до API (RTK Query)
│   ├── authEndpoints.ts    # Логін, реєстрація, активація
│   ├── categoriesEndpoints.ts
│   ├── profilesEndpoints.ts
│   └── productsEndpoints.ts
│
└── slices/                 # Папка для суто клієнтського стейту (Класичний RTK)
    ├── userSlice.ts        # Збереження токена та статусу авторизації
    ├── cartSlice.ts        # Кошик покупок (додати, видалити товар)
    ├── wishlistSlice.ts    # Список бажань (вибране)
    └── filterSlice.ts      # Фільтри на каталозі
```

## 🛠️ Частина 4: Покроковий алгоритм розробки нової фічі

Коли тобі потрібно додати роботу з новими ендпоінтами (наприклад, Категорії), твій шлях виглядає так:

### Крок 1: Дивимось у Swagger та створюємо типи

Відкриваємо документацію API (Swagger), знаходимо потрібні шляхи (наприклад, `GET /api/categories/`) та описуємо інтерфейси у файлі `src/store/types.ts`. Це застрахує нас від помилок у буквах.

### Крок 2: Створюємо файл ендпоінтів

В папці `endpoints/` створюємо файл `categoriesEndpoints.ts`. Ми використовуємо метод `api.injectEndpoints` і «впорскуємо» нові адреси в наш головний сервіс.

> 💡 **Запам'ятай золоте правило:**
>
> - Якщо ми дані **БЕРЕМО** (запит `GET`) — використовуємо `builder.query`.
> - Якщо ми дані **ЗМІНЮЄМО/ВІДПРАВЛЯЄМО** (`POST`, `PUT`, `PATCH`, `DELETE`) — використовуємо `builder.mutation`.

**Приклад коду:**

```typescript
import { api } from '../api';
import { Category } from '../types';

const categoriesEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET запит, тому використовуємо builder.query
    getCategories: builder.query<Category[], void>({
      query: () => '/api/categories/',
    }),
    // POST запит, тому використовуємо builder.mutation
    createCategory: builder.mutation<Category, CategoryCreateInput>({
      query: (body) => ({ url: '/api/categories/', method: 'POST', body }),
    }),
  }),
});

// RTK Query автоматично згенерує готові React-хуки!
export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoriesEndpoints;
```

### Крок 3: Використовуємо хук у Next.js компоненті

Тепер у будь-якому клієнтському компоненті ти просто викликаєш цей хук. Тобі **не потрібно** писати `useEffect`, `useState`, обробляти помилки вручну — RTK Query все зробив за тебе:

```typescript
'use client';

import { useGetCategoriesQuery } from '@/store/endpoints/categoriesEndpoints';

export default function CategoryList() {
  // Хук сам дає нам дані, статус завантаження та помилки
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  if (isLoading) return <div>Завантаження категорій...</div>;
  if (isError) return <div>Помилка при завантаженні</div>;

  return (
    <ul>
      {categories?.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}
```

## 💻 Частина 5: Як Ендпоінти та Слайси працюють у парі?

Найкращий приклад взаємодії — це **Вхід на сайт (Логін)**:

1. **Компонент (`LoginForm.tsx`):** Користувач вводить пароль і тисне кнопка "Увійти".
2. **Виклик Кур'єра (RTK Query Mutation):** Компонент викликає хук `const [login] = useLoginMutation()`. Запит із паролем летить на бекенд за адресою `/api/login/`.
3. **Відповідь Сервера:** Сервер каже: _"Все супер, ось твій `access` токен"_.
4. **Робота зі Слайсом (Redux Toolkit):** Компонент отримує цей токен. Ми записуємо його в `localStorage` (щоб авторизація не злітала при перезавантаженні сторінки). І за допомогою функції `dispatch(setToken(token))` кладемо його в наш клієнтський **Слайс** `userSlice`.
5. **Оновлення всього сайту:** Слайс змінює свій стан на `status: 'authenticated'`. Шапка сайту (`Header.tsx`), яка підписана на цей слайс, миттєво це бачить, ховає кнопку "Увійти" і показує аватарку користувача.

**Схема взаємодії:**

```
Користувач клікає "Логін"
       ↓
LoginForm.tsx викликає useLoginMutation()
       ↓
RTK Query відправляє POST /api/login/
       ↓
Сервер повертає { access: "token123" }
       ↓
dispatch(setToken("token123"))
       ↓
userSlice оновлює Redux Store
       ↓
Header.tsx бачить status: 'authenticated'
       ↓
Сайт показує аватарку користувача
```

## 📦 Частина 6: Redux Persist — збереження даних при перезавантаженні

Щоб дані у **кошику** або **списку бажань** не терялись при перезавантаженні браузера, ми використовуємо `redux-persist`.

### Як це працює?

1. У файлі `src/store/store.ts` ми налаштували **whitelist**, що вказує, які слайси потрібно зберігати:

```typescript
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist'],
};
```

2. Це означає: _"Зберігай тільки `cart` і `wishlist` у `localStorage`"_.
3. При перезавантаженні браузера `PersistGate` у `providers.tsx` автоматично відновлює ці дані.

**Приклад слайса з persist:**

```typescript
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
      // redux-persist автоматично збереже ці зміни
    },
  },
});
```

## 🛠️ Три корисні інструменти для самоперевірки

1. **Вкладка Network (Мережа) в браузері (F12):** Якщо хук повертає помилку, завжди дивись туди. Там ти побачиш точний URL, який туди пішов, та відповідь від бэкенду в блоці `Response`.
2. **Redux DevTools:** Обов'язково встанови розширення для браузера Redux DevTools. Це як рентген для твого додатку: там видно кожну мутацію, кожен екшен кошика та поточний стан усього сайту в реальному часі.
3. **Консоль терминалу Next.js:** Не забувай, що якщо ти вносиш зміни або додаєш нові змінні у файл `.env.local`, потрібно обов'язково перезапустити локальний сервер в терміналі (`npm run dev`), інакше додаток їх не побачить.

## 📝 Практичні приклади в проекті

### Приклад 1: Використання `useGetCategoriesQuery`

```typescript
'use client';
import { useGetCategoriesQuery } from '@/store/endpoints/categoriesEndpoints';

export default function CatalogPage() {
  const { data, isLoading, error } = useGetCategoriesQuery();
  // Компонент автоматично перерисується при приході даних
  return <>{/* Твій JSX */}</>;
}
```

### Приклад 2: Додавання товару в кошик

```typescript
'use client';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';

export default function ProductCard({ productId }: { productId: number }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ productId, quantity: 1 }));
    // Дані автоматично збережуться в localStorage завдяки redux-persist
  };

  return <button onClick={handleAddToCart}>Додати в кошик</button>;
}
```

### Приклад 3: Логін та збереження токена

```typescript
'use client';
import { useLoginMutation } from '@/store/endpoints/authEndpoints';
import { useAppDispatch } from '@/store/hooks';
import { setToken } from '@/store/slices/userSlice';

export default function LoginForm() {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({
        email_or_phone: email,
        password
      }).unwrap();

      // Зберігаємо токен у локальному сховищі
      localStorage.setItem('accessToken', result.access);
      localStorage.setItem('refreshToken', result.refresh);

      // Оновлюємо Redux Toolkit слайс
      dispatch(setToken(result.access));
    } catch (error) {
      console.error('Помилка логіну:', error);
    }
  };

  return <>{/* Твій JSX з формою */}</>;
}
```

## 🎯 Чек-лист для нової фічі

Коли додаєш нову фічу, слідкуй за цим чек-листом:

- [ ] Переглянув документацію бекенда (Swagger)
- [ ] Додав типи в `src/store/types.ts`
- [ ] Створив файл `*Endpoints.ts` в папці `endpoints/`
- [ ] Використав `builder.query` для GET запитів
- [ ] Використав `builder.mutation` для POST/PUT/PATCH/DELETE запитів
- [ ] Експортував хуки з `use` префіксом
- [ ] Тестував у браузері (Network tab, Redux DevTools)
- [ ] Перезапустив `npm run dev` після змін у `.env.local`

---

**Успіхів у розробці!** 🚀
