import { Spinner, theme } from '@rekorder.io/ui'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuthenticationStore } from '../../../store/authentication'
import { Sidebar } from '../../../components/layout/sidebar'

export const Route = createFileRoute('/dashboard/shared/_layout')({
  component: RecordingLayout,
})

function RecordingLayout() {
  const authentication = useAuthenticationStore()

  switch (authentication.status) {
    case 'unauthenticated':
      return (
        <main className="h-screen w-screen flex items-center justify-center p-8">
          <Spinner size={32} color={theme.colors.primary.main} />
          <p className="text-sm text-card-text font-medium mt-2">
            Session expired, please login again...
          </p>
          <Navigate to="/auth/login" />
        </main>
      )

    case 'authenticated':
      return (
        <section className="flex w-full h-full bg-card-background">
          <Sidebar />
          <Outlet />
        </section>
      )
  }
}
