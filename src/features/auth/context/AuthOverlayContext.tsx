'use client';

import { createContext, useContext } from 'react';

import type { AuthView } from '@/features/auth/lib/authViews';

type LoginHint = {
  text: string;
  type: 'success' | 'error';
};

export type OpenAuthOptions = {
  email?: string;
  hintMessage?: string;
  hintType?: LoginHint['type'];
};

export type AuthOverlayContextValue = {
  isOpen: boolean;
  openAuth: (view?: AuthView, options?: OpenAuthOptions) => void;
  closeAuth: () => void;
};

export const AuthOverlayContext = createContext<AuthOverlayContextValue | null>(null);

export function useAuthOverlay() {
  const context = useContext(AuthOverlayContext);

  if (!context) {
    throw new Error('useAuthOverlay must be used within AuthOverlayProvider');
  }

  return context;
}
