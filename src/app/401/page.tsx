import ErrorPage from '@/features/error-pages/ui/ErrorPage/ErrorPage';

export default function UnauthorizedPage() {
  return (
    <ErrorPage
      errorCode="401"
      title="Unauthorized access"
      description="Sorry, you don't have permission to access this page. Please sign in with an account that has the required permissions."
    />
  );
}
