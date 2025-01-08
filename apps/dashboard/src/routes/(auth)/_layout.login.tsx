import { Button, Divider, Input } from '@rekorder.io/ui';
import { createFileRoute, Link } from '@tanstack/react-router';

import { AppleIcon } from '../../components/icons/apple';
import { GoogleIcon } from '../../components/icons/google';

export const Route = createFileRoute('/(auth)/_layout/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-8 px-8">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h3 className="text-xl font-semibold">Log in to your account</h3>

        <Button className="w-full !mt-6" color="accent" variant="outline">
          <GoogleIcon />
          <span>Log in with Google</span>
        </Button>
        <Button className="w-full !mt-3" color="secondary">
          <AppleIcon fill="#ffffff" />
          <span>Log in with Apple</span>
        </Button>

        <Divider className="w-full mt-8 mb-6">or continue with email</Divider>

        <form className="w-full flex flex-col">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <Input />
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium">Password</label>
              <Link className="text-xs font-medium hover:underline" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <Input />
          </div>
          <Button className="w-full !mt-6" color="primary" variant="solid">
            Log in
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?&nbsp;
          <Link className="text-primary-main hover:underline" to="/register">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
