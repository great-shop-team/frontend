const PENDING_KEY = 'wearly_google_oauth_pending';
const RESULT_KEY = 'wearly_google_oauth_result';

export type GoogleOAuthPending = {
  acceptTerms: boolean;
  returnTo: string;
};

export type GoogleOAuthResult = {
  ok: boolean;
  message?: string;
};

export function saveGoogleOAuthPending(pending: GoogleOAuthPending) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function readGoogleOAuthPending(): GoogleOAuthPending | null {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GoogleOAuthPending;
    if (typeof parsed.acceptTerms !== 'boolean' || typeof parsed.returnTo !== 'string') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearGoogleOAuthPending() {
  sessionStorage.removeItem(PENDING_KEY);
}

export function saveGoogleOAuthResult(result: GoogleOAuthResult) {
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function consumeGoogleOAuthResult(): GoogleOAuthResult | null {
  const raw = sessionStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(RESULT_KEY);

  try {
    return JSON.parse(raw) as GoogleOAuthResult;
  } catch {
    return null;
  }
}

export function buildGoogleAuthUrl(clientId: string, redirectUri: string) {
  const nonce =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce,
    prompt: 'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
