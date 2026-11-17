import ErrorPage from '@/features/error-pages/ui/ErrorPage/ErrorPage';

export default function ServerErrorPage() {
  return (
    <ErrorPage
      errorCode="500"
      title="Something went wrong on our end"
      description="We're experiencing technical difficulties on our server. Our team has been notified and is working to fix this problem. Please try again later."
    />
  );
}
