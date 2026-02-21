# 🔐 Secure MADVERSE - Implementation Steps

Quick action items to prevent data leaks in your Supabase.

---

## ⚡ Quick Start (15 minutes)

### Step 1: Enable Row-Level Security (RLS)
1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** on the left
3. Copy-paste each policy below
4. Run each one

### Step 2: Users Table - Prevent Data Leaks
```sql
-- Copy this entire block and run in SQL Editor

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Users can only see themselves
CREATE POLICY "Users can view own profile"
ON auth.users
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"  
ON auth.users
FOR UPDATE
USING (auth.uid() = id);
```

### Step 3: Activities Table - Secure Admin Access
```sql
-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Everyone can read activities
CREATE POLICY "Activities are public readable"
ON activities
FOR SELECT
TO authenticated
USING (true);

-- Only admins can create
CREATE POLICY "Only admins can create activities"
ON activities
FOR INSERT
WITH CHECK (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'ADMIN'
);

-- Only admins can update
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

### Step 4: Registrations Table - Protect User Privacy
```sql
-- Enable RLS
ALTER TABLE activity_registrations ENABLE ROW LEVEL SECURITY;

-- Users see only their own registrations
CREATE POLICY "Users see own registrations"
ON activity_registrations
FOR SELECT
USING (
  auth.uid() = user_id OR
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'ADMIN'
);

-- Users can create their own
CREATE POLICY "Users can register for activities"
ON activity_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

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

## ✅ Verification Checklist

After running the SQL policies:

### 1. Check RLS is Enabled
```bash
# Supabase Dashboard
# → Authentication → Policies
# Should see all 3 tables listed with policies
```

### 2. Test User Isolation
```
User A logs in → Can only see User A's registrations ✅
User B logs in → Can only see User B's registrations ✅
User A cannot see User B's data ✅
```

### 3. Test Admin Access
```
Admin logs in → Can see all activities ✅
Admin logs in → Can modify any activity ✅
Regular user logs in → Cannot modify activities ✅
```

### 4. Verify No Data Leaks
```sql
-- Run this query to check
-- If this returns rows, there's a leak!
SELECT * FROM auth.users WHERE id != auth.uid();
```

---

## 📱 Frontend - No Changes Needed!

Your existing Supabase code already works:
```typescript
const { data } = await supabase
  .from('users')
  .select('*');

// RLS automatically filters this!
// If logged in as user_id=123,
// only returns user 123's row
```

**Supabase RLS works automatically with your frontend code.** ✅

---

## 🔑 API Keys - Verify Safety

### Check Your .env File
```bash
# Should have these lines:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Should NOT have:
# SUPABASE_SERVICE_ROLE_KEY=... (backend only if used)
```

### Verify .gitignore
```bash
# .gitignore should include:
.env
.env.local
.env.*.local

# Run this to verify:
git status
# Should NOT show .env files
```

---

## 🚨 If Accident Happens (API Key Leaked)

1. **Revoke the key immediately:**
   - Supabase Dashboard → Project Settings → API
   - Find the exposed key
   - Click three dots → Disable or regenerate

2. **Update .env:**
   - Replace with new key
   - Redeploy frontend

3. **Check logs:**
   - Supabase Dashboard → Logs
   - Look for unusual activity

---

## 🎯 Final Security Status

After completing above:

| Item | Status |
|------|--------|
| RLS Policies | ✅ Implemented |
| User Data Isolation | ✅ Protected |
| Admin Access Control | ✅ Restricted |
| API Keys | ✅ Secured |
| Git Safety | ✅ .env ignored |
| Data Leak Risk | ✅ Minimized |

---

## 📋 Testing Your Security

### Test 1: User Cannot See Other Users
```typescript
// Log in as user1@example.com
const { data: users } = await supabase
  .from('auth.users')
  .select('*');

// Should return: Only user1's row
// NOT: All users
```

### Test 2: User Cannot Modify Activities (if not admin)
```typescript
// Log in as regular user
const { error } = await supabase
  .from('activities')
  .update({ title: 'Hacked!' })
  .eq('id', 'some-activity-id');

// Should get: Permission denied error ✅
// NOT: Update successful
```

### Test 3: Admin Can Modify Activities
```typescript
// Log in as admin@madverse.com
const { data } = await supabase
  .from('activities')
  .update({ title: 'Updated' })
  .eq('id', 'some-activity-id');

// Should work: Update successful ✅
```

---

## 🆘 Troubleshooting

### "Permission denied" for everything?
→ RLS too strict. Verify policies use correct syntax

### Some users can see all registrations?
→ RLS not enabled. Run: `ALTER TABLE activity_registrations ENABLE ROW LEVEL SECURITY;`

### Admin cannot modify activities?
→ Admin role not set. Verify users table has `role` column = 'ADMIN'

### Still seeing other users' data?
→ Check if RLS policy uses `USING` (select) or `CHECK` (insert) correctly

---

## 🎉 You're Done!

Your MADVERSE app is now:
- ✅ Using Supabase (proven secure BaaS)
- ✅ Row-Level Security enabled (prevents leaks)  
- ✅ API keys secured (.env ignored)
- ✅ Data isolated per user
- ✅ Admin controls in place

**Your users' data is now protected!** 🔒

---

## 📞 Need Help?

- **RLS Policies:** See SUPABASE_SECURITY_GUIDE.md
- **Supabase Docs:** https://supabase.com/docs/guides/auth/rls
- **Emergency Leak:** Revoke API key immediately, check logs

