import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { ErrorMessages, EventConfig } from '@rekorder.io/constants';
import { supabase } from '@rekorder.io/database';
import { Brand, Button, Divider, GoogleIcon, Hint, Input, Label, LoadingButton } from '@rekorder.io/ui';
import { unwrapError } from '@rekorder.io/utils';

import { useAuthenticationStore } from '../store/authentication';
import { PasswordInput, PasswordRegex } from './ui/password-input';

const RegisterSchema = z.object({
  email: z.string().nonempty('Please enter your email address').email('Please enter a valid email address'),
  password: z.string().nonempty('Please enter your password').regex(PasswordRegex, "Password doesn't meet the requirements"),
});

type IRegisterSchema = z.infer<typeof RegisterSchema>;

export function RegisterPage() {
  const authentication = useAuthenticationStore();
  const [isSubmitting, setSubmitting] = useState(false);

  const { handleSubmit, control } = useForm<IRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRegister: SubmitHandler<IRegisterSchema> = async ({ email, password }) => {
    try {
      setSubmitting(true);
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      await chrome.storage.local.set({ session: data.session, user: data.user });
      chrome.runtime.sendMessage({ type: EventConfig.AuthenticateSuccess });
    } catch (error) {
      toast.error(unwrapError(error, ErrorMessages.GenericError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      const [user, session] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);
      await chrome.storage.local.set({ session: session.data.session, user: user.data.user });
      chrome.runtime.sendMessage({ type: EventConfig.AuthenticateSuccess });
    } catch (error) {
      toast.error(unwrapError(error, ErrorMessages.GenericError));
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-10">
      <div className="w-full max-w-md flex flex-col items-center bg-card-background px-10 py-10 rounded-2xl shadow-sm">
        <Brand mode="collapsed" className="h-10 w-auto" />
        <h3 className="text-xl mt-4 font-semibold">Create your account</h3>
        <p className="text-sm text-center mt-1 text-text-muted">Welcome, please fill in the details to get started.</p>
        <Button className="w-full !mt-6" color="accent" variant="outline" onClick={handleRegisterWithGoogle}>
          <GoogleIcon />
          <span>Sign up with Google</span>
        </Button>
        <Divider className="w-full mt-7 mb-5">or continue with email</Divider>
        <form className="w-full flex flex-col" onSubmit={handleSubmit(handleRegister)}>
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
          <button className="text-primary-main hover:underline" onClick={() => authentication.setMode('login')}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
