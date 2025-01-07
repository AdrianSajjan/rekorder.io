import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/_layout')({
  component: AuthenticationLayout,
});

function AuthenticationLayout() {
  return (
    <main className="w-screen min-h-screen grid grid-cols-2">
      <Outlet />
      <div>Hello "/(auth)/_layout"!</div>
    </main>
  );
}
