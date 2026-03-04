# Quick Reference: From URLs to Local PNG Files

## Current System
**Before**: Images stored as external URLs
```
image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
```

## New System
**After**: Images stored as local files in `/public` folder
```
image_url: "/activity-youth.png"
```

## What You Get

### Before (URLs):
❌ Depends on external services  
❌ Can break if external sites change  
❌ Slower loading times  
❌ Rate limiting issues  

### After (Local Files):
✅ Full control over images  
✅ Faster loading (cached locally)  
✅ No external dependencies  
✅ Better performance on Vercel  
✅ Easy to customize brand colors  

---

## Quick Setup (5 Steps)

### Step 1: Add PNG Files to `/public`
```
public/
├── activity-youth.png
├── activity-arts.png
├── activity-culture.png
├── activity-sports.png
├── activity-exhibition.png
└── activity-volunteering.png
```

### Step 2: Update Database
Run one of these SQL queries in Supabase:

**Option A: Auto-generate names**
```sql
UPDATE activity_content 
SET image_url = '/activity-' || LOWER(activity_type) || '.png';
```

**Option B: Manual per activity**
```sql
UPDATE activity_content SET image_url = '/activity-youth.png' WHERE activity_type = 'Youth';
UPDATE activity_content SET image_url = '/activity-arts.png' WHERE activity_type = 'Arts';
-- ... etc for others
```

### Step 3: Test Locally
```bash
npm run dev
# Visit http://localhost:5173/activity/youth
# Images should load from /public
```

### Step 4: Commit & Push
```bash
git add public/activity-*.png
git commit -m "Add: Local PNG files for activity cards"
git push
```

### Step 5: Wait for Vercel Build
Vercel will automatically rebuild (5-10 minutes)

---

## File Naming Convention

| Activity Type | File Name | File Path |
|---------------|-----------|-----------|
| Youth | `activity-youth.png` | `/activity-youth.png` |
| Arts | `activity-arts.png` | `/activity-arts.png` |
| Culture | `activity-culture.png` | `/activity-culture.png` |
| Sports | `activity-sports.png` | `/activity-sports.png` |
| Exhibition | `activity-exhibition.png` | `/activity-exhibition.png` |
| Volunteering | `activity-volunteering.png` | `/activity-volunteering.png` |

**Case matters!** Use lowercase file names.

---

## File Specifications

| Property | Recommended |
|----------|-------------|
| Format | PNG with transparency |
| Dimensions | 800x600px or 1920x1080px |
| File Size | 100-200KB per image |
| Colors | Brand colors (see below) |
| Aspect Ratio | 4:3 or 16:9 |

### MADVERSE Brand Colors
```
Primary: #FCF5AF (Yellow)
Secondary: #F0A533 (Orange)
Accent: #E44F0A (Red-Orange)
Dark: #BA011A (Deep Red)
```

---

## Conversion Tools

### Online (Free)
- **TinyPNG** (best): https://tinypng.com
- **Compressor.io**: https://compressor.io
- **Pixlr**: https://pixlr.com

### Command Line (Linux/Mac)
```bash
# Resize to 800x600
convert input.jpg -resize 800x600 output.png

# Compress with quality 85
convert input.png -quality 85 output.png

# Both at once
convert input.jpg -resize 800x600 -quality 85 output.png
```

### Windows (PowerShell)
```powershell
# Using built-in Image Resizer
# Right-click image → Resize pictures
```

---

## Database Queries for Your Team

### See all current images
```sql
SELECT activity_type, image_url, COUNT(*) as count 
FROM activity_content 
GROUP BY activity_type, image_url;
```

### Find activities without images
```sql
SELECT * FROM activity_content 
WHERE image_url IS NULL OR image_url = '';
```

### Update single activity
```sql
UPDATE activity_content 
SET image_url = '/activity-youth.png'
WHERE activity_type = 'Youth' AND language = 'en';
```

### Rollback to URLs (if needed)
```sql
UPDATE activity_content 
SET image_url = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
WHERE activity_type = 'Youth';
```

---

## Common Issues

### **Q: Images don't show on localhost**
A: Clear cache (Ctrl+Shift+Delete) and refresh browser

### **Q: Images don't show on Vercel**
A: Wait 10 minutes for rebuild, then hard refresh (Ctrl+Shift+R)

### **Q: File names don't match**
A: Verify exact match - case sensitive!
```
✅ /activity-youth.png
❌ /Activity-Youth.png
❌ /activity_youth.png
```

### **Q: How to add branding to images?**
A: Use Figma, Adobe XD, or Photoshop
- Add your logo
- Use MADVERSE colors
- Keep consistent style

---

## Next Steps

1. ✅ Add PNG files to `/public`
2. ✅ Run SQL update query
3. ✅ Test on localhost
4. ✅ Push to GitHub
5. ✅ Wait for Vercel build
6. ✅ Test on production

---

## Questions?

Check the full setup guide: `ACTIVITY_IMAGES_SETUP_GUIDE.md`  
SQL templates: `ACTIVITY_IMAGES_SQL_TEMPLATE.sql`  
