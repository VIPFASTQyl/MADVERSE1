# 📧 Email Deliverability Setup Guide

## Problem Summary
- Emails are going to spam
- Some emails aren't being sent at all
- No user confirmation emails

---

## ✅ Solution: Use Supabase Email + SendGrid

Your project uses **SendGrid** but needs proper configuration.

---

## 🔧 Setup Steps

### Step 1: SendGrid Account Setup

1. Go to https://sendgrid.com and create free account
2. Get your **API Key** (Settings → API Keys → Create)
3. Copy the key for use in Supabase

### Step 2: Verify Sender Domain

This is CRITICAL for deliverability:

1. In SendGrid dashboard → Settings → Sender Authentication
2. Click **Authenticate Your Domain**
3. Follow the wizard:
   - Enter your domain (e.g., `madverse.com`)
   - Add the 3 DNS records:
     ```
     CNAME record for DKIM
     CNAME record for Domain WHITELABEL
     MX record for bounce (optional)
     ```
4. Wait 24-48 hours for DNS propagation
5. SendGrid will show status: ✅ Verified

### Step 3: Add Verified Sender

1. Settings → Sender Verification
2. Add sender email like:
   - `noreply@yourdomain.com` (verified domain)
   - `notifications@yourdomain.com`
   - `support@yourdomain.com`
3. Verify the email

### Step 4: Supabase Configuration

In **Supabase Dashboard** → **Settings** → **Auth**:

1. **Email Provider**: Set to SendGrid
2. **API Key**: Paste your SendGrid API key
3. **Sender Email**: Use verified sender like `noreply@yourdomain.com`
4. **Test**: Send test email

---

## 🚀 Updated Registration Email Function

Replace the current `send-registration-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, authorization, x-client-info, apikey',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, activityId, userName, programName, userEmail } = await req.json()

    const sendGridKey = Deno.env.get('SENDGRID_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const fromEmail = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@madverse.com'

    if (!sendGridKey) {
      console.error('Missing SENDGRID_API_KEY')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // ✅ Send confirmation email to USER
    if (userEmail) {
      const userEmailHTML = \`
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">✅ Registration Confirmed</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hi <strong>\${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.8;">
            You're all set! Your registration for <strong>\${programName}</strong> is confirmed.
          </p>

          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 8px 0; color: #333;"><strong>Program:</strong> \${programName}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Registration Date:</strong> \${new Date().toLocaleString()}</p>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            This is a confirmation email. Please do not reply to this message.<br>
            If you have questions, contact our support team.
          </p>
        </div>
      </div>
      \`

      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${sendGridKey}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: userEmail, name: userName }] }],
          from: { email: fromEmail, name: 'Madverse' },
          subject: \`✅ Registration Confirmed: \${programName}\`,
          html: userEmailHTML,
          reply_to: { email: adminEmail || 'support@madverse.com' },
          categories: ['registration-confirmation'],
          track_opens: true,
          track_clicks: true,
        }),
      })
        .then(r => {
          if (!r.ok) console.error('User email failed:', r.status)
          else console.log('✅ Confirmation email sent to user:', userEmail)
        })
        .catch(e => console.error('User email error:', e))
    }

    // 📬 Send notification to ADMIN
    if (adminEmail && adminEmail !== userEmail) {
      const adminEmailHTML = \`
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #667eea; margin-top: 0;">📝 New Program Registration</h2>
          
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 8px 0;"><strong>User:</strong> \${userName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> \${userEmail || 'N/A'}</p>
            <p style="margin: 8px 0;"><strong>Program:</strong> \${programName}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> \${new Date().toLocaleString()}</p>
          </div>

          <a href="https://madverse-platform.vercel.app/admin" style="background-color: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">View in Dashboard</a>
        </div>
      </div>
      \`

      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${sendGridKey}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: adminEmail }] }],
          from: { email: fromEmail, name: 'Madverse Notifications' },
          subject: \`📝 New Registration: \${programName}\`,
          html: adminEmailHTML,
          categories: ['admin-notification'],
        }),
      })
        .then(r => {
          if (!r.ok) console.error('Admin email failed:', r.status)
          else console.log('✅ Admin notification sent')
        })
        .catch(e => console.error('Admin email error:', e))
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Emails queued' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
```

---

## 📋 What to Do Now

1. ✅ Sign up for SendGrid (free plan has 100 emails/day)
2. ✅ Verify your domain in SendGrid
3. ✅ Add verified sender email
4. ✅ Get API key from SendGrid
5. ✅ In Supabase: Add SENDGRID_API_KEY environment variable:
   ```
   SENDGRID_API_KEY=SG.xxxxx...
   ADMIN_EMAIL=your@email.com
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```
6. ✅ Update the email function code above
7. ✅ Deploy via Supabase

---

## 🎯 Key Improvements in Updated Function

| Feature | Old | New |
|---------|-----|-----|
| **User Confirmation** | ❌ None | ✅ Yes |
| **Proper From Email** | noreply@madverse.com | ✅ Verified domain |
| **Track Opens/Clicks** | ❌ No | ✅ Yes |
| **Email Categories** | ❌ No | ✅ Yes (spam filtering) |
| **Error Handling** | Basic | ✅ Better logging |
| **Admin Notification** | ✅ Yes | ✅ Improved format |

---

## 🔍 Testing

1. Go to `/signup`
2. Register with your email
3. Check **Inbox** (should arrive in 1-2 minutes)
4. Check **Spam folder** (if it went there, verify domain in SendGrid)
5. Go to `/admin` and check admin email received notification

---

## 📌 Important Notes

- **Domain Verification is KEY** - this prevents spam folder
- **Verified Sender** - must be from your domain
- **Free SendGrid plan** - 100 emails/day, very generous for testing
- **Reply-To** - set so users can reply if needed

Need help with any step? Let me know!
