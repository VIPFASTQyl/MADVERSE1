# Fix Team Members Images - Complete Setup

## The Problem
The About page wasn't loading team images from Supabase - it was hardcoding them!

## The Solution
I've updated the code to load images from Supabase. Now you need to:

---

## Step 1: Add PNG Files to `/public` folder

Create these 3 files in `public/`:
- `team-klest.png` - Klest's photo
- `team-guri.png` - Guri's photo (you already have this)
- `team-erion.png` - Erion's photo

**File format:**
- Format: PNG
- Size: Any size works (will be scaled)
- Recommended: 400x500px or 300x400px

---

## Step 2: Run SQL to Add Team Data to Supabase

**Go to Supabase Dashboard:**
1. Click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy **ALL** the SQL from `SETUP_TEAM_IN_SUPABASE.sql`
4. Paste it into the SQL Editor
5. Click "Run"

This adds to your database:
- Team member names (Klest, Guri, Erion)
- Team member titles
- **Image paths** (`/team-klest.png`, `/team-guri.png`, `/team-erion.png`)

---

## Step 3: Test Locally

```bash
npm run dev
# or
yarn dev
```

Visit: `http://localhost:8080/about`

**Expected behavior:**
- ✅ Team cards show local PNG images
- ✅ Images load from `/public/team-*.png`
- ✅ No 404 errors in console

---

## Step 4: Commit & Push

```bash
git add public/team-*.png
git add SETUP_TEAM_IN_SUPABASE.sql
git commit -m "Add: Team member PNG files and Supabase setup"
git push
```

---

## Verify It's Working

**In browser console** (right-click → Inspect → Console):
You should see logs like:
```
Team member klest: { nameItem, titleItem, bioItem, imageItem }
```

If `imageItem` is empty, the SQL didn't run or wasn't committed.

---

## Troubleshooting

### Images not showing on localhost
- [ ] Check PNG files exist in `public/` folder
- [ ] Verify filenames are **exactly**: `team-klest.png`, `team-guri.png`, `team-erion.png` (lowercase)
- [ ] Run the SQL to add entries to Supabase
- [ ] Refresh browser (Ctrl+Shift+R for hard refresh)

### Images not showing on Vercel
- [ ] Wait 10 minutes for rebuild
- [ ] Verify PNG files are committed to git: `git status`
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check Vercel deployment logs

### SQL error
- [ ] Copy the ENTIRE SQL from `SETUP_TEAM_IN_SUPABASE.sql`
- [ ] Make sure you're in Supabase SQL Editor (not Python)
- [ ] Check for proper syntax

---

## What Changed in Code

**File: `src/pages/About.tsx`**

**Before:** Hardcoded image URLs
```tsx
image: memberKey === "guri" ? "/assets/guri-card.svg" : "..."
```

**After:** Loads from Supabase
```tsx
const imageItem = teamContent.find((item) => item.key === `team_${memberKey}_image`);
image: imageItem?.content || `/team-${memberKey}.png`,
```

Now it will use whatever image path you add to Supabase! 🎉

---

## Questions?

If images still aren't showing:
1. Check browser console for errors
2. Verify Supabase has the data: `SELECT * FROM web_content1 WHERE key LIKE 'team_%'`
3. Make sure PNG files are in `/public` and committed to git
