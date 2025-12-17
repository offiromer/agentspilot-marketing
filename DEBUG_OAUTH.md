# Debug OAuth Redirect Issue

## Test This

After logging in with Google, before the redirect happens:

1. Open Browser DevTools (F12)
2. Go to **Console** tab
3. Look for this log line:
   ```
   Onboarding status: true/false/undefined
   ```

## What It Means

- **`undefined`** → User has never completed onboarding → Redirects to `/onboarding` ✅ CORRECT
- **`false`** → User explicitly marked as not onboarded → Redirects to `/onboarding` ✅ CORRECT
- **`true`** → User completed onboarding → Redirects to `/v2/dashboard` ✅ CORRECT

## If You See `undefined` or `false` But Expect Dashboard

This means:
1. The user hasn't completed the onboarding flow in the main app yet
2. OR the onboarding completion wasn't saved correctly
3. OR you're testing with a different Google account than the one that completed onboarding

## To Fix

**Option 1: Complete Onboarding** (Recommended)
1. Let the redirect to `/onboarding` happen
2. Complete the onboarding flow in the main app
3. Next time you login, `onboarding_completed` will be `true` and you'll go to dashboard

**Option 2: Manually Set Onboarding Complete** (For testing)
1. Login to main app
2. Open browser console
3. Run:
   ```javascript
   const { createClient } = await import('@supabase/supabase-js');
   const supabase = createClient(
     'YOUR_SUPABASE_URL',
     'YOUR_SUPABASE_ANON_KEY'
   );
   await supabase.auth.updateUser({
     data: { onboarding_completed: true }
   });
   console.log('Onboarding marked as complete');
   ```
4. Logout and login again with Google

## If It's Redirecting to Root (`/`) Instead

That's a different issue. Let me know and I'll fix the redirect logic.
