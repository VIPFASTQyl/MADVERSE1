# Vercel Deployment Configuration

## What Changed
Fixed 404 errors on Vercel by adding proper SPA (Single Page Application) routing configuration.

## Files Added
1. **vercel.json** - Main Vercel configuration for SPA routing
2. **.vercelignore** - Excludes unnecessary files from the build
3. **public/_redirects** - Backup routing configuration

## Environment Variables to Set in Vercel

Go to your Vercel project settings and add these environment variables:

### Required for Clerk Authentication:
```
VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
```

### Optional (if you have a backend API):
```
VITE_API_URL=<your_api_url>
```

## How to Deploy Changes

1. Commit and push these new files to GitHub:
   ```bash
   git add vercel.json .vercelignore public/_redirects
   git commit -m "Fix: Add Vercel SPA routing configuration"
   git push
   ```

2. Vercel will automatically redeploy. The deployment should now:
   - Properly route to activity pages (/activity/arts, /activity/youth, etc.)
   - Handle login/signup pages correctly
   - Prevent 404 errors when navigating between pages

## How It Works

The `vercel.json` configuration tells Vercel to:
- Route all requests to `/index.html` (except actual files)
- Let React Router handle all client-side routing
- This fixes the 404 errors you were experiencing

## Troubleshooting

If you still see 404 errors after deployment:

1. Clear your browser cache
2. Wait 5-10 minutes for Vercel to finish deployment
3. Check Vercel deployment logs for build errors
4. Verify all environment variables are set correctly in Vercel project settings

## Build Output

The app builds to the `dist` folder which Vercel automatically serves as static files.
Build command: `npm run build`
Output directory: `dist`
