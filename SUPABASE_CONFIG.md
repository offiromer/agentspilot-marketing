# Supabase Configuration for Two-Environment Setup

This document explains how to configure Supabase to work with both the marketing site and main app.

---

## Overview

Both environments use the **SAME Supabase project**:
- **Marketing Site** (agentspilot-marketing): Handles signup/login
- **Main App** (neuronforge): Handles onboarding and dashboard

Users authenticate on the marketing site, then are redirected to the main app with session tokens.

---

## Required Supabase Configuration

### 1. Navigate to Supabase Dashboard

Go to: https://supabase.com/dashboard/project/[your-project-id]

### 2. Configure Authentication URLs

**Location**: Authentication → URL Configuration

#### Site URL
This is the primary URL for your application:

**Development**:
```
http://localhost:3001
```

**Production**:
```
https://agentspilot.ai
```

#### Redirect URLs
Add ALL these URLs (both development and production):

**Development URLs**:
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

**Production URLs** (update when deploying):
```
https://app.agentspilot.ai/auth/callback
https://agentspilot.ai/auth/callback
```

**Vercel Preview URLs** (for testing deployments):
```
https://*.vercel.app/auth/callback
```

> **Important**: The wildcard `*.vercel.app` allows all Vercel preview deployments to work

---

## 3. Email Templates (Optional)

If using email confirmation, update email templates:

**Location**: Authentication → Email Templates

### Confirm Signup Template

Update the redirect URL to point to marketing site:

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm your email</a></p>
```

### Reset Password Template

```html
<h2>Reset your password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery">Reset password</a></p>
```

---

## 4. OAuth Providers (If Using Google/GitHub/etc.)

**Location**: Authentication → Providers

### Google OAuth Configuration

1. Enable Google provider
2. Set redirect URL:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret

### Authorized JavaScript Origins

Add these to your Google Cloud Console:

**Development**:
```
http://localhost:3000
http://localhost:3001
```

**Production**:
```
https://agentspilot.ai
https://app.agentspilot.ai
```

### Authorized Redirect URIs

```
https://[your-project-ref].supabase.co/auth/v1/callback
```

---

## 5. Email Confirmation Settings

**Location**: Authentication → Settings

### Email Confirmation

**Recommended Setting**: Disabled (for beta/testing)

**Why?**:
- Faster user onboarding
- Less friction during signup
- Users can immediately access the app

**If Enabled**:
- Users must click email link before accessing app
- Update email templates (see above)
- Handle unconfirmed state in app

---

## 6. Security Settings

### Password Requirements

**Location**: Authentication → Settings → Password Policy

**Recommended**:
- Minimum length: 8 characters
- Require uppercase: Yes
- Require lowercase: Yes
- Require numbers: Yes
- Require special characters: Optional

### Rate Limiting

**Default settings are good for most apps**:
- 30 requests per hour per IP for signup
- 60 requests per hour per IP for signin

---

## 7. Verification Checklist

After configuration, verify:

- [ ] Site URL set to marketing domain
- [ ] All redirect URLs added (dev + production)
- [ ] OAuth providers configured (if using)
- [ ] Email templates updated (if using email confirmation)
- [ ] Both marketing and main app can authenticate
- [ ] Session transfers correctly between environments
- [ ] No CORS errors in browser console

---

## 8. Testing the Configuration

### Local Testing

1. Start both apps:
   ```bash
   # Terminal 1: Main app
   cd neuronforge
   npm run dev  # Port 3000

   # Terminal 2: Marketing site
   cd agentspilot-marketing
   npm run dev  # Port 3001
   ```

2. Test flow:
   - Visit http://localhost:3001
   - Click "Get Started"
   - Sign up with email/password OR Google
   - Should redirect to http://localhost:3000/onboarding
   - Complete onboarding
   - Should land on http://localhost:3000/v2/dashboard

3. Check browser console for:
   - No CORS errors
   - Session tokens in URL hash
   - "Session set successfully" message
   - No redirect loops

### Production Testing

After deploying:

1. Update Supabase redirect URLs with production URLs
2. Test complete signup flow
3. Test login flow
4. Test Google OAuth
5. Monitor Supabase logs for errors

---

## 9. Common Issues

### Issue: "Invalid redirect URL"

**Solution**: Ensure exact URL is added to Supabase redirect URLs list

### Issue: CORS error

**Solution**:
- Check Site URL matches your marketing domain
- Ensure both domains are in redirect URLs list

### Issue: Session not transferring

**Solution**:
- Verify SessionHandler is in main app layout
- Check browser console for token hash in URL
- Ensure NEXT_PUBLIC_MAIN_APP_URL is correct

### Issue: Email confirmation not working

**Solution**:
- Check email template redirect URL
- Verify SMTP settings (if custom email)
- Check spam folder

---

## 10. Environment Variables

Both apps need these Supabase variables:

### Marketing Site (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000  # or production URL
```

### Main App (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

> **Critical**: Use the EXACT SAME Supabase credentials in both apps

---

## 11. Production Deployment Checklist

Before going live:

- [ ] Update Site URL to production domain
- [ ] Add production redirect URLs
- [ ] Update environment variables in Vercel
- [ ] Test complete auth flow in production
- [ ] Enable email confirmation (optional)
- [ ] Set up custom email SMTP (optional)
- [ ] Configure rate limiting for production
- [ ] Set up monitoring/alerts

---

## 12. Support

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify all URLs match exactly
4. Test with incognito/private window
5. Check this doc's troubleshooting section

---

**Last Updated**: December 17, 2024
**Supabase Project**: jgccgkyhpwirgknnceoh
