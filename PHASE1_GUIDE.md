# Phase 1: Enhanced User Features - Implementation Guide

## Overview
Phase 1 adds essential user engagement features to MADVERSE including enhanced profiles, activity favorites, registration system, and activity tracking.

## Features Implemented

### 1. Enhanced User Profiles
- **Profile Information**: Full name, bio, location, phone, date of birth
- **User Interests**: Multi-select interests from activity categories (Arts, Culture, Sports, Volunteering, Youth, Exhibition)
- **Profile Images**: Avatar support with Supabase storage
- **Profile Editing**: Users can edit their complete profile
- **Stats Dashboard**: View activity statistics at a glance

### 2. Activity Favorites System
- Users can add/remove activities from favorites (wishlist)
- Heart icon to toggle favorite status
- View all favorites in a dedicated tab
- Favorite count visible in profile

### 3. Activity Registration System
- Register for upcoming activities
- Automatic tracking of registration status
- Cancel registration anytime
- Mark activities as completed

### 4. Activity History Tracking
- Automatic tracking of user actions:
  - `viewed`: When user views an activity
  - `registered`: When user registers
  - `completed`: When user marks activity as done
  - `favorite`: When user adds to favorites
- Activity statistics (total viewed, registered, completed, favorited)

---

## Database Schema

### Tables Created

#### 1. `user_profiles`
```sql
- id (UUID) - Primary Key
- full_name (TEXT)
- bio (TEXT)
- interests (TEXT[]) - Array of interest categories
- profile_image_url (TEXT)
- date_of_birth (DATE)
- location (TEXT)
- phone (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. `activity_favorites`
```sql
- id (UUID) - Primary Key
- user_id (UUID) - Foreign Key to auth.users
- activity_id (TEXT) - Foreign Key to activity_content
- created_at (TIMESTAMP)
- UNIQUE(user_id, activity_id)
```

#### 3. `activity_registrations`
```sql
- id (UUID) - Primary Key
- user_id (UUID) - Foreign Key to auth.users
- activity_id (TEXT) - Foreign Key to activity_content
- status (TEXT) - 'registered', 'completed', 'cancelled'
- registered_at (TIMESTAMP)
- completed_at (TIMESTAMP, nullable)
- UNIQUE(user_id, activity_id)
```

#### 4. `activity_history`
```sql
- id (UUID) - Primary Key
- user_id (UUID) - Foreign Key to auth.users
- activity_id (TEXT) - Foreign Key to activity_content
- action (TEXT) - 'viewed', 'registered', 'completed', 'favorite'
- action_date (TIMESTAMP)
```

**All tables have Row Level Security (RLS) enabled** with appropriate policies for data privacy.

---

## Files Created/Modified

### New Files

1. **`src/lib/phase1Service.ts`**
   - Service functions for all Phase 1 features
   - Exports: `profileService`, `favoriteService`, `registrationService`, `historyService`
   - Includes TypeScript interfaces for type safety

2. **`src/components/ActivityCard.tsx`**
   - Reusable activity card component
   - Features: Heart icon for favorites, Register button
   - Automatic status synchronization with Supabase

3. **`src/components/MyActivitiesSection.tsx`**
   - Display registered activities, completed activities, and favorites
   - Tabs for easy navigation between sections
   - Manage registrations and favorites

4. **`PHASE1_DATABASE.sql`**
   - SQL schema and setup script
   - RLS policies included

### Modified Files

1. **`src/pages/Profile.tsx`**
   - Enhanced with edit capability
   - Profile statistics display
   - Interest selection
   - Integration with phase1Service

---

## Setup Instructions

### Step 1: Create Database Tables
1. Log into Supabase dashboard
2. Go to SQL Editor
3. Copy and paste contents of `PHASE1_DATABASE.sql`
4. Execute the SQL script

### Step 2: Create Supabase Storage Bucket (Optional)
For profile images:
1. Go to Storage in Supabase dashboard
2. Create new bucket named `profile-images`
3. Set privacy to "Public"

### Step 3: Verify RLS Policies
1. Check each table's RLS policies in Supabase dashboard
2. Ensure all policies are enabled

### Step 4: Test in Application
1. Update your Profile
2. Add an activity to favorites
3. Register for an activity
4. Verify stats update

---

## API Usage Examples

### Profile Service
```typescript
import { profileService } from '@/lib/phase1Service';

// Get user profile
const profile = await profileService.getProfile(userId);

// Update profile
await profileService.updateProfile(userId, {
  full_name: 'John Doe',
  bio: 'Activity enthusiast',
  interests: ['Arts', 'Culture'],
  location: 'New York',
});

// Upload profile image
const imageUrl = await profileService.uploadProfileImage(userId, file);
```

### Favorites Service
```typescript
import { favoriteService } from '@/lib/phase1Service';

// Add to favorites
await favoriteService.addFavorite(userId, activityId);

// Remove from favorites
await favoriteService.removeFavorite(userId, activityId);

// Check if favorited
const isFavorited = await favoriteService.isFavorited(userId, activityId);

// Get all user favorites
const favorites = await favoriteService.getUserFavorites(userId);
```

### Registration Service
```typescript
import { registrationService } from '@/lib/phase1Service';

// Register for activity
await registrationService.registerForActivity(userId, activityId);

// Get user registrations
const regs = await registrationService.getUserRegistrations(userId);

// Mark as completed
await registrationService.markActivityCompleted(userId, activityId);

// Cancel registration
await registrationService.cancelRegistration(userId, activityId);

// Check if registered
const isReg = await registrationService.isRegistered(userId, activityId);
```

### History Service
```typescript
import { historyService } from '@/lib/phase1Service';

// Track action
await historyService.trackAction(userId, activityId, 'viewed');

// Get user history
const history = await historyService.getUserHistory(userId);

// Get activity stats
const stats = await historyService.getActivityStats(userId);
// Returns: { total_viewed, total_registered, total_completed, total_favorited }
```

---

## Component Integration

### Using ActivityCard Component
```typescript
<ActivityCard
  id="activity-123"
  title="Art Exhibition"
  category="Arts"
  date="2026-02-15"
  location="Downtown Gallery"
  participants={42}
  image="/path/to/image.jpg"
  description="Amazing art exhibition"
  onRegisterSuccess={() => console.log('Registered!')}
/>
```

### Using MyActivitiesSection Component
```typescript
import MyActivitiesSection from '@/components/MyActivitiesSection';

export default function ActivityPage() {
  return (
    <div>
      <MyActivitiesSection />
    </div>
  );
}
```

---

## Data Flow

### User Registration Flow
1. User fills out profile form
2. Data sent to `profileService.updateProfile()`
3. Supabase upserts data into `user_profiles` table
4. `updated_at` timestamp automatically set
5. Component re-fetches and displays updated profile

### Favorite Activity Flow
1. User clicks heart icon on activity card
2. `favoriteService.addFavorite()` called
3. Entry inserted into `activity_favorites` table
4. `historyService.trackAction()` records 'favorite' action
5. Heart icon updates immediately
6. Toast notification shown

### Activity Registration Flow
1. User clicks "Register Now" button
2. `registrationService.registerForActivity()` called
3. Entry inserted into `activity_registrations` table with status='registered'
4. `historyService.trackAction()` records 'registered' action
5. Button text changes to "Registered"
6. User's registration count increases

### Marking Complete Flow
1. User clicks "Mark Complete" in My Activities
2. `registrationService.markActivityCompleted()` called
3. `activity_registrations.status` updated to 'completed'
4. `completed_at` timestamp set
5. Activity moved to "Completed" tab
6. `historyService.trackAction()` records 'completed' action

---

## Error Handling

All service functions include:
- Try-catch blocks for database errors
- Meaningful error messages
- Toast notifications for user feedback
- Automatic error logging to console

Example:
```typescript
try {
  await favoriteService.addFavorite(userId, activityId);
  toast({ description: 'Added to favorites' });
} catch (error) {
  console.error('Error:', error);
  toast({
    title: 'Error',
    description: 'Failed to add favorite',
    variant: 'destructive',
  });
}
```

---

## Security Features

- **Row Level Security (RLS)**: All tables protected with RLS policies
- **User Isolation**: Users can only access their own data
- **Authentication Required**: All operations require authenticated user
- **Data Validation**: TypeScript interfaces ensure data integrity
- **Supabase Client**: Uses secure Supabase client configuration

---

## Next Steps - Phase 2 (Engagement)

After Phase 1 is complete and working, Phase 2 will add:
- **Reviews & Ratings** - 1-5 star ratings and written reviews
- **Notifications Center** - Real-time notifications for activities
- **Follow System** - Follow other members
- **Badges/Achievements** - Gamification elements

---

## Testing Checklist

- [ ] Can edit profile information
- [ ] Can select multiple interests
- [ ] Can add activity to favorites
- [ ] Favorite icon updates immediately
- [ ] Can register for activities
- [ ] Registration count increases
- [ ] Can view registered activities
- [ ] Can mark activity as completed
- [ ] Can cancel registration
- [ ] Stats display correctly
- [ ] All error messages work
- [ ] Works on mobile and desktop
- [ ] No console errors

---

## Troubleshooting

### Profile not saving
- Check RLS policies on `user_profiles` table
- Verify user is authenticated
- Check browser console for errors

### Favorites not working
- Ensure `activity_favorites` table exists
- Check RLS policies
- Verify activity IDs match between tables

### Registration issues
- Verify `activity_registrations` table created
- Check foreign key constraints
- Ensure activity_content table exists

### History not tracking
- Check `activity_history` table exists
- Verify `historyService.trackAction()` is being called
- Check RLS policies allow inserts

---

## Support

For issues or questions:
1. Check browser console for errors
2. Review Supabase logs
3. Verify all SQL was executed correctly
4. Check RLS policies are enabled
