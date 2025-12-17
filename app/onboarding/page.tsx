// Marketing site onboarding redirect
// Immediately redirects users to main app for onboarding
// The full onboarding flow lives in neuronforge (main app)

'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectToMainApp = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          console.error('No session found, redirecting to login');
          router.push('/login');
          return;
        }

        // Redirect to main app onboarding with session tokens
        const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000';
        console.log('Redirecting to main app onboarding...');
        window.location.href = `${mainAppUrl}/onboarding#access_token=${session.access_token}&refresh_token=${session.refresh_token}`;
      } catch (err) {
        console.error('Error during redirect:', err);
        router.push('/login');
      }
    };

    redirectToMainApp();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-slate-300">Redirecting to setup...</p>
      </div>
    </div>
  );
}