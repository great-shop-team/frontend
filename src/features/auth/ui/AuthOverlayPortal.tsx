'use client';

import type { AuthView } from '@/features/auth/lib/authViews';
import AuthFlow from '@/features/auth/ui/AuthFlow/AuthFlow';
import AuthShell from '@/features/auth/ui/AuthShell/AuthShell';

type LoginHint = {
  text: string;
  type: 'success' | 'error';
};

type AuthOverlayPortalProps = {
  view: AuthView;
  verifyEmail: string;
  loginEmail: string;
  loginHint: LoginHint;
  onViewChange: (view: AuthView) => void;
  onVerifyEmailChange: (email: string) => void;
  onLoginEmailChange: (email: string) => void;
  onLoginHintChange: (hint: LoginHint) => void;
  onClose: () => void;
};

export default function AuthOverlayPortal({
  view,
  verifyEmail,
  loginEmail,
  loginHint,
  onViewChange,
  onVerifyEmailChange,
  onLoginEmailChange,
  onLoginHintChange,
  onClose,
}: AuthOverlayPortalProps) {
  return (
    <div id="auth-overlay">
      <AuthShell onBackdropClick={onClose}>
        <AuthFlow
          view={view}
          verifyEmail={verifyEmail}
          loginEmail={loginEmail}
          loginHint={loginHint}
          onViewChange={onViewChange}
          onVerifyEmailChange={onVerifyEmailChange}
          onLoginEmailChange={onLoginEmailChange}
          onLoginHintChange={onLoginHintChange}
          onLoginSuccess={onClose}
          onWelcomeComplete={onClose}
        />
      </AuthShell>
    </div>
  );
}
