# Phase 1 Quick Start Checklist

## Prerequisites
- Supabase project set up
- User authentication working
- All dependencies installed

## Implementation Steps

### 1. Database Setup (5 minutes)
- [ ] Open `PHASE1_DATABASE.sql`
- [ ] Copy all SQL code
- [ ] Paste into Supabase SQL Editor
- [ ] Execute the script
- [ ] Verify all 4 tables created:
  - `user_profiles`
  - `activity_favorites`
  - `activity_registrations`
  - `activity_history`

### 2. Install Dependencies (if needed)
```bash
# Already in package.json, but verify:
npm install  # or bun install
```

### 3. Code Integration (10 minutes)
- [ ] Files already created:
  - `src/lib/phase1Service.ts` ✓
  - `src/components/ActivityCard.tsx` ✓
  - `src/components/MyActivitiesSection.tsx` ✓
  - `src/pages/Profile.tsx` (updated) ✓

### 4. Import Services in Your Components
```typescript
import { 
  profileService, 
  favoriteService, 
  registrationService, 
  historyService 
} from '@/lib/phase1Service';
```

### 5. Add ActivityCard to Activity Pages
```typescript
import ActivityCard from '@/components/ActivityCard';

// In your activity listing
<ActivityCard
  id={activity.id}
  title={activity.title}
  category={activity.category}
  date={activity.date}
  location={activity.location}
  participants={activity.participants}
  image={activity.image}
/>
```

### 6. Add MyActivitiesSection to Dashboard
```typescript
import MyActivitiesSection from '@/components/MyActivitiesSection';

// In your dashboard/profile page
<MyActivitiesSection />
```

### 7. Test Everything
- [ ] Load Profile page - verify edit works
- [ ] Select interests - verify save works
- [ ] Go to activity - verify favorite works
- [ ] Click register - verify registration works
- [ ] Check MyActivities tab - verify lists show correctly
- [ ] Verify stats update

### 8. Deployment
- [ ] Commit changes
- [ ] Push to GitHub
- [ ] Deploy to production

---

## Quick Reference

### Service Methods

**Profile**
```typescript
await profileService.getProfile(userId)
await profileService.updateProfile(userId, data)
```

**Favorites**
```typescript
await favoriteService.addFavorite(userId, activityId)
await favoriteService.removeFavorite(userId, activityId)
await favoriteService.isFavorited(userId, activityId)
await favoriteService.getUserFavorites(userId)
```

**Registration**
```typescript
await registrationService.registerForActivity(userId, activityId)
await registrationService.cancelRegistration(userId, activityId)
await registrationService.markActivityCompleted(userId, activityId)
await registrationService.isRegistered(userId, activityId)
await registrationService.getUserRegistrations(userId)
```

**History**
```typescript
await historyService.trackAction(userId, activityId, action)
await historyService.getUserHistory(userId)
await historyService.getActivityStats(userId)
```

---

## Environment Variables (if needed)
Add to `.env.local` if required:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

---

## Estimated Time
- Database setup: 5 minutes
- Code setup: 5 minutes
- Testing: 10 minutes
- **Total: ~20 minutes**

---

## Support Files
- `PHASE1_DATABASE.sql` - Database schema
- `PHASE1_GUIDE.md` - Detailed implementation guide
- `src/lib/phase1Service.ts` - All service functions
- `src/components/ActivityCard.tsx` - Reusable component
- `src/components/MyActivitiesSection.tsx` - Activities dashboard
- `src/pages/Profile.tsx` - Enhanced profile page
