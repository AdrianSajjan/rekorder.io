import { createFileRoute } from '@tanstack/react-router';
import { Spinner, theme } from '@rekorder.io/ui';

export const Route = createFileRoute('/auth/_layout/callback')({
  component: AuthenticationCallback,
});

function AuthenticationCallback() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      <Spinner size={32} color={theme.colors.primary.main} />
      <p className="text-sm text-card-text font-medium mt-2">Your session is being authenticated...</p>
    </div>
  );
}
