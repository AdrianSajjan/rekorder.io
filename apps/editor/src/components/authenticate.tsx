import { Button } from '@rekorder.io/ui';
import Illustration from '../assets/authentication/illustration.svg';
import { Lock } from '@phosphor-icons/react';

export function Authenticate() {
  return (
    <main className="h-screen w-screen bg-card-background flex flex-col items-center justify-center p-10 gap-10">
      <img src={Illustration} alt="" className="w-96 h-auto" />
      <div className="max-w-md w-full text-center">
        <h3 className="text-lg font-semibold">Session expired</h3>
        <p className="text-sm text-accent-dark mt-1 mb-6">
          Your session has expired. Please authenticate your session by clicking the button below to access the editor.
        </p>
        <Button variant="fancy" className="w-full">
          <Lock weight="bold" size={16} />
          <span>Authenticate Session</span>
        </Button>
      </div>
    </main>
  );
}
