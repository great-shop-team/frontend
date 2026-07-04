'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSyncExternalStore } from 'react';

import { useAuthOverlay } from '@/features/auth/context/AuthOverlayContext';
import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import LoginRequiredModal from '@/features/wishlist/ui/LoginRequiredModal/LoginRequiredModal';

type WishlistAuthContextValue = {
  requireAuth: (onAuthenticated?: () => void) => boolean;
};

const WishlistAuthContext = createContext<WishlistAuthContextValue | null>(null);

export default function WishlistAuthProvider({ children }: { children: React.ReactNode }) {
  const { hasSession } = useSessionEmail();
  const { openAuth } = useAuthOverlay();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const requireAuth = useCallback(
    (onAuthenticated?: () => void) => {
      if (hasSession) {
        onAuthenticated?.();
        return true;
      }

      setIsModalOpen(true);
      return false;
    },
    [hasSession],
  );

  const handleLogin = useCallback(() => {
    closeModal();
    openAuth('login');
  }, [closeModal, openAuth]);

  const handleRegister = useCallback(() => {
    closeModal();
    openAuth('register');
  }, [closeModal, openAuth]);

  const value = useMemo(() => ({ requireAuth }), [requireAuth]);

  return (
    <WishlistAuthContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <LoginRequiredModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />,
          document.body,
        )}
    </WishlistAuthContext.Provider>
  );
}

export function useWishlistAuth() {
  const context = useContext(WishlistAuthContext);

  if (!context) {
    throw new Error('useWishlistAuth must be used within WishlistAuthProvider');
  }

  return context;
}
