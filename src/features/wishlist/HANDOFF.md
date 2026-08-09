# Wishlist / Favorites — handoff

Документ для второго фронтенд-разработчика, который будет делать избранное в профиле.

## Кратко

На витрине уже реализована **клиентская логика избранного**:

- добавление / удаление с карточек товаров;
- проверка авторизации;
- модалка «нужен вход»;
- счётчик в хедере.

**Страница списка избранного в профиле не делалась** — это зона профиля.

---

## Что уже работает

### 1. Добавление в избранное с карточек

Сердечко подключено в:

- `src/features/catalog/ui/CatalogProductCard/CatalogProductCard.tsx` — каталог;
- `src/features/landing/ui/sections/LandingProductCard/LandingProductCard.tsx` — лендинг, product card;
- `src/features/landing/ui/sections/FeaturedProductCard/FeaturedProductCard.tsx` — лендинг, featured product.

Общий компонент кнопки:

- `src/features/wishlist/ui/WishlistButton/WishlistButton.tsx`

### 2. Поведение

| Состояние | Что происходит |
|-----------|----------------|
| Не авторизован | По клику на сердечко открывается модалка «Потрібен вхід» |
| Авторизован | Товар добавляется / удаляется из Redux |
| Товар уже в избранном | Сердечко залито (`fill="currentColor"`) |

Кнопки в модалке:

- **Увійти** → открывает auth overlay (`login`);
- **Реєстрація** → открывает auth overlay (`register`).

### 3. Хедер

Файл: `src/widgets/WishList/WishList.tsx`

| Состояние | Поведение |
|-----------|-----------|
| Не авторизован | Клик открывает модалку входа |
| Авторизован | Ссылка ведёт на `/profile` |
| Счётчик | Badge с количеством товаров (макс. `9+`) |
| После logout | Счётчик скрыт, избранное очищено |

### 4. Хранение данных

- Redux slice: `src/store/slices/wishlistSlice.ts`
- Тип: `WishlistItem { productId: string }` (`src/store/types.ts`)
- Persist в `localStorage` через `redux-persist` (whitelist: `cart`, `wishlist` в `src/store/store.ts`)
- При `logout` избранное автоматически очищается (`extraReducers` в `wishlistSlice`)

---

## Структура файлов

```
src/features/wishlist/
  context/WishlistAuthProvider.tsx   # провайдер + модалка авторизации
  hooks/useWishlist.ts               # toggle, isInWishlist, items
  ui/WishlistButton/WishlistButton.tsx
  ui/LoginRequiredModal/LoginRequiredModal.tsx
  HANDOFF.md                         # этот файл

src/store/slices/wishlistSlice.ts
src/widgets/WishList/WishList.tsx    # иконка в хедере
```

Провайдер подключён в `src/app/providers.tsx` внутри `AuthOverlayProvider`:

```tsx
<AuthOverlayProvider>
  <WishlistAuthProvider>{children}</WishlistAuthProvider>
</AuthOverlayProvider>
```

---

## API для переиспользования

### Хук `useWishlist`

```ts
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';

const { items, isInWishlist, toggleWishlist } = useWishlist();

// items: WishlistItem[]  →  [{ productId: 'w-cloth-001' }, ...]
// isInWishlist('w-cloth-001') → boolean
// toggleWishlist('w-cloth-001') → add/remove (с проверкой auth)
```

### Хук `useWishlistAuth`

```ts
import { useWishlistAuth } from '@/features/wishlist/context/WishlistAuthProvider';

const { requireAuth } = useWishlistAuth();

// Если пользователь авторизован — выполняет callback и возвращает true
// Если нет — показывает модалку и возвращает false
requireAuth(() => {
  // действие только для авторизованных
});
```

### Redux actions

```ts
import {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '@/store/slices/wishlistSlice';

dispatch(addToWishlist({ productId: 'w-cloth-001' }));
dispatch(removeFromWishlist('w-cloth-001'));
dispatch(clearWishlist());
```

### Селектор

```ts
const items = useSelector((state: RootState) => state.wishlist.items);
```

---

## i18n

Ключи в `src/i18n/locales/en.ts` и `uk.ts`, секция `wishlist`:

| Ключ | Назначение |
|------|------------|
| `loginRequiredTitle` | Заголовок модалки |
| `loginRequiredText` | Текст модалки |
| `loginButton` | Кнопка входа |
| `registerButton` | Кнопка регистрации |
| `closeModal` | aria-label закрытия |

Использование: `t.wishlist.loginRequiredTitle`

---

## Что не сделано (зона профиля)

1. **Страница избранного** — `/wishlist` сейчас заглушка (`src/app/(public)/wishlist/page.tsx` → `StubPage`).
2. **Вкладка wishlist в профиле** — в `ProfileForm` её пока нет.
3. **Интеграция с бэкендом** — данные только в Redux / `localStorage`, без API.
4. **Синхронизация с сервером при логине** — не реализована.
5. **Сердечко на странице товара** (`ProductShowcase`) — не подключено, только на карточках.

---

## Важные нюансы

### `productId`

- Тип: `string`.
- В каталоге используются id из `src/data/products.json` (например `w-cloth-001`, `a-frag-001`).
- На лендинге id другие: `essentialTee`, `tobaccoVanille`, `lostCherry` и т.д. (`src/data/landingAssets.ts`).

При отображении списка в профиле нужно либо:

- хранить сразу id каталога;
- либо маппить landing-id → catalog-id.

Резолв товара по id:

```ts
import { getProductById } from '@/features/catalog/lib/catalogProductsData';
import { mapProductToCatalogCard } from '@/entities/product';

const product = getProductById(productId);
if (product) {
  const card = mapProductToCatalogCard(product, locale);
}
```

### Logout

После выхода локальное избранное сбрасывается. Когда появится API, при логине, вероятно, нужно будет:

1. загружать список с бэка;
2. мержить или заменять локальный стейт;
3. убрать или пересмотреть очистку в `extraReducers` на `logout`.

### Хедер

Сейчас сердечко ведёт на `/profile`. Когда появится вкладка избранного, имеет смысл обновить ссылку (например `/profile?tab=wishlist` или отдельный route).

---

## Предлагаемый план для профиля

1. Добавить вкладку / секцию wishlist в `src/features/profile/ui/ProfileForm/ProfileForm.tsx`.
2. Читать `items` из `useWishlist()` или `state.wishlist.items`.
3. Резолвить `productId` → карточки товара через `getProductById` + `mapProductToCatalogCard`.
4. Подключить API, когда бэкенд будет готов.
5. Обновить ссылку в хедере (`src/widgets/WishList/WishList.tsx`) на финальный route избранного.

---

## Связанные файлы вне `wishlist/`

| Файл | Роль |
|------|------|
| `src/app/providers.tsx` | Подключение `WishlistAuthProvider` |
| `src/store/store.ts` | Persist wishlist |
| `src/store/types.ts` | Тип `WishlistItem` |
| `src/features/orders/ui/AccountHeader.tsx` | Ссылка на `/wishlist` (пока заглушка) |
| `src/app/(public)/favorites/page.tsx` | Редирект на `/wishlist` |
