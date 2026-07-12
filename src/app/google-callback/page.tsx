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
          // Безопасно передаем JWT токен в родительское окно кнопки
          window.opener.postMessage(
            { type: 'GOOGLE_AUTH_SUCCESS', idToken },
            window.location.origin,
          );
        }
      }
      // Закрываем поп-ап окно сразу после передачи данных
      window.close();
    }
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white font-sans text-sm text-gray-500">
      Authenticating, please wait...
    </div>
  );
}
