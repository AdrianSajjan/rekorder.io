import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Divider, Input, Label, Hint } from '@rekorder.io/ui';
import { createFileRoute, Link } from '@tanstack/react-router';

import { AppleIcon } from '../../components/icons/apple';
import { GoogleIcon } from '../../components/icons/google';
import { PasswordInput } from '../../components/ui/password-input';

export const Route = createFileRoute('/(auth)/_layout/login')({
  component: LoginPage,
});

const LoginSchema = z.object({
  email: z.string().nonempty('Please enter your email address').email('Please enter a valid email address'),
  password: z.string().nonempty('Please enter your password'),
});

type ILoginSchema = z.infer<typeof LoginSchema>;

function LoginPage() {
  const { handleSubmit, control } = useForm<ILoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<ILoginSchema> = (data) => {
    console.log(data);
  };

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
        <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              return (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="john@doe.com" {...field} />
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
                  <div className="flex justify-between items-end">
                    <Label htmlFor="password">Password</Label>
                    <Link className="text-xs font-medium hover:underline" to="/forgot-password">
                      Forgot password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
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
