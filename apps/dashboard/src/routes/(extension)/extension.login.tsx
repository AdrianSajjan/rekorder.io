import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { ErrorMessages, EventConfig, ExtensionConfig } from '@rekorder.io/constants';
import { supabase } from '@rekorder.io/database';
import { AppleIcon, Brand, Button, Divider, GoogleIcon, Hint, Input, Label, LoadingButton } from '@rekorder.io/ui';
import { unwrapError, wait } from '@rekorder.io/utils';

import { PasswordInput } from '../../components/ui/password-input';

const LoginSchema = z.object({
  email: z.string().nonempty('Please enter your email address').email('Please enter a valid email address'),
  password: z.string().nonempty('Please enter your password'),
});

type ILoginSchema = z.infer<typeof LoginSchema>;

export const Route = createFileRoute('/(extension)/extension/login')({
  component: LoginPage,
});

function LoginPage() {
  const [isSubmitting, setSubmitting] = useState(false);

  const { handleSubmit, control } = useForm<ILoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginWithPassword: SubmitHandler<ILoginSchema> = async ({ email, password }) => {
    setSubmitting(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      wait(1500).then(() => window.chrome.runtime.sendMessage(ExtensionConfig.ExtensionId, { type: EventConfig.AuthenticateSuccess, payload: data }));
      toast.success('You have been logged in, this tab will close automatically...');
    } catch (error) {
      toast.error(unwrapError(error, ErrorMessages.GenericError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://localhost:4200/extension/auth/callback',
        },
      });
    } catch (error) {
      toast.error(unwrapError(error, ErrorMessages.GenericError));
    }
  };

  const handleLoginWithApple = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'https://localhost:4200/extension/auth/callback',
        },
      });
    } catch (error) {
      toast.error(unwrapError(error, ErrorMessages.GenericError));
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-10 bg-background-light overscroll-none">
      <div className="w-full max-w-md flex flex-col items-center bg-card-background px-10 py-10 rounded-2xl shadow-sm">
        <Brand mode="collapsed" className="h-10 w-auto" />
        <h3 className="text-xl mt-4 font-semibold">Log in to Screech</h3>
        <p className="text-sm text-center mt-1 text-text-muted">Welcome back, let's get you back to work.</p>
        <Button className="w-full !mt-10" color="accent" variant="outline" onClick={handleLoginWithGoogle}>
          <GoogleIcon />
          <span>Log in with Google</span>
        </Button>
        <Button className="w-full !mt-3" color="secondary" onClick={handleLoginWithApple}>
          <AppleIcon fill="#ffffff" />
          <span>Log in with Apple</span>
        </Button>
        <Divider className="w-full mt-8 mb-6">or continue with email</Divider>
        <form className="w-full flex flex-col" onSubmit={handleSubmit(handleLoginWithPassword)}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              return (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="john@doe.com" autoComplete="email" {...field} />
                  <Hint invalid={invalid} error={error?.message}>
                    Enter your registered email address
                  </Hint>
                </div>
              );
            }}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              return (
                <div className="flex flex-col gap-1 mt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="/" className="text-xs font-medium hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    hint={
                      <Hint invalid={invalid} error={error?.message}>
                        Enter your password
                      </Hint>
                    }
                    {...field}
                  />
                </div>
              );
            }}
          />
          <LoadingButton loading={isSubmitting} className="w-full !mt-6" color="primary" variant="solid">
            Log in
          </LoadingButton>
        </form>
        <p className="text-sm text-center mt-4">
          Don't have an account?&nbsp;
          <Link className="text-primary-main hover:underline" to="/extension/register">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
