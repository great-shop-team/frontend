'use client';

import { Suspense } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AuthOverlayProvider from '@/features/auth/context/AuthOverlayProvider';
import AuthBootstrap from '@/features/auth/ui/AuthBootstrap';
import WishlistAuthProvider from '@/features/wishlist/context/WishlistAuthProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import { persistor, store } from '@/store/store';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthBootstrap />
      <Suspense fallback={null}>
        <AuthOverlayProvider>
          <WishlistAuthProvider>{children}</WishlistAuthProvider>
        </AuthOverlayProvider>
      </Suspense>
    </I18nProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const app = (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProviders>{children}</AppProviders>
      </PersistGate>
    </Provider>
  );

  if (!googleClientId) {
    return app;
  }

  return <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>;
}
