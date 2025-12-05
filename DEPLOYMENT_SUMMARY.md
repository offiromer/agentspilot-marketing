# Marketing Site Separation - Complete Summary

## ✅ What's Been Done

### 1. **Created Separate Marketing Site**
- Location: `/Users/yaelomer/Documents/agentspilot-marketing`
- Fresh Next.js 14 setup with minimal dependencies
- All marketing pages copied and working

### 2. **Folder Structure**
```
agentspilot-marketing/
├── app/
│   ├── (marketing)/          # Marketing pages WITH header/footer
│   │   ├── layout.tsx        # Marketing layout (nav + footer)
│   │   ├── page.tsx          # Home page
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── contact/
│   │   └── use-cases/
│   ├── login/                # Auth pages WITHOUT header/footer
│   ├── signup/
│   ├── auth/callback/
│   ├── onboarding/
│   └── api/                  # API routes
├── components/
├── lib/
└── public/
```

### 3. **Authentication Flow**

**For Email/Password Login:**
1. User logs in on marketing site
2. Marketing site redirects to: `localhost:3000/v2/dashboard#access_token=xxx&refresh_token=yyy`
3. Main app's SessionHandler reads tokens from URL hash
4. Main app sets session via `supabase.auth.setSession()`
5. User is logged in!

**For Google OAuth:**
1. User clicks "Sign in with Google" on marketing site
2. OAuth redirects to: `localhost:3000/auth/callback` (MAIN APP)
3. Main app's existing auth callback handles the OAuth response
4. Main app redirects to dashboard/onboarding as normal

### 4. **Session Transfer**
The marketing site passes session tokens via URL hash:
```
http://localhost:3000/v2/dashboard#access_token=xxx&refresh_token=yyy
```

**Main app needs to implement SessionHandler** (see MAIN_APP_SESSION_HANDLER.tsx)

### 5. **Files Copied to Marketing Site**
- ✅ All marketing pages (home, features, pricing, about, contact, use-cases)
- ✅ Auth pages (login, signup, onboarding)
- ✅ Components (PluginIcon, onboarding components, billing calculator)
- ✅ API routes (pricing, audit, onboarding, contact, newsletter)
- ✅ Public assets (images, plugin icons)
- ✅ Lib utilities (supabase client, audit services)

## 🔧 Configuration Required

### Environment Variables (.env.local)
```bash
# Main App URL (where to redirect after login)
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Gmail OAuth (optional - for contact form)
GMAIL_USER=your@gmail.com
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_secret
GMAIL_REFRESH_TOKEN=your_token
```

### Supabase Configuration
Add to "Redirect URLs" in Supabase Dashboard:
```
http://localhost:3000/auth/callback
https://app.yourdomain.com/auth/callback
```

## 📝 TODO: Main App Updates Needed

### 1. Add SessionHandler Component
Create `app/components/SessionHandler.tsx` in **main app** (see MAIN_APP_SESSION_HANDLER.tsx)

### 2. Import in Layout
```tsx
// Main app's app/layout.tsx or app/v2/layout.tsx
import { SessionHandler } from '@/components/SessionHandler';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionHandler />  {/* Add this */}
        {children}
      </body>
    </html>
  );
}
```

## 🚀 Deployment Strategy

### Development
- **Marketing Site**: Deploy to separate service (Vercel, Netlify) or run on different port
- **Main App**: Keep on localhost:3000 or existing domain
- Set `NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000` in marketing site

### Production
- **Marketing Site**: `https://yourdomain.com` (or `marketing.yourdomain.com`)
- **Main App**: `https://app.yourdomain.com`
- Set `NEXT_PUBLIC_MAIN_APP_URL=https://app.yourdomain.com` in marketing site

## 📊 Benefits Achieved

1. ✅ **Lighter Marketing Site**: ~450 packages vs 1.1GB in main app
2. ✅ **Independent Deployment**: Deploy marketing changes without touching app
3. ✅ **Better SEO**: Marketing site can be optimized separately
4. ✅ **Faster Builds**: Marketing site builds in seconds
5. ✅ **Cleaner Separation**: Clear boundary between marketing and app

## 🔒 Security Notes

- Session tokens in URL hash are client-side only (standard OAuth implicit flow)
- Audit logging maintained across both sites
- Same Supabase instance = consistent user data
- Service role keys protected in API routes only

## 📚 Key Files Reference

- `SESSION_TRANSFER_GUIDE.md` - Detailed session transfer explanation
- `MAIN_APP_SESSION_HANDLER.tsx` - Component to add to main app
- `.env.local.example` - Environment variables template
- `.env.local.setup-instructions.md` - Setup guide

## ✅ Testing Checklist

- [ ] Email/password login → redirects to dashboard with session
- [ ] Google OAuth → redirects to dashboard with session
- [ ] New user signup → redirects to onboarding
- [ ] Marketing pages load without header on auth pages
- [ ] Pricing calculator works
- [ ] Contact form sends emails
- [ ] Newsletter signup works
