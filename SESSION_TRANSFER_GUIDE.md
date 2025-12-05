# Session Transfer Guide

## Problem
When users log in on the marketing site and get redirected to the main app, the session doesn't transfer because they're separate Next.js instances with different localStorage.

## Solution
The marketing site passes the session tokens via URL hash, and the main app needs to read and set them.

## What the Marketing Site Does (ALREADY IMPLEMENTED)
Login and auth callback now redirect with tokens in the URL hash:
```
http://localhost:3000/v2/dashboard#access_token=xxx&refresh_token=yyy
```

## What the Main App Needs to Do

### Option 1: Add to Root Layout (Recommended)
In your main app's `app/layout.tsx`, add this client component:

```tsx
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function SessionHandler() {
  useEffect(() => {
    // Check for tokens in URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        console.log('Setting session from marketing site redirect...');
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(() => {
          // Clear hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          console.log('Session set successfully');
        });
      }
    }
  }, []);

  return null;
}
```

Then add `<SessionHandler />` to your root layout.

### Option 2: Add to Specific Pages
Add the same logic to `/v2/dashboard` and `/onboarding` pages.

### Option 3: Middleware (Advanced)
Use Next.js middleware to handle this at the edge.

## Testing
1. Start marketing site on a different port (or deploy separately)
2. Login from marketing site
3. Should redirect to main app with session intact
4. User should see dashboard without being logged out

## Security Note
Tokens in URL hash are client-side only (not sent to server), which is the standard OAuth implicit flow pattern used by Supabase.
