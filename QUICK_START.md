# Quick Start: Deploy to Vercel

**This guide gets your marketing site deployed in 5 minutes.**

---

## What You Need

1. Your Vercel account
2. Your Supabase credentials (already in `.env.local`)
3. Your neuronforge production URL

---

## Step 1: Deploy to Vercel (2 minutes)

### 1.1 Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Find **"agentspilot-marketing"** repository
4. Click **"Import"**

### 1.2 Configure Settings

**Framework Preset**: Next.js ✓ (auto-detected)

Leave all other build settings as default.

### 1.3 Add Environment Variables

Click **"Environment Variables"** and add these 4 variables:

**Copy these exact values from your `.env.local` file:**

```bash
# 1. Main App URL - UPDATE THIS AFTER FINDING YOUR NEURONFORGE URL
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000

# 2. Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://jgccgkyhpwirgknnceoh.supabase.co

# 3. Supabase Anon Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2Nna3locHdpcmdrbm5jZW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjY3OTMsImV4cCI6MjA2Nzc0Mjc5M30.h6VfcNOsEusgykZ9nR8mUStMrmbePp4ThFLlZHpqtWo

# 4. Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2Nna3locHdpcmdrbm5jZW9oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE2Njc5MywiZXhwIjoyMDY3NzQyNzkzfQ.NkUzCksSNNDy0UNr3jD-JYPAHUfEBKXc4wM6zqGEr2s
```

**For each variable:**
- Paste the name
- Paste the value
- Select: **Production, Preview, Development** (all 3)
- Click **"Add"**

### 1.4 Deploy

Click **"Deploy"** button and wait ~2-3 minutes.

**Note**: You may see build warnings about static page generation. These are **SAFE TO IGNORE** - Vercel handles them correctly.

---

## Step 2: Update Environment Variables (1 minute)

After deployment completes:

### 2.1 Get Your URLs

**Marketing Site URL** (just deployed):
```
https://agentspilot-marketing-xxx.vercel.app
```
Copy this from Vercel dashboard.

**Main App URL** (neuronforge):
1. Go to Vercel dashboard
2. Find your **neuronforge** project
3. Copy its production URL (e.g., `https://neuronforge-xxx.vercel.app`)

### 2.2 Update NEXT_PUBLIC_MAIN_APP_URL

1. In Vercel → agentspilot-marketing project
2. Go to **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_MAIN_APP_URL`
4. Click **"Edit"**
5. Change from `http://localhost:3000` to your neuronforge URL
6. Click **"Save"**

### 2.3 Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait ~2 minutes

---

## Step 3: Configure Supabase (2 minutes)

### 3.1 Add Redirect URLs

1. Go to https://supabase.com/dashboard
2. Select project: **jgccgkyhpwirgknnceoh**
3. Go to **Authentication** → **URL Configuration**
4. Find **"Redirect URLs"** section

### 3.2 Add These URLs

```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
https://*.vercel.app/auth/callback
```

The wildcard `*.vercel.app` allows all Vercel deployments.

5. Click **"Save"**
6. Wait 30 seconds for changes to take effect

---

## Step 4: Test (1 minute)

### 4.1 Visit Your Marketing Site

Go to: `https://agentspilot-marketing-xxx.vercel.app`

### 4.2 Test Signup Flow

1. Click "Get Started"
2. Enter a test email: `test+vercel@example.com`
3. Create password: `Test123!@#`
4. Click "Create Account"

**Expected**: Redirects to your main app (neuronforge) at `/onboarding`

### 4.3 Check Browser Console

Press F12 and look for:
```
[SessionHandler] Found tokens in URL hash
[SessionHandler] Session set successfully for user: test+vercel@example.com
```

### 4.4 Complete Onboarding

Follow onboarding steps and verify you reach the dashboard.

---

## ✅ Success Checklist

- [ ] Marketing site deployed to Vercel
- [ ] Environment variables configured (all 4)
- [ ] NEXT_PUBLIC_MAIN_APP_URL points to neuronforge
- [ ] Supabase redirect URLs include `*.vercel.app`
- [ ] Test signup redirects to main app
- [ ] Session transfers successfully
- [ ] Can complete onboarding
- [ ] Dashboard accessible

---

## Common Issues

### Issue: "Invalid redirect URL" After Signup

**Fix**: Go back to Supabase and verify you added `https://*.vercel.app/auth/callback`

### Issue: Redirects to Main App But No Session

**Fix**:
1. Check `NEXT_PUBLIC_MAIN_APP_URL` is correct in Vercel env vars
2. Verify both apps use the same Supabase credentials
3. Check browser console for SessionHandler logs

### Issue: Build Warnings During Deployment

**This is normal!** Vercel shows warnings about static page generation, but the deployment will work fine. These warnings don't affect functionality.

---

## Next Steps

After testing works:

### For Production (Later)

1. **Custom Domains**:
   - agentspilot.ai → marketing site
   - app.agentspilot.ai → main app

2. **Update Supabase**:
   - Site URL: `https://agentspilot.ai`
   - Add production redirect URLs

3. **Update Env Vars**:
   - Change `NEXT_PUBLIC_MAIN_APP_URL` to `https://app.agentspilot.ai`

4. **Clean Up Neuronforge** (After 1-2 weeks):
   - Follow `/MARKETING_CODE_TO_DELETE.md`

---

## Support

- **Deployment Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions
- **Testing**: See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive tests
- **Supabase Config**: See [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)

---

**Ready?** Start with Step 1 above! 🚀
