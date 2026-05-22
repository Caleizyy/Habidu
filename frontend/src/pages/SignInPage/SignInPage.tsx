import { SignInProps } from '@/components/navbar/types';
import { Button } from '@/components/ui/Button';
import { DEFAULT_AUTH, DEFAULT_LOGO } from '@/constants/NavBar.constants';
import { useAuth } from '@/context/AuthContext';
import * as React from 'react';

export function SignInPage({ logo = DEFAULT_LOGO, auth = DEFAULT_AUTH }: SignInProps): React.ReactNode {
  const { signup } = useAuth();
  return (
    <div className="bg-brand-bg flex min-h-screen flex-col items-center justify-center gap-8">
      <img src={logo.src} className="max-h-16 dark:invert" alt={logo.alt} />
      <h1 className="text-brand-dark font-sans text-6xl tracking-tight">Build habits together.</h1>
      <Button className="px-8 py-4 text-lg" onClick={signup}>
        {auth.signin.title}
      </Button>
    </div>
  );
}
