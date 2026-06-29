import { SignInProps } from '@/components/navbar/types';
import { Button } from '@/components/ui/Button';
import { APP_LOGO, APP_NAME } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import * as React from 'react';
import googleLogo from '@/assets/Google_logo.png';
import backgroundImage from '@/assets/background 2.png';

export function SignInPage({ logo = APP_LOGO }: SignInProps): React.ReactNode {
  const { signin } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div className="flex flex-1">
        <div
          className="relative hidden flex-shrink-0 flex-col items-center justify-end overflow-hidden bg-cover bg-left p-8 lg:flex lg:w-3/4"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative flex w-full flex-shrink-0 flex-col items-center justify-center bg-white px-8 py-16 lg:w-1/4">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center justify-center gap-3">
              <img src={logo.src} className="h-15" alt={logo.alt} />
              <h2 className="text-5xl font-bold text-gray-900">{APP_NAME}</h2>
            </div>
            <p className="mb-6 text-center text-lg font-semibold text-gray-700">Ready to start building habits?</p>
            <Button
              onClick={signin}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
            >
              <img src={googleLogo} alt="Google" className="h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
