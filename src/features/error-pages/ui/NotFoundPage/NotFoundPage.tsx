import ErrorPage from '@/features/error-pages/ui/ErrorPage/ErrorPage';

export default function NotFoundPage() {
  return (
    <ErrorPage
      errorCode="404"
      title="Page not found"
      description="Oops! The page you're looking for can't be found. It may have been moved or doesn't exist anymore."
    />
  );
}
