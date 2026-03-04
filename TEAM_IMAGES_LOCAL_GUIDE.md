# Update Team Member Images: URL to PNG Files

## Quick Steps

### Step 1: Add PNG Files to `/public`
Create these files in the `public/` folder:
- `team-klest.png`
- `team-guri.png`
- `team-erion.png`

**File Requirements:**
- Format: PNG
- Size: Any size (will be scaled by CSS)
- Dimensions: 300x300px or larger recommended

### Step 2: Update Supabase with SQL

1. Go to Supabase Dashboard → SQL Editor
2. Copy the SQL from `TEAM_IMAGES_SQL_UPDATE.sql`
3. Paste it in a new Query
4. Click "Run"

The SQL will change image references from:
```
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80
```

To:
```
/team-klest.png
```

### Step 3: Test Locally
```bash
npm run dev
# Visit your team cards section
# Images should load from /public/team-*.png
```

### Step 4: Commit PNG Files
```bash
git add public/team-*.png TEAM_IMAGES_SQL_UPDATE.sql
git commit -m "Add: Team member PNG files, update image references"
git push
```

## That's it! 

Your team cards will now:
✅ Use local PNG files instead of external URLs
✅ Load faster
✅ Be under your control
✅ Work offline

---

## If you need to revert back to URLs

Run this SQL:
```sql
UPDATE web_content1 
SET content = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
WHERE key = 'team_klest_image';

-- etc for other team members
```
