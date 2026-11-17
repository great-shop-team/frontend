'use client';

import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AuthOverlayProvider from '@/features/auth/context/AuthOverlayProvider';
import AuthBootstrap from '@/features/auth/ui/AuthBootstrap';
import { CartDrawerProvider } from '@/features/cart/context/CartDrawerContext';
import WishlistAuthProvider from '@/features/wishlist/context/WishlistAuthProvider';
import WishlistSync from '@/features/wishlist/ui/WishlistSync';
import { I18nProvider } from '@/i18n/I18nProvider';
import { persistor, store } from '@/store/store';
import CartDrawer from '@/widgets/CartDrawer/CartDrawer';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthBootstrap />
      <WishlistSync />
      <Suspense fallback={null}>
        <AuthOverlayProvider>
          <WishlistAuthProvider>
            <CartDrawerProvider>
              {children}
              <CartDrawer />
            </CartDrawerProvider>
          </WishlistAuthProvider>
        </AuthOverlayProvider>
      </Suspense>
    </I18nProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProviders>{children}</AppProviders>
      </PersistGate>
    </Provider>
  );
}
