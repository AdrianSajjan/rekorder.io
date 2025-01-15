import { Button, Input } from '@rekorder.io/ui';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/_layout/password/forgot')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h3 className="text-xl font-semibold">Forgot your password?</h3>
        <p className="text-sm text-center mt-2 text-text-muted">
          Enter your email address registered with us and we'll send you a link to reset your password.
        </p>

        <form className="w-full flex flex-col mt-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <Input />
          </div>
          <Button className="w-full !mt-6" color="primary" variant="solid">
            Send reset link
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't need to reset you password?&nbsp;
          <Link className="text-primary-main hover:underline" to="/auth/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
