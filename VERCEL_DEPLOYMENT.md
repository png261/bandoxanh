# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Check

### 1. Dependencies ✅
- [x] All packages installed (`resend`, `@vercel/analytics`, etc.)
- [x] `package.json` has `postinstall: prisma generate`
- [x] All imports are correct

### 2. Build Configuration ✅
- [x] Next.js 15.0.0
- [x] TypeScript configured
- [x] No critical build errors

### 3. Database ✅
- [x] Prisma configured with Accelerate
- [x] Database URL ready
- [x] Schema up to date

### 4. External Services ✅
- [x] Clerk authentication
- [x] Supabase storage
- [x] Resend email
- [x] Google Gemini AI
- [x] Vercel Analytics
- [x] Vercel Speed Insights

---

## 🔑 Environment Variables for Vercel

**IMPORTANT:** You need to add these environment variables in Vercel Dashboard.

Go to: **Project Settings → Environment Variables**

### Required Variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWFnbmV0aWMtZG9ua2V5LTI1LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_qqd5rTiiMd7O3sCqNGDhJYNJTQOXYp1sndgWjd68hu

# Database (Prisma Accelerate)
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza183YzJiX2Y5dzU5N0ZzWnF5VjNfUW4iLCJhcGlfa2V5IjoiMDFLOEZTRVBZSjlIV1dGUUFNNUhINVZUMEciLCJ0ZW5hbnRfaWQiOiJhMTQ0NzQ1ZmNlZTQ4OTI1YTc3ZjA5MTAzYjEwYjk4YzhiNmRhNWY2MGI4YjE3MzRhZGE0YmFlZjI2M2NmMzRhIiwiaW50ZXJuYWxfc2VjcmV0IjoiMjdiOTM4NzgtNDIxZS00NjEyLWExOGQtMjFmZjk1OTI5MzQ2In0.4WMNHToYDZPLKKBDc5i-nlPJsizK4U9wmhvuLUEl9r8

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://sutzgzuvipjbbgkmtbry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dHpnenV2aXBqYmJna210YnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjU3NjMsImV4cCI6MjA3NzA0MTc2M30.T8mnJUqaCTcnl9C5nq5KEfbMeoz72zt-LSvZ4espC7A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dHpnenV2aXBqYmJna210YnJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDQzMjYyMCwiZXhwIjoxNzYyMDQ0NjIwfQ.LAVhXJSJ9WH9y8VoHUt-1x4bJD3uUx_xw7HV9eMjOWI

# Google Gemini AI
GEMINI_API_KEY=AIzaSyB4tnFzoHhEK2a8cg1iPW1aSqoEyMa0uNY

# Resend Email
RESEND_API_KEY=re_AK3W3Yf7_mZcHfLezxApotWwAvx4sTiBS
```

### Variable Types:
- Variables starting with `NEXT_PUBLIC_` are **exposed to the browser**
- Other variables are **server-side only**

---

## 📋 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: add email integration and refactor code"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `png261/bandoxanh`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 3: Add Environment Variables
1. In project settings, go to **Environment Variables**
2. Add all variables from above
3. Select environments: **Production**, **Preview**, **Development**
4. Click "Save"

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your deployed URL

---

## ⚙️ Build Configuration (Auto-handled)

Vercel will automatically detect your Next.js app and use these settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

The `postinstall` script will run Prisma generation automatically:
```json
"postinstall": "prisma generate"
```

---

## 🔍 Integration Checklist

### ✅ Email Integration (Resend)
- [x] `resend` package installed (v6.3.0)
- [x] `RESEND_API_KEY` environment variable
- [x] Email service in `/lib/email.ts`
- [x] API routes created
- [x] Welcome email on user registration

**Action Required:**
- Update `from` email address to your verified domain in production
- Files to update:
  - `/lib/email.ts` (line 13)
  - `/lib/workflows.ts` (line 21)

### ✅ Analytics Integration
- [x] `@vercel/analytics` (v1.5.0)
- [x] `@vercel/speed-insights` (v1.2.0)
- [x] Integrated in `/app/layout.tsx`
- [x] Auto-enabled on Vercel deployment

**No action required** - works automatically on Vercel!

### ✅ Authentication (Clerk)
- [x] Clerk SDK installed
- [x] Environment variables set
- [x] Admin system configured
- [x] Public access enabled

**Action Required After Deployment:**
- Add production domain to Clerk dashboard
- Update allowed redirect URLs

### ✅ Database (Prisma + Accelerate)
- [x] Prisma configured
- [x] Accelerate connection ready
- [x] Auto-generation on build

**No action required** - connection string already configured!

### ✅ Storage (Supabase)
- [x] Supabase client configured
- [x] Public bucket setup
- [x] Image upload working

**Action Required:**
- Verify Supabase bucket permissions
- Check CORS settings for your domain

### ✅ AI Features (Gemini)
- [x] Gemini API configured
- [x] Image identification working

**No action required** - API key configured!

---

## 🚨 Common Issues & Solutions

### Issue 1: Build Fails with Prisma Error
**Solution:** Ensure `DATABASE_URL` is set in Vercel environment variables

### Issue 2: Clerk Authentication Fails
**Solution:** 
1. Add your Vercel domain to Clerk allowed domains
2. Update redirect URLs in Clerk dashboard

### Issue 3: Images Not Uploading
**Solution:**
1. Check Supabase CORS settings
2. Verify bucket is public
3. Check `SUPABASE_SERVICE_ROLE_KEY`

### Issue 4: Email Not Sending
**Solution:**
1. Verify `RESEND_API_KEY` is correct
2. Check Resend dashboard for errors
3. Update `from` address to verified domain

### Issue 5: CSS Warnings
**Solution:** These are just linter warnings and won't affect deployment. You can ignore them.

---

## 📊 Post-Deployment Testing

After deployment, test these features:

- [ ] Homepage loads correctly
- [ ] User can sign up/sign in (Clerk)
- [ ] Map page displays
- [ ] Community posts work
- [ ] Image upload works (Supabase)
- [ ] AI identification works (Gemini)
- [ ] Welcome email sends (Resend)
- [ ] Admin panel accessible (if admin)
- [ ] Analytics tracking (check Vercel dashboard after 24h)

---

## 🔗 Post-Deployment Actions

### 1. Update Clerk Settings
- Go to [Clerk Dashboard](https://dashboard.clerk.com)
- Add your Vercel domain to allowed origins
- Update redirect URLs:
  - Add: `https://your-app.vercel.app/*`

### 2. Update Resend Settings
- Go to [Resend Dashboard](https://resend.com)
- Verify your domain
- Update email templates to use your domain

### 3. Test Email Functionality
Visit your deployed app:
```
https://your-app.vercel.app/test-email
```
Send a test welcome email to verify integration.

### 4. Monitor Analytics
Check these dashboards:
- **Vercel Analytics:** Project → Analytics tab
- **Vercel Speed Insights:** Project → Speed Insights tab
- **Resend:** [resend.com/emails](https://resend.com/emails)

---

## 🎯 Domain Configuration (Optional)

To use a custom domain:

1. In Vercel project settings, go to **Domains**
2. Add your domain (e.g., `bandoxanh.com`)
3. Configure DNS records as shown
4. Wait for SSL certificate (automatic)
5. Update Clerk allowed domains

---

## ✅ Final Checklist

Before deploying:
- [ ] All code committed to GitHub
- [ ] All environment variables ready to add
- [ ] Database is accessible
- [ ] Supabase bucket configured
- [ ] Clerk project created

After deploying:
- [ ] Add environment variables in Vercel
- [ ] Test all features
- [ ] Update Clerk domains
- [ ] Update Resend email addresses
- [ ] Monitor for errors

---

## 🚀 Deploy Command

```bash
# 1. Commit your changes
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Then deploy via Vercel dashboard or CLI
npx vercel --prod
```

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Check external service dashboards (Clerk, Supabase, Resend)

**Your app is ready to deploy!** 🎉
