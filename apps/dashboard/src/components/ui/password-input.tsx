'use client';

import { Check, Eye, EyeSlash, X } from '@phosphor-icons/react';
import { ChangeEvent, forwardRef, Fragment, useState } from 'react';

import { Input, InputProps } from '@rekorder.io/ui';
import { cn } from '@rekorder.io/utils';

interface PasswordInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;

  indicator?: boolean;
  hint?: React.ReactNode;
}

const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
];

function checkStrengthColor(score: number) {
  if (score === 0) return '!bg-borders-input';
  if (score <= 1) return '!bg-red-500';
  if (score <= 2) return '!bg-orange-500';
  if (score === 3) return '!bg-amber-500';
  return '!bg-emerald-500';
}

function checkStrengthText(score: number) {
  if (score === 0) return 'Enter a password';
  if (score <= 2) return 'Weak password';
  if (score === 3) return 'Medium password';
  return 'Strong password';
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ indicator, hint, value, className, onChange, ...props }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleToggleVisibility = () => {
    setVisible((state) => !state);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  const strength = requirements.map(({ regex, text }) => ({ met: regex.test(value), text }));
  const score = strength.filter((requirement) => requirement.met).length;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative w-full">
        <Input
          ref={ref}
          placeholder="Password"
          aria-invalid={score < 4}
          type={visible ? 'text' : 'password'}
          value={value}
          className={cn(className, '!pe-10 !w-full')}
          onChange={handleChangePassword}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center rounded-e-xl text-text-muted outline-offset-0 transition-colors hover:text-accent-dark focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-main/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleToggleVisibility}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls="password"
        >
          {visible ? <EyeSlash size={16} weight="fill" aria-hidden="true" /> : <Eye size={16} weight="fill" aria-hidden="true" />}
        </button>
      </div>
      {hint}
      {indicator ? (
        <Fragment>
          <div
            aria-valuemin={0}
            aria-valuemax={4}
            role="progressbar"
            aria-valuenow={score}
            aria-label="Password strength"
            className="my-3 h-1 w-full overflow-hidden rounded-full bg-borders-input"
          >
            <div className={cn('h-full transition-all duration-500 ease-out', checkStrengthColor(score))} style={{ width: (score / 4) * 100 + '%' }} />
          </div>
          <p className="mb-2 text-sm font-medium text-background-text">{checkStrengthText(score)}. Must contain:</p>
          <ul className="space-y-1.5" aria-label="Password requirements">
            {strength.map((request, index) => (
              <li key={index} className="flex items-center gap-2">
                {request.met ? (
                  <Check weight="bold" size={14} className="text-emerald-500" aria-hidden="true" />
                ) : (
                  <X weight="bold" size={14} className="text-accent-dark/80" aria-hidden="true" />
                )}
                <span className={cn('text-xs', request.met ? 'text-emerald-600' : 'text-accent-dark')}>
                  {request.text}
                  <span className="sr-only">{request.met ? ' - Requirement met' : ' - Requirement not met'}</span>
                </span>
              </li>
            ))}
          </ul>
        </Fragment>
      ) : null}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput, PasswordRegex, type PasswordInputProps };
