import { LoginPage } from './components/login';
import { RegisterPage } from './components/register';
import { useAuthenticationStore } from './store/authentication';

export function AuthenticationPage() {
  const { mode } = useAuthenticationStore();

  switch (mode) {
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
  }
}
