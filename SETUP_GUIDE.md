# Supabase & Authentication Setup - Complete Guide

## ✅ What Has Been Done

### 1. **Supabase Client** - `src/lib/supabaseClient.ts`
- Initialized Supabase client with your project URL and API key
- Ready for all database operations

### 2. **Authentication Context** - `src/contexts/AuthContext.tsx`
- Manages user authentication state globally
- Provides `useAuth()` hook for any component
- Auto-detects login/logout changes

### 3. **Login Page** - `src/pages/Login.tsx`
- GitHub OAuth sign-in interface
- Dark theme styling
- Auto-redirects authenticated users to home

### 4. **App Integration** - `src/App.tsx`
- Wrapped app with `AuthProvider`
- Added `/login` route
- Authentication context available throughout app

### 5. **Navigation Updates** - `src/components/Navigation.tsx`
- Added Login button for non-authenticated users
- Added Logout button for authenticated users
- Integrated with auth context

### 6. **Contact Form** - `src/components/ContactSection.tsx`
- Changed from HTTP backend to Supabase database
- Now saves directly to `contact_messages` table
- No backend server needed

### 7. **Backend** - `backend/server.js`
- Updated to use Supabase for data storage
- API endpoint still functional if needed
- Added Supabase client dependency

---

## 🚀 Next Steps: Create Database Table

### In Your Supabase Dashboard:

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/xlayiymdhgixsqtcivzq

2. **Go to SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

3. **Copy & Paste This SQL**:
```sql
CREATE TABLE contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);
```

4. **Click Run** ✅

---

## 🔐 Configure GitHub OAuth (If Not Done)

### In Supabase Dashboard:

1. Go to **Authentication > Providers**
2. Find **GitHub** and click to enable
3. Follow instructions to create GitHub OAuth App:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - **Application name**: Madverse
   - **Homepage URL**: `http://localhost:5173` (dev) or your domain (prod)
   - **Authorization callback URL**: `https://xlayiymdhgixsqtcivzq.supabase.co/auth/v1/callback`
4. Copy Client ID & Secret to Supabase

---

## ✨ How It Works Now

### Contact Form:
```
User fills form → Clicks Send → Data saved to Supabase → Success message
```

### Authentication:
```
User clicks Login → GitHub OAuth → User logged in → Can access protected pages
```

### Navigation:
```
Not logged in: Shows "Login" button
Logged in: Shows "Logout" button with user info
```

---

## 📝 Environment Variables

Your credentials are in:
- **Frontend**: `src/lib/supabaseClient.ts`
- **Backend**: `backend/server.js`

(Note: In production, move these to `.env` files - NOT committed to git!)

---

## 🧪 Testing

1. **Start your app**: `npm run dev`
2. **Click Login** - Should see GitHub OAuth screen
3. **Sign in with GitHub**
4. **Check Navigation** - Should show Logout button
5. **Test Contact Form** - Try submitting a message
6. **Check Supabase** - View messages in `contact_messages` table

---

## 📚 Available Routes

- `/` - Home
- `/about` - About page  
- `/contact` - Contact form (works with all users)
- `/login` - GitHub OAuth login
- `/activity/*` - Activity pages

---

## 🆘 Troubleshooting

**"Database not found" error?**
- Make sure you created the `contact_messages` table in Supabase

**"GitHub OAuth not working"?**
- Check GitHub OAuth App credentials are in Supabase
- Verify callback URL is correct

**"Can't log in"?**
- Check Supabase project is active
- Verify GitHub provider is enabled in Supabase

---

## 📦 Git Commands

```bash
# View changes
git status

# Push to GitHub
git push

# Pull from GitHub
git pull
```

Your project is ready! 🎉
