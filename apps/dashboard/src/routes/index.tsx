import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthenticationStore } from '../store/authentication';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const authentication = useAuthenticationStore.getState();

    switch (authentication.status) {
      case 'authenticated':
        return redirect({ to: '/dashboard/library' });

      case 'unauthenticated':
        return redirect({ to: '/auth/login' });
    }
  },
});
