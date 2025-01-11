import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

import { supabase } from '@rekorder.io/database';
import { unwrapError } from '@rekorder.io/utils';
import { ErrorMessages } from '@rekorder.io/constants';
import { LoadingButton, Button, Divider, Hint, Input, Label } from '@rekorder.io/ui';
import { GoogleIcon } from '@rekorder.io/ui';

import { PasswordInput, PasswordRegex } from '../../components/ui/password-input';

export const Route = createFileRoute('/(auth)/_layout/register')({
  component: RegisterPage,
});

const RegisterSchema = z.object({
  email: z.string().nonempty('Please enter your email address').email('Please enter a valid email address'),
  password: z.string().nonempty('Please enter your password').regex(PasswordRegex, "Password doesn't meet the requirements"),
});

type IRegisterSchema = z.infer<typeof RegisterSchema>;

function RegisterPage() {
  const navigate = useNavigate();

  const [isSubmitting, setSubmitting] = useState(false);

  const { handleSubmit, control } = useForm<IRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin: SubmitHandler<IRegisterSchema> = async ({ email, password }) => {
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error(unwrapError(error, ErrorMessages.GenericError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-8 px-8">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h3 className="text-xl font-semibold">Create your account</h3>
        <p className="text-sm text-center mt-1 text-text-muted">Welcome, please fill in the details to get started.</p>
        <Button className="w-full !mt-8" color="accent" variant="outline">
          <GoogleIcon />
          <span>Sign up with Google</span>
        </Button>
        <Divider className="w-full mt-7 mb-5">or continue with email</Divider>
        <form className="w-full flex flex-col" onSubmit={handleSubmit(handleLogin)}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              return (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" autoComplete="email" placeholder="john@doe.com" {...field} />
                  <Hint invalid={invalid} error={error?.message}>
                    Enter your email address
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
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    indicator
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
          <LoadingButton loading={isSubmitting} className="w-full !mt-6" color="primary" variant="solid" type="submit">
            Sign up
          </LoadingButton>
          <p className="mt-3 text-xs font-medium text-accent-dark">By signing up, I agree to the Terms of Service, acknowledge Screech's Privacy Policy.</p>
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
