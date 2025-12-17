# AgentsPilot Marketing Site - Deployment Guide

**Last Updated**: December 17, 2024

This guide covers deploying the agentspilot-marketing site to Vercel and ensuring it works seamlessly with the main neuronforge application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Variables Configuration](#environment-variables-configuration)
5. [Supabase Configuration](#supabase-configuration)
6. [Domain Setup](#domain-setup)
7. [Testing After Deployment](#testing-after-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Production Checklist](#production-checklist)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository: agentspilot-marketing committed and pushed
- [ ] Vercel account with access to your organization
- [ ] Supabase project credentials (same as neuronforge)
- [ ] Main app (neuronforge) already deployed to Vercel
- [ ] Local testing completed successfully

---

## Local Testing

Before deploying to Vercel, test the complete flow locally.

### 1. Start Both Applications

**Terminal 1: Main App (neuronforge)**
```bash
cd /Users/yaelomer/Documents/neuronforge
npm run dev
# Should run on http://localhost:3000
```

**Terminal 2: Marketing Site (agentspilot-marketing)**
```bash
cd /Users/yaelomer/Documents/agentspilot-marketing
npm run dev
# Should run on http://localhost:3001
```

### 2. Test Complete User Flow

**Signup Flow**:
1. Visit http://localhost:3001
2. Click "Get Started" or "Start Free Trial"
3. Fill out signup form
4. Submit
5. Should redirect to http://localhost:3000/onboarding with tokens in URL hash
6. Complete onboarding
7. Should land on http://localhost:3000/v2/dashboard

**Login Flow**:
1. Visit http://localhost:3001/login
2. Enter credentials
3. Submit
4. Should redirect to http://localhost:3000/onboarding (if not completed) or http://localhost:3000/v2/dashboard

**Google OAuth Flow**:
1. Visit http://localhost:3001/login
2. Click "Continue with Google"
3. Complete Google authentication
4. Should redirect to main app with session

### 3. Check Browser Console

Look for:
- ✅ "Session set successfully" message
- ✅ No CORS errors
- ✅ No "Invalid redirect URL" errors
- ✅ Session tokens in URL hash before SessionHandler clears them
- ✅ No redirect loops

### 4. Verify Session Transfer

1. After redirect to main app, open browser DevTools
2. Go to Application → Local Storage → http://localhost:3000
3. Should see Supabase session keys populated
4. User should be authenticated and see protected content

---

## Vercel Deployment

### Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your Git provider (GitHub)
4. Find and import `agentspilot-marketing` repository
5. Click "Import"

### Step 2: Configure Project Settings

**Framework Preset**: Next.js
**Root Directory**: `./` (default)
**Build Command**: `npm run build` (default)
**Output Directory**: `.next` (default)
**Install Command**: `npm install` (default)

**Node.js Version**: 18.x or higher

### Step 3: Configure Environment Variables

Click "Environment Variables" and add the following:

#### Required Variables

```bash
# Main App URL - THIS IS CRITICAL
NEXT_PUBLIC_MAIN_APP_URL=https://app.agentspilot.ai
# For testing with preview URLs, use: https://your-neuronforge-app.vercel.app

# Supabase Configuration (copy from neuronforge)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Optional Variables (Contact Form)

```bash
# Gmail OAuth for Contact Form
GMAIL_USER=your_email@gmail.com
GMAIL_CLIENT_ID=your_gmail_oauth_client_id
GMAIL_CLIENT_SECRET=your_gmail_oauth_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_oauth_refresh_token
```

**Important Notes**:
- Use the **EXACT SAME** Supabase credentials as neuronforge
- For `NEXT_PUBLIC_MAIN_APP_URL`, use your neuronforge production URL
- Click "Add" for each variable
- Select environment: Production, Preview, Development (or as needed)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a preview URL: `https://agentspilot-marketing-xxx.vercel.app`

---

## Environment Variables Configuration

### Where to Find Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Where to Find Main App URL

**Development**: http://localhost:3000

**Production**:
- If using custom domain: https://app.agentspilot.ai
- If using Vercel URL: https://your-neuronforge-app.vercel.app

**How to Find Your Neuronforge Vercel URL**:
1. Go to Vercel Dashboard
2. Select neuronforge project
3. Copy the production URL from the deployment

---

## Supabase Configuration

After deployment, update Supabase redirect URLs.

### 1. Add Vercel Preview URL to Redirect URLs

**Location**: Supabase Dashboard → Authentication → URL Configuration

Add your new Vercel preview URL:
```
https://agentspilot-marketing-xxx.vercel.app/auth/callback
```

**Wildcard Option** (recommended for previews):
```
https://*.vercel.app/auth/callback
```

### 2. Update Site URL (When Using Custom Domain)

When you configure agentspilot.ai domain:

**Site URL**:
```
https://agentspilot.ai
```

### 3. Verify All Redirect URLs

Your Supabase redirect URLs should include:

**Development**:
- http://localhost:3000/auth/callback
- http://localhost:3001/auth/callback

**Vercel Previews**:
- https://*.vercel.app/auth/callback

**Production** (when ready):
- https://agentspilot.ai/auth/callback
- https://app.agentspilot.ai/auth/callback

**Full Instructions**: See [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)

---

## Domain Setup

### Option 1: Use Vercel Preview URL (Testing)

**No additional setup needed**. Use the Vercel-provided URL:
```
https://agentspilot-marketing-xxx.vercel.app
```

**Pros**: Quick, no DNS configuration
**Cons**: Long URL, not branded

---

### Option 2: Configure Custom Domain (Production)

#### Step 1: Add Domain in Vercel

1. Go to Vercel Dashboard → agentspilot-marketing project
2. Click "Settings" → "Domains"
3. Add domain: `agentspilot.ai`
4. Vercel will provide DNS records

#### Step 2: Configure DNS

Add these records in your domain registrar:

**For Vercel**:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait**: DNS propagation takes 5-60 minutes

#### Step 3: Verify Domain

1. Return to Vercel Domains settings
2. Click "Verify"
3. Once verified, domain is live

#### Step 4: Update Environment Variables

Update `NEXT_PUBLIC_MAIN_APP_URL` if needed:
- Marketing site on: https://agentspilot.ai
- Main app on: https://app.agentspilot.ai (configure separately)

#### Step 5: Update Supabase

Update Site URL and Redirect URLs in Supabase to use production domains.

---

## Testing After Deployment

### 1. Basic Site Load Test

1. Visit your deployed marketing site
2. Navigate through pages:
   - Home page
   - Features
   - Pricing (test calculator)
   - About
   - Contact (test form submission)
3. Check browser console for errors

### 2. Signup Flow Test

**Test User 1: New Email Signup**
1. Go to marketing site
2. Click "Get Started"
3. Enter new email/password
4. Submit
5. **Expected**: Redirect to main app `/onboarding` with tokens
6. Complete onboarding
7. **Expected**: Land on main app `/v2/dashboard`

**Test User 2: Google OAuth**
1. Go to marketing site
2. Click "Continue with Google"
3. Complete Google auth
4. **Expected**: Redirect to main app with session

### 3. Login Flow Test

**Test Existing User**
1. Go to marketing site `/login`
2. Enter credentials
3. Submit
4. **Expected**: Redirect to main app `/v2/dashboard` (if onboarded) or `/onboarding`

### 4. Session Verification

After redirect to main app:
1. Open DevTools → Console
2. Look for: `[SessionHandler] Session set successfully for user: [email]`
3. Check Application → Local Storage → Supabase keys should be present
4. User should see protected content (dashboard, agents, etc.)

### 5. Error Testing

**Test Invalid Credentials**:
- Should show error message on marketing site
- Should NOT redirect to main app

**Test Network Issues**:
- Disconnect internet during signup
- Should show appropriate error message

### 6. Mobile Testing

Test on:
- iPhone Safari
- Android Chrome
- Tablet devices

Check:
- Responsive design
- Forms work correctly
- Redirects work on mobile
- No layout issues

---

## Troubleshooting

### Issue: "Invalid redirect URL" Error

**Symptoms**: After login, see error message about invalid redirect

**Solution**:
1. Check Supabase redirect URLs list
2. Ensure your deployed URL is added exactly: `https://your-url.vercel.app/auth/callback`
3. Wait 30 seconds after adding (Supabase caching)
4. Try again

### Issue: Redirects to Main App But No Session

**Symptoms**: Redirected to main app, but still see login page or unauthenticated state

**Possible Causes**:
1. **SessionHandler not in layout**: Check [neuronforge/app/layout.tsx](../neuronforge/app/layout.tsx)
2. **Tokens not in URL hash**: Check browser console for SessionHandler logs
3. **Different Supabase credentials**: Ensure both apps use EXACT SAME credentials

**Solution**:
1. Check browser console for SessionHandler logs
2. Verify environment variables match exactly
3. Check SessionHandler is imported in neuronforge layout
4. Look at Network tab → check Supabase API calls

### Issue: CORS Errors

**Symptoms**: Browser console shows CORS errors

**Solution**:
1. Verify Site URL in Supabase matches marketing site URL
2. Check redirect URLs include both marketing and main app domains
3. Clear browser cache and try again

### Issue: Onboarding Loop

**Symptoms**: After completing onboarding, redirected back to onboarding

**Possible Causes**:
1. `onboarding_completed` not being saved to user_metadata
2. Different Supabase projects between apps

**Solution**:
1. Check Supabase users table → user_metadata should have `onboarding_completed: true`
2. Verify both apps connect to the same Supabase project
3. Check neuronforge onboarding completion logic

### Issue: Contact Form Not Working

**Symptoms**: Contact form submission fails

**Possible Causes**:
1. Missing Gmail OAuth environment variables
2. Invalid Gmail credentials
3. API route not deployed correctly

**Solution**:
1. Verify all Gmail environment variables are set in Vercel
2. Test API route directly: `https://your-site.vercel.app/api/contact`
3. Check Vercel function logs for errors

### Issue: Pricing Calculator Not Working

**Symptoms**: Calculator doesn't update or shows errors

**Possible Causes**:
1. Missing static configuration files
2. JavaScript error in component

**Solution**:
1. Check browser console for errors
2. Verify `lib/config/pricingConfig.ts` and `lib/config/aisRanges.ts` exist
3. Check build logs for compilation errors

---

## Production Checklist

Before going live with custom domain:

### Pre-Deployment
- [ ] All local tests passing
- [ ] Both apps use same Supabase credentials
- [ ] SessionHandler verified in neuronforge
- [ ] Environment variables documented
- [ ] Marketing code marked for deletion in neuronforge

### Vercel Configuration
- [ ] Marketing site deployed to Vercel
- [ ] Build successful with no errors
- [ ] Environment variables set correctly
- [ ] Preview deployment tested and working

### Supabase Configuration
- [ ] Site URL updated (if using custom domain)
- [ ] All redirect URLs added (dev + production)
- [ ] OAuth providers configured
- [ ] Email templates reviewed
- [ ] Rate limiting appropriate for production

### Domain Configuration
- [ ] Custom domain added to Vercel
- [ ] DNS records configured
- [ ] Domain verified and SSL active
- [ ] WWW redirect configured

### Authentication Testing
- [ ] Email/password signup works
- [ ] Google OAuth works
- [ ] Login flow works
- [ ] Session transfers correctly
- [ ] Onboarding completes successfully
- [ ] Dashboard accessible after onboarding

### End-to-End Testing
- [ ] Complete signup flow (new user)
- [ ] Complete login flow (existing user)
- [ ] Mobile device testing
- [ ] Different browsers tested
- [ ] Network error handling tested
- [ ] No console errors

### Monitoring Setup
- [ ] Vercel analytics enabled
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Supabase logs monitored
- [ ] User feedback mechanism in place

### Documentation
- [ ] README updated with two-repo architecture
- [ ] Team notified of new deployment
- [ ] Rollback plan documented
- [ ] Support team briefed on new flow

### Post-Deployment
- [ ] Monitor first 24 hours for issues
- [ ] Check error logs daily for first week
- [ ] Collect user feedback
- [ ] Verify analytics tracking

### After 1-2 Weeks of Stable Operation
- [ ] Archive marketing code in neuronforge (create branch)
- [ ] Delete marketing folder from neuronforge
- [ ] Update neuronforge documentation

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Journey                            │
└─────────────────────────────────────────────────────────────┘

1. User visits: https://agentspilot.ai
   └─ Marketing Site (agentspilot-marketing)
      ├─ Browse features, pricing, etc.
      └─ Click "Get Started" or "Login"

2. User signs up/logs in
   └─ Marketing site authenticates with Supabase
      ├─ Gets session (access_token, refresh_token)
      └─ Redirects with tokens in URL hash

3. Redirect to: https://app.agentspilot.ai/onboarding#access_token=xxx&refresh_token=yyy
   └─ Main App (neuronforge)
      ├─ SessionHandler reads tokens from hash
      ├─ Calls supabase.auth.setSession()
      ├─ Clears hash from URL
      └─ User is now authenticated

4. User completes onboarding
   └─ Redirect to: https://app.agentspilot.ai/v2/dashboard
      └─ User accesses full app features

┌─────────────────────────────────────────────────────────────┐
│                 Shared Infrastructure                       │
└─────────────────────────────────────────────────────────────┘

Single Supabase Project:
  ├─ Authentication (shared)
  ├─ Users table (shared)
  └─ Session management (shared)

Both apps use:
  ├─ Same NEXT_PUBLIC_SUPABASE_URL
  ├─ Same NEXT_PUBLIC_SUPABASE_ANON_KEY
  └─ Same SUPABASE_SERVICE_ROLE_KEY
```

---

## Support and Resources

### Documentation
- [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md) - Supabase configuration guide
- [MARKETING_CODE_TO_DELETE.md](../neuronforge/MARKETING_CODE_TO_DELETE.md) - Marketing cleanup plan
- [TWO_REPO_ARCHITECTURE.md] (future) - Detailed architecture documentation

### External Resources
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

### Troubleshooting
- Vercel Logs: Dashboard → Project → Deployments → Click deployment → Logs
- Supabase Logs: Dashboard → Logs → Auth logs
- Browser Console: F12 → Console tab

---

## Rollback Plan

If critical issues occur after deployment:

### Option 1: Rollback to Previous Deployment
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Option 2: Emergency Redirect
Temporarily redirect marketing site to main app:

**In Vercel Dashboard**:
1. Settings → Redirects
2. Add: `/ → https://app.agentspilot.ai`

### Option 3: Restore Marketing Code in Neuronforge
If marketing site fails completely:

```bash
cd /Users/yaelomer/Documents/neuronforge
git checkout archive/marketing-code-pre-deletion -- app/\(marketing\)
git commit -m "Emergency: Restore marketing code"
git push
```

---

**Deployment Status**: Ready for deployment
**Testing Status**: Pending local testing completion
**Production Status**: Not yet live

**Last Updated**: December 17, 2024
