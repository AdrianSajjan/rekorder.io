import { Button, Divider, Input } from '@rekorder.io/ui';
import { createFileRoute, Link } from '@tanstack/react-router';

import { GoogleIcon } from '../../components/icons/google';
import { PasswordInput } from '../../components/ui/password-input';

export const Route = createFileRoute('/(auth)/_layout/register')({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-8 px-8">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h3 className="text-xl font-semibold">Create your account</h3>

        <Button className="w-full !mt-6" color="accent" variant="outline">
          <GoogleIcon />
          <span>Sign up with Google</span>
        </Button>
        <p className="mt-3 text-xs font-medium text-accent-dark">
          By clicking “Sign up with Google” I agree to the Terms of Service, acknowledge Screech's Privacy Policy.
        </p>

        <Divider className="w-full mt-8 mb-6">or continue with email</Divider>

        <form className="w-full flex flex-col">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" />
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <PasswordInput id="password" indicator value="" onChange={console.log} />
          </div>
          <Button className="w-full !mt-6" color="primary" variant="solid">
            Sign up
          </Button>
          <p className="mt-3 text-xs font-medium text-accent-dark">
            By clicking “Sign up” I agree to the Terms of Service, acknowledge Screech's Privacy Policy.
          </p>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?&nbsp;
          <Link className="text-primary-main hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
