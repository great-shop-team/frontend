import NotFoundPage from '@/features/error-pages/ui/NotFoundPage/NotFoundPage';

export default function GlobalNotFound() {
  return (
    <>
      <style>{`
        header,
        footer {
          display: none !important;
        }

        .layout-container {
          max-width: 100% !important;
          padding-inline: 0 !important;
        }

        .layout-container > .flex-1 > main {
          padding-top: 0 !important;
        }
      `}</style>
      <NotFoundPage />
    </>
  );
}

