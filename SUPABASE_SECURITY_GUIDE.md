# 🔒 MADVERSE Supabase Security - Data Leak Prevention

Complete guide to secure your Supabase setup and prevent information leaks.

---

## 1. 🚨 Row-Level Security (RLS) - CRITICAL

RLS ensures users ONLY see their own data. **This is the #1 defense against data leaks.**

### Check Your Current RLS Status
```bash
# Go to Supabase Dashboard
# → Project Settings
# → Database
# → Check "RLS Status" toggle is ON for each table
```

### ✅ Required RLS Policies

#### **Users Table** - Users see only themselves
```sql
-- Anyone can see only their own row
CREATE POLICY "Users can view own profile"
ON auth.users
FOR SELECT
USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON auth.users
FOR UPDATE
USING (auth.uid() = id);
```

#### **Activities Table** - Everyone can read, only admins modify
```sql
-- Anyone can read activities
CREATE POLICY "Activities are public readable"
ON activities
FOR SELECT
TO authenticated
USING (true);

-- Only creators/admins can update
CREATE POLICY "Only admins can update activities"
ON activities
FOR UPDATE
USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'ADMIN'
);

-- Only admins can delete
CREATE POLICY "Only admins can delete activities"
ON activities
FOR DELETE
USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'ADMIN'
);
```

#### **Registrations Table** - Users see only their own
```sql
-- Users can only see their own registrations
CREATE POLICY "Users see own registrations"
ON activity_registrations
FOR SELECT
USING (
  auth.uid() = user_id OR
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'ADMIN'
);

-- Users can only modify their own
CREATE POLICY "Users modify own registrations"
ON activity_registrations
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own
CREATE POLICY "Users delete own registrations"
ON activity_registrations
FOR DELETE
USING (auth.uid() = user_id);
```

---

## 2. 🔑 API Keys - Keep Them Secret!

### ❌ DANGEROUS - Never Do This:
```typescript
// DON'T commit this to GitHub!
const supabase = createClient(
  "https://your-project.supabase.co",
  "eyJhbGciOiJIUzI1NiIs..." // ❌ Exposed!
);
```

### ✅ SAFE - Use Environment Variables:
```bash
# .env.local (Frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# .env (Backend if any)
SUPABASE_SERVICE_ROLE_KEY=secret-key-only-backend
```

### ✅ Add to .gitignore
```bash
# Already in your .gitignore - verify:
.env
.env.local
.env.*.local
```

---

## 3. 🛡️ Password Security

### ✅ Strong Password Requirements
Enforce in your signup form:
```typescript
// At least 8 characters, mix of cases, numbers, symbols
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!PASSWORD_REGEX.test(password)) {
  throw new Error("Password must be 8+ chars with uppercase, lowercase, number, and symbol");
}
```

### ✅ Never Store Passwords in Logs
```typescript
// ❌ WRONG
console.log("User password:", password);

// ✅ RIGHT
console.log("User registered:", email);
```

---

## 4. 🔐 Authentication Flow Safety

### ✅ Secure Token Storage
```typescript
// Supabase automatically handles:
// ✅ Tokens stored in secure httpOnly cookies (if configured)
// ✅ Tokens encrypted at rest
// ✅ Tokens refresh automatically

// Your only job: Don't expose them!
```

### ❌ Never Do This:
```typescript
// DON'T expose auth tokens
localStorage.setItem("authToken", token); // Visible to JavaScript!
document.getElementById("token").value = token; // In HTML!
```

### ✅ Let Supabase Handle It:
```typescript
// Supabase handles token storage securely
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
// Tokens automatically stored and managed!
```

---

## 5. 📊 SQL Injection Prevention

Supabase prevents SQL injection automatically when using their client:

### ✅ SAFE - Use Supabase Client:
```typescript
// Parameterized query (safe!)
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail); // Email safely parameterized
```

### ❌ DANGEROUS - Raw SQL (Don't do this):
```typescript
// NEVER do this!
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

---

## 6. 🚨 Audit Trail - Know Who Did What

### Enable Supabase Audit Logs
```bash
# Supabase Dashboard → Project Settings → Logs
# Logs all:
# ✅ Database changes
# ✅ Authentication events
# ✅ API calls
```

### Track Important Actions
```typescript
// Log when admin takes action
async function logAdminAction(action: string, targetId: string) {
  const { data: user } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('admin_logs')
    .insert({
      admin_id: user.id,
      action: action,
      target_id: targetId,
      timestamp: new Date(),
    });
}
```

---

## 7. 🔍 Regularly Audit Your Data

### Weekly Checklist:
```
☑️ Review Supabase audit logs for suspicious activity
☑️ Check for unauthorized API key usage
☑️ Verify no test data in production
☑️ Confirm RLS policies are still enabled
☑️ Check for unusual data access patterns
```

### SQL to Find Suspicious Activity:
```sql
-- Activities created by non-admins (should be rare)
SELECT * FROM activities
WHERE created_by NOT IN (
  SELECT id FROM auth.users WHERE role = 'ADMIN'
);

-- Users with excessive registrations (might be spam)
SELECT user_id, COUNT(*) as registration_count
FROM activity_registrations
GROUP BY user_id
HAVING COUNT(*) > 50;
```

---

## 8. 🚫 Rate Limiting - Prevent Abuse

### Enable in Supabase
```bash
# Supabase Dashboard → Project Settings → API
# Set rate limits:
# - 100 requests/minute per IP
# - 1000 requests/hour per user
```

---

## 9. 📱 Secure External Sharing

### If Sharing Data Externally:
```typescript
// ❌ DON'T expose sensitive data in URLs
https://example.com?userId=12345&email=user@gmail.com

// ✅ DO use secure tokens
https://example.com?sharToken=abc123xyz
// Token expires after 1 hour
```

---

## 10. 🔄 Backup & Recovery

### Supabase Backups
```bash
# Supabase automatically:
✅ Daily backups
✅ Point-in-time recovery (7 days free, longer paid)
✅ Backup encryption
✅ Geo-redundant storage
```

### Test Recovery
```bash
# Monthly: Test restoring from a backup
# Just to make sure it works!
```

---

## 📋 Security Checklist

- [ ] **RLS Enabled** - All tables have RLS policies
- [ ] **API Keys Secured** - Never committed to Git
- [ ] **Passwords Strong** - 8+ chars, mixed case, numbers, symbols
- [ ] **Tokens Managed** - Not exposed in localStorage/HTML
- [ ] **SQL Safe** - Using Supabase client (not raw SQL)
- [ ] **Audit Logs** - Regularly reviewed
- [ ] **Rate Limiting** - Enabled in API settings
- [ ] **Backups** - Configured and tested
- [ ] **Users** - Only see their own data
- [ ] **Admins** - Can't accidentally become admins

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: RLS Disabled
```sql
-- This allows EVERYONE to see EVERYTHING!
-- NEVER do this in production
CREATE POLICY "Allow all" ON users
FOR SELECT TO authenticated
USING (true);
```

### ❌ Mistake 2: Logging Passwords
```typescript
// NEVER log passwords!
console.log("Signup:", { email, password }); // ❌
```

### ❌ Mistake 3: API Keys in Frontend Code
```typescript
// API key visible in JavaScript source code
const KEY = "sk_live_abc123"; // ❌ Anyone can steal this!
```

### ❌ Mistake 4: No Encryption for Sensitive Fields
```typescript
// Storing sensitive data as plain text
phone: "+355697000000", // Visible in database!
```

---

## ✅ What You're Protected Against

| Threat | Protection |
|--------|-----------|
| **Data leaks** | Row-Level Security (RLS) |
| **Hacking** | Supabase enterprise security |
| **SQL injection** | Parameterized queries |
| **Brute force** | Rate limiting + Supabase auth |
| **Man-in-the-middle** | HTTPS/SSL encryption |
| **Stolen passwords** | Password hashing (bcrypt) |
| **Lost data** | Automated backups |

---

## 🎯 For MADVERSE Specifically

### Your Data Model:
```
Users → Can only see their own profile, registrations
Activities → Everyone can view, only admins modify
Registrations → Users see only their own
```

### Current Status:
- ✅ Using Supabase (secure BaaS)
- ✅ Frontend has authentication
- ⚠️ **TODO:** Implement RLS policies
- ⚠️ **TODO:** Review .env files
- ⚠️ **TODO:** Audit existing data

---

## 🚀 Next Steps

1. **Enable RLS** on all tables (Supabase Dashboard)
2. **Create RLS policies** (use SQL above)
3. **Test RLS** - Login as different users, verify they only see own data
4. **Audit existing data** - Check for test/dummy data
5. **Review logs monthly** - Look for suspicious activity
6. **Update passwords** - Enforce strong passwords

---

## 📞 Emergency Contacts

If you suspect a data leak:
1. Check Supabase audit logs
2. Revoke compromised API keys (Dashboard → Settings)
3. Force password reset for all users
4. Check for unauthorized RLS policy changes
5. Contact Supabase support: support@supabase.io

---

**Your data is as secure as your Supabase configuration. Follow this guide and you'll be very safe!** 🔒

