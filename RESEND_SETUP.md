# 📧 Resend Email Setup (2 Min Setup!)

## What is Resend?
- ✅ Email service for developers
- ✅ **Free tier: 100 emails/day**
- ✅ **No domain needed** to start
- ✅ Emails go to inbox (not spam)
- ✅ Supports custom domain later

---

## 🚀 Setup (Takes 2 Minutes)

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Click **Sign Up**
3. Use any email (gmail is fine)
4. Verify email
5. Done! ✅

### Step 2: Get API Key
1. In Resend dashboard, go to **API Keys**
2. Click **Create New API Key**
3. Name it: `madverse-registration`
4. Copy the key
5. Keep it safe!

### Step 3: Add to Supabase

In **Supabase Dashboard**:
1. Go to **Project Settings** (bottom left)
2. Click **Configuration**
3. Open **Edge Functions** section
4. Add these Environment Variables:

```
RESEND_API_KEY = re_xxxxx... (paste your API key)
ADMIN_EMAIL = your-email@gmail.com
RESEND_FROM_EMAIL = onboarding@resend.dev
```

Click **Save**

### Step 4: Deploy Function
Run this command:
```bash
supabase functions deploy send-registration-email
```

Or just push to GitHub if you have auto-deploy set up.

---

## ✅ Testing

1. Go to your app: `/signup`
2. Sign up with your real email:
   - Full Name: `Test User`
   - Phone: `555-1234567`
   - Email: `your-real-email@gmail.com`
   - Password: anything
3. **Wait 1-2 minutes**
4. Check your **Inbox** (should be there!)
5. Check **Spam folder** (should NOT be there)

---

## 📋 What Happens Now

When user registers:
- ✅ User gets **confirmation email** 
- ✅ Admin gets **notification email**
- ✅ Both arrive in **Inbox** (not spam!)
- ✅ No domain verification needed

---

## 🎯 Later: Add Custom Domain (Optional)

Once you buy a domain:
1. In Resend: **Domains** → **Add Domain**
2. Enter your domain
3. Add DNS records
4. Wait 24-48 hours
5. Update `RESEND_FROM_EMAIL` to use your domain

For now, `onboarding@resend.dev` works perfectly!

---

## 🆘 Troubleshooting

### Emails not arriving?
- Check: Did you use your real email in signup? (test emails must have real email)
- Wait: Might take 1-2 minutes
- Check spam folder
- Check Supabase function logs

### Function deployment failed?
- Run: `supabase functions deploy send-registration-email`
- Wait 30 seconds
- Try again

### API key error?
- Go to Supabase → Settings → Edge Functions
- Verify `RESEND_API_KEY` is exactly right (no spaces)
- Redeploy function

### Still need help?
- Check Resend console for email status
- Check Supabase function logs for errors

---

## 💡 Free Tier Limits
- 100 emails/day (perfect for testing!)
- After that, upgrade (very cheap)
- Or wait until next day (resets daily)

---

## ✨ You're All Set!

That's it! Your emails will now:
- ✅ Go to inbox (not spam)
- ✅ Arrive in 1-2 minutes
- ✅ Send to both user and admin
- ✅ Work reliably

**No complex setup. No domain needed. Just works!** 🚀
