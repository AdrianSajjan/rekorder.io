import { Spinner } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import { animate, theme } from '@rekorder.io/ui';

export const Route = createFileRoute('/extension/_layout/callback')({
  component: AuthenticationCallback,
});

function AuthenticationCallback() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-3">
      <Spinner size={32} weight="bold" style={{ animation: animate.spin }} color={theme.colors.primary.main} />
      <p className="text-sm text-card-text font-medium">Your session is being authenticated...</p>
    </div>
  );
}
