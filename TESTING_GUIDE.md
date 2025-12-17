# AgentsPilot Marketing Site - Testing Guide

**Last Updated**: December 17, 2024

Comprehensive testing guide for the two-environment setup (marketing site + main app).

---

## Table of Contents

1. [Local Testing Setup](#local-testing-setup)
2. [Authentication Flow Tests](#authentication-flow-tests)
3. [Session Transfer Tests](#session-transfer-tests)
4. [Marketing Site Feature Tests](#marketing-site-feature-tests)
5. [Error Handling Tests](#error-handling-tests)
6. [Browser Compatibility Tests](#browser-compatibility-tests)
7. [Mobile Testing](#mobile-testing)
8. [Production Testing](#production-testing)
9. [Performance Testing](#performance-testing)
10. [Security Testing](#security-testing)

---

## Local Testing Setup

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Both repositories cloned
- [ ] Environment variables configured
- [ ] Supabase redirect URLs include localhost

### Starting Local Servers

**Terminal 1: Main App**
```bash
cd /Users/yaelomer/Documents/neuronforge
npm run dev
```
**Expected**: Server running on http://localhost:3000

**Terminal 2: Marketing Site**
```bash
cd /Users/yaelomer/Documents/agentspilot-marketing
npm run dev
```
**Expected**: Server running on http://localhost:3001

### Verify Environment Variables

**Marketing Site** (`agentspilot-marketing/.env.local`):
```bash
# Check this file exists and contains:
cat .env.local

# Should see:
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
```

**Main App** (`neuronforge/.env.local`):
```bash
# Check Supabase credentials match marketing site
cat .env.local | grep SUPABASE
```

---

## Authentication Flow Tests

### Test 1: New User Signup (Email/Password)

**Objective**: Verify complete signup flow from marketing site to main app

**Steps**:
1. Visit http://localhost:3001
2. Click "Get Started" or "Start Free Trial"
3. Fill signup form:
   - Full Name: Test User
   - Email: test+[timestamp]@example.com (use unique email)
   - Password: Test123!@# (8+ chars, meets requirements)
4. Click "Create Account"

**Expected Results**:
- ✅ Loading spinner appears
- ✅ Success message: "Account created successfully! Redirecting to setup..."
- ✅ Page redirects to: http://localhost:3000/onboarding
- ✅ URL hash contains: `#access_token=...&refresh_token=...`
- ✅ Browser console shows: `[SessionHandler] Found tokens in URL hash`
- ✅ Browser console shows: `[SessionHandler] Session set successfully for user: test@example.com`
- ✅ URL hash is cleared (tokens removed from visible URL)
- ✅ Onboarding page loads and shows user's name/email

**Common Issues**:
- ❌ "Invalid redirect URL" → Check Supabase redirect URLs
- ❌ "User already registered" → Use unique email with timestamp
- ❌ No redirect → Check browser console for errors

---

### Test 2: Existing User Login

**Objective**: Verify login flow for users who completed onboarding

**Preparation**:
1. Complete Test 1 (signup and onboarding)
2. Log out from main app
3. Return to marketing site

**Steps**:
1. Visit http://localhost:3001/login
2. Enter credentials from Test 1
3. Click "Sign In"

**Expected Results**:
- ✅ Loading spinner appears
- ✅ If onboarding completed: Redirects to http://localhost:3000/v2/dashboard
- ✅ If onboarding not completed: Redirects to http://localhost:3000/onboarding
- ✅ Session transfers successfully
- ✅ User sees authenticated dashboard

---

### Test 3: Google OAuth Signup

**Objective**: Verify Google OAuth flow

**Requirements**: Google OAuth configured in Supabase

**Steps**:
1. Visit http://localhost:3001/login
2. Click "Continue with Google"
3. Select Google account in popup
4. Authorize application

**Expected Results**:
- ✅ Google OAuth popup opens
- ✅ After authorization, popup closes
- ✅ Redirects to main app with session
- ✅ User authenticated in main app
- ✅ User profile populated from Google

**Common Issues**:
- ❌ OAuth popup blocked → Check browser popup settings
- ❌ "Unauthorized redirect URI" → Check Google Cloud Console authorized URIs

---

### Test 4: Google OAuth Login (Existing User)

**Objective**: Verify returning Google OAuth user flow

**Steps**:
1. Complete Test 3
2. Log out
3. Visit http://localhost:3001/login
4. Click "Continue with Google"

**Expected Results**:
- ✅ Immediately redirects (no account selection needed)
- ✅ Redirects to dashboard (if onboarded) or onboarding
- ✅ Session established correctly

---

### Test 5: Logout and Re-login

**Objective**: Verify logout clears session and re-login works

**Steps**:
1. Login via marketing site (Test 2)
2. Access http://localhost:3000/v2/dashboard
3. Click logout in main app
4. Return to http://localhost:3001/login
5. Login again

**Expected Results**:
- ✅ After logout: Cannot access protected routes
- ✅ After re-login: Session restored
- ✅ Dashboard accessible again

---

## Session Transfer Tests

### Test 6: Session Token Transfer

**Objective**: Verify tokens are correctly passed via URL hash

**Steps**:
1. Open browser DevTools → Network tab
2. Visit http://localhost:3001/login
3. Login with valid credentials
4. Watch redirect happen

**Expected Results**:
- ✅ Redirect URL contains `#access_token=` and `&refresh_token=`
- ✅ Tokens are NOT sent to server (hash is client-side only)
- ✅ SessionHandler component fires
- ✅ Console logs: `[SessionHandler] Setting session from marketing site...`
- ✅ Console logs: `[SessionHandler] Session set successfully`
- ✅ Hash is cleared from URL after session set

**Verification**:
```javascript
// In browser console after redirect:
console.log(window.location.hash); // Should be empty after SessionHandler runs
```

---

### Test 7: SessionHandler Error Handling

**Objective**: Verify SessionHandler handles invalid tokens gracefully

**Steps**:
1. Manually visit: http://localhost:3000/onboarding#access_token=invalid&refresh_token=invalid
2. Check browser console

**Expected Results**:
- ✅ Console error: `[SessionHandler] Error setting session:`
- ✅ Redirects to login with error: http://localhost:3000/login?error=session_failed
- ✅ No infinite redirect loop

---

### Test 8: Session Persistence

**Objective**: Verify session persists across page refreshes

**Steps**:
1. Complete login flow (Test 2)
2. Access http://localhost:3000/v2/dashboard
3. Refresh page (F5 or Cmd+R)
4. Navigate to other pages in main app
5. Close browser tab
6. Open new tab and visit http://localhost:3000/v2/dashboard

**Expected Results**:
- ✅ After refresh: Still authenticated
- ✅ After navigation: Session maintained
- ✅ After closing/reopening: Still authenticated (session in localStorage)

---

## Marketing Site Feature Tests

### Test 9: Home Page

**Objective**: Verify home page loads and functions correctly

**Steps**:
1. Visit http://localhost:3001
2. Scroll through entire page
3. Click all CTA buttons
4. Check animations

**Expected Results**:
- ✅ Page loads without errors
- ✅ All images load correctly
- ✅ Animations play smoothly (Framer Motion)
- ✅ "Get Started" buttons redirect to /signup
- ✅ "Login" links redirect to /login
- ✅ Navigation menu works
- ✅ Footer links work

---

### Test 10: Pricing Page & Calculator

**Objective**: Verify pricing calculator functions correctly

**Steps**:
1. Visit http://localhost:3001/pricing
2. Adjust calculator sliders:
   - Number of agents: 5
   - Plugins per agent: 3
   - Execution frequency: Daily
3. Click "Subscribe to This Plan"

**Expected Results**:
- ✅ Calculator updates monthly cost in real-time
- ✅ Shows estimated monthly credits
- ✅ Shows breakdown of costs
- ✅ "Subscribe" button redirects to /signup with query params:
   - `?credits=X&agents=5&plugins=3`
- ✅ No console errors

**Edge Cases**:
- Adjust sliders to minimum values (1 agent, 1 plugin)
- Adjust sliders to maximum values (50 agents, 10 plugins)
- Verify calculations remain accurate

---

### Test 11: Contact Form

**Objective**: Verify contact form submits successfully

**Requirements**: Gmail OAuth configured (optional for testing)

**Steps**:
1. Visit http://localhost:3001/contact
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Subject: Test Message
   - Message: This is a test contact form submission
3. Click "Send Message"

**Expected Results**:
- ✅ Loading state appears
- ✅ If Gmail configured: Success message appears
- ✅ If Gmail not configured: Error message (expected)
- ✅ Form clears after successful submission

**To Test Without Gmail**:
- Check browser Network tab
- API request to `/api/contact` should return 500 (expected without Gmail)
- Form should handle error gracefully

---

### Test 12: Features Page

**Objective**: Verify features page loads correctly

**Steps**:
1. Visit http://localhost:3001/features
2. Scroll through all sections
3. Click embedded links/buttons

**Expected Results**:
- ✅ Page loads completely
- ✅ All feature cards visible
- ✅ Images/icons load correctly
- ✅ CTA buttons work

---

### Test 13: Navigation Menu

**Objective**: Verify navigation works across all pages

**Steps**:
1. Visit http://localhost:3001
2. Click each navigation item:
   - Features
   - Pricing
   - About
   - Contact
3. Test mobile menu (resize browser to mobile width)

**Expected Results**:
- ✅ All links navigate correctly
- ✅ Active page highlighted in nav
- ✅ Mobile hamburger menu works
- ✅ Menu closes after clicking link (mobile)

---

## Error Handling Tests

### Test 14: Invalid Login Credentials

**Objective**: Verify error handling for wrong credentials

**Steps**:
1. Visit http://localhost:3001/login
2. Enter:
   - Email: wrong@example.com
   - Password: WrongPassword123
3. Click "Sign In"

**Expected Results**:
- ✅ Error message displayed: "Invalid login credentials"
- ✅ No redirect occurs
- ✅ User remains on login page
- ✅ Form data NOT cleared (user can retry)

---

### Test 15: Duplicate Email Signup

**Objective**: Verify error handling for existing email

**Steps**:
1. Visit http://localhost:3001/signup
2. Enter email that already exists in system
3. Click "Create Account"

**Expected Results**:
- ✅ Error message: "User already registered"
- ✅ No redirect occurs
- ✅ Suggestion to use login page

---

### Test 16: Weak Password

**Objective**: Verify password validation

**Steps**:
1. Visit http://localhost:3001/signup
2. Enter weak password: "123"
3. Try to submit

**Expected Results**:
- ✅ Client-side validation prevents submission
- ✅ Error message about password requirements
- ✅ Shows requirements: 8+ characters, uppercase, lowercase, number

---

### Test 17: Network Error During Auth

**Objective**: Verify handling of network failures

**Steps**:
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Visit http://localhost:3001/login
4. Try to login

**Expected Results**:
- ✅ Error message about network/connection issue
- ✅ User not stuck in loading state
- ✅ Can retry after restoring connection

---

### Test 18: Missing Environment Variables

**Objective**: Verify graceful degradation without env vars

**Steps**:
1. Temporarily rename `.env.local` to `.env.local.backup`
2. Restart marketing site dev server
3. Try to access pages

**Expected Results**:
- ✅ Pages load but features fail gracefully
- ✅ Auth attempts show clear error messages
- ✅ No unhandled exceptions crash the app

**Cleanup**: Restore `.env.local` and restart server

---

## Browser Compatibility Tests

### Test 19: Cross-Browser Testing

**Objective**: Verify compatibility across major browsers

**Test Matrix**:
| Browser | Version | Platform | Status |
|---------|---------|----------|--------|
| Chrome | Latest | macOS | ☐ Tested |
| Chrome | Latest | Windows | ☐ Tested |
| Firefox | Latest | macOS | ☐ Tested |
| Safari | Latest | macOS | ☐ Tested |
| Edge | Latest | Windows | ☐ Tested |

**For Each Browser**:
1. Run Test 1 (signup flow)
2. Run Test 2 (login flow)
3. Run Test 10 (pricing calculator)
4. Check for console errors
5. Verify visual consistency

**Expected Results**:
- ✅ All core functionality works across browsers
- ✅ No major visual differences
- ✅ Session transfer works consistently

---

### Test 20: Browser Storage

**Objective**: Verify session storage in different browsers

**Steps** (For each browser):
1. Login via marketing site
2. Open DevTools → Application → Local Storage
3. Check `http://localhost:3000` entry
4. Verify Supabase keys present

**Expected Keys**:
```
sb-[project-ref]-auth-token
sb-[project-ref]-auth-token-code-verifier
```

---

## Mobile Testing

### Test 21: Mobile Safari (iOS)

**Objective**: Verify full functionality on iPhone

**Devices to Test**:
- iPhone 12/13/14 (iOS 15+)
- iPad (iPadOS 15+)

**Steps**:
1. Open Safari
2. Visit marketing site
3. Complete signup flow
4. Test pricing calculator
5. Test contact form

**Expected Results**:
- ✅ Responsive design works correctly
- ✅ Forms are usable (proper input types)
- ✅ Session transfer works
- ✅ No layout issues
- ✅ Scrolling smooth
- ✅ Buttons easily tappable (not too small)

**Common Issues**:
- Viewport meta tag needed for proper scaling
- Touch targets should be 44x44pt minimum
- Input zoom issues if font-size < 16px

---

### Test 22: Mobile Chrome (Android)

**Objective**: Verify functionality on Android devices

**Devices to Test**:
- Android phone (Android 11+)
- Android tablet

**Steps**: Same as Test 21

**Expected Results**: Same as Test 21

---

### Test 23: Mobile Landscape Orientation

**Objective**: Verify layout in landscape mode

**Steps**:
1. Rotate device to landscape
2. Test all pages
3. Verify navigation still accessible

**Expected Results**:
- ✅ Layout adapts to landscape
- ✅ Content remains readable
- ✅ No horizontal scrolling issues

---

### Test 24: Mobile Network Conditions

**Objective**: Test on slow mobile networks

**Steps**:
1. Use Chrome DevTools Device Mode
2. Set network to "Slow 3G"
3. Test signup flow
4. Monitor loading states

**Expected Results**:
- ✅ Loading indicators shown during slow operations
- ✅ User not stuck in loading state
- ✅ Timeout handling works correctly

---

## Production Testing

### Test 25: Vercel Preview Deployment

**Objective**: Test deployed preview before production

**Prerequisites**:
- Marketing site deployed to Vercel preview URL
- Main app deployed to Vercel

**Steps**:
1. Visit preview URL: https://agentspilot-marketing-xxx.vercel.app
2. Complete full signup flow
3. Verify redirect to production main app
4. Complete onboarding
5. Access dashboard

**Expected Results**:
- ✅ Preview site loads correctly
- ✅ All assets load (images, fonts, etc.)
- ✅ Environment variables correct
- ✅ Redirects to production main app
- ✅ Session transfers successfully

---

### Test 26: Custom Domain Testing

**Objective**: Test with production domains

**Prerequisites**:
- agentspilot.ai configured for marketing site
- app.agentspilot.ai configured for main app
- DNS propagated

**Steps**:
1. Visit https://agentspilot.ai
2. Complete signup
3. Should redirect to https://app.agentspilot.ai/onboarding
4. Complete onboarding
5. Access https://app.agentspilot.ai/v2/dashboard

**Expected Results**:
- ✅ HTTPS works on both domains
- ✅ SSL certificates valid
- ✅ Session transfer works across domains
- ✅ No CORS issues
- ✅ No mixed content warnings

---

### Test 27: Production Environment Variables

**Objective**: Verify production env vars are correct

**Check in Vercel Dashboard**:
1. Marketing site → Settings → Environment Variables
2. Verify:
   - `NEXT_PUBLIC_MAIN_APP_URL=https://app.agentspilot.ai`
   - Supabase credentials match main app
   - All required variables present

**Test**:
1. Deploy with production env vars
2. Test auth flow
3. Check redirects go to production main app

---

## Performance Testing

### Test 28: Page Load Performance

**Objective**: Measure page load times

**Tools**: Chrome DevTools → Lighthouse

**Pages to Test**:
- Home page
- Pricing page
- Login page
- Signup page

**Run Lighthouse Audit** (for each page):
1. Open page in incognito mode
2. F12 → Lighthouse tab
3. Select "Performance"
4. Click "Analyze page load"

**Target Scores**:
- Performance: 90+ (green)
- Accessibility: 95+ (green)
- Best Practices: 95+ (green)
- SEO: 90+ (green)

**Common Issues to Fix**:
- Large images not optimized
- Missing alt text on images
- No caching headers
- Blocking JavaScript

---

### Test 29: Bundle Size Analysis

**Objective**: Ensure bundle size is reasonable

**Steps**:
```bash
cd /Users/yaelomer/Documents/agentspilot-marketing
npm run build

# Check output for bundle sizes
```

**Target**:
- First Load JS: < 100 KB per page
- Total bundle: < 500 KB

**If Too Large**:
- Use dynamic imports for heavy components
- Remove unused dependencies
- Optimize images

---

### Test 30: API Response Times

**Objective**: Measure API endpoint performance

**Endpoints to Test**:
- POST /api/contact
- Auth endpoints (via Supabase)

**Steps**:
1. Open DevTools → Network tab
2. Trigger API calls
3. Check response times

**Target**:
- < 200ms for contact form
- < 500ms for Supabase auth

---

## Security Testing

### Test 31: Environment Variable Exposure

**Objective**: Verify no secrets exposed to client

**Steps**:
1. Visit any marketing page
2. View page source (Ctrl+U)
3. Search for sensitive strings:
   - "SERVICE_ROLE_KEY"
   - "GMAIL_CLIENT_SECRET"
   - "REFRESH_TOKEN"

**Expected Results**:
- ✅ Only NEXT_PUBLIC_* variables visible
- ✅ No service role keys in client code
- ✅ No OAuth secrets in client code

---

### Test 32: Session Token Security

**Objective**: Verify tokens are not logged or exposed

**Steps**:
1. Complete login flow
2. Check browser console logs
3. Check Network tab → Request headers
4. Check Analytics (if configured)

**Expected Results**:
- ✅ Tokens not logged to console
- ✅ Tokens not in analytics events
- ✅ Tokens passed only via URL hash (client-side)
- ✅ Tokens cleared from URL after use

---

### Test 33: XSS Protection

**Objective**: Verify protection against XSS attacks

**Steps**:
1. Try to submit form with malicious input:
   ```
   Name: <script>alert('XSS')</script>
   Email: test@example.com
   ```
2. Submit contact form
3. Check if script executes

**Expected Results**:
- ✅ Script does not execute
- ✅ Input sanitized or escaped
- ✅ React's built-in XSS protection working

---

### Test 34: SQL Injection Protection

**Objective**: Verify Supabase handles SQL injection safely

**Steps**:
1. Try to login with:
   ```
   Email: admin'--
   Password: anything
   ```
2. Try signup with similar inputs

**Expected Results**:
- ✅ Input rejected or safely handled
- ✅ No SQL errors exposed
- ✅ Supabase client library prevents injection

---

### Test 35: CORS Configuration

**Objective**: Verify CORS is configured correctly

**Steps**:
1. Open browser console on marketing site
2. Try to make request to main app API:
   ```javascript
   fetch('http://localhost:3000/api/test')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

**Expected Results**:
- ✅ CORS policy allows necessary requests
- ✅ Blocks unauthorized cross-origin requests
- ✅ Supabase requests work correctly

---

## Testing Checklist Summary

### Before Deployment
- [ ] All authentication flow tests pass (Tests 1-5)
- [ ] Session transfer works correctly (Tests 6-8)
- [ ] All marketing features work (Tests 9-13)
- [ ] Error handling tested (Tests 14-18)
- [ ] Cross-browser compatibility verified (Tests 19-20)
- [ ] Mobile testing completed (Tests 21-24)

### After Deployment
- [ ] Preview deployment tested (Test 25)
- [ ] Custom domain tested (Test 26)
- [ ] Production env vars verified (Test 27)
- [ ] Performance acceptable (Tests 28-30)
- [ ] Security tests passed (Tests 31-35)

### Production Monitoring (First Week)
- [ ] Monitor error rates daily
- [ ] Check Vercel function logs
- [ ] Review Supabase auth logs
- [ ] Collect user feedback
- [ ] Track conversion rates (signup → onboarding → dashboard)

---

## Reporting Issues

When reporting issues, include:

1. **Test Number**: Which test failed
2. **Environment**: Local, preview, or production
3. **Browser/Device**: Chrome 120 on macOS, iPhone 14, etc.
4. **Steps to Reproduce**: Exact steps that cause the issue
5. **Expected vs Actual**: What should happen vs what happened
6. **Screenshots**: If applicable
7. **Console Logs**: Any errors in browser console
8. **Network Tab**: Failed requests or unexpected responses

**Example Issue Report**:
```
Test: #14 - Invalid Login Credentials
Environment: Local (localhost:3001)
Browser: Chrome 120 on macOS Sonoma 14.3
Issue: Error message not displayed after wrong password
Expected: Should show "Invalid login credentials"
Actual: Loading spinner never stops
Console Error: TypeError: Cannot read property 'message' of undefined
Screenshot: [attached]
```

---

**Testing Status**: Ready for execution
**Last Updated**: December 17, 2024
