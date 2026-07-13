'use client';

import { useEffect } from 'react';

export default function GoogleCallbackPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;

      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const idToken = params.get('id_token');

        if (idToken && window.opener) {
          // 1. Передаем токен родителю
          window.opener.postMessage(
            { type: 'GOOGLE_AUTH_SUCCESS', idToken },
            window.location.origin,
          );

          // 2. Даем 100мс задержки, чтобы блокировщики успели переварить событие postMessage
          setTimeout(() => {
            try {
              window.close();
            } catch (e) {
              console.error('Failed to close window via setTimeout', e);
            }
          }, 100);
        }
      }

      // 3. Запасной вызов закрытия, если токена нет или re-auth не удался
      try {
        window.close();
      } catch (e) {
        console.error('Failed to close window directly', e);
      }
    }
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white font-sans text-sm text-gray-500">
      Authenticating, please wait...
    </div>
  );
}
