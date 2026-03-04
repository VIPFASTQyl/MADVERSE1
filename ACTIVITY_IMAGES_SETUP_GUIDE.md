# Setup Guide: Local PNG Files for Activity Cards

## Overview
This guide explains how to replace external image URLs with local PNG files for your activity cards on the team dashboard.

## Step 1: Add PNG Files to Your Project

### File Location
Place all activity PNG files in the `public/` folder:
```
madverse/
├── public/
│   ├── activity-youth.png
│   ├── activity-arts.png
│   ├── activity-culture.png
│   ├── activity-sports.png
│   ├── activity-exhibition.png
│   ├── activity-volunteering.png
│   └── ... other files
```

### Naming Convention
Use this naming format: `/activity-{activity-type-lowercase}.png`

**Activity Type → File Name**
- Youth → `activity-youth.png`
- Arts → `activity-arts.png`
- Culture → `activity-culture.png`
- Sports → `activity-sports.png`
- Exhibition → `activity-exhibition.png`
- Volunteering → `activity-volunteering.png`

### File Requirements
- **Format**: PNG with transparent background recommended
- **Dimensions**: 800x600px or 1920x1080px (will be scaled by CSS)
- **File Size**: Keep under 500KB per image for optimal performance
- **Colors**: Match your MADVERSE branding colors

## Step 2: Update Your Database

### Via Supabase SQL Editor:
1. Go to your Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the SQL from `ACTIVITY_IMAGES_UPDATE.sql`
4. Replace the `image_url` values with your local file paths
5. Click "Run"

### Single Activity Update (Manual):
```sql
UPDATE activity_content 
SET image_url = '/activity-youth.png'
WHERE activity_type = 'Youth' AND language = 'en';

UPDATE activity_content 
SET image_url = '/activity-arts.png'
WHERE activity_type = 'Arts' AND language = 'en';
```

### Bulk Update (All Activities):
```sql
UPDATE activity_content 
SET image_url = '/activity-' || LOWER(activity_type) || '.png';
```

## Step 3: Verify in Your Code

The following components already support local files:

### ActivityCard Component
```tsx
<img 
  src={activity.image_url}  // Now reads: /activity-youth.png
  alt={activity.title} 
  className="w-full h-full object-cover" 
/>
```

### Program Carousel
```tsx
image: activity.image_url || "/Hero.svg",  // Falls back to Hero.svg if no image
```

### Programs Grid
```tsx
<img 
  src={(item as any).image || '/Hero.svg'} 
  alt={item.title} 
/>
```

## Step 4: Deploy Changes

```bash
# Commit your PNG files and SQL migration
git add public/activity-*.png ACTIVITY_IMAGES_UPDATE.sql
git commit -m "Add: Local PNG files for activity cards"
git push
```

## File Size Optimization Tips

### Using ImageMagick (Command Line):
```bash
# Resize image to 1920x1080 and compress
convert activity-youth.png -resize 1920x1080 activity-youth-optimized.png

# Reduce file size
convert activity-youth.png -quality 85 activity-youth-compressed.png
```

### Using Online Tools:
- TinyPNG: https://tinypng.com (supports batch uploads)
- ImageIO: https://www.imageio.com
- Compressor.io: https://compressor.io

## Testing Locally

Run your development server and check:
```bash
npm run dev
# or
yarn dev
```

Visit: `http://localhost:5173/activity/youth`

Expected behavior:
- ✅ Images load from `/public/activity-youth.png`
- ✅ No 404 errors in console
- ✅ Images display correctly on cards

## Troubleshooting

### Images not showing on localhost:
1. Verify file path is exactly: `/activity-{type}.png`
2. Check filename matches database `image_url` value exactly
3. Clear browser cache: Ctrl+Shift+Delete
4. Check browser console for 404 errors

### Images not showing on Vercel:
1. Verify files are in `public/` folder and committed to git
2. Wait 5-10 minutes for Vercel rebuild
3. Clear browser cache and hard refresh: Ctrl+Shift+R
4. Check Vercel deployment logs

### File size too large:
1. Compress using TinyPNG or ImageMagick
2. Target: 100-200KB per image for fast loading
3. Use WebP format for even smaller files (requires additional setup)

## Database Query Reference

### Check current image URLs:
```sql
SELECT DISTINCT activity_type, image_url FROM activity_content;
```

### Check which activities don't have images:
```sql
SELECT * FROM activity_content WHERE image_url IS NULL OR image_url = '';
```

### Update specific activity:
```sql
UPDATE activity_content 
SET image_url = '/activity-youth.png'
WHERE activity_type = 'Youth';
```

## Next Steps After Adding Images

1. **Team notification**: Inform team members where images are stored
2. **Brand guidelines**: Create guidelines for image specifications
3. **Update testing**: Test all activity pages with new images
4. **Performance check**: Monitor image loading times
5. **Backup originals**: Keep original high-res images for future use

## File Organization

Consider organizing images by category:
```
public/
├── activities/
│   ├── activity-youth.png
│   ├── activity-arts.png
│   ├── activity-culture.png
│   ├── activity-sports.png
│   ├── activity-exhibition.png
│   └── activity-volunteering.png
├── partners/
│   ├── partner1.svg
│   └── ...
└── ...
```

If using subdirectories, update database references:
```sql
UPDATE activity_content 
SET image_url = '/activities/activity-' || LOWER(activity_type) || '.png';
```

## Contact & Support

For questions about image formats or optimization, reach out to your team lead.
